import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';

export interface ExternalDnsRegistryConfiguration {
  readonly permissions?: PolicyStatement[];
  readonly properties?: {[key: string]: any};
  readonly registryType: string;
}

export interface IExternalDnsRegistry {
  readonly registryType: string;
  bind(scope: IConstruct): ExternalDnsRegistryConfiguration;
}