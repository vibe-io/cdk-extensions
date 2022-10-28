import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
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

export interface ITriggerAction {
  bind(trigger: Trigger): CfnTrigger.ActionProperty;
}

export interface ITriggerPredicate {
  bind(trigger: Trigger): CfnTrigger.ConditionProperty;
}

/**
 * Configuration for the Glue Trigger resource.
 */
export interface TriggerProps extends ResourceProps {
  /**
   * A list of actions initiated by this trigger.
   * 
   * @see [AWS::Glue::Trigger Action](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html)
   */
  readonly actions?: ITriggerAction[];
  /**
   * A description for the Trigger
   */
  readonly description?: string;
  /**
   * A name for the Trigger
   */
  readonly name?: string;
  /**
   * A list of conditions predicating the trigger, determining when it will fire
   * 
   * @see [AWS::Glue::Trigger Predicate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html)
   */
  readonly predicateConditions?: ITriggerPredicate[];
  /**
   * Operator for chaining predicate conditions (AND/OR)
   */
  readonly predicateOperator?: PredicateOperator;
  /**
   * A cron expression used to specify the schedule. 
   * 
   * @see [AWS::Glue::Trigger](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-schedule)
   */
  readonly schedule?: Schedule;
  /**
   * Set to true to start SCHEDULED and CONDITIONAL triggers when created. True is not supported for ON_DEMAND triggers.
   * 
   * @see [AWS::Glue::Trigger](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-startoncreation)
   */
  readonly startOnCreation?: boolean;
  /**
   * The type of trigger that this is.
   * 
   * @see [AWS::Glue::Trigger](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-type)
   */
  readonly type: TriggerType;
  /**
   * Workflow object the Trigger should be attached to
   */
  readonly workflow?: Workflow;
}

export class Trigger extends Resource {
  // Internal properties
  private readonly _actions: ITriggerAction[] = [];
  private readonly _predicates: ITriggerPredicate[] = [];

  // Input properties
  /**
    * {@link TriggerProps.description}
    */
	public readonly description?: string;
  /**
    * {@link TriggerProps.name}
    */
	public readonly name?: string;
  /**
    * {@link TriggerProps.predicateOperator:}
    */
	public readonly predicateOperator: PredicateOperator;
  /**
    * {@link TriggerProps.schedule}
    */
	public readonly schedule?: Schedule;
  /**
    * {@link TriggerProps.startOnCreation}
    */
	public readonly startOnCreation?: boolean;
  /**
    * {@link TriggerProps.type:}
    */
	public readonly type: TriggerType;
  /**
    * {@link TriggerProps.workflow}
    */
	public readonly workflow?: Workflow;

  // Resource properties
  public readonly resource: CfnTrigger;

  // Standard properties
  public readonly workflowArn: string;
  public readonly workflowName: string;

  /**
     * Creates a new instance of the Trigger class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TriggerProps) {
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

    this.workflowArn = this.stack.formatArn({
      resource: 'table',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.workflowName = this.resource.ref;
  }

  public addAction(action: ITriggerAction): Trigger {
    this._actions.push(action);
    return this;
  }

  public addPredicate(predicate: ITriggerPredicate): Trigger {
    this._predicates.push(predicate);
    return this;
  }
}
