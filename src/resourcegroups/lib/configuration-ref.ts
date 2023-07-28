import { CfnGroup } from 'aws-cdk-lib/aws-resourcegroups';
import { IConstruct } from 'constructs';


export interface BoundGroupConfiguration {
  readonly configuration?: CfnGroup.ConfigurationItemProperty[];
  readonly query?: CfnGroup.ResourceQueryProperty;
}

export interface IGroupConfiguration {
  bind(scope: IConstruct): BoundGroupConfiguration;
}