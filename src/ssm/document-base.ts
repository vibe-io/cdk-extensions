import { ArnFormat, IResource, Lazy, PhysicalName, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnDocument } from 'aws-cdk-lib/aws-ssm';
import { IConstruct } from 'constructs';
import { IDocumentContent } from './lib';


export interface IDocument extends IResource {
  readonly documentArn: string;
  readonly documentName: string;
}

export class DocumentType {
  public static readonly APPLICATION_CONFIGURATION: DocumentType = DocumentType.of('ApplicationConfiguration');
  public static readonly APPLICATION_CONFIGURATION_SCHEMA: DocumentType = DocumentType.of('ApplicationConfigurationSchema');
  public static readonly AUTOMATION: DocumentType = DocumentType.of('Automation');
  public static readonly AUTOMATION_CHANGE_TEMPLATE: DocumentType = DocumentType.of('Automation.ChangeTemplate');
  public static readonly COMMAND: DocumentType = DocumentType.of('Command');
  public static readonly DEPLOYMENT_STRATEGY: DocumentType = DocumentType.of('DeploymentStrategy');
  public static readonly PACKAGE: DocumentType = DocumentType.of('Package');
  public static readonly POLICY: DocumentType = DocumentType.of('Policy');
  public static readonly SESSION: DocumentType = DocumentType.of('Session');

  public static of(value: string): DocumentType {
    return new DocumentType(value);
  }


  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

export class DocumentUpdateMethod {
  public static readonly NEW_VERSION: DocumentUpdateMethod = DocumentUpdateMethod.of('NewVersion');
  public static readonly REPLACE: DocumentUpdateMethod = DocumentUpdateMethod.of('Replace');

  public static of(value: string): DocumentUpdateMethod {
    return new DocumentUpdateMethod(value);
  }


  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

export interface DocumentRequirement {
  readonly document: IDocument;
  readonly version?: string;
}

export interface DocumentBaseProps extends ResourceProps {
  readonly content: IDocumentContent;
  readonly documentType?: DocumentType;
  readonly name?: string;
  readonly requires?: DocumentRequirement[];
  readonly targetType?: string;
  readonly updateMethod?: DocumentUpdateMethod;
  readonly versionName?: string;
}

export class DocumentBase extends Resource implements IDocument {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  private readonly _requires: DocumentRequirement[];

  public readonly content: IDocumentContent;
  public readonly documentType?: DocumentType;
  public readonly name?: string;
  public readonly targetType?: string;
  public readonly updateMethod?: DocumentUpdateMethod;
  public readonly versionName?: string;

  public get requires(): DocumentRequirement[] {
    return [...this._requires];
  }

  public readonly resource: CfnDocument;

  public readonly documentArn: string;
  public readonly documentName: string;


  public constructor(scope: IConstruct, id: string, props: DocumentBaseProps) {
    super(scope, id, {
      physicalName: props.name ?? PhysicalName.GENERATE_IF_NEEDED,
    });

    this._requires = [];

    this.content = props.content;
    this.documentType = props.documentType;
    this.name = this.physicalName;
    this.targetType = props.targetType;
    this.updateMethod = props.updateMethod;
    this.versionName = props.versionName;

    const boundContent = this.content.bind(this);

    this.resource = new CfnDocument(this, 'Resource', {
      content: boundContent.content,
      documentFormat: boundContent.documentFormat.value,
      documentType: this.documentType?.name,
      name: this.name,
      requires: Lazy.any(
        {
          produce: () => {
            return this._requires.map((x) => {
              return {
                name: x.document.documentName,
                version: x.version,
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      targetType: this.targetType,
      updateMethod: this.updateMethod?.value,
      versionName: this.versionName,
    });

    this.documentArn = this.stack.formatArn({
      arnFormat: DocumentBase.ARN_FORMAT,
      resource: 'document',
      resourceName: this.resource.ref,
      service: 'ssm',
    });
    this.documentName = this.resource.ref;

    props.requires?.forEach((x) => {
      this.addRequirement(x);
    });

    this.node.addValidation({
      validate: () => {
        return this.validate();
      },
    });
  }

  protected addRequirement(requirement: DocumentRequirement): IDocument {
    this._requires.push(requirement);
    return this;
  }

  protected validate(): string[] {
    const result: string[] = [];
    const propertyTypesDocumentation = 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html';
    const targetTypeRegex = /^\/[\w\.\-\:\/]*$/;
    const versionNameRegex = /^[a-zA-Z0-9_\-.]{1,128}$/;

    if (this.targetType && this.targetType.match(targetTypeRegex)) {
      result.push([
        `Provided target type '${this.targetType}' failed validation. Valid`,
        'target types should start with a forward slash and can contain an',
        'optional property type name. For a list of valid property type see:',
        propertyTypesDocumentation,
      ].join(' '));
    }

    if (this.versionName && this.versionName.match(versionNameRegex)) {
      result.push([
        `Provided version name '${this.versionName}' failed validation. Valid`,
        'version names must be between 1 and 128 charactes and contain',
        'only alphanumeric characters, underscores, hyphens, and periods.',
        `Regular expression used for validation: ${versionNameRegex}.`,
      ].join(' '));
    }

    return result;
  }
}