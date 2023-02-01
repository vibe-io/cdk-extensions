import { Resource } from 'aws-cdk-lib';
import { FargateCluster, FargateClusterProps } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct, IDependable } from 'constructs';
import { IWorkspace, Workspace } from '../aps';
import { FargateLogger, FargateLoggerOptions, Route53Dns, Route53DnsOptions } from '../k8s-aws';
import { AdotCollector } from '../k8s-aws/adot-collector';
import { ExternalSecret } from '../k8s-aws/external-secret';
import { ExternalSecretsOperator, NamespacedExternalSecretOptions } from '../k8s-aws/external-secrets-operator';
import { Prometheus, PrometheusOptions } from '../k8s-fargate';


/**
 * Configuration options for enabling CloudWatch monitoring on the cluster.
 */
export interface ContainerInsightsOptions {
  /**
   * Flag that controls whether CloudWatch Monitoring should be enabled or not.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The Kubernetes namespace where resources related to the the configuration
   * of Container Insights will be created.
   *
   * @default {@link AdotCollector.DEFAULT_NAMESPACE}
   */
  readonly namespace?: string;
}

/**
 * Configuration options for enabling persistent logging for Fargate containers
 * on the cluster.
 */
export interface ClusterFargateLoggingOptions extends FargateLoggerOptions {
  /**
     * Controls whether logging will be set up for pods using the default
     * Fargate provide on the EKS cluster.
     *
     * @default true
     */
  readonly enabled?: boolean;
}

export interface ClusterRoute53DnsOptions extends Route53DnsOptions {
  readonly enabled?: boolean;
}

export interface ClusterPrometheusOptions extends PrometheusOptions {
  readonly enabled?: boolean;
  readonly workspace?: IWorkspace;
}

export interface ExternalSecretsOptions {
  readonly enabled?: boolean;
  readonly createNamespace?: boolean;
  readonly name?: string;
  readonly namespace?: string;
}

export interface AwsIntegratedFargateClusterProps extends FargateClusterProps {
  readonly containerInsightsOptions?: ContainerInsightsOptions;
  readonly externalDnsOptions?: ClusterRoute53DnsOptions;
  readonly externalSecretsOptions?: ExternalSecretsOptions;
  readonly loggingOptions?: ClusterFargateLoggingOptions;
  readonly prometheusOptions?: ClusterPrometheusOptions;
}

export class AwsIntegratedFargateCluster extends Resource {
  // Resource properties
  public readonly adotCollector?: AdotCollector;
  public readonly externalSecrets?: ExternalSecretsOperator;
  public readonly fargateLogger?: FargateLogger;
  public readonly prometheusService?: Prometheus;
  public readonly prometheusWorkspace?: IWorkspace;
  public readonly route53Dns?: Route53Dns;
  public readonly resource: FargateCluster;


  public constructor(scope: Construct, id: string, props: AwsIntegratedFargateClusterProps) {
    super(scope, id);

    this.resource = new FargateCluster(this, 'cluster', {
      ...props,
    });

    let lastResource: IDependable = this.resource;

    if (props.loggingOptions?.enabled ?? true) {
      this.fargateLogger = new FargateLogger(this, 'fargate-logger', {
        cluster: this.resource,
        fargateProfiles: [
          this.resource.defaultProfile,
        ],
      });
      this.fargateLogger.node.addDependency(lastResource);
      lastResource = this.fargateLogger;
    }

    if (props.containerInsightsOptions?.enabled ?? true) {
      this.adotCollector = new AdotCollector(this, 'adot-collector', {
        cluster: this.resource,
      });
      this.adotCollector.node.addDependency(lastResource);

      const fargateProfile = this.resource.addFargateProfile('adot-collector', {
        selectors: [
          {
            namespace: this.adotCollector.namespace,
          },
        ],
      });
      this.fargateLogger?.addFargateProfile(fargateProfile);

      lastResource = this.adotCollector;
    }

    if (props.externalDnsOptions?.enabled ?? true) {
      this.route53Dns = new Route53Dns(this, 'route-53-dns', {
        ...(props.externalDnsOptions ?? {}),
        cluster: this.resource,
      });
      this.route53Dns.node.addDependency(lastResource);
      lastResource = this.route53Dns;
    }

    if (props.externalSecretsOptions?.enabled ?? true) {
      this.externalSecrets = new ExternalSecretsOperator(this, 'external-secrets', {
        ...(props.externalSecretsOptions ?? {}),
        cluster: this.resource,
      });
      this.externalSecrets.node.addDependency(lastResource);

      const fargateProfile = this.resource.addFargateProfile('external-secrets', {
        selectors: [
          {
            namespace: this.externalSecrets.namespace,
          },
        ],
      });
      this.fargateLogger?.addFargateProfile(fargateProfile);

      lastResource = this.externalSecrets;
    }

    if (props.prometheusOptions?.enabled ?? true) {
      this.prometheusWorkspace = props.prometheusOptions?.workspace ?? new Workspace(this, 'prometheus-workspace');

      this.prometheusService = new Prometheus(this, 'prometheus-service', {
        ...(props.prometheusOptions ?? {}),
        cluster: this.resource,
        workspace: this.prometheusWorkspace,
      });
      this.prometheusService.node.addDependency(lastResource);

      lastResource = this.prometheusService;
    }
  }

  public registerSecretsManagerSecret(id: string, secret: ISecret, options: NamespacedExternalSecretOptions = {}): ExternalSecret {
    if (this.externalSecrets) {
      return this.externalSecrets.registerSecretsManagerSecret(id, secret, options);
    } else {
      throw new Error('Cannot register secret as external secret functionality was explicitly disabled.');
    }
  }

  public registerSsmParameterSecret(id: string, parameter: IParameter, options: NamespacedExternalSecretOptions = {}): ExternalSecret {
    if (this.externalSecrets) {
      return this.externalSecrets.registerSsmParameterSecret(id, parameter, options);
    } else {
      throw new Error('Cannot register secret as external secret functionality was explicitly disabled.');
    }
  }
}