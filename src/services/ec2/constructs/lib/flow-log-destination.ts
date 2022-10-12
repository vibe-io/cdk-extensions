import { ArnFormat, PhysicalName, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { FlowLogDestinationType } from 'aws-cdk-lib/aws-ec2';
import { Effect, IRole, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { undefinedIfNoKeys } from '../../../../utils/formatting';
import { FlowLogsBucket } from '../../../s3/patterns/flow-logs-bucket';


/**
 * The file format options for flow log files delivered to S3.
 *
 * @see [FlowLog DestinationOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-destinationoptions)
 * @see [Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)
 */
export enum FlowLogFileFormat {
  /**
     * Apache Parquet is a columnar data format. Queries on data in Parquet
     * format are 10 to 100 times faster compared to queries on data in plain
     * text. Data in Parquet format with Gzip compression takes 20 percent less
     * storage space than plain text with Gzip compression.
     */
  PARQUET = ' parquet',

  /**
     * Plain text. This is the default format.
     */
  PLAIN_TEXT = 'plain-text'
}

/**
 * A configuration object providing the details necessary to set up log
 * delivery to a given destination.
 */
export interface FlowLogDestinationConfig {
  /**
     * An S3 bucket where logs should be delivered.
     *
     * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
     */
  readonly bucket?: IBucket;

  /**
     * Additional options that control the format and behavior of logs
     * delivered to the destination.
     */
  readonly destinationOptions?: {[key: string]: any};

  /**
     * The type of destination for the flow log data.
     *
     * @see [FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)
     */
  readonly destinationType: FlowLogDestinationType;

  /**
     * A CloudWatch LogGroup where logs should be delivered.
     *
     * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
     */
  readonly logGroup?: ILogGroup;

  /**
     * The ARN of the IAM role that allows Amazon EC2 to publish flow logs in
     * your account.
     *
     * @see [FlowLog DeliverLogsPermissionArn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-deliverlogspermissionarn)
     */
  readonly role?: IRole;

  /**
     * An Amazon Resource Name (ARN) for the S3 destination where log files are
     * to be delivered.
     *
     * If a custom prefix is being added the ARN should reflect that prefix.
     *
     * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
     */
  readonly s3Path?: string;
}

export interface FlowLogS3Options {
  /**
     * The file format in which flow logs should be delivered to S3.
     *
     * @see [FlowLog DestinationOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-destinationoptions)
     * @see [Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)
     */
  readonly fileFormat?: FlowLogFileFormat;

  /**
     * Controls the format of partitions ("folders") when the flow logs are
     * delivered to S3.
     *
     * By default, flow logs are delivered partitioned such that each part of
     * the S3 path represents a values pertaining to details of the log.
     *
     * When hive compatible partitions are enabled, partitions will be
     * structured such that keys declaring the partition name are added at
     * each level.
     *
     * An example of standard partitioning:
     * ```
     * /us-east-1/2020/03/08/log.tar.gz
     * ```
     *
     * An example with Hive compatible partitions:
     * ```
     * /region=us-east-1/year=2020/month=03/day=08/log.tar.gz
     * ```
     *
     * @see [FlowLog DestinationOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-destinationoptions)
     * @see [Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)
     * @see [Partitioning data in Athena](https://docs.aws.amazon.com/athena/latest/ug/partitions.html)
     * @see [AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/optimize-performance-and-reduce-costs-for-network-analytics-with-vpc-flow-logs-in-apache-parquet-format/)
     */
  readonly hiveCompatiblePartitions?: boolean;

  /**
     * An optional prefix that will be added to the start of all flow log files
     * delivered to the S3 bucket.
     *
     * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
     */
  readonly keyPrefix?: string;

  /**
     * Indicates whether to partition the flow log per hour.
     *
     * By default, flow logs are partitioned (organized into S3 "folders") by
     * day.
     *
     * Setting this to true will add an extra layer of directories splitting
     * flow log files by the hour in which they were delivered.
     *
     * @see [FlowLog DestinationOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-destinationoptions)
     * @see [Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)
     */
  readonly perHourPartition?: boolean;
}

/**
 * Represents a resource that can act as a deliver endpoint for captured flow
 * logs.
 */
export interface ILogDestination {
  bind(scope: IConstruct): FlowLogDestinationConfig;
}

/**
 * Represents a resource that can act as a deliver endpoint for captured flow
 * logs.
 */
export abstract class FlowLogDestination implements ILogDestination {
  /**
     * Represents a CloudWatch log group that will serve as the endpoint where
     * flow logs should be delivered.
     *
     * @see [Publish flow logs to CloudWatch Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html)
     *
     * @param logGroup The CloudWatch LogGroup where flow logs should be
     * delivered.
     * @param role An IAM role that allows Amazon EC2 to publish flow logs to a
     * CloudWatch Logs log group in your account.
     * @returns A configuration object containing details on how to set up
     * logging to the log group.
     */
  public static toCloudWatchLogs(logGroup?: ILogGroup, role?: IRole): FlowLogDestination {
    return {
      bind: (scope: IConstruct) => {
        const resolvedLogGroup = logGroup ?? new LogGroup(scope, 'log-group', {
          removalPolicy: RemovalPolicy.DESTROY,
          retention: RetentionDays.TWO_WEEKS,
        });

        const resolvedRole = role ?? new Role(scope, 'role', {
          assumedBy: new ServicePrincipal('vpc-flow-logs.amazonaws.com'),
          roleName: PhysicalName.GENERATE_IF_NEEDED,
        });

        resolvedRole.addToPrincipalPolicy(new PolicyStatement({
          actions: [
            'logs:CreateLogStream',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents',
          ],
          // TODO - Handle condition for extra security
          // See: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html#flow-logs-iam
          effect: Effect.ALLOW,
          resources: [
            resolvedLogGroup.logGroupArn,
          ],
        }));

        return {
          role: resolvedRole,
          destinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
          logGroup: logGroup,
        };
      },
    };
  }

  /**
     * Represents a CloudWatch log group that will serve as the endpoint where
     * flow logs should be delivered.
     *
     * @see [Publish flow logs to Amazon S3](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html)
     *
     * @param bucket The S3 Bucket where flow logs should be delivered.
     * @param options Configuration options controlling how flow logs will be
     * written to S3.
     * @returns A configuration object containing details on how to set up
     * logging to the bucket.
     */
  public static toS3(bucket?: IBucket, options?: FlowLogS3Options): FlowLogDestination {
    return {
      bind: (scope: IConstruct) => {
        const resolvedBucket = bucket ?? new FlowLogsBucket(scope, 'bucket');

        resolvedBucket.addToResourcePolicy(
          new PolicyStatement({
            actions: [
              's3:PutObject',
            ],
            conditions: {
              ArnLike: {
                'aws:SourceArn': Stack.of(scope).formatArn({
                  arnFormat: ArnFormat.NO_RESOURCE_NAME,
                  resource: '*',
                  service: 'logs',
                }),
              },
              StringEquals: {
                'aws:SourceAccount': Stack.of(scope).account,
                's3:x-amz-acl': 'bucket-owner-full-control',
              },
            },
            effect: Effect.ALLOW,
            principals: [
              new ServicePrincipal('delivery.logs.amazonaws.com'),
            ],
            resources: [
              resolvedBucket.arnForObjects('*'),
            ],
          }),
        );

        resolvedBucket.addToResourcePolicy(
          new PolicyStatement({
            actions: [
              's3:GetBucketAcl',
            ],
            conditions: {
              ArnLike: {
                'aws:SourceArn': Stack.of(scope).formatArn({
                  arnFormat: ArnFormat.NO_RESOURCE_NAME,
                  resource: '*',
                  service: 'logs',
                }),
              },
              StringEquals: {
                'aws:SourceAccount': Stack.of(scope).account,
              },
            },
            effect: Effect.ALLOW,
            principals: [
              new ServicePrincipal('delivery.logs.amazonaws.com'),
            ],
            resources: [
              resolvedBucket.bucketArn,
            ],
          }),
        );

        return {
          bucket: resolvedBucket,
          destinationOptions: undefinedIfNoKeys({
            FileFormat: options?.fileFormat,
            HiveCompatiblePartitions: options?.hiveCompatiblePartitions,
            PerHourPartition: options?.perHourPartition,
          }),
          destinationType: FlowLogDestinationType.S3,
          s3Path: options?.keyPrefix ? resolvedBucket.arnForObjects(options?.keyPrefix) : resolvedBucket.bucketArn,
        };
      },
    };
  }

  /**
     * Returns a configuration object with all the fields and resources needed
     * to configure a flow log to write to the destination.
     *
     * @param scope The CDK Construct that will be consuming the configuration
     * and using it to configure a flow log.
     */
  public abstract bind(scope: IConstruct): FlowLogDestinationConfig;
}
