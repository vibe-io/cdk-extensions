import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IamPasswordPolicy, VpcDefaultSecurityGroupClosed } from '../config-rules';
import { Hub, IHub } from '../securityhub/hub';


export interface SecurityHubOptions {
  readonly enabled?: boolean;
  readonly hub?: IHub;
}

export interface SecurityManagerProps extends ResourceProps {
  readonly autoRemediate?: boolean;
  readonly securityHub?: SecurityHubOptions;
}

export class SecurityManager extends Resource {
  public readonly autoRemediate: boolean;
  public readonly hub?: IHub;


  public constructor(scope: IConstruct, id: string, props: SecurityManagerProps) {
    super(scope, id, props);

    this.autoRemediate = props.autoRemediate ?? false;

    if (props.securityHub?.enabled ?? true) {
      this.hub = props.securityHub?.hub ?? new Hub(this, 'hub');
    }

    new IamPasswordPolicy(this, 'rule-iam-password-policy', {
      autoRemediation: this.autoRemediate,
    });

    new VpcDefaultSecurityGroupClosed(this, 'rule-vpc-security-group-closed', {
      autoRemediation: this.autoRemediate,
    });
  }
}