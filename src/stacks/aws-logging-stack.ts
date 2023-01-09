import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FlowLogFormat } from '../ec2';
import { Database } from '../glue';
import { AlbLogsBucket, CloudfrontLogsBucket, CloudtrailBucket, FlowLogsBucket, S3AccessLogsBucket, SesLogsBucket, WafLogsBucket } from '../s3-buckets';

/**
* Configuration for AwsLoggingStack.
*/
export interface AwsLoggingStackProps extends StackProps {
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!AlbLogsBucket} object.
   */
  readonly albLogsBucket?: AlbLogsBucket;
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!CloudfrontLogsBucket} object.
   */
  readonly cloudfrontLogsBucket?: CloudfrontLogsBucket;
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!CloudtrailBucket} object.
   */
  readonly cloudtrailLogsBucket?: CloudtrailBucket;
  /**
   * Name used for the Glue Database that will be created
   */
  readonly databaseName?: string;
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!FlowLogsBucket} object.
   */
  readonly flowLogsBucket?: FlowLogsBucket;
  /**
   * A cdk-extentions/ec2 {@link aws-ec2!FlowLogFormat } object defining the desired formatting for Flow Logs
   */
  readonly flowLogsFormat?: FlowLogFormat;
  /**
   * Boolean for adding "friendly names" for the created Athena queries.
   */
  readonly friendlyQueryNames?: boolean;
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!SesLogsBucket} object.
   */
  readonly sesLogsBucket?: SesLogsBucket;
  /**
   * Boolean for using "standardized" naming (i.e. "aws-${service}-logs-${account}
   * -${region}") for the created S3 Buckets.
   */
  readonly standardizeNames?: boolean;
  /**
   * A cdk-extensions/s3-buckets {@link aws-s3-buckets!WafLogsBucket} object.
   */
  readonly wafLogsBucket?: WafLogsBucket;
}

/**
 * Creates a Stack that deploys a logging strategy for several AWS services.
 * Stack creates a Glue Database using cdk-extensions Database, deploys
 * cdk-extensions/s3-buckets patterns for each service, and utilizes methods exposed
 * by cdk-extensions/s3-buckets S3AccessLogsBucket to enable logging for each created
 * bucket.
 *
 * @see {@link aws-glue!Database | cdk-extensions/glue Database}
 * @see {@link aws-s3-buckets!AlbLogsBucket | cdk-extensions/s3-buckets AlbLogsBucket}
 * @see {@link aws-s3-buckets!CloudfrontLogsBucket | cdk-extensions/s3-buckets CloudfrontLogsBucket}
 * @see {@link aws-s3-buckets!CloudtrailBucket | cdk-extensions/s3-buckets CloudtrailBucket}
 * @see {@link aws-s3-buckets!FlowLogsBucket | cdk-extensions/s3-buckets FlowLogsBucket}
 * @see {@link aws-s3-buckets!S3AccessLogsBucket | cdk-extensions/s3-buckets S3AccessLogsBucket}
 * @see {@link aws-s3-buckets!SesLogsBucket | cdk-extensions/s3-buckets SesLogsBucket}
 * @see {@link aws-s3-buckets!WafLogsBucket | cdk-extensions/s3-buckets WafLogsBucket}
 */
export class AwsLoggingStack extends Stack {
  // Input properties
  /**
   * Name for the AWS Logs Glue Database
   */
  public readonly databaseName: string;
  /**
   * A cdk-extentions/ec2 {@link aws-ec2!FlowLogFormat } object defining the desired formatting for Flow Logs
   */
  public readonly flowLogsFormat: FlowLogFormat;
  /**
   * Boolean for adding "friendly names" for the created Athena queries.
   */
  public readonly friendlyQueryNames?: boolean;
  /**
   * Boolean for using standardized names (i.e. "aws-${service}-logs-${account}
   * -${region}") for the created S3 Buckets.
   */
  public readonly standardizeNames: boolean;

  // Resource properties
  public readonly albLogsBucket: AlbLogsBucket;
  public readonly cloudfrontLogsBucket: CloudfrontLogsBucket;
  public readonly cloudtrailLogsBucket: CloudtrailBucket;
  public readonly database: Database;
  public readonly flowLogsBucket: FlowLogsBucket;
  public readonly s3AccessLogsBucket: S3AccessLogsBucket;
  public readonly sesLogsBucket: SesLogsBucket;
  public readonly wafLogsBucket: WafLogsBucket;

  /**
     * Creates a new instance of the AwsLoggingStack class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: AwsLoggingStackProps = {}) {
    super(scope, id, props);

    this.databaseName = props.databaseName ?? 'awslogs';
    this.flowLogsFormat = props.flowLogsFormat ?? FlowLogFormat.V2;
    this.friendlyQueryNames = props.friendlyQueryNames ?? props.standardizeNames ?? true;
    this.standardizeNames = props.standardizeNames ?? true;

    this.database = new Database(this, 'database', {
      name: this.databaseName,
    });

    this.s3AccessLogsBucket = new S3AccessLogsBucket(this, 's3-access-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-s3-access-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 's3_access_logs',
    });

    this.albLogsBucket = props.albLogsBucket ?? new AlbLogsBucket(this, 'alb-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-alb-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'alb_logs',
    });

    this.cloudfrontLogsBucket = props.cloudfrontLogsBucket ?? new CloudfrontLogsBucket(this, 'cloudfront-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-cloudfront-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'cloudfront_logs',
    });

    this.cloudtrailLogsBucket = props.cloudtrailLogsBucket ?? new CloudtrailBucket(this, 'cloudtail-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-cloudtrail-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'cloudtrail_logs',
    });

    this.flowLogsBucket = props.flowLogsBucket ?? new FlowLogsBucket(this, 'flow-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-flow-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      format: this.flowLogsFormat,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'flow_logs',
    });

    this.sesLogsBucket = props.sesLogsBucket ?? new SesLogsBucket(this, 'ses-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-ses-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'ses_logs',
    });

    this.wafLogsBucket = props.wafLogsBucket ?? new WafLogsBucket(this, 'waf-logs-bucket', {
      bucketName: this.standardizeNames ? `aws-waf-logs-${this.account}-${this.region}` : undefined,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      tableName: 'waf_logs',
    });

    this.s3AccessLogsBucket.addLoggingAspect(this);
  }
}
