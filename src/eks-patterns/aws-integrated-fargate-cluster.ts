import { Resource } from 'aws-cdk-lib';
import { FargateCluster, FargateClusterProps } from 'aws-cdk-lib/aws-eks';
import { ILogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct, IDependable } from 'constructs';
import { CloudWatchMonitoring } from '../k8s-aws/cloudwatch-monitoring';
import { ExternalDns } from '../k8s-aws/external-dns';
import { ExternalSecret } from '../k8s-aws/external-secret';
import { ExternalSecretsOperator, NamespacedExternalSecretOptions } from '../k8s-aws/external-secrets-operator';
import { FargateLogger } from '../k8s-aws/fargate-logger';


export interface CloudWatchMonitoringOptions {
  readonly enabled?: boolean;
}

export interface FargateLoggingOptions {
  /**
     * Controls whether logging will be set up for pods using the default
     * Fargate provide on the EKS cluster.
     *
     * @default true
     */
  readonly enabled?: boolean;

  /**
     * The CloudWatch log group where Farget container logs will be sent.
     */
  readonly logGroup?: ILogGroup;

  /**
      * The prefix to add to the start of log streams created by the Fargate
      * logger.
      */
  readonly logStreamPrefix?: string;

  /**
      * The number of days logs sent to CloudWatch from Fluent Bit should be
      * retained before they are automatically removed.
      */
  readonly retention?: RetentionDays;
}

export interface ExternalDnsOptions {
  readonly enabled?: boolean;
  readonly domainFilter?: string[];
}

export interface ExternalSecretsOptions {
  readonly enabled?: boolean;
  readonly createNamespace?: boolean;
  readonly name?: string;
  readonly namespace?: string;
}

export interface AwsIntegratedFargateClusterProps extends FargateClusterProps {
  readonly cloudWatchMonitoringOptions?: CloudWatchMonitoringOptions;
  readonly externalDnsOptions?: ExternalDnsOptions;
  readonly externalSecretsOptions?: ExternalSecretsOptions;
  readonly loggingOptions?: FargateLoggingOptions;
}

export class AwsIntegratedFargateCluster extends Resource {
  // Resource properties
  public readonly cloudWatchMonitoring?: CloudWatchMonitoring;
  public readonly externalDns?: ExternalDns;
  public readonly externalSecrets?: ExternalSecretsOperator;
  public readonly fargateLogger?: FargateLogger;
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
      this.externalDns = new ExternalDns(this, 'external-dns', {
        ...(props.externalDnsOptions ?? {}),
        cluster: this.resource,
      });
      this.externalDns.node.addDependency(lastResource);
      lastResource = this.externalDns;
    }

    if (props.externalSecretsOptions?.enabled ?? true) {
      this.resource.addFargateProfile('external-secrets', {
        selectors: [
          {
            namespace: props.externalSecretsOptions?.namespace ?? ExternalSecretsOperator.DEFAULT_NAMESPACE,
          },
        ],
      });

      this.externalSecrets = new ExternalSecretsOperator(this, 'external-secrets', {
        ...(props.externalSecretsOptions ?? {}),
        cluster: this.resource,
      });
      this.externalSecrets.node.addDependency(lastResource);
      lastResource = this.externalSecrets;
    }
  }

  public registerSecretsManagerSecret(id: string, secret: ISecret, options: NamespacedExternalSecretOptions): ExternalSecret {
    if (this.externalSecrets) {
      return this.externalSecrets.registerSecretsManagerSecret(id, secret, options);
    } else {
      throw new Error('Cannot register secret as external secret functionality was explicitly disabled.');
    }
  }

  public registerSsmParameterSecret(id: string, parameter: IParameter, options?: NamespacedExternalSecretOptions): ExternalSecret {
    if (this.externalSecrets) {
      return this.externalSecrets.registerSsmParameterSecret(id, parameter, options);
    } else {
      throw new Error('Cannot register secret as external secret functionality was explicitly disabled.');
    }
  }
}