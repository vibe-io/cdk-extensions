import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { ExternalSecretStore } from './external-secret-store';


export interface SecretFieldReference {
  readonly key: string;
  readonly property?: string;
}

/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly fields?: SecretFieldReference[];
  readonly name?: string;
  readonly refreshInterval?: Duration;
  readonly secret: ISecret;
  readonly secretStore: ExternalSecretStore;
}

export class ExternalSecret extends Resource {
  // Input properties
  public readonly cluster: ICluster;
  public readonly fields: SecretFieldReference[];
  public readonly name: string;
  public readonly refreshInterval?: Duration;
  public readonly secret: ISecret;
  public readonly secretStore: ExternalSecretStore;

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
    this.name = `es${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.refreshInterval = props.refreshInterval ?? Duration.minutes(1);
    this.secret = props.secret;
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
                      secretKey: x.key,
                      remoteRef: {
                        key: this.secret.secretArn,
                        property: x.property ?? x.key,
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
    this.resource.node.addDependency(this.secretStore.secretStore);

    this.secretName = this.name;
  }

  public addField(key: string, property?: string): void {
    this.fields.push({
      key,
      property,
    });
  }
}