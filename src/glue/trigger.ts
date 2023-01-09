import { Arn, ArnFormat, Lazy, Resource, ResourceProps, Stack } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { Construct, IConstruct } from 'constructs';
import { Workflow } from './workflow';


export enum PredicateOperator {
  AND = 'AND',
  OR = 'OR'
}

export enum TriggerType {
  CONDITIONAL = 'CONDITIONAL',
  EVENT = 'EVENT',
  ON_DEMAND = 'ON_DEMAND',
  SCHEDULED = 'SCHEDULED'
}

/**
 * Represents an action that should be taken when a trigger is executed.
 */
export interface ITriggerAction {
  bind(trigger: Trigger): CfnTrigger.ActionProperty;
}

/**
 * Represents a precondition that must be satisfied in order for a trigger to
 * be executed.
 */
export interface ITriggerPredicate {
  bind(trigger: Trigger): CfnTrigger.ConditionProperty;
}

/**
 * Represents a Glue Trigger in AWS.
 */
export interface ITrigger extends IConstruct {
  /**
   * The Amazon Resource Name (ARN) of the trigger.
   */
  readonly triggerArn: string;

  /**
    * The name of the trigger.
    */
  readonly triggerName: string;
}

abstract class TriggerBase extends Resource implements ITrigger {
  /**
   * The Amazon Resource Name (ARN) of the trigger.
   */
  public abstract readonly triggerArn: string;

  /**
   * The name of the trigger.
   */
  public abstract readonly triggerName: string;
}

/**
 * Configuration for the GlueTrigger resource.
 */
export interface TriggerProps extends ResourceProps {
  /**
   * A list of actions initiated by this trigger.
   *
   * @see [Trigger Actions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-actions)
   */
  readonly actions?: ITriggerAction[];

  /**
   * A description for the trigger.
   *
   * @see [Trigger Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-description)
   */
  readonly description?: string;

  /**
   * A name for the trigger.
   *
   * @see [Trigger Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-name)
   */
  readonly name?: string;

  /**
   * A list of the conditions that determine when the trigger will fire.
   *
   * @see [Trigger Predicate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html)
   */
  readonly predicateConditions?: ITriggerPredicate[];

  /**
   * Operator for chaining predicate conditions if multiple are given.
   *
   * @see [Trigger Predicate.Logical](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-logical)
   */
  readonly predicateOperator?: PredicateOperator;

  /**
   * A cron expression used to specify the schedule.
   *
   * @see [Trigger Schedule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-schedule)
   * @see [Time-Based Schedules for Jobs and Crawlers](https://docs.aws.amazon.com/glue/latest/dg/monitor-data-warehouse-schedule.html)
   */
  readonly schedule?: Schedule;

  /**
   * Set to true to start SCHEDULED and CONDITIONAL triggers when created. True
   * is not supported for ON_DEMAND triggers.
   *
   * @see [Trigger StartOnCreation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-startoncreation)
   */
  readonly startOnCreation?: boolean;

  /**
   * The type of trigger that this is.
   *
   * @see [Trigger Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-type)
   */
  readonly type: TriggerType;

  /**
   * The name of the workflow associated with the trigger.
   *
   * @see [Trigger WorkflowName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-workflowname)
   */
  readonly workflow?: Workflow;
}

export class Trigger extends TriggerBase {
  /**
   * Imports an existing trigger using its Amazon Resource Name (ARN).
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param triggerArn The ARN of the trigger to import.
   * @returns An object representing the trigger that was imported.
   */
  public static fromTriggerArn(scope: IConstruct, id: string, triggerArn: string): ITrigger {
    class Import extends TriggerBase {
      public readonly triggerArn: string = triggerArn;
      public readonly triggerName: string = Arn.split(triggerArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing trigger using its name.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param triggerName The name of the trigger to import.
   * @returns An object representing the trigger that was imported.
   */
  public static fromTriggerName(scope: IConstruct, id: string, triggerName: string): ITrigger {
    return Trigger.fromTriggerArn(scope, id, Stack.of(scope).formatArn({
      resource: 'trigger',
      resourceName: triggerName,
      service: 'glue',
    }));
  }

  /**
   * Internal collection tracking the actions which should be run by this
   * trigger.
   */
  private readonly _actions: ITriggerAction[] = [];

  /**
   * Internal collection tracking the predicates that serve as preconditions
   * for when this trigger should run.
   */
  private readonly _predicates: ITriggerPredicate[] = [];

  /**
   * A description for the trigger.
   *
   * @see [Trigger Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-description)
   *
   * @group Inputs
   */
  public readonly description?: string;

  /**
   * A name for the trigger.
   *
   * @see [Trigger Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-name)
   *
   * @group Inputs
   */
  public readonly name?: string;

  /**
   * Operator for chaining predicate conditions if multiple are given.
   *
   * @see [Trigger Predicate.Logical](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-logical)
   *
   * @group Inputs
   */
  public readonly predicateOperator: PredicateOperator;

  /**
   * A cron expression used to specify the schedule.
   *
   * @see [Trigger Schedule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-schedule)
   * @see [Time-Based Schedules for Jobs and Crawlers](https://docs.aws.amazon.com/glue/latest/dg/monitor-data-warehouse-schedule.html)
   *
   * @group Inputs
   */
  public readonly schedule?: Schedule;

  /**
   * Set to true to start SCHEDULED and CONDITIONAL triggers when created. True
   * is not supported for ON_DEMAND triggers.
   *
   * @see [Trigger StartOnCreation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-startoncreation)
   *
   * @group Inputs
   */
  public readonly startOnCreation?: boolean;

  /**
   * The type of trigger that this is.
   *
   * @see [Trigger Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-type)
   *
   * @group Inputs
   */
  public readonly type: TriggerType;

  /**
   * The name of the workflow associated with the trigger.
   *
   * @see [Trigger WorkflowName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-workflowname)
   *
   * @group Inputs
   */
  public readonly workflow?: Workflow;

  /**
   * The underlying Trigger CloudFormation resource.
   *
   * @see [AWS::Glue::Trigger](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTrigger;

  /**
   * The Amazon Resource Name (ARN) of the trigger.
   */
  public readonly triggerArn: string;

  /**
   * The name of the trigger.
   */
  public readonly triggerName: string;

  /**
   * Creates a new instance of the Trigger class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TriggerProps) {
    super(scope, id, props);

    this.description = props.description;
    this.name = props.name;
    this.predicateOperator = props.predicateOperator ?? PredicateOperator.AND;
    this.schedule = props.schedule;
    this.startOnCreation = props.startOnCreation ?? (props.type === TriggerType.ON_DEMAND ? false : true);
    this.type = props.type;
    this.workflow = props.workflow;

    props.actions?.forEach((x) => {
      this.addAction(x);
    });

    props.predicateConditions?.forEach((x) => {
      this.addPredicate(x);
    });

    this.resource = new CfnTrigger(this, 'Resource', {
      actions: Lazy.uncachedAny(
        {
          produce: () => {
            return this._actions.map((x) => {
              return x.bind(this);
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      description: this.description,
      name: this.name,
      predicate: Lazy.uncachedAny({
        produce: () => {
          return !!!this._predicates.length ? undefined : {
            conditions: this._predicates.map((x) => {
              return x.bind(this);
            }),
            logical: this._predicates.length > 1 ? this.predicateOperator : undefined,
          };
        },
      }),
      schedule: this.schedule?.expressionString,
      startOnCreation: this.startOnCreation,
      type: this.type,
      workflowName: this.workflow?.workflowName,
    });

    this.triggerArn = this.stack.formatArn({
      resource: 'trigger',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.triggerName = this.resource.ref;
  }

  /**
   * Registers an action with the trigger. All actions associated with the
   * trigger are run when the conditions to trigger the trigger are met.
   *
   * @param action The action to be run by this trigger.
   * @returns The trigger to which the action was added.
   */
  public addAction(action: ITriggerAction): Trigger {
    this._actions.push(action);
    return this;
  }

  /**
   * Registers a predicate with the trigger. Triggers with predicates must meet
   * the conditions they specify in order to run.
   *
   * @param predicate The predicate to be added to the trigger.
   * @returns The trigger to which the predicate was added.
   */
  public addPredicate(predicate: ITriggerPredicate): Trigger {
    this._predicates.push(predicate);
    return this;
  }
}
