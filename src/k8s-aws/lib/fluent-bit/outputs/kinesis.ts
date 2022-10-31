import { Stack } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream, Stream } from 'aws-cdk-lib/aws-kinesis';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitOutputPlugin, FluentBitOutputPluginCommonOptions } from './output-plugin';


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

export class FluentBitKinesisOutput extends FluentBitOutputPlugin {
  public constructor(options: FluentBitKinesisOutputOptions = {}) {
    super('kinesis_firehose', options);

    if (options.autoRetryRequests !== undefined) {
      this.addField('auto_create_group', String(options.autoRetryRequests));
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

    if (options.stream !== undefined) {
      this.addField('stream', options.stream.streamName);
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
    if (this.fields.stream === undefined) {
      const stream = this.getStream(scope);
      this.addField('stream', stream.streamName);
    }

    if (this.fields.region === undefined) {
      this.addField('region', Stack.of(scope).region);
    }

    return super.bind(scope);
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
    const stream = scope.node.tryFindChild(streamId) as IStream;
    return stream ?? new Stream(scope, streamId);
  }
}