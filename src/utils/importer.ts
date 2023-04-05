import { ArnFormat, IResolvable, Lazy, Stack, Token } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export interface ResourceIdentities {
  arn: string;
  id: string;
}

export interface IIdentityParser {
  buildArn(id: string): string;
  parseArn(arn: string, resourceName?: string): string;
}

export interface ResourceSpecification {
  readonly account?: string;
  readonly arnFormat: ArnFormat;
  readonly parser?: IIdentityParser;
  readonly partition?: string;
  readonly region?: string;
  readonly resource?: string;
  readonly scope: IConstruct;
  readonly service: string;
}

export class DefaultIdentityParser implements IIdentityParser {
  public readonly spec: ResourceSpecification;


  public constructor(spec: ResourceSpecification) {
    this.spec = spec;
  }

  public buildArn(id: string): string {
    const stack = Stack.of(this.spec.scope);

    if (this.spec.arnFormat === ArnFormat.NO_RESOURCE_NAME) {
      if (this.spec.resource) {
        throw new Error([
          "When an ARN has the format 'NO_RESOURCE_NAME' the 'resource'",
          'property should not be passed in the resource specification.',
        ].join(' '));
      } else {
        return stack.formatArn({
          ...this.spec,
          resource: id,
        });
      }
    } else {
      if (!this.spec.resource) {
        throw new Error([
          "The 'resource' property is required in the resource specification",
          "when the ARN format is not 'NO_RESOURCE_NAME'.",
        ].join(' '));
      } else {
        return stack.formatArn({
          ...this.spec,
          resource: this.spec.resource,
          resourceName: id,
        });
      }
    }
  }

  public parseArn(arn: string, resourceName?: string): string {
    if (resourceName) {
      return resourceName;
    } else {
      throw new Error([
        `Unable to automatically determine resource ID from ARN '${arn}'.`,
      ].join(' '));
    }
  }
}

export function resolveIdentities(spec: ResourceSpecification, arn?: string, id?: string): ResourceIdentities {
  const parser = spec.parser ?? new DefaultIdentityParser(spec);

  if (arn && id) {
    return {
      arn: arn,
      id: id,
    };
  } else if (arn) {
    const stack = Stack.of(spec.scope);
    const components = stack.splitArn(arn, spec.arnFormat);
    const resourceName = components.arnFormat === ArnFormat.NO_RESOURCE_NAME ? components.resource : components.resourceName;

    return {
      arn: arn,
      id: parser.parseArn(arn, resourceName),
    };
  } else if (id) {
    return {
      arn: parser.buildArn(id),
      id: id,
    };
  } else {
    throw new Error([
      "At least one of 'arn' or 'id' must be specified when trying to resolve",
      'resource identities.',
    ].join(' '));
  }
}

export function optionalBoolean(scope: IConstruct, id: string, field: string, value?: boolean): IResolvable {
  return Lazy.any({
    produce: () => {
      if (value !== undefined) {
        return value;
      } else {
        throw new Error([
          `Field '${field}' is not available on imported resource`,
          `'${scope.node.path}/${id}' because it was not specificed when the`,
          'resource was imported.',
        ].join(' '));
      }
    },
  });
}

export function optionalNumber(scope: IConstruct, id: string, field: string, value?: number): number {
  return value ? value : Lazy.number({
    produce: () => {
      throw new Error([
        `Field '${field}' is not available on imported resource`,
        `'${scope.node.path}/${id}' because it was not specificed when the`,
        'resource was imported.',
      ].join(' '));
    },
  });
}

export function optionalString(scope: IConstruct, id: string, field: string, value?: string): string {
  return value ? value : Lazy.string({
    produce: () => {
      throw new Error([
        `Field '${field}' is not available on imported resource`,
        `'${scope.node.path}/${id}' because it was not specificed when the`,
        'resource was imported.',
      ].join(' '));
    },
  });
}

export interface ResourceImporterProps {
  readonly account?: string;
  readonly arnFormat: ArnFormat;
  readonly parser?: IIdentityParser;
  readonly partition?: string;
  readonly region?: string;
  readonly resource?: string;
  readonly service: string;
}

export class ResourceImporter {
  public readonly id: string;
  public readonly props: ResourceImporterProps;
  public readonly scope: IConstruct;


  public constructor(scope: IConstruct, id: string, props: ResourceImporterProps) {
    this.id = id;
    this.props = props;
    this.scope = scope;
  }

  public resolveProperties(props: { [key: string]: any }): { [key: string]: Token } {
    return Object.keys(props).reduce((prev, cur) => {
      prev[cur] = Lazy.any({
        produce: () => {
          const obj = props[cur];
          return obj ? obj : Lazy.string({
            produce: () => {
              throw new Error([
                `Field '${cur}' is not available on imported resource`,
                `'${this.scope.node.path}/${this.id}' because it was not`,
                'specificed when the resource was imported.',
              ].join(' '));
            },
          });
        },
      });

      return prev;
    }, {} as { [key: string]: Token });
  }

  public resolveIdentities(arn?: string, id?: string): ResourceIdentities {
    const spec: ResourceSpecification = {
      ...this.props,
      scope: this.scope,
    };

    return resolveIdentities(spec, arn, id);
  }
}