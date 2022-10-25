import { Resource } from 'aws-cdk-lib';
import { FargateCluster, FargateClusterProps } from 'aws-cdk-lib/aws-eks';
import { ILogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct, IDependable } from 'constructs';
import { CloudWatchMonitoring } from '../k8s-aws/cloudwatch-monitoring';
import { ExternalDns } from '../k8s-aws/external-dns';
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
  readonly loggingOptions?: FargateLoggingOptions;
}

export class AwsIntegratedFargateCluster extends Resource {
  // Resource properties
  public readonly cloudWatchMonitoring?: CloudWatchMonitoring;
  public readonly externalDns?: ExternalDns;
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
    }
  }
}