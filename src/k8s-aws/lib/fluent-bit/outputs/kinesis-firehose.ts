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

export class FluentBitKinesisFirehoseOutput extends FluentBitOutputPlugin {
  public constructor(options: FluentBitKinesisFirehoseOutputOptions = {}) {
    super('kinesis_firehose', options);

    if (options.autoRetryRequests !== undefined) {
      this.addField('auto_create_group', String(options.autoRetryRequests));
    }

    if (options.compression !== undefined) {
      this.addField('compression', options.compression);
    }

    if (options.deliveryStream !== undefined) {
      this.addField('delivery_stream', options.deliveryStream.deliveryStreamName);
    }

    if (options.endpoint !== undefined) {
      this.addField('endpoint', options.endpoint);
    }

    if (options.logKey !== undefined) {
      this.addField('log_key', options.logKey);
    }

    if (options.region !== undefined) {
      this.addField('region', options.region);
    }

    if (options.role !== undefined) {
      this.addField('role_arn', options.role.roleArn);
    }

    if (options.stsEndpoint !== undefined) {
      this.addField('sts_endpoint', options.stsEndpoint);
    }

    if (options.timeKey !== undefined) {
      this.addField('time_key', options.timeKey);
    }

    if (options.timeKeyFormat !== undefined) {
      this.addField('time_key_format', options.timeKeyFormat);
    }
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
    if (this.fields.delivery_stream === undefined) {
      this.addField('delivery_stream', deliveryStream.deliveryStreamName);
    }

    if (this.fields.region === undefined) {
      this.addField('region', Stack.of(scope).region);
    }

    return {
      ...super.bind(scope),
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
    const deliveryStream = scope.node.tryFindChild(deliveryStreamId) as IDeliveryStream;

    if (deliveryStream) {
      return deliveryStream;
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