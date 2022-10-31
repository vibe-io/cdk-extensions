import { Names, Stack } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, ILogStream, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitOutputPlugin, FluentBitOutputPluginCommonOptions } from './output-plugin';


/**
 * Options for configuring the CloudWatch Logs Fluent Bit output plugin.
 *
 * @see [CloudWatch Logs Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)
 */
export interface FluentBitCloudWatchLogsOutputOptions extends FluentBitOutputPluginCommonOptions {
  /**
     * Escape hatch to allow additional configuration fields to be passed to
     * the plugin.
     */
  readonly additionalFields?: {[key: string]: string};

  /**
     * Automatically create the log group.
     *
     * @default false
     */
  readonly autoCreateGroup?: boolean;

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
     * Specify a custom endpoint for the CloudWatch Logs API.
     */
  readonly endpoint?: string;

  /**
     * By default, the whole log record will be sent to CloudWatch. If you
     * specify a key name with this option, then only the value of that key
     * will be sent to CloudWatch.
     */
  readonly logKey?: string;

  /**
     * An optional parameter that can be used to tell CloudWatch the format of
     * the data. A value of json/emf enables CloudWatch to extract custom
     * metrics embedded in a JSON payload.
     *
     * @see [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)
     */
  readonly logFormat?: string;

  /**
     * The CloudWatch Log Group that you want log records sent to.
     */
  readonly logGroup?: ILogGroup;

  /**
     * Template for Log Group name using Fluent Bit record_accessor syntax.
     *
     * This field is optional and if configured it overrides the configured Log
     * Group.
     *
     * If the template translation fails, an error is logged and the provided
     * Log Group (which is still required) is used instead.
     *
     * @see [Fluent Bit record accessor snytax](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/record-accessor)
     */
  readonly logGroupTemplate?: string;

  /**
     * If set to a number greater than zero, and newly create log group's
     * retention policy is set to this many days.
     */
  readonly logRetention?: RetentionDays;

  /**
     * The CloudWatch Log Stream that you want log records sent to.
     */
  readonly logStream?: ILogStream;

  /**
     * Prefix for the Log Stream name. The tag is appended to the prefix to
     * construct the full log stream name. Not compatible with the `logStream`
     * option.
     */
  readonly logStreamPrefix?: string;

  /**
     * Template for Log Stream name using Fluent Bit record accessor syntax.
     * This field is optional and if configured it overrides the other log
     * stream options. If the template translation fails, an error is logged
     * and the logStream or logStreamPrefix are used instead (and thus one of
     * those fields is still required to be configured).
     *
     * @see [Fluent Bit record accessor snytax](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/record-accessor)
     */
  readonly logStreamTemplate?: string;

  /**
     * A list of lists containing the dimension keys that will be applied to
     * all metrics. The values within a dimension set MUST also be members on
     * the root-node.
     *
     * @see [Dimensions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension)
     */
  readonly metricDimensions?: string[];

  /**
     * An optional string representing the CloudWatch namespace for the
     * metrics.
     *
     * @see [Metric Tutorial](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch#metrics-tutorial)
     */
  readonly metricNamespace?: string;

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
}

export class FluentBitCloudWatchLogsOutput extends FluentBitOutputPlugin {
  public constructor(options: FluentBitCloudWatchLogsOutputOptions = {}) {
    super('cloudwatch_logs', options);

    if (options.autoCreateGroup !== undefined) {
      this.addField('auto_create_group', String(options.autoCreateGroup));
    }

    if (options.autoRetryRequests !== undefined) {
      this.addField('auto_retry_requests', String(options.autoRetryRequests));
    }

    if (options.endpoint !== undefined) {
      this.addField('endpoint', options.endpoint);
    }

    if (options.logFormat !== undefined) {
      this.addField('log_format', options.logFormat);
    }

    if (options.logGroup !== undefined) {
      this.addField('log_group_name', options.logGroup.logGroupName);
    }

    if (options.logGroupTemplate !== undefined) {
      this.addField('log_group_template', options.logGroupTemplate);
    }

    if (options.logKey !== undefined) {
      this.addField('log_key', options.logKey);
    }

    if (options.logRetention !== undefined) {
      this.addField('log_retention_days', options.logRetention.toString());
    }

    if (options.logStream !== undefined) {
      this.addField('log_stream_name', options.logStream.logStreamName);
    }

    if (options.logStreamPrefix !== undefined) {
      this.addField('log_stream_prefix', options.logStreamPrefix);
    }

    if (options.logStreamTemplate !== undefined) {
      this.addField('log_stream_template', options.logStreamTemplate);
    }

    if (options.metricDimensions !== undefined) {
      this.addField('metric_dimensions', options.metricDimensions.join(','));
    }

    if (options.metricNamespace !== undefined) {
      this.addField('metric_namespace', options.metricNamespace);
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
    if (this.fields.log_group_name === undefined) {
      const logGroup = this.getLogGroup(scope);
      this.addField('log_group_name', logGroup.logGroupName);
    }

    if (this.fields.region === undefined) {
      this.addField('region', Stack.of(scope).region);
    }

    return super.bind(scope);
  }

  /**
     * Gets a log group object that can be used to set the required
     * log_group_name property if one hasn't been provided.
     *
     * @param scope The construct configuring logging using Fluent Bit.
     * @returns The log group where output logs should be sent.
     */
  private getLogGroup(scope: IConstruct): ILogGroup {
    const logGroupId = 'fluent-bit-output-log-group';
    const logGroup = scope.node.tryFindChild(logGroupId) as ILogGroup;

    if (logGroup) {
      return logGroup;
    } else if (this.fields.auto_create_group) {
      return LogGroup.fromLogGroupName(scope, logGroupId, Names.uniqueId(scope));
    } else {
      return new LogGroup(scope, logGroupId, {
        retention: RetentionDays.TWO_WEEKS,
      });
    }
  }
}