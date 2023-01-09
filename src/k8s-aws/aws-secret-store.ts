import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { Construct, IDependable } from 'constructs';


/**
 * Represents a Kubernetes secret store resource.
 */
export interface ISecretStore extends IDependable {
  /**
   * The name of the secret store as it appears in Kubernetes.
   */
  readonly secretStoreName: string;
}

/**
 * Configuration options for adding a new secret store resource.
 */
export interface AwsSecretStoreProps extends ResourceProps {
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

  /**
   * The name of the service provider backing the secret store.
   */
  readonly service: string;
}

/**
 * A generic class representing secret store that is backed by an AWS service.
 */
export class AwsSecretStore extends Resource implements ISecretStore {
  /**
   * The regex pattern used to validate secret store names.
   */
  public static readonly NAME_VALIDATOR_REGEX='^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$';

  /**
   * The EKS cluster where the secret store should be created.
   *
   * @group Inputs
   */
  public readonly cluster: ICluster;

  /**
   * A human friendly name for the secret store.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * The Kubernetes namespace where the secret store should be created.
   *
   * @group Inputs
   */
  public readonly namespace: string;

  /**
   * The name of the service provider backing the secret store.
   *
   * @group Inputs
   */
  public readonly service: string;

  /**
   * The Kubernetes manifest that defines the secret store.
   *
   * @group Resources
   */
  public readonly manifest: KubernetesManifest;

  /**
   * A Kubernetes service account mapped to an IAM role that provides the
   * necessary permissions to sychronize secrets from an AWS rpvoder.
   *
   * @group Resources
   */
  public readonly serviceAccount: ServiceAccount;

  /**
   * The name of the secret store as it appears in Kubernetes.
   */
  public readonly secretStoreName: string;


  /**
   * Creates a new instance of the AwsSecretStore class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: AwsSecretStoreProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61).toLowerCase()}`;
    this.namespace = props.namespace ?? 'default';
    this.service = props.service;

    if (!RegExp(AwsSecretStore.NAME_VALIDATOR_REGEX).test(this.name) || this.name.length > 63) {
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

    this.manifest = new KubernetesManifest(this, 'Resource', {
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
    this.manifest.node.addDependency(this.serviceAccount);

    this.secretStoreName = this.name;
  }
}