import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import { ISecretStore } from './external-secret';


/**
 * Configuration options for adding a new secret store resource.
 */
export interface AwsSecretStoreProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
  readonly service: string;
}

export class AwsSecretStore extends Resource implements ISecretStore {
  // Static properties
  public static readonly NAME_VALIDATOR_REGEX=/^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;

  // Input properties
  public readonly cluster: ICluster;
  public readonly name: string;
  public readonly namespace: string;
  public readonly service: string;

  // Resource properties
  public readonly resource: KubernetesManifest;
  public readonly serviceAccount: ServiceAccount;

  // Standard properties
  public readonly secretStoreName: string;


  constructor(scope: Construct, id: string, props: AwsSecretStoreProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.namespace = props.namespace ?? 'default';
    this.service = props.service;

    if (!AwsSecretStore.NAME_VALIDATOR_REGEX.test(this.name) || this.name.length > 63) {
      throw new Error([
        `Invalid external secret store name: '${this.name}'. Valid names`,
        'must be less than 64 characters long. They can only contain',
        'lowercase letters, numbers, hyphens, and dots. They must start',
        'and end with an alphanumeric character.',
      ].join(' '));
    }

    this.serviceAccount = new ServiceAccount(this, 'service-account', {
      cluster: this.cluster,
      name: `sa${Names.uniqueId(this).slice(-61)}`.toLowerCase(),
      namespace: this.namespace,
    });

    this.resource = new KubernetesManifest(this, 'Resource', {
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
                service: this.service,
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
    this.resource.node.addDependency(this.serviceAccount);

    this.secretStoreName = this.name;
  }
}