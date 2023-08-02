import { ArnFormat, Duration, Lazy, Resource, ResourceProps } from "aws-cdk-lib";
import { CfnRemediationConfiguration, IRule } from "aws-cdk-lib/aws-config";
import { IRemediationTarget } from "./lib";
import { IConstruct } from "constructs";
import { ResourceImporter } from "../utils/importer";


export interface IRemediationConfiguration {
  readonly remediationConfigurationArn: string;
  readonly remediationConfigurationName: string;
}

abstract class RemediationConfigurationBase extends Resource implements IRemediationConfiguration {
  public abstract readonly remediationConfigurationArn: string;
  public abstract readonly remediationConfigurationName: string;
}

export interface RemediationConfigurationAttributes {
  readonly arn?: string;
  readonly name?: string;
}

export interface RemediationConfigurationProps extends ResourceProps {
  readonly automatic?: boolean;
  readonly configRule: IRule;
  readonly maximumAutomaticAttempts?: number;
  readonly resourceParameter?: string;
  readonly resourceType?: string;
  readonly retryInterval?: Duration;
  readonly staticParameters: {[key: string]: any[]};
  readonly target: IRemediationTarget;
}

export class RemediationConfiguration extends RemediationConfigurationBase {
  public static readonly ARN_FORMAT: ArnFormat;

  public static fromRemediationConfigurationArn(scope: IConstruct, id: string, arn: string): IRemediationConfiguration {
    return RemediationConfiguration.fromRemediationConfigurationAttributes(scope, id, {
      arn: arn,
    });
  }

  public static fromRemediationConfigurationAttributes(scope: IConstruct, id: string, attrs: RemediationConfigurationAttributes): IRemediationConfiguration {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: RemediationConfiguration.ARN_FORMAT,
      service: 'config',
      resource: 'remediation-configuration',
    });

    const identities = importer.resolveIdentities(attrs.arn, attrs.name);

    class Import extends RemediationConfigurationBase {
      public readonly remediationConfigurationArn = identities.arn;
      public readonly remediationConfigurationName = identities.id;
    }

    return new Import(scope, id);
  }

  public static fromRemediationConfigurationName(scope: IConstruct, id: string, name: string): IRemediationConfiguration {
    return RemediationConfiguration.fromRemediationConfigurationAttributes(scope, id, {
      name: name,
    });
  }


  private readonly _parameters;

  public readonly automatic?: boolean;
  public readonly configRule: IRule;
  public readonly maximumAutomaticAttempts?: number;
  public readonly resourceType?: string;
  public readonly retryInterval?: Duration;
  
  public readonly resource: CfnRemediationConfiguration;
  
  public readonly remediationConfigurationArn: string;
  public readonly remediationConfigurationName: string;


  public constructor(scope: IConstruct, id: string, props: RemediationConfigurationProps) {
    super(scope, id, props);

    this._parameters = {};

    this.automatic = props.automatic;
    this.configRule = props.configRule;
    this.maximumAutomaticAttempts = props.maximumAutomaticAttempts;
    this.resourceType = props.resourceType;
    this.retryInterval = props.retryInterval;

    const target = props.target.bind(this);

    if (props.resourceParameter) {
      this._parameters[props.resourceParameter] = {
        ResourceValue: {
          Value: 'RESOURCE_ID',
        },
      };
    }

    this.resource = new CfnRemediationConfiguration(this, 'Resource', {
      automatic: this.automatic,
      configRuleName: this.configRule.configRuleName,
      executionControls: target.controls,
      maximumAutomaticAttempts: this.maximumAutomaticAttempts,
      parameters: Lazy.any({
        produce: () => {
          return this.renderParameters();
        }
      }),
      resourceType: this.resourceType,
      retryAttemptSeconds: this.retryInterval?.toSeconds(),
      targetId: target.targetId,
      targetType: target.targetType.value,
      targetVersion: target.targetVersion,
    });

    this.remediationConfigurationArn = this.stack.formatArn({
      arnFormat: RemediationConfiguration.ARN_FORMAT,
      resource: 'remediation-configuration',
      resourceName: this.resource.ref,
      service: 'config',
    });

    this.remediationConfigurationName = this.resource.ref;
    const parameters = props.staticParameters ?? {};

    Object.keys(parameters).forEach((x) => {
      this.addParameter(x, ...parameters[x]);
    });
  }

  public addParameter(key: string, ...values: string[]): void {
    if (key in this._parameters) {
      throw new Error([
        `A parameter with the key '${key}' already exists in the remediation`,
        `configuration '${this.node.path}'. Cannot add duplicate parameter.`
      ].join(' '));
    }

    this._parameters[key] = {
      StaticValue: {
        Values: values
      }
    };
  }

  protected renderParameters(): any {
    return this._parameters;
  }
}