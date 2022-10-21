import { ArnFormat, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { ExternalSecret, SecretFieldReference } from './external-secret';


export interface IExternalSecretProvider {
  addExternalSecret(secret: ISecret, fields?: SecretFieldReference[]): ExternalSecret;
}

/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretStoreProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
}

export class ExternalSecretStore extends Resource implements IExternalSecretProvider {
  // Input properties
  public readonly cluster: ICluster;
  public readonly name: string;
  public readonly namespace: string;

  // Resource properties
  public readonly secretStore: KubernetesManifest;
  public readonly serviceAccount: ServiceAccount;

  // Standard properties
  public readonly secretStoreName: string;


  constructor(scope: Construct, id: string, props: ExternalSecretStoreProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61)}`;
    this.namespace = props.namespace ?? 'external-secrets';

    this.serviceAccount = new ServiceAccount(this, 'service-account', {
      cluster: this.cluster,
      name: `sa${Names.uniqueId(this).slice(-61)}`.toLowerCase(),
      namespace: this.namespace,
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

    this.secretStore = new KubernetesManifest(this, 'runner-deployment', {
      cluster: this.cluster,
      manifest: [
        {
          apiVersion: 'external-secrets.io/v1beta1',
          kind: 'SecretStore',
          metadata: {
            name: this.name,
            namespace: this.namespace,
          },
          spec: {
            provider: {
              aws: {
                service: 'SecretsManager',
                region: this.stack.region,
                auth: {
                  jwt: {
                    serviceAccountRef: {
                      name: this.serviceAccount.serviceAccountName,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    });

    this.secretStoreName = this.name;
  }

  public addExternalSecret(secret: ISecret, fields?: SecretFieldReference[]): ExternalSecret {
    const id = Names.nodeUniqueId(secret.node);

    return new ExternalSecret(this, `secret-${id}`, {
      cluster: this.cluster,
      fields: fields,
      secret: secret,
      secretStore: this,
    });
  }
}