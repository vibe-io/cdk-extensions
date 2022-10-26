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
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61)}`;
    this.namespace = props.namespace ?? 'external-secrets';
    this.service = props.service;

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