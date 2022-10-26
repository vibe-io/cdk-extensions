import { Names, ResourceProps } from 'aws-cdk-lib';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { AwsSecretStore } from './aws-secret-store';
import { ExternalSecret } from './external-secret';


export interface SsmFieldMapping {
  kubernetesKey: string;
  parameterKey?: string;
}

/**
 * Configuration options for adding a new secret store resource.
 */
export interface SsmSecretStoreProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
}

export class SsmSecretStore extends AwsSecretStore {
  constructor(scope: Construct, id: string, props: SsmSecretStoreProps) {
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

  public addSecret(parameter: IParameter, fields?: SsmFieldMapping[]): ExternalSecret {
    const id = Names.nodeUniqueId(parameter.node);
    const output = new ExternalSecret(parameter, `secret-${id}`, {
      cluster: this.cluster,
      fields: fields?.map((x) => {
        return {
          kubernetesKey: x.kubernetesKey,
          remoteRef: parameter.parameterArn,
          remoteKey: x.parameterKey ?? x.kubernetesKey,
        };
      }),
      secretStore: this,
    });

    if (this.stack === parameter.stack) {
      output.node.addDependency(this.resource);
    }

    return output;
  }
}