import { Lazy } from "aws-cdk-lib";
import { IConstruct } from "constructs";


/**
 * Represents the action that a System's Manager command document should take
 * when a given step fails.
 * 
 * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#shared-inputs)
 */
export class CommandFailureAction {
  /**
   * Sets step status to `failure` and the document doesn't run any remaining
   * steps unless a `finallyStep` has been defined.
   * 
   * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#shared-inputs)
   */
  public static readonly EXIT: CommandFailureAction = CommandFailureAction.of('exit');

  /**
   * Sets step status to `success` and the document doesn't run any remaining
   * steps unless a `finallyStep` has been defined.
   * 
   * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#shared-inputs)
   */
  public static readonly SUCCESS_AND_EXIT: CommandFailureAction = CommandFailureAction.of('successAndExit');

  /**
   * An escape hatch method that allows setting custom statuses for a plugin's
   * `onFailure` method.
   * 
   * It is recomended that when possible use of the provided static properties
   * should be preferred instead of calling this function. It is primarily
   * prevented to provide options in the event that new values are added that
   * this implementation has not yet been updated to support.
   * 
   * @param name The value to set for a step's `onFailure` action.
   * @returns A `CommandFailureAction` object that represents the value
   * specified.
   */
  public static of(name: string): CommandFailureAction {
    return new CommandFailureAction(name);
  }


  /**
   * Creates a new instance of the `CommandFailureAction` class.
   * 
   * @param name The value to set for a step's `onFailure` action.
   */
  private constructor(public readonly name: string) {}
}

export class CommandSuccessAction {
  /**
   * If set and a the step runs successfully, the document doesn't run any
   * remaining steps unless a `finallyStep` has been defined.
   * 
   * @see [Plugin onFailure action](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#shared-inputs)
   */
  public static readonly EXIT: CommandFailureAction = CommandFailureAction.of('exit');

  /**
   * An escape hatch method that allows setting custom statuses for a plugin's
   * `onSuccess` method.
   * 
   * It is recomended that when possible use of the provided static properties
   * should be preferred instead of calling this function. It is primarily
   * prevented to provide options in the event that new values are added that
   * this implementation has not yet been updated to support.
   * 
   * @param name The value to set for a step's `onSuccess` action.
   * @returns A `CommandSuccessAction` object that represents the value
   * specified.
   */
     public static of(name: string): CommandSuccessAction {
      return new CommandSuccessAction(name);
    }
  
  
    /**
     * Creates a new instance of the `CommandSuccessAction` class.
     * 
     * @param name The value to set for a step's `onSuccess` action.
     */
    private constructor(public readonly name: string) {}
}

export interface CommandActionBaseProps {
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
   * The action that the System's Manager command document should take when the
   * step fails.
   */
  readonly onFailure?: CommandFailureAction;

  /**
   * The action that the System's Manager command document should take when the
   * step succeeds.
   */
  readonly onSuccess?: CommandSuccessAction;

  /**
   * The name of the step. Must be unique within the context of a command
   * document.
   */
  readonly stepName: string;
}

export class CommandActionBase {
  /**
   * Internal collection of inputs that will be used to control the behavior of
   * the action.
   */
  private readonly _inputs: {[key: string]: any};

  /**
   * The name of the plugin action to be executed by the document.
   */
  public readonly actionName: string;

  /**
   * The action that the System's Manager command document should take when the
   * step fails.
   */
  public readonly onFailure?: CommandFailureAction;

  /**
   * The action that the System's Manager command document should take when the
   * step succeeds.
   */
  public readonly onSuccess?: CommandSuccessAction;

  /**
   * The name of the step. Must be unique within the context of a command
   * document.
   */
  public readonly stepName: string;

  /**
   * An immutable collection of inputs that will be used to control the
   * behavior of the action.
   */
  public get inputs(): {[key: string]: any} {
    return {...this.inputs};
  }


  /**
   * Creates a new instance of the `CommandActionBase` class.
   * 
   * @param props Configuration that specifies the behavior of the action.
   */
  public constructor(props: CommandActionBaseProps) {
    this._inputs = {};

    this.actionName = props.actionName;
    this.stepName = props.stepName;

    if (props.onFailure) {
      this.onFailure = props.onFailure;
      this.addInput('onFailure', props.onFailure);
    }
    if (props.onSuccess) {
      this.onSuccess = props.onSuccess;
      this.addInput('onSuccess', props.onSuccess);
    }
    
    const inputs = props.inputs ?? {};
    Object.keys(inputs).forEach((x) => {
      this.addInput(x, inputs[x]);
    });
  }

  public addInput(key: string, value: any): {[key: string]: any} {
    if (key in this._inputs) {
      throw new Error(`An input with the name '${key}' already exists.`);
    }

    this._inputs[key] = value;
    return this.inputs;
  }

  public bind(_scope: IConstruct): {[key: string]: any} {
    return {
      'action': this.actionName,
      'inputs': Lazy.any({
        produce: () => {
          return this._inputs;
        }
      }),
      'name': this.stepName,
    };
  }
}