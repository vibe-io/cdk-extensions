import { Duration, Lazy, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { undefinedIfNoKeys } from '../../../utils/formatting';


/**
 * Configuration for the Workflow Action resource.
 */
export interface WorkflowActionOptions extends ResourceProps {
  /**
   * The arguments to use when the associated trigger fires.
   *
   * Jobs run via the associated trigger will have their default arguments
   * replaced with the arguments specified.
   *
   * You can specify arguments here that your own job-execution script
   * consumes, in addition to arguments that AWS Glue itself consumes.
   *
   * @see [Trigger Actions.Arguments](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-arguments)
   */
  readonly arguments?: {[key: string]: string};

  /**
   * After a job run starts, the number of minutes to wait before sending a job
   * run delay notification.
   *
   * @see [Trigger Actions.NotificationProperty.NotifyDelayAfter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-notificationproperty.html#cfn-glue-trigger-notificationproperty-notifydelayafter)
   */
  readonly notifyDelayAfter?: Duration;

  /**
   * The name of the SecurityConfiguration structure to be used with this
   * action.
   *
   * @see [Trigger Actions.SecurityConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-securityconfiguration)
   *
   * @alpha
   */
  readonly securityConfiguration?: string;

  /**
   * The `JobRun` timeout in minutes. This is the maximum time that a job run
   * can consume resources before it is terminated and enters TIMEOUT status.
   * The default is 48 hours. This overrides the timeout value set in the
   * parent job.
   *
   * @see [Trigger Actions.Timeout](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-timeout)
   */
  readonly timeout?: Duration;
}

/**
 * Base class providing common functionality for workflow trigger actions.
 */
export class WorkflowActionBase {
  /**
   * Internal list of arguments that will be passed to the Glue job when run as
   * part of the workflow.
   */
  private readonly _arguments: {[key: string]: string} = {};

  /**
   * After a job run starts, the number of minutes to wait before sending a job
   * run delay notification.
   *
   * @see [Trigger Actions.NotificationProperty.NotifyDelayAfter](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-notificationproperty.html#cfn-glue-trigger-notificationproperty-notifydelayafter)
   *
   * @group Inputs
   */
  public readonly notifyDelayAfter?: Duration;

  /**
   * The name of the SecurityConfiguration structure to be used with this
   * action.
   *
   * @see [Trigger Actions.SecurityConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-securityconfiguration)
   *
   * @alpha
   * @group Inputs
   */
  public readonly securityConfiguration?: string;

  /**
   * The `JobRun` timeout in minutes. This is the maximum time that a job run
   * can consume resources before it is terminated and enters TIMEOUT status.
   * The default is 48 hours. This overrides the timeout value set in the
   * parent job.
   *
   * @see [Trigger Actions.Timeout](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-timeout)
   *
   * @group Inputs
   */
  public readonly timeout?: Duration;


  /**
   * Creates a new instance of the WorkflowActionBase class.
   *
   * @param options Options controlling aspects of the action being executed.
   */
  public constructor(options?: WorkflowActionOptions) {
    this.notifyDelayAfter = options?.notifyDelayAfter;
    this.securityConfiguration = options?.securityConfiguration;
    this.timeout = options?.timeout;

    const args = options?.arguments ?? {};
    Object.keys(args).forEach((x) => {
      this.addArgument(x, args[x]);
    });
  }

  /**
   * Adds an argument that will be passed to the specified action when
   * triggered as part of a workflow.
   *
   * @see [AWS Glue job parameters](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)
   *
   * @param key The name of the argument being set.
   * @param value The value to pass for the specified argument.
   */
  public addArgument(key: string, value: string): void {
    this._arguments[key] = value;
  }

  /**
   * Associates the action with a construct that is configuring a trigger for a
   * Glue workflow.
   *
   * @param _scope The construct configuring the Glue trigger.
   * @returns A configuration object that can be used to configure a triggered
   * workflow action.
   */
  protected bindOptions(_scope: IConstruct): any {
    return {
      arguments: Lazy.uncachedAny({
        produce: () => {
          return !!Object.keys(this._arguments).length ? this._arguments : undefined;
        },
      }),
      notificationProperty: undefinedIfNoKeys({
        notifyDelayAfter: this.notifyDelayAfter?.toMinutes(),
      }),
      securityConfiguration: this.securityConfiguration,
      timeout: this.timeout?.toMinutes(),
    };
  }
}