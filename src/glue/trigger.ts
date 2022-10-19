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
  readonly actions?: ITriggerAction[];
  readonly description?: string;
  readonly name?: string;
  readonly predicateConditions?: ITriggerPredicate[];
  readonly predicateOperator?: PredicateOperator;
  readonly schedule?: Schedule;
  readonly startOnCreation?: boolean;
  readonly type: TriggerType;
  readonly workflow?: Workflow;
}

export class Trigger extends Resource {
  // Internal properties
  private readonly _actions: ITriggerAction[] = [];
  private readonly _predicates: ITriggerPredicate[] = [];

  // Input properties
  public readonly description?: string;
  public readonly name?: string;
  public readonly predicateOperator: PredicateOperator;
  public readonly schedule?: Schedule;
  public readonly startOnCreation?: boolean;
  public readonly type: TriggerType;
  public readonly workflow?: Workflow;

  // Resource properties
  public readonly resource: CfnTrigger;

  // Standard properties
  public readonly workflowArn: string;
  public readonly workflowName: string;


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
