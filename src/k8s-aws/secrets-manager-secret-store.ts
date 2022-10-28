import { ArnFormat, ResourceProps } from 'aws-cdk-lib';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { AwsSecretStore } from './aws-secret-store';
import { ExternalSecret } from './external-secret';
import { ExternalSecretOptions } from './external-secrets-operator';
import { SecretsManagerReference } from './lib/secrets-manager-reference';


export interface SecretsManagerFieldMapping {
  kubernetesKey: string;
  secretsManagerKey?: string;
}

/**
 * Configuration options for adding a new secret store resource.
 */
export interface SecretsManagerSecretStoreProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
}

export class SecretsManagerSecretStore extends AwsSecretStore {
  constructor(scope: Construct, id: string, props: SecretsManagerSecretStoreProps) {
    super(scope, id, {
      ...props,
      service: 'SecretsManager',
    });

    this.serviceAccount.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'secretsmanager:DescribeSecret',
        'secretsmanager:GetResourcePolicy',
        'secretsmanager:GetSecretValue',
        'secretsmanager:ListSecretVersionIds',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resource: 'secret',
          resourceName: '*',
          service: 'secretsmanager',
        }),
      ],
    }));
  }

  public addSecret(id: string, secret: ISecret, options: ExternalSecretOptions = {}): ExternalSecret {
    const output = new ExternalSecret(secret, `external-secret-${id}`, {
      cluster: this.cluster,
      name: options.name,
      namespace: this.namespace,
      secrets: [
        new SecretsManagerReference(secret, {
          fields: options.fields,
        }),
      ],
      secretStore: this,
    });

    if (this.stack === secret.stack) {
      output.node.addDependency(this.resource);
    }

    return output;
  }
}