import { Stack } from 'aws-cdk-lib';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IStream, Stream } from 'aws-cdk-lib/aws-kinesis';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitOutputPluginBase, FluentBitOutputPluginCommonOptions } from './output-plugin-base';


/**
 * Options for configuring the Kinesis Data Streams Fluent Bit output plugin.
 *
 * @see [Kinesis Streams Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/kinesis)
 */
export interface FluentBitKinesisOutputOptions extends FluentBitOutputPluginCommonOptions {
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
     * The name of the Kinesis Streams Delivery stream that you want log
     * records sent to.
     */
  readonly stream?: IStream;

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
 * Represents configuration for outputing logs from Fluent Bit to Kinesis Data
 * Streams.
 */
export class FluentBitKinesisOutput extends FluentBitOutputPluginBase {
  /**
     * Immediately retry failed requests to AWS services once. This option does
     * not affect the normal Fluent Bit retry mechanism with backoff. Instead,
     * it enables an immediate retry with no delay for networking errors, which
     * may help improve throughput when there are transient/random networking
     * issues.
     *
     * @group Inputs
     */
  readonly autoRetryRequests?: boolean;

  /**
     * Specify a custom endpoint for the Firehose API.
     *
     * @group Inputs
     */
  readonly endpoint?: string;

  /**
     * By default, the whole log record will be sent to Firehose. If you
     * specify a key name with this option, then only the value of that key
     * will be sent to Firehose.
     *
     * @group Inputs
     */
  readonly logKey?: string;

  /**
     * The AWS region.
     *
     * @group Inputs
     */
  readonly region?: string;

  /**
     * ARN of an IAM role to assume (for cross account access).
     *
     * @group Inputs
     */
  readonly role?: IRole;

  /**
     * The name of the Kinesis Streams Delivery stream that you want log
     * records sent to.
     *
     * @group Inputs
     */
  readonly stream?: IStream;

  /**
     * Specify a custom STS endpoint for the AWS STS API.
     *
     * @group Inputs
     */
  readonly stsEndpoint?: string;

  /**
     * Add the timestamp to the record under this key.
     *
     * @group Inputs
     */
  readonly timeKey?: string;

  /**
     * A strftime compliant format string for the timestamp.
     *
     * @group Inputs
     */
  readonly timeKeyFormat?: string;


  /**
    * Creates a new instance of the FluentBitKinesisOutput class.
    *
    * @param options Options for configuring the output/
    */
  public constructor(options: FluentBitKinesisOutputOptions = {}) {
    super('kinesis', options);

    this.autoRetryRequests = options.autoRetryRequests;
    this.endpoint = options.endpoint;
    this.logKey = options.logKey;
    this.region = options.region;
    this.role = options.role;
    this.stream = options.stream;
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
    const stream = this.getStream(scope);

    return {
      configFile: super.renderConfigFile({
        auto_retry_requests: this.autoRetryRequests,
        endpoint: this.endpoint,
        log_key: this.logKey,
        region: this.region ?? Stack.of(scope).region,
        role_arn: this.role?.roleArn,
        stream: stream.streamName,
        sts_endpoint: this.stsEndpoint,
        time_key: this.timeKey,
        time_key_format: this.timeKeyFormat,
      }),
      permissions: [
        new PolicyStatement({
          actions: [
            'kinesis:PutRecords',
          ],
          effect: Effect.ALLOW,
          resources: [
            stream.streamArn,
          ],
        }),
      ],
    };
  }

  /**
     * Gets a stream object that can be used to set the required stream
     * property if one hasn';t been provided.
     *
     * @param scope The construct configuring logging using Fluent Bit.
     * @returns The stream where output logs should be sent.
     */
  private getStream(scope: IConstruct): IStream {
    const streamId = 'fluent-bit-output-stream';
    const inheritedStream = scope.node.tryFindChild(streamId) as IStream;

    if (this.stream) {
      return this.stream;
    } else if (inheritedStream) {
      return inheritedStream;
    } else {
      return new Stream(scope, streamId);
    }
  }
}