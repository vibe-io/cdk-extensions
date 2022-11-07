import { Resource } from 'aws-cdk-lib';
import { FargateCluster, FargateClusterProps } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct, IDependable } from 'constructs';
import { FargateLogger, FargateLoggerOptions, Route53Dns, Route53DnsOptions } from '../k8s-aws';
import { CloudWatchMonitoring } from '../k8s-aws/cloudwatch-monitoring';
import { ExternalSecret } from '../k8s-aws/external-secret';
import { ExternalSecretsOperator, NamespacedExternalSecretOptions } from '../k8s-aws/external-secrets-operator';


/**
 * Configuration options for enabling CloudWatch monitoring on the cluster.
 */
export interface CloudWatchMonitoringOptions {
  /**
   * Flag that controls whether CloudWatch Monitoring should be enabled or not.
   *
   * @default true
   */
  readonly enabled?: boolean;
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

export interface ExternalSecretsOptions {
  readonly enabled?: boolean;
  readonly createNamespace?: boolean;
  readonly name?: string;
  readonly namespace?: string;
}

export interface AwsIntegratedFargateClusterProps extends FargateClusterProps {
  readonly cloudWatchMonitoringOptions?: CloudWatchMonitoringOptions;
  readonly externalDnsOptions?: ClusterRoute53DnsOptions;
  readonly externalSecretsOptions?: ExternalSecretsOptions;
  readonly loggingOptions?: ClusterFargateLoggingOptions;
}

export class AwsIntegratedFargateCluster extends Resource {
  // Resource properties
  public readonly cloudWatchMonitoring?: CloudWatchMonitoring;
  public readonly externalSecrets?: ExternalSecretsOperator;
  public readonly fargateLogger?: FargateLogger;
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

    if (props.cloudWatchMonitoringOptions?.enabled ?? true) {
      this.cloudWatchMonitoring = new CloudWatchMonitoring(this, 'cloudwatch-monitoring', {
        cluster: this.resource,
      });
      this.cloudWatchMonitoring.node.addDependency(lastResource);
      lastResource = this.cloudWatchMonitoring;
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
      const fargateProfile = this.resource.addFargateProfile('external-secrets', {
        selectors: [
          {
            namespace: props.externalSecretsOptions?.namespace ?? ExternalSecretsOperator.DEFAULT_NAMESPACE,
          },
        ],
      });

      this.fargateLogger?.addFargateProfile(fargateProfile);

      this.externalSecrets = new ExternalSecretsOperator(this, 'external-secrets', {
        ...(props.externalSecretsOptions ?? {}),
        cluster: this.resource,
      });
      this.externalSecrets.node.addDependency(lastResource);
      lastResource = this.externalSecrets;
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