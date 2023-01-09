import { Resource, ResourceProps } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnWorkflow } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { ITrigger } from '.';
import { ITriggerAction, ITriggerPredicate, PredicateOperator, Trigger, TriggerType } from './trigger';


export interface TriggerOptions extends ResourceProps {
  readonly actions?: ITriggerAction[];
  readonly description?: string;
  readonly name?: string;
  readonly predicateConditions?: ITriggerPredicate[];
  readonly predicateOperator?: PredicateOperator;
  readonly schedule?: Schedule;
  readonly startOnCreation?: boolean;
  readonly type: TriggerType;
}

/**
 * Configuration for the Glue Workflow resource.
 */
export interface WorkflowProps extends ResourceProps {
  /**
   * A description of the Workflow
   */
  readonly description?: string;

  /**
   * A name of the Workflow
   */
  readonly name?: string;
}

export class Workflow extends Resource {
  /**
   * {@link WorkflowProps.description}
   */

  public readonly description?: string;
  /**
   * {@link WorkflowProps.name}
   */
  public readonly name?: string;

  // Resource properties
  public readonly resource: CfnWorkflow;

  // Standard properties
  public readonly workflowArn: string;
  public readonly workflowName: string;

  /**
   * Creates a new instance of the Workflow class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: WorkflowProps) {
    super(scope, id, props);

    this.description = props.description;
    this.name = props.name;

    this.resource = new CfnWorkflow(this, 'Resource', {
      description: this.description,
      name: this.name,
    });

    this.workflowArn = this.stack.formatArn({
      resource: 'table',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.workflowName = this.resource.ref;
  }

  public addTrigger(id: string, options: TriggerOptions): ITrigger {
    return new Trigger(this, `trigger-${id}`, {
      ...options,
      workflow: this,
    });
  }
}
