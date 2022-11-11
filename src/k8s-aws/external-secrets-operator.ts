import { Duration, Resource, ResourceProps } from 'aws-cdk-lib';
import { Cluster, HelmChart } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { ExternalSecret, SecretFieldReference } from './external-secret';
import { SecretsManagerSecretStore } from './secrets-manager-secret-store';
import { SsmParameterSecretStore } from './ssm-parameter-secret-store';


/**
 * Configuration options for adding a Kubernetes secret synced from an external
 * provider to Kubernetes.
 */
export interface ExternalSecretOptions {
  /**
   * A collection of field mappings that tells the external secrets operator
   * the structure of the Kubernetes secret to create and which how fields in
   * the Kubernetes secret should map to fields in the secret from the external
   * secret provider.
   *
   * @default The Kubernetes secret will mirror the fields from the secret in
   * the external provider.
   */
  readonly fields?: SecretFieldReference[];

  /**
   * The name of the Kubernetes secret that will be created, as it will appear
   * from within the Kubernetes cluster.
   *
   * @default A name will be auto-generated.
   */
  readonly name?: string;
}

/**
 * Configuration options for adding a Kubernetes secret synced from an external
 * provider to a specific Kubernetes namespace.
 */
export interface NamespacedExternalSecretOptions extends ExternalSecretOptions {
  /**
   * The Kubernetes namespace where the synced secret should be created.
   *
   * @default 'default'
   */
  readonly namespace?: string;
}

/**
 * Configuration for the ExternalSecretsOperator resource.
 */
export interface ExternalSecretsOperatorProps extends ResourceProps {
  /**
   * The EKS cluster where the external secrets operator should be installed.
   */
  readonly cluster: Cluster;

  /**
   * Determines the behavior when the service is deployed to a namespace that
   * doesn't already exist on the EKS cluster.
   *
   * When this flag is `true` and the namespace doesn't exist, the namespace
   * will be created automatically.
   *
   * When this flag is `false` and the namespace doesn't exist, an error will
   * occur and resource creation will fail.
   *
   * @default true
   */
  readonly createNamespace?: boolean;

  /**
   * The Kubernetes namespace where the external secrets operator service
   * should be installed and configured.
   *
   * @default {@link ExternalSecretsOperator.DEFAULT_NAMESPACE}
   */
  readonly namespace?: string;
}

/**
 * External Secrets Operator is a Kubernetes operator that integrates external
 * secret management systems like AWS Secrets Manager, HashiCorp Vault, Google
 * Secrets Manager, Azure Key Vault and many more. The operator reads
 * information from external APIs and automatically injects the values into a
 * Kubernetes Secret.
 *
 * @see [External Secrets Website](https://external-secrets.io/)
 */
export class ExternalSecretsOperator extends Resource {
  /**
   * The name of the Helm chart to install from the Helm repository.
   */
  public static readonly CHART_NAME: string = 'external-secrets';

  /**
   * The URL of the Helm repository that hostys the Helm charts used to install
   * the externalk secrets operator service.
   */
  public static readonly CHART_REPOSITORY: string = 'https://charts.external-secrets.io';

  /**
   * The default Kubernetes namespace where the external secrets operator
   * service should be installed and configured if no overriding input is
   * provided.
   */
  public static readonly DEFAULT_NAMESPACE: string = 'external-secrets';

  /**
   * The EKS cluster where the external secrets operator service should be
   * installed and configured.
   *
   * @group Inputs
   */
  public readonly cluster: Cluster;

  /**
   * Determines the behavior when the service is deployed to a namespace that
   * doesn't already exist on the EKS cluster.
   *
   * When this flag is `true` and the namespace doesn't exist, the namespace
   * will be created automatically.
   *
   * When this flag is `false` and the namespace doesn't exist, an error will
   * occur and resource creation will fail.
   *
   * @group Inputs
   */
  public readonly createNamespace?: boolean;

  /**
   * The Kubernetes namespace where the external secrets operator service
   * should be installed and configured.
   *
   * @group Inputs
   */
  public readonly namespace: string;

  /**
   * The Helm chart the manages the installation and configuration of the
   * external secrets operator service.
   *
   * @group Resources
   */
  public readonly helmChart: HelmChart;


  /**
   * Creates a new instance of the ExternalSecretsOperator class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  constructor(scope: Construct, id: string, props: ExternalSecretsOperatorProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.createNamespace = props.createNamespace ?? true;
    this.namespace = props.namespace ?? ExternalSecretsOperator.DEFAULT_NAMESPACE;

    this.helmChart = new HelmChart(this, 'helm-chart', {
      cluster: this.cluster,
      chart: ExternalSecretsOperator.CHART_NAME,
      createNamespace: this.createNamespace,
      namespace: this.namespace,
      release: 'external-secrets-operator',
      repository: ExternalSecretsOperator.CHART_REPOSITORY,
      timeout: Duration.minutes(15),
      values: {
        installCRDs: true,
        webhook: {
          port: '9443',
        },
      },
      wait: true,
    });
  }

  /**
   * Registers a Secrets Manager secret with the external secrets operator,
   * enabling syncing from the Secrets Manager secret into Kubernetes.
   *
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within for each secrets manager secret within a
   * Kubernetes namespace.
   * @param secret The Secrets Manager secret to enable syncing for.
   * @param options Options for configuring syncing of the Secrets Manager
   * secret.
   * @returns The external secret object that was created.
   */
  public registerSecretsManagerSecret(id: string, secret: ISecret, options: NamespacedExternalSecretOptions = {}): ExternalSecret {
    const namespace = options?.namespace ?? 'default';
    const storeId = `store::${namespace}::secrets-manager`;
    const store = this.node.tryFindChild(storeId) as SecretsManagerSecretStore ?? new SecretsManagerSecretStore(this, storeId, {
      cluster: this.cluster,
      namespace: options?.namespace,
    });
    store.node.addDependency(this.helmChart);

    return store.addSecret(id, secret, options);
  }

  /**
   * Registers a Systems Manager parameter with the external secrets operator,
   * enabling syncing from the Systems Manager parameter into Kubernetes.
   *
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within for each Systems Manager parameter within a
   * Kubernetes namespace.
   * @param parameter The Systems Manager parameter to enable syncing for.
   * @param options Options for configuring syncing of the Systems Manager
   * parameter.
   * @returns The external secret object that was created.
   */
  public registerSsmParameterSecret(id: string, parameter: IParameter, options: NamespacedExternalSecretOptions = {}): ExternalSecret {
    const namespace = options.namespace ?? 'default';
    const storeId = `store::${namespace}::ssm`;
    const store = this.node.tryFindChild(storeId) as SsmParameterSecretStore ?? new SsmParameterSecretStore(this, storeId, {
      cluster: this.cluster,
      namespace: options.namespace,
    });
    store.node.addDependency(this.helmChart);

    return store.addSecret(id, parameter, options);
  }
}