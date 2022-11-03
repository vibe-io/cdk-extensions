import { Duration, Stack } from 'aws-cdk-lib';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption, IBucket, StorageClass } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { DeliveryStream, ExtendedS3Destination, IDeliveryStream } from '../../../../kinesis-firehose';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitOutputPlugin, FluentBitOutputPluginCommonOptions } from './output-plugin';


export enum KinesisFirehoseCompressionFormat {
  /**
     * The Apache Arrow compression format.
     *
     * Only available if the Fluent Fit service being used to send logs to
     * Firehose had Apache Arrow enabled at compile time.
     */
  ARROW = 'arrow',

  /**
     * Gzip compression format.
     */
  GZIP = 'gzip',
}

/**
 * Options for configuring the Kinesis Firehose Fluent Bit output plugin.
 *
 * @see [Kinesis Firehose Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/firehose)
 */
export interface FluentBitKinesisFirehoseOutputOptions extends FluentBitOutputPluginCommonOptions {
  /**
     * Immediately retry failed requests to AWS services once. This option does
     * not affect the normal Fluent Bit retry mechanism with backoff. Instead,
     * it enables an immediate retry with no delay for networking errors, which
     * may help improve throughput when there are transient/random networking
     * issues.
     *
     * @default true
     */
  readonly autoRetryRequests?: boolean;

  /**
     * Compression type for Firehose records. Each log record is individually
     * compressed and sent to Firehose.
     */
  readonly compression?: KinesisFirehoseCompressionFormat;

  /**
     * The Kinesis Firehose Delivery stream that you want log records sent to.
     */
  readonly deliveryStream?: IDeliveryStream;

  /**
     * Specify a custom endpoint for the Firehose API.
     */
  readonly endpoint?: string;

  /**
     * By default, the whole log record will be sent to Firehose. If you
     * specify a key name with this option, then only the value of that key
     * will be sent to Firehose.
     */
  readonly logKey?: string;

  /**
     * The AWS region.
     */
  readonly region?: string;

  /**
     * ARN of an IAM role to assume (for cross account access).
     */
  readonly role?: IRole;

  /**
     * Specify a custom STS endpoint for the AWS STS API.
     */
  readonly stsEndpoint?: string;

  /**
     * Add the timestamp to the record under this key.
     */
  readonly timeKey?: string;

  /**
     * A strftime compliant format string for the timestamp.
     *
     * @default '%Y-%m-%dT%H:%M:%S'
     */
  readonly timeKeyFormat?: string;
}

/**
 * Represents configuration for outputing logs from Fluent Bit to Kinesis
 * Firehose.
 */
export class FluentBitKinesisFirehoseOutput extends FluentBitOutputPlugin {
  /**
     * Immediately retry failed requests to AWS services once. This option does
     * not affect the normal Fluent Bit retry mechanism with backoff. Instead,
     * it enables an immediate retry with no delay for networking errors, which
     * may help improve throughput when there are transient/random networking
     * issues.
     *
     * @group Inputs
     */
  public readonly autoRetryRequests?: boolean;

  /**
     * Compression type for Firehose records. Each log record is individually
     * compressed and sent to Firehose.
     *
     * @group Inputs
     */
  public readonly compression?: KinesisFirehoseCompressionFormat;

  /**
     * The Kinesis Firehose Delivery stream that you want log records sent to.
     *
     * @group Inputs
     */
  public readonly deliveryStream?: IDeliveryStream;

  /**
     * Specify a custom endpoint for the Firehose API.
     *
     * @group Inputs
     */
  public readonly endpoint?: string;

  /**
     * By default, the whole log record will be sent to Firehose. If you
     * specify a key name with this option, then only the value of that key
     * will be sent to Firehose.
     *
     * @group Inputs
     */
  public readonly logKey?: string;

  /**
     * The AWS region.
     *
     * @group Inputs
     */
  public readonly region?: string;

  /**
     * ARN of an IAM role to assume (for cross account access).
     *
     * @group Inputs
     */
  public readonly role?: IRole;

  /**
     * Specify a custom STS endpoint for the AWS STS API.
     *
     * @group Inputs
     */
  public readonly stsEndpoint?: string;

  /**
     * Add the timestamp to the record under this key.
     *
     * @group Inputs
     */
  public readonly timeKey?: string;

  /**
     * A strftime compliant format string for the timestamp.
     *
     * @group Inputs
     */
  public readonly timeKeyFormat?: string;


  /**
    * Creates a new instance of the FluentBitKinesisFirehoseOutput class.
    *
    * @param options Options for configuring the output.
    */
  public constructor(options: FluentBitKinesisFirehoseOutputOptions = {}) {
    super('kinesis_firehose', options);

    this.autoRetryRequests = options.autoRetryRequests;
    this.compression = options.compression;
    this.deliveryStream = options.deliveryStream;
    this.endpoint = options.endpoint;
    this.logKey = options.logKey;
    this.region = options.region;
    this.role = options.role;
    this.stsEndpoint = options.stsEndpoint;
    this.timeKey = options.timeKey;
    this.timeKeyFormat = options.timeKeyFormat;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    const deliveryStream = this.getDeliveryStream(scope);

    return {
      configFile: super.renderConfigFile({
        auto_retry_requests: this.autoRetryRequests,
        compression: this.compression,
        delivery_stream: deliveryStream.deliveryStreamName,
        endpoint: this.endpoint,
        log_key: this.logKey,
        region: this.region ?? Stack.of(scope).region,
        role_arn: this.role?.roleArn,
        sts_endpoint: this.stsEndpoint,
        time_key: this.timeKey,
        time_key_format: this.timeKeyFormat,
      }),
      permissions: [
        new PolicyStatement({
          actions: [
            'firehose:PutRecordBatch',
          ],
          effect: Effect.ALLOW,
          resources: [
            deliveryStream.deliveryStreamArn,
          ],
        }),
      ],
    };
  }

  /**
     * Gets a delivery stream object that can be used to set the required
     * delivery_stream property if one hasn't been provided.
     *
     * @param scope The construct configuring logging using Fluent Bit.
     * @returns The delivery stream where output logs should be sent.
     */
  private getDeliveryStream(scope: IConstruct): IDeliveryStream {
    const deliveryStreamId = 'fluent-bit-output-delivery-stream';
    const bucketId = 'fluent-bit-output-delivery-stream-bucket';
    const inheritedDeliveryStream = scope.node.tryFindChild(deliveryStreamId) as IDeliveryStream;

    if (this.deliveryStream) {
      return this.deliveryStream;
    } else if (inheritedDeliveryStream) {
      return inheritedDeliveryStream;
    } else {
      const bucket = scope.node.tryFindChild(bucketId) as IBucket ?? new Bucket(scope, bucketId, {
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
        lifecycleRules: [
          {
            enabled: true,
            expiration: Duration.days(365 * 7),
            noncurrentVersionExpiration: Duration.days(7),
            transitions: [
              {
                storageClass: StorageClass.GLACIER,
                transitionAfter: Duration.days(365 * 1),
              },
              {
                storageClass: StorageClass.DEEP_ARCHIVE,
                transitionAfter: Duration.days(365 * 3),
              },
            ],
          },
        ],
        encryption: BucketEncryption.S3_MANAGED,
        versioned: true,
      });

      return new DeliveryStream(scope, deliveryStreamId, {
        destination: new ExtendedS3Destination(bucket),
      });
    }
  }
}