import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct, IConstruct, IDependable } from 'constructs';


export interface ISecretStore extends IDependable {
  readonly secretStoreName: string;
}

export interface SecretFieldReference {
  readonly kubernetesKey: string;
  readonly metadataPolicy?: string;
  readonly remoteKey?: string;
}

export interface SecretReferenceConfiguration {
  readonly fields?: SecretFieldReference[];
  readonly remoteRef: string;
}

export interface ISecretReference {
  bind(scope: IConstruct): SecretReferenceConfiguration;
}

/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly name?: string;
  readonly namespace?: string;
  readonly refreshInterval?: Duration;
  readonly secrets?: ISecretReference[];
  readonly secretStore: ISecretStore;
}

export class ExternalSecret extends Resource {
  // Internal properties
  private readonly _secrets: ISecretReference[] = [];

  // Input properties
  public readonly cluster: ICluster;
  public readonly name: string;
  public readonly namespace?: string;
  public readonly refreshInterval?: Duration;
  public readonly secretStore: ISecretStore;

  public get secrets(): ISecretReference[] {
    return [...this._secrets];
  }

  // Resource properties
  public readonly resource: KubernetesManifest;

  // Standard properties
  public readonly secretName: string;


  constructor(scope: Construct, id: string, props: ExternalSecretProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? `es${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.namespace = props.namespace;
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
            namespace: this.namespace,
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
                  return this._secrets.reduce((prev, cur) => {
                    const config = cur.bind(this);
                    config.fields?.forEach((x) => {
                      prev.push({
                        secretKey: x.kubernetesKey,
                        remoteRef: {
                          key: config.remoteRef,
                          metadataPolicy: x.metadataPolicy,
                          property: x.remoteKey,
                        },
                      });
                    });
                    return prev;
                  }, [] as any[]);
                },
              },
              {
                omitEmptyArray: true,
              },
            ),
            dataFrom: Lazy.uncachedAny(
              {
                produce: () => {
                  return this._secrets.reduce((prev, cur) => {
                    const config = cur.bind(this);
                    if ((config.fields?.length ?? 0) === 0) {
                      prev.push({
                        extract: {
                          key: config.remoteRef,
                        },
                      });
                    }
                    return prev;
                  }, [] as any[]);
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

    props.secrets?.map((x) => {
      this.addSecret(x);
    });
  }

  public addSecret(secret: ISecretReference): ExternalSecret {
    this._secrets.push(secret);
    return this;
  }
}