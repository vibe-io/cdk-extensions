import { ArnFormat, RemovalPolicy, Resource, ResourceProps } from 'aws-cdk-lib';
import { EventField, Match, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LogLevel, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';


/**
 * Options for configuring logging from an executing state machine.
 */
export interface ExecutionLogOptions {
  /**
   * Controls whether logging from the state machine is enabled.
   *
   * @default true
   *
   * @see [StateMachine LoggingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration)
   */
  readonly enabled?: boolean;

  /**
   * Determines whether execution data is included in your log. When set to
   * `false`, data is excluded.
   *
   * @default true
   *
   * @see [StateMachine LoggingConfiguration.IncludeExecutionData](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-includeexecutiondata)
   */
  readonly includeExecutionData: boolean;

  /**
   * Defines which category of execution history events are logged.
   *
   * @default LogLevel.ALL
   *
   * @see [StateMachine LoggingConfiguration.Level](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-level)
   */
  readonly level: LogLevel;

  /**
   * Specifies a log group which will receive execution events from the state
   * machine.
   *
   * If no log group is passed and loggin is enabled, a log group will be
   * created automatically.
   *
   * @see [StateMachine LoggingConfiguration.Destinations.CloudWatchLogsLogGroup.LogGroupArn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html#cfn-stepfunctions-statemachine-cloudwatchlogsloggroup-loggrouparn)
   */
  readonly logGroup?: ILogGroup;

  /**
   * The number of days execution logging events should be retained before
   * being deleted.
   *
   * This value is ignored if `logGroup` is passed.
   *
   * @see [LogGroup RetentionInDays](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays)
   */
  readonly retention?: RetentionDays;
}

/**
 * Configuration for the LogRetentionController resource.
 */
export interface LogRetentionControllerProps extends ResourceProps {
  /**
   * Execution logging configuration for the state machine that is used to
   * configure log retention for log groups created via AWS Lambda.
   *
   * @see [StateMachine LoggingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration)
   */
  readonly executionLogging?: ExecutionLogOptions;

  /**
   * The length of time logs sent to log groups created by AWS Lambda should be
   * retained before being deleted.
   *
   * @see [LogGroup RetentionInDays](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays)
   */
  readonly retention?: RetentionDays;
}

/**
 * Deploys a solution that automatically sets a log retention policy for all
 * CloudWatch log groups created by AWS Lamba.
 *
 * The controller consists of an EventBridge rule that detects the creation of
 * new log groups and a state machine that sets a retention policy for any log
 * groups that triggered the rule.
 *
 * The rule triggers for any log group that is created with a name that starts
 * with `/aws/lambda/`.
 *
 * Currently existing log groups created by AWS Lambda are not affected by the
 * policy. It is also possible that log groups created by means other than AWS
 * Lambda that have a retention policy specified could have their retention
 * policy overridden if the log group name starts with `/aws/lambda/`.
 *
 * @see [Reduce log-storage costs by automating retention settings in Amazon CloudWatch](https://aws.amazon.com/blogs/infrastructure-and-automation/reduce-log-storage-costs-by-automating-retention-settings-in-amazon-cloudwatch/)
 */
export class LogRetentionController extends Resource {
  /**
   * Execution logging configuration for the state machine that is used to
   * configure log retention for log groups created via AWS Lambda.
   *
   * @see [StateMachine LoggingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration)
   *
   * @group Inputs
   */
  public readonly executionLogging?: ExecutionLogOptions;

  /**
   * The length of time logs sent to log groups created by AWS Lambda should be
   * retained before being deleted.
   *
   * @see [LogGroup RetentionInDays](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-logs-loggroup-retentionindays)
   *
   * @group Inputs
   */
  public readonly retention: RetentionDays;

  /**
   * The log group which will receive execution events from the state machine.
   *
   * @group Resources
   */
  public readonly executionLogGroup?: ILogGroup;

  /**
   * The EventBridge rule that detects the creation of new log groups with a
   * name matching the prefix used by AWS Lambda.
   *
   * @group Resources
   */
  public readonly logGroupCreatedRule: Rule;

  /**
   * The state machine that is triggered to add a retention policy for all new
   * log groups that trigger the EventBridge rule.
   *
   * @group Resources
   */
  public readonly stateMachine: StateMachine;


  /**
   * Creates a new instance of the LogRetentionController class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: IConstruct, id: string, props: LogRetentionControllerProps = {}) {
    super(scope, id, props);

    this.executionLogging = props.executionLogging;
    this.retention = props.retention ?? RetentionDays.TWO_WEEKS;

    if (this.executionLogging?.enabled ?? true) {
      this.executionLogGroup = this.executionLogging?.logGroup ?? new LogGroup(this, 'execution-log-group', {
        removalPolicy: RemovalPolicy.DESTROY,
        retention: this.executionLogging?.retention,
      });
    }

    const putRetentionPolicy = new CallAwsService(this, 'put-retention-policy', {
      action: 'putRetentionPolicy',
      iamAction: 'logs:PutRetentionPolicy',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resource: 'log-group',
          resourceName: '/aws/lambda/*',
          service: 'logs',
        }),
      ],
      parameters: {
        'LogGroupName.$': '$.logGroupName',
        'RetentionInDays.$': '$.retentionInDays',
      },
      service: 'cloudwatchlogs',
    });

    this.stateMachine = new StateMachine(this, 'state-machine', {
      definition: putRetentionPolicy,
      logs: this.executionLogGroup === undefined ? undefined : {
        destination: this.executionLogGroup,
        includeExecutionData: this.executionLogging?.includeExecutionData ?? true,
        level: this.executionLogging?.level ?? LogLevel.ALL,
      },
      stateMachineType: StateMachineType.EXPRESS,
      tracingEnabled: true,
    });

    this.logGroupCreatedRule = new Rule(this, 'log-group-created-rule', {
      description: 'Detects the creation of log groups tied to Lambda functions.',
      enabled: true,
      eventPattern: {
        detail: {
          eventName: [
            'CreateLogGroup',
          ],
          eventSource: [
            'logs.amazonaws.com',
          ],
          requestParameters: {
            logGroupName: Match.prefix('/aws/lambda/'),
          },
        },
        detailType: [
          'AWS API Call via CloudTrail',
        ],
        source: [
          'aws.logs',
        ],
      },
      targets: [
        new SfnStateMachine(this.stateMachine, {
          input: RuleTargetInput.fromObject({
            logGroupName: EventField.fromPath('$.detail.requestParameters.logGroupName'),
            retentionInDays: this.retention,
          }),
        }),
      ],
    });
  }
}