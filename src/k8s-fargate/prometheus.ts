import { Duration, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { Cluster, FargateProfile, HelmChart, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { IConstruct } from 'constructs';
import { IWorkspace } from '../aps';


/**
 * Configures the queue used to write to Amazon Managed Service for Prometheus.
 *
 * @see [Remote write configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write)
 */
export interface QueueConfiguration {
  /**
   * Number of samples to buffer per shard before we block reading of more
   * samples from the WAL. It is recommended to have enough capacity in each
   * shard to buffer several requests to keep throughput up while processing
   * occasional slow remote requests.
   */
  readonly capacity?: number;

  /**
   * Maximum number of samples per send.
   */
  readonly maxSamplesPerSend?: number;

  /**
   * Maximum number of shards, i.e. amount of concurrency.
   */
  readonly maxShards?: number;
}

/**
 * Optional configurations for the Prometheus resource.
 */
export interface PrometheusOptions {
  /**
   * The Kubernetes namespace where the service should be deployed.
   */
  readonly namespace?: string;

  /**
   * {@inheritdoc QueueConfiguration}
   */
  readonly queueConfiguration?: QueueConfiguration;

  /**
   * Name of the Kubernetes service account that should be created and used by
   * Prometheus.
   */
  readonly serviceAccountName?: string;
}

export interface PrometheusProps extends ResourceProps, PrometheusOptions {
  /**
   * The EKS cluster where Prometheus should be deployed.
   */
  readonly cluster: Cluster;

  /**
   * The Amazon Managed Service for Prometheus workspace where the Prometheus
   * server should sned its data.
   */
  readonly workspace: IWorkspace;
}

/**
 * Deploys Prometheus into EKS.
 *
 * The service is run in Fargate and writes data to Amazon Managed Service for
 * Prometheus which provides the backing data store.
 *
 * @see [Official Helm chart documentation](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus#readme)
 */
export class Prometheus extends Resource {
  /**
   * The name of the Prometheus Helm chart.
   */
  public static readonly CHART_NAME: string = 'prometheus';

  /**
   * The Helm repository providing the chart to be used for installing the
   * Prometheus service.
   */
  public static readonly CHART_REPOSITORY: string = 'https://prometheus-community.github.io/helm-charts';

  /**
   * The default Kubernetes namespace where Prometheus will be installed if an
   * alternative isn't given as input.
   */
  public static readonly DEFAULT_NAMESPACE: string = 'prometheus';

  /**
   * {@inheritdoc PrometheusProps.cluster}
   *
   * @group Inputs
   */
  public readonly cluster: Cluster;

  /**
   * {@inheritdoc PrometheusOptions.namespace}
   *
   * @group Inputs
   */
  public readonly namespace: string;

  /**
   * {@inheritdoc PropmetheusOptions.queueConfiguration}
   *
   * @group Inputs
   */
  public readonly queueConfiguration?: QueueConfiguration;

  /**
   * {@inheritdoc PrometheusOptions.serviceAccountName}
   *
   * @group Inputs
   */
  public readonly serviceAccountName: string;

  /**
   * {@inheritdoc PrometheusProps.workspace}
   *
   * @group Inputs
   */
  public readonly workspace: IWorkspace;

  /**
   * The Helm chart that was used to deploy Prometheus.
   *
   * @group Resources
   */
  public readonly chart: HelmChart;

  /**
   * The Fargate profile used for running the service in Fargate.
   */
  public readonly fargateProfile: FargateProfile;

  /**
   * The service account that Prometheus will use to gain permissions for
   * Kubernetes and AWS.
   *
   * @group Resources
   */
  public readonly serviceAccount: ServiceAccount;


  /**
   * Creates a new instance of the Prometheus class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: IConstruct, id: string, props: PrometheusProps) {
    super(scope, id, props);

    this.cluster = props.cluster;
    this.namespace = props.namespace ?? Prometheus.DEFAULT_NAMESPACE;
    this.queueConfiguration = props.queueConfiguration;
    this.serviceAccountName = props.serviceAccountName ?? (Names.uniqueId(this) + 'sa').slice(-63).toLowerCase();
    this.workspace = props.workspace;

    this.fargateProfile = this.cluster.addFargateProfile('fargate-profile', {
      selectors: [{
        namespace: this.namespace,
        labels: {
          'cdk-service-node': Names.uniqueId(this),
        },
      }],
    });

    this.serviceAccount = new ServiceAccount(this, 'service-account', {
      cluster: this.cluster,
      name: this.serviceAccountName,
      namespace: this.namespace,
    });

    this.chart = new HelmChart(this, 'helm-chart', {
      cluster: this.cluster,
      chart: Prometheus.CHART_NAME,
      createNamespace: true,
      namespace: this.namespace,
      repository: Prometheus.CHART_REPOSITORY,
      timeout: Duration.minutes(15),
      values: {
        'alertmanager': {
          enabled: false,
        },
        'kube-state-metrics': {
          customLabels: {
            'cdk-service-node': Names.uniqueId(this),
          },
        },
        'prometheus-pushgateway': {
          podLabels: {
            'cdk-service-node': Names.uniqueId(this),
          },
        },
        'prometheus-node-exporter': {
          enabled: false,
        },
        'server': {
          persistentVolume: {
            enabled: false,
          },
          podLabels: {
            'cdk-service-node': Names.uniqueId(this),
          },
          remoteWrite: [{
            queue_config: {
              capacity: this.queueConfiguration?.capacity ?? 2500,
              max_samples_per_send: this.queueConfiguration?.maxSamplesPerSend ?? 1000,
              max_shards: this.queueConfiguration?.maxShards ?? 200,
            },
            url: this.workspace.workspaceRemoteWriteUrl,
          }],
        },
        'serviceAccounts': {
          server: {
            create: false,
            name: this.serviceAccount.serviceAccountName,
          },
        },
      },
      wait: true,
    });
  }
}