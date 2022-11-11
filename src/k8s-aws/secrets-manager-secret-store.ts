import { ArnFormat, ResourceProps } from 'aws-cdk-lib';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { AwsSecretStore } from './aws-secret-store';
import { ExternalSecret } from './external-secret';
import { ExternalSecretOptions } from './external-secrets-operator';
import { SecretsManagerReference } from './lib/secrets-manager-reference';


/**
 * Configuration options for adding a new secret store resource.
 */
export interface SecretsManagerSecretStoreProps extends ResourceProps {
  /**
   * The EKS cluster where the secret store should be created.
   */
  readonly cluster: ICluster;

  /**
   * A human friendly name for the secret store.
   */
  readonly name?: string;

  /**
   * The Kubernetes namespace where the secret store should be created.
   */
  readonly namespace?: string;
}

/**
 * A secret store that allows secrets from AWS Secrets Managers to be
 * synchronized into Kubernetes as Kubernetes secrets.
 */
export class SecretsManagerSecretStore extends AwsSecretStore {
  /**
   * Creates a new instance of the SecretsManagerSecretStore class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
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

  /**
   * Registers a new Secrets Manager secret to be synchronized into Kubernetes.
   *
   * @param id The ID of the secret import configuration in the CDK construct
   * tree.
   *
   * The configuration is placed under the Secrets Manager secret it
   * synchronizes and so must be unique per secret.
   * @param secret The Secrets Manager secret to synchronize into Kubernetes.
   * @param options Configuration options for how the secret should be
   * synchronized.
   * @returns The external secret configuration that was added.
   */
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
      output.node.addDependency(this.manifest);
    }

    return output;
  }
}