import { ArnFormat, Names, Stack } from 'aws-cdk-lib';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, ILogStream, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitOutputPluginBase, FluentBitOutputPluginCommonOptions } from './output-plugin-base';


/**
 * Configuration options for configuring Fluent Bit output to CloudWatch
 * LogStreams.
 */
interface FluentBitLogStreamOutputOptions {
  /**
   * The name of the log stream where records should be created.
   */
  readonly logStreamName?: string;

  /**
   * The prefix for log streams that will be created on a per-pod basis.
   */
  readonly logStreamPrefix?: string;
}

/**
 * Represents valid log stream output configuration options to be used by
 * Fluent Bit when writing to CloudWatch Logs.
 */
export class FluentBitLogStreamOutput {
  /**
   * Sets output to be a log stream resource object.
   *
   * @param logStream The log stream where records should be written.
   * @returns A FluentBitLogStreamOutput object representing the configured
   * log stream destination.
   */
  public static fromLogStream(logStream: ILogStream): FluentBitLogStreamOutput {
    return new FluentBitLogStreamOutput({
      logStreamName: logStream.logStreamName,
    });
  }

  /**
   * Sets output to a named log stream.
   *
   * If a log stream with the given name doesn't exist in the configured log
   * group a log stream with the given name will be created.
   *
   * @param name The name of the log stream where records should be written.
   * @returns A FluentBitLogStreamOutput object representing the configured
   * log stream destination.
   */
  public static fromName(name: string): FluentBitLogStreamOutput {
    return new FluentBitLogStreamOutput({
      logStreamName: name,
    });
  }

  /**
   * Sets output to a prefixed log stream.
   *
   * Log streams will be created on a per-pod basis with the name oof the log
   * streams starting with the provided prefix.
   *
   * @param name The prefix for log streams which will be created.
   * @returns A FluentBitLogStreamOutput object representing the configured
   * log stream destination.
   */
  public static fromPrefix(prefix: string): FluentBitLogStreamOutput {
    return new FluentBitLogStreamOutput({
      logStreamPrefix: prefix,
    });
  }


  /**
   * The name of the log stream where records should be created.
   */
  public readonly logStreamName?: string;

  /**
   * The prefix for log streams that will be created on a per-pod basis.
   */
  public readonly logStreamPrefix?: string;

  /**
   * Creates a new instance of the FluentBitLogStreamOutput class.
   *
   * @param options  Options for configuring log stream output.
   */
  private constructor(options: FluentBitLogStreamOutputOptions) {
    this.logStreamName = options.logStreamName;
    this.logStreamPrefix = options.logStreamPrefix;
  }
}


/**
 * Configuration options for configuring Fluent Bit output to CloudWatch
 * LogGroups.
 */
interface FluentBitLogGroupOutputOptions {
  /**
   * Determines whether or not a Log Group should be created automatically by
   * the plugin CDK resource.
   */
  readonly create?: boolean;

  /**
   * A log group resource object to use as the destination.
   */
  readonly logGroup?: ILogGroup;

  /**
   * The name of the log group where records should be sent.
   */
  readonly logGroupName?: string;
}


/**
 * Represents valid log group output configuration options to be used by
 * Fluent Bit when writing to CloudWatch Logs.
 */
export class FluentBitLogGroupOutput {
  /**
   * Sets a flag saying that a log group should be created automatically.
   *
   * Depending on the configuration of the plugin, this flag will either cause
   * permissions to be granted for Fluent Bit to create the log group itself or
   * the plugin CDK resource will create a Log Group and use that as the
   * destination.
   *
   * @returns A FluentBitLogGroupOutput object representing the configured log
   * group destination.
   */
  public static create(): FluentBitLogGroupOutput {
    return new FluentBitLogGroupOutput({
      create: true,
    });
  }

  /**
   * Sets the destination log group to a LogGroup CDK resource.
   *
   * @param logGroup The log group where output records should be written.
   * @returns A FluentBitLogGroupOutput object representing the configured log
   * group destination.
   */
  public static fromLogGroup(logGroup: ILogGroup): FluentBitLogGroupOutput {
    return new FluentBitLogGroupOutput({
      logGroup: logGroup,
    });
  }

  /**
   * Sets the destination for logs to the named log group.
   *
   * @param name The name of the log group where output records should be written.
   * @returns A FluentBitLogGroupOutput object representing the configured log
   * group destination.
   */
  public static fromName(name: string, create?: boolean): FluentBitLogGroupOutput {
    return new FluentBitLogGroupOutput({
      create: create,
      logGroupName: name,
    });
  }


  /**
   * Flag that determines whether or not a log group should be automatically
   * created.
   */
  public readonly create?: boolean;

  /**
   * A log group resource object to use as the destination.
   */
  public readonly logGroup?: ILogGroup;

  /**
   * The name for the log group that should be used for output records.
   */
  public readonly logGroupName?: string;

  /**
   * Creates a new instance of the FluentBitLogStreamOutput class.
   *
   * @param options  Options for configuring log stream output.
   */
  private constructor(options: FluentBitLogGroupOutputOptions) {
    this.create = options.create;
    this.logGroup = options.logGroup;
    this.logGroupName = options.logGroupName;
  }
}


/**
 * Options for configuring the CloudWatch Logs Fluent Bit output plugin.
 *
 * @see [CloudWatch Logs Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)
 */
export interface FluentBitCloudWatchLogsOutputOptions extends FluentBitOutputPluginCommonOptions {
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
     * The CloudWatch Log Group configuration for output records.
     */
  readonly logGroup?: FluentBitLogGroupOutput;

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
     * The CloudWatch LogStream configuration for outbound records.
     */
  readonly logStream?: FluentBitLogStreamOutput;

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

/**
 * Represents configuration for outputing logs from Fluent Bit to CloudWatch
 * Logs.
 */
export class FluentBitCloudWatchLogsOutput extends FluentBitOutputPluginBase {
  /**
     * Automatically create the log group.
      *
      * @group Inputs
     */
  public readonly autoCreateGroup?: boolean;

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
      * Specify a custom endpoint for the CloudWatch Logs API.
      *
      * @group Inputs
      */
  public readonly endpoint?: string;

  /**
      * By default, the whole log record will be sent to CloudWatch. If you
      * specify a key name with this option, then only the value of that key
      * will be sent to CloudWatch.
      *
      * @group Inputs
      */
  public readonly logKey?: string;

  /**
      * An optional parameter that can be used to tell CloudWatch the format of
      * the data. A value of json/emf enables CloudWatch to extract custom
      * metrics embedded in a JSON payload.
      *
      * @see [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)
      *
      * @group Inputs
      */
  public readonly logFormat?: string;

  /**
     * The CloudWatch Log Group configuration for output records.
     */
  public readonly logGroup?: FluentBitLogGroupOutput;

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
      *
      * @group Inputs
      */
  public readonly logGroupTemplate?: string;

  /**
      * If set to a number greater than zero, and newly create log group's
      * retention policy is set to this many days.
      *
      * @group Inputs
      */
  public readonly logRetention?: RetentionDays;

  /**
     * The CloudWatch LogStream configuration for outbound records.
     */
  public readonly logStream: FluentBitLogStreamOutput;

  /**
      * Template for Log Stream name using Fluent Bit record accessor syntax.
      * This field is optional and if configured it overrides the other log
      * stream options. If the template translation fails, an error is logged
      * and the logStream or logStreamPrefix are used instead (and thus one of
      * those fields is still required to be configured).
      *
      * @see [Fluent Bit record accessor snytax](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/record-accessor)
      *
      * @group Inputs
      */
  public readonly logStreamTemplate?: string;

  /**
      * A list of lists containing the dimension keys that will be applied to
      * all metrics. The values within a dimension set MUST also be members on
      * the root-node.
      *
      * @see [Dimensions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension)
      *
      * @group Inputs
      */
  public readonly metricDimensions?: string[];

  /**
      * An optional string representing the CloudWatch namespace for the
      * metrics.
      *
      * @see [Metric Tutorial](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch#metrics-tutorial)
      *
      * @group Inputs
      */
  public readonly metricNamespace?: string;

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
    * Creates a new instance of the FluentBitCloudWatchLogsOutput class.
    *
    * @param options Options for configuring the output.
    */
  public constructor(options: FluentBitCloudWatchLogsOutputOptions = {}) {
    super('cloudwatch_logs', options);

    this.autoCreateGroup = options.autoCreateGroup;
    this.autoRetryRequests = options.autoRetryRequests;
    this.endpoint = options.endpoint;
    this.logFormat = options.logFormat;
    this.logGroup = options.logGroup;
    this.logGroupTemplate = options.logGroupTemplate;
    this.logKey = options.logKey;
    this.logRetention = options.logRetention;
    this.logStream = options.logStream ?? FluentBitLogStreamOutput.fromPrefix('eks');
    this.logStreamTemplate = options.logStreamTemplate;
    this.metricDimensions = options.metricDimensions;
    this.metricNamespace = options.metricNamespace;
    this.region = options.region;
    this.role = options.role;
    this.stsEndpoint = options.stsEndpoint;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    const logGroup = this.getLogGroup(scope);

    return {
      configFile: super.renderConfigFile({
        auto_create_group: this.autoCreateGroup,
        auto_retry_requests: this.autoRetryRequests,
        endpoint: this.endpoint,
        log_format: this.logFormat,
        log_group_name: logGroup.logGroupName,
        log_group_template: this.logGroupTemplate,
        log_key: this.logKey,
        log_retention_days: this.logRetention?.toString(),
        log_stream_name: this.logStream.logStreamName,
        log_stream_prefix: this.logStream.logStreamPrefix,
        log_stream_template: this.logStreamTemplate,
        metric_dimensions: this.metricDimensions?.join(','),
        metric_namespace: this.metricNamespace,
        region: this.region ?? Stack.of(scope).region,
        role_arn: this.role?.roleArn,
        sts_endpoint: this.stsEndpoint,
      }),
      permissions: [
        new PolicyStatement({
          actions: [
            ...(this.autoCreateGroup ? ['logs:CreateLogGroup'] : []),
            'logs:DescribeLogStreams',
          ],
          effect: Effect.ALLOW,
          resources: [
            Stack.of(scope).formatArn({
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
              resource: 'log-group',
              resourceName: logGroup.logGroupName,
              service: 'log-group',
            }),
          ],
        }),
        new PolicyStatement({
          actions: [
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          effect: Effect.ALLOW,
          resources: [
            logGroup.logGroupArn,
          ],
        }),
      ],
    };
  }

  /**
     * Gets a log group object that can be used to set the required
     * log_group_name property if one hasn't been provided.
     *
     * @param scope The construct configuring logging using Fluent Bit.
     * @returns The log group where output logs should be sent.
     */
  private getLogGroup(scope: IConstruct): ILogGroup {
    const logGroupSuffix = this.logGroup?.logGroupName ? `-${this.logGroup.logGroupName}` : '::default';
    const stubSuffix = this.logGroup?.create ? '' : '::stub';
    const logGroupId = `fluent-bit-output-log-group${logGroupSuffix}${stubSuffix}`;
    const inheritedLogGroup = scope.node.tryFindChild(logGroupId) as ILogGroup;

    if (this.logGroup?.logGroup) {
      return this.logGroup.logGroup;
    } else if (inheritedLogGroup) {
      return inheritedLogGroup;
    } else if (this.logGroup?.create) {
      return new LogGroup(scope, logGroupId, {
        logGroupName: this.logGroup.logGroupName,
        retention: this.logRetention ?? RetentionDays.TWO_WEEKS,
      });
    } else {
      return LogGroup.fromLogGroupName(scope, logGroupId, this.logGroup?.logGroupName ?? Names.uniqueId(scope));
    }
  }
}