import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct, IDependable } from 'constructs';


export interface ISecretStore extends IDependable {
  readonly secretStoreName: string;
}

export interface SecretFieldReference {
  readonly kubernetesKey: string;
  readonly metadataPolicy?: string;
  readonly remoteRef: string;
  readonly remoteKey?: string;
}

/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly fields?: SecretFieldReference[];
  readonly name?: string;
  readonly refreshInterval?: Duration;
  readonly secretStore: ISecretStore;
}

export class ExternalSecret extends Resource {
  // Input properties
  public readonly cluster: ICluster;
  public readonly fields: SecretFieldReference[];
  public readonly name: string;
  public readonly refreshInterval?: Duration;
  public readonly secretStore: ISecretStore;

  // Resource properties
  public readonly resource: KubernetesManifest;

  // Standard properties
  public readonly secretName: string;


  constructor(scope: Construct, id: string, props: ExternalSecretProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.fields = props.fields ?? [];
    this.name = props.name ?? `es${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.refreshInterval = props.refreshInterval ?? Duration.minutes(1);
    this.secretStore = props.secretStore;

    this.resource = new KubernetesManifest(this, 'Resource', {
      cluster: this.cluster,
      manifest: [
        {
          apiVersion: 'external-secrets.io/v1beta1',
          kind: 'ExternalSecret',
          metadata: {
            name: this.name,
          },
          spec: {
            refreshInterval: `${this.refreshInterval.toMinutes()}m`,
            secretStoreRef: {
              name: this.secretStore.secretStoreName,
              kind: 'SecretStore',
            },
            target: {
              name: this.name,
              creationPolicy: 'Owner',
            },
            data: Lazy.uncachedAny(
              {
                produce: () => {
                  return this.fields.map((x) => {
                    return {
                      secretKey: x.kubernetesKey,
                      remoteRef: {
                        key: x.remoteRef,
                        metadataPolicy: x.metadataPolicy,
                        property: x.remoteKey,
                      },
                    };
                  });
                },
              },
              {
                omitEmptyArray: true,
              },
            ),
          },
        },
      ],
    });
    this.resource.node.addDependency(this.secretStore);

    this.secretName = this.name;
  }

  public addField(field: SecretFieldReference): void {
    this.fields.push(field);
  }
}