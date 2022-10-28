import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct, IConstruct } from 'constructs';
import { ISecretStore } from '.';


/**
 * Options for fetching tags/labels from provider secrets.
 */
export enum MetadataPolicy {
  /**
   * Fetch tags/labels from provider secrets.
   */
  FETCH = 'Fetch',

  /**
   * Do not fetch tags/labels from provider secrets.
   */
  NONE = 'None',
}

/**
 * Options for how to synchronize a specific field in a secret being imported.
 */
export interface SecretFieldReference {
  /**
   * The name of the data key to be used for the field in the imported
   * Kubernetes secret.
   */
  readonly kubernetesKey: string;

  /**
   * Policy for fetching tags/labels from provider secrets.
   */
  readonly metadataPolicy?: MetadataPolicy;

  /**
   * The JSON key for the field in the secret being imported.
   */
  readonly remoteKey?: string;
}

/**
 * Configuration detailing how secrets are to be synchronized.
 */
export interface SecretReferenceConfiguration {
  /**
   * A mapping of fields and per field options to use when synchronizing a
   * secret from a provider.
   */
  readonly fields?: SecretFieldReference[];

  /**
   * The ID of the secret to be imported from the provider.
   */
  readonly remoteRef: string;
}

/**
 * Represents a resource the can be synchronized into a Kubernetes secret.
 */
export interface ISecretReference {
  /**
   * Gets the configuration details for the resource being sychronized in a
   * form that can be universally used to create the synchronization
   * configuration.
   *
   * @param scope The scope of the construct that will be configuring the
   * synchronization configuration.
   */
  bind(scope: IConstruct): SecretReferenceConfiguration;
}

/**
 * Configuration for the ExternalSecret resource.
 */
export interface ExternalSecretProps extends ResourceProps {
  /**
   * The EKS cluster where the secret should be created.
   */
  readonly cluster: ICluster;

  /**
   * The name to use for the Kubernetes secret resource when it is synchronized
   * into the cluster.
   */
  readonly name?: string;

  /**
   * The name where the synchronized secret should be created.
   */
  readonly namespace?: string;

  /**
   * The frequency at which synchronization should occur.
   */
  readonly refreshInterval?: Duration;

  /**
   * The secrets to synchronize into this Kubernetes secret.
   *
   * If multiple secrets are provided their fields will be merged.
   */
  readonly secrets?: ISecretReference[];

  /**
   * The Kubernetes secret store resource that provides details and permissions
   * to use for importing secrets from the provider.
   */
  readonly secretStore: ISecretStore;
}

/**
 * Represents a Kubernetes secret that is being synchronized from an external
 * provider.
 *
 * On a technical level, provides the configuration for how the external
 * secrets operator service should manage the synchronization of the Kubernetes
 * secret.
 */
export class ExternalSecret extends Resource {
  /**
   * The internal collection of referenced provider secrets that are referenced
   * in the Kubernetes secret.
   */
  private readonly _secrets: ISecretReference[] = [];


  /**
   * The EKS cluster where the secret should be created.
   *
   * @group Inputs
   */
  public readonly cluster: ICluster;

  /**
   * The name to use for the Kubernetes secret resource when it is synchronized
   * into the cluster.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * The name where the synchronized secret should be created.
   *
   * @group Inputs
   */
  public readonly namespace?: string;

  /**
   * The frequency at which synchronization should occur.
   *
   * @group Inputs
   */
  public readonly refreshInterval?: Duration;

  /**
   * The Kubernetes secret store resource that provides details and permissions
   * to use for importing secrets from the provider.
   *
   * @group Inputs
   */
  public readonly secretStore: ISecretStore;

  /**
   * The collection of referenced provider secrets that are referenced in the
   * Kubernetes secret.
   *
   * @group Inputs
   */
  public get secrets(): ISecretReference[] {
    return [...this._secrets];
  }


  /**
   * The Kubernetes manifest defining the configuration of how to synchronize
   * the Kubernetes secret from the provider secrets.
   *
   * @group Resources
   */
  public readonly manifest: KubernetesManifest;


  /**
   * The name of the Kubernetes secret.
   */
  public readonly secretName: string;


  /**
   * Creates a new instance of the ExternalSecret class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: ExternalSecretProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? `es${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.namespace = props.namespace;
    this.refreshInterval = props.refreshInterval ?? Duration.minutes(1);
    this.secretStore = props.secretStore;

    this.manifest = new KubernetesManifest(this, 'Resource', {
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
    this.manifest.node.addDependency(this.secretStore);

    this.secretName = this.name;

    props.secrets?.map((x) => {
      this.addSecret(x);
    });
  }

  /**
   * Adds a provider secret reference to the synchronized Kubernetes secret.
   *
   * For external secrets that reference multiple provider secrets the keys of
   * all provider secrets will be merged into the single Kubernetes secret.
   *
   * @param secret The provider secret to reference.
   * @returns The external secret resoiurce where the reference was added.
   */
  public addSecret(secret: ISecretReference): ExternalSecret {
    this._secrets.push(secret);
    return this;
  }
}