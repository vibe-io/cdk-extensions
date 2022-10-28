import { ResourceProps } from 'aws-cdk-lib';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { AwsSecretStore } from './aws-secret-store';
import { ExternalSecret } from './external-secret';
import { ExternalSecretOptions } from './external-secrets-operator';
import { SsmParameterReference } from './lib/ssm-parameter-reference';


/**
 * Configuration options for adding a new secret store resource.
 */
export interface SsmParameterSecretStoreProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
}

export class SsmParameterSecretStore extends AwsSecretStore {
  constructor(scope: Construct, id: string, props: SsmParameterSecretStoreProps) {
    super(scope, id, {
      ...props,
      service: 'ParameterStore',
    });

    this.serviceAccount.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'ssm:GetParameter*',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.stack.formatArn({
          resource: 'parameter',
          resourceName: '*',
          service: 'ssm',
        }),
      ],
    }));
  }

  public addSecret(id: string, parameter: IParameter, options: ExternalSecretOptions = {}): ExternalSecret {
    const output = new ExternalSecret(parameter, `external-secret-${id}`, {
      cluster: this.cluster,
      name: options.name,
      namespace: this.namespace,
      secrets: [
        new SsmParameterReference(parameter, {
          fields: options.fields,
        }),
      ],
      secretStore: this,
    });

    if (this.stack === parameter.stack) {
      output.node.addDependency(this.resource);
    }

    return output;
  }
}