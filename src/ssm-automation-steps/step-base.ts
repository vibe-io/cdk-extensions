import { Duration, Lazy } from "aws-cdk-lib";
import { Construct, IConstruct } from "constructs";
import { IStep } from "./step-ref";


/**
 * Indicates whether the automation should stop, continue, or go to a different
 * step on failure.
 * 
 * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html#automation-common)
 */
 export class CancelAction {
  /**
   * When the automation step is cancelled during execution the execution
   * should stop and no further steps should be executed.
   * 
   * @returns An `AutomationCancelAction` that represents the "Abort"
   * `onCancel` action.
   */
  public static abort(): CancelAction {
    return new CancelAction('Abort');
  }

  /**
   * When the automation step is cancelled during execution the execution
   * should jump to a specified step and continue from there.
   * 
   * @param step The step that execution should jump to.
   * @returns An `AutomationCancelAction` that instructing the execution to
   * jump to the specified step.
   */
  public static step(step: IStep): CancelAction {
    return new CancelAction(`step:${step.stepName}`);
  }

  /**
   * An escape hatch method that allows setting custom statuses for a plugin's
   * `onCancel` method.
   * 
   * It is recomended that when possible use of the provided static methods
   * should be preferred instead of calling this function. It is primarily
   * prevented to provide options in the event that new values are added that
   * this implementation has not yet been updated to support.
   * 
   * @param name The value to set for a step's `onCancel` action.
   * @returns A `AutomationCancelAction` object that represents the value
   * specified.
   */
  public static of(name: string): CancelAction {
    return new CancelAction(name);
  }


  /**
   * Creates a new instance of the `AutomationCancelAction` class.
   * 
   * @param name The value to set for a step's `onCancel` action.
   */
  private constructor(public readonly name: string) {}
}

/**
 * Indicates whether the automation should stop, continue, or go to a different
 * step on failure.
 * 
 * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html#automation-common)
 */
export class FailueAction {
  /**
   * When the automation step fails the execution should stop and no further
   * steps should be executed.
   * 
   * @returns An `AutomationFailueAction` that represents the "Abort"
   * `onFailure` action.
   */
  public static abort(): FailueAction {
    return new FailueAction('Abort');
  }

  /**
   * When the automation step fails the execution should continue to the next
   * step without interruption.
   * 
   * @returns An `AutomationFailueAction` that represents the "Continue"
   * `onFailure` action.
   */
  public static ignore(): FailueAction {
    return new FailueAction('Continue');
  }

  /**
   * When the automation step fails the execution should jump to a specified
   * step and continue from there.
   * 
   * @param step The step that execution should jump to.
   * @returns An `AutomationFailueAction` that instructing the execution to
   * jump to the specified step.
   */
  public static step(step: IStep): FailueAction {
    return new FailueAction(`step:${step.stepName}`);
  }

  /**
   * An escape hatch method that allows setting custom statuses for a plugin's
   * `onFailure` method.
   * 
   * It is recomended that when possible use of the provided static methods
   * should be preferred instead of calling this function. It is primarily
   * prevented to provide options in the event that new values are added that
   * this implementation has not yet been updated to support.
   * 
   * @param name The value to set for a step's `onFailure` action.
   * @returns A `AutomationFailueAction` object that represents the value
   * specified.
   */
  public static of(name: string): FailueAction {
    return new FailueAction(name);
  }


  /**
   * Creates a new instance of the `AutomationFailueAction` class.
   * 
   * @param name The value to set for a step's `onFailure` action.
   */
  private constructor(public readonly name: string) {}
}

/**
 * Configuration options that are available for all automation steps regardless
 * of type.
 * 
 * @see [Properties shared by all actions](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html#automation-common)
 */
export interface StepBaseProps {
  /**
   * The name of the plugin action to be executed by the document.
   */
  readonly actionName: string;

  /**
   * Collection of arbitrary inputs that will be used to control the behavior
   * of the action.
   */
  readonly inputs?: {[key: string]: any};

  /**
   * Designates a step as critical for the successful completion of the
   * Automation. If a step with this designation fails, then Automation reports
   * the final status of the Automation as `Failed`. This property is only
   * evaluated if you explicitly define it in your step.
   */
  readonly isCritical?: boolean;

  /**
   * This option stops an automation at the end of a specific step. The
   * automation stops if the step failed or succeeded. 
   */
  readonly isEnd?: boolean;

  /**
   * The number of times the step should be retried in case of failure. If the
   * value is greater than 1, the step isn't considered to have failed until
   * all retry attempts have failed.
   */
  readonly maxAttempts?: number;

  /**
   * Specifies which step in an automation to process next after successfully
   * completing a step.
   */
  readonly nextStep?: IStep;

  /**
   * The action that the System's Manager automation document should take when
   * the step is cancelled during execution.
   */
  readonly onCancel?: CancelAction;

  /**
   * The action that the System's Manager automation document should take when
   * the step fails.
   */
  readonly onFailure?: FailueAction;

  /**
   * The name of the step. Must be unique within the context of a command
   * document.
   */
  readonly stepName: string;

  /**
   * The timeout value for the step. If the timeout is reached and the value of
   * `maxAttempts` is greater than 1, then the step isn't considered to have
   * timed out until all retries have been attempted.
   */
  readonly timeout?: Duration;
}

/**
 * Configuration options applicable to all automation steps.
 */
export class StepBase extends Construct implements IStep {
  private readonly _incomingSteps: StepBase[];

  /**
   * Internal collection of inputs that will be used to control the behavior of
   * the action.
   */
  private readonly _inputs: { [key: string]: any };

  /**
   * The name of the plugin action to be executed by the document.
   */
   readonly actionName: string;

   /**
    * Designates a step as critical for the successful completion of the
    * Automation. If a step with this designation fails, then Automation reports
    * the final status of the Automation as `Failed`. This property is only
    * evaluated if you explicitly define it in your step.
    */
   readonly isCritical?: boolean;
 
   /**
    * This option stops an automation at the end of a specific step. The
    * automation stops if the step failed or succeeded. 
    */
   readonly isEnd?: boolean;
 
   /**
    * The number of times the step should be retried in case of failure. If the
    * value is greater than 1, the step isn't considered to have failed until
    * all retry attempts have failed.
    */
   readonly maxAttempts?: number;
 
   /**
    * Specifies which step in an automation to process next after successfully
    * completing a step.
    */
   readonly nextStep?: IStep;
 
   /**
    * The action that the System's Manager automation document should take when
    * the step is cancelled during execution.
    */
   readonly onCancel?: CancelAction;
 
   /**
    * The action that the System's Manager automation document should take when
    * the step fails.
    */
   readonly onFailure?: FailueAction;
 
   /**
    * The name of the step. Must be unique within the context of a command
    * document.
    */
   readonly stepName: string;
 
   /**
    * The timeout value for the step. If the timeout is reached and the value of
    * `maxAttempts` is greater than 1, then the step isn't considered to have
    * timed out until all retries have been attempted.
    */
   readonly timeout?: Duration;

  /**
   * An immutable collection of inputs that will be used to control the
   * behavior of the action.
   */
  public get inputs(): {[key: string]: any} {
    return {...this.inputs};
  }


  /**
   * Creates a new instance of the `AutomationStepBase` class.
   * 
   * @param props Configuration that specifies the behavior of the step.
   */
  public constructor(scope: IConstruct, id: string, props: StepBaseProps) {
    super(scope, id);

    this._incomingSteps = [];
    this._inputs = {};

    this.actionName = props.actionName;
    this.isCritical = props.isCritical;
    this.isEnd = props.isEnd;
    this.maxAttempts = props.maxAttempts;
    this.nextStep = props.nextStep;
    this.onCancel = props.onCancel;
    this.onFailure = props.onFailure;
    this.stepName = props.stepName;
    this.timeout = props.timeout;
    
    const inputs = props.inputs ?? {};
    Object.keys(inputs).forEach((x) => {
      this.addInput(x, inputs[x]);
    });
  }

  private addIncoming(source: StepBase): void {
    this._incomingSteps.push(source);
  }

  public addInput(key: string, value: any): {[key: string]: any} {
    if (key in this._inputs) {
      throw new Error(`An input with the name '${key}' already exists.`);
    }

    this._inputs[key] = value;
    return this.inputs;
  }

  public bind(_scope: IConstruct): { [key: string]: any } {
    return {
      action: this.actionName,
      inputs: Lazy.any({
        produce: () => {
          return this._inputs;
        }
      }),
      isCritical: this.isCritical,
      isEnd: this.isEnd,
      maxAttempts: this.maxAttempts,
      name: this.stepName,
      nextStep: this.nextStep?.stepName,
      onCancel: this.onCancel?.name,
      onFailure: this.onFailure?.name,
      timeoutSeconds: this.timeout?.toSeconds(),
    };
  }
}