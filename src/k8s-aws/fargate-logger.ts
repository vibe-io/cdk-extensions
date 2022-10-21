import { Resource, ResourceProps } from 'aws-cdk-lib';
import { FargateProfile, ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';


/**
 * Configuration for the FargateLogger resource.
 */
export interface FargateLoggerProps extends ResourceProps {
  /**
     * The EKS Cluster to configure Fargate logging for.
     */
  readonly cluster: ICluster;

  /**
     * A default list of Fargate profiles that should have permissions
     * configured. Alternatively profiles can be added at any time by calling
     * `addProfile`.
     */
  readonly fargateProfiles?: FargateProfile[];

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

export class FargateLogger extends Resource {
  // Input properties
  public readonly cluster: ICluster;
  public readonly logStreamPrefix: string;
  public readonly retention: RetentionDays;

  // Resource properties
  public readonly logGroup: ILogGroup;
  public readonly resource: KubernetesManifest;


  constructor(scope: Construct, id: string, props: FargateLoggerProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.logStreamPrefix = props.logStreamPrefix ?? 'pod-';
    this.retention = props.retention ?? RetentionDays.TWO_WEEKS;

    this.logGroup = props.logGroup ?? new LogGroup(this, 'log-group', {
      retention: this.retention,
    });

    this.resource = new KubernetesManifest(this, 'Resource', {
      cluster: this.cluster,
      manifest: [
        {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'aws-observability',
            labels: {
              'aws-observability': 'enabled',
            },
          },
        },
        {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'aws-logging',
            namespace: 'aws-observability',
          },
          data: {
            'output.conf': [
              '[OUTPUT]',
              '    Name cloudwatch_logs',
              '    Match *',
              `    region ${this.stack.region}`,
              `    log_group_name ${this.logGroup.logGroupName}`,
              `    log_stream_prefix ${this.logStreamPrefix}`,
              '    auto_create_group false',
              `    log_retention_days ${this.retention.valueOf()}`,
              '    log_key log',
            ].join('\n'),
            'parsers.conf': [
              '[PARSER]',
              '    Name crio',
              '    Format Regex',
              '    Regex ^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>P|F) (?<log>.*)$',
              '    Time_Key time',
              '    Time_Format %Y-%m-%dT%H:%M:%S.%L%z',
            ].join('\n'),
            'filters.conf': [
              '[FILTER]',
              '    Name parser',
              '    Match *',
              '    Key_name log',
              '    Parser crio',
            ].join('\n'),
          },
        },
      ],
    });

    props.fargateProfiles?.forEach((x) => {
      this.addFargateProfile(x);
    });
  }

  public addFargateProfile(profile: FargateProfile): FargateLogger {
    profile.podExecutionRole.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'logs:CreateLogStream',
        'logs:CreateLogGroup',
        'logs:DescribeLogStreams',
        'logs:PutLogEvents',
      ],
      effect: Effect.ALLOW,
      resources: [
        '*',
      ],
    }));

    return this;
  }
}