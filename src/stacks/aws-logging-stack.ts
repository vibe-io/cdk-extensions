import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FlowLogFormat } from '../services/ec2/constructs/flow-log';
import { Database } from '../services/glue/constructs/database';
import { AlbLogsBucket } from '../services/s3/patterns/alb-logs-bucket';
import { CloudfrontLogsBucket } from '../services/s3/patterns/cloudfront-logs-bucket';
import { CloudtrailBucket } from '../services/s3/patterns/cloudtrail-bucket';
import { FlowLogsBucket } from '../services/s3/patterns/flow-logs-bucket';
import { S3AccessLogsBucket } from '../services/s3/patterns/s3-access-logs-bucket';
import { SesLogsBucket } from '../services/s3/patterns/ses-logs-bucket';
import { WafLogsBucket } from '../services/s3/patterns/waf-logs-bucket';


/**
 * Configuration for the demo service stack.
 */
export interface AwsLoggingStackProps extends StackProps {
  readonly albLogsBucket?: AlbLogsBucket;
  readonly cloudfrontLogsBucket?: CloudfrontLogsBucket;
  readonly cloudtrailLogsBucket?: CloudtrailBucket;
  readonly databaseName?: string;
  readonly flowLogsBucket?: FlowLogsBucket;
  readonly flowLogsFormat?: FlowLogFormat;
  readonly friendlyQueryNames?: boolean;
  readonly sesLogsBucket?: SesLogsBucket;
  readonly standardizeNames?: boolean;
  readonly wafLogsBucket?: WafLogsBucket;
}

/**
 * Creates a demo web service running in Fargate that is accessible through an application load balancer.
 * The demo service serves a generic "Welcome to nginx" page.
 *
 * The service can be accessed remotely using ECS Exec. For details see the documentation at:
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html#ecs-exec-running-commands
 */
export class AwsLoggingStack extends Stack {
  // Input properties
  public readonly databaseName: string;
  public readonly flowLogsFormat: FlowLogFormat;
  public readonly friendlyQueryNames?: boolean;
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