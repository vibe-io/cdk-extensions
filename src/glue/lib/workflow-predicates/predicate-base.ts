import { ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


/**
 * Logical operator that specifies how the conditions of a predicate should be
 * evaluated.
 */
export enum PredicateLogicalOperator {
  /**
   * State equals specified value.
   */
  EQUALS = 'EQUALS'
}

/**
 * Options for a generic Glue Trigger predicate.
 */
export interface WorkflowPredicateOptions extends ResourceProps {}

/**
 * Base class providing common functionality for trigger predicate conditions.
 */
export class WorkflowPredicateBase {
  /**
   * Create a new instance of the WorkflowPredicateBase class.
   *
   * @param _options Options specifying the conditions the predicate must meet
   * to trigger the next stage of the workflow.
   */
  public constructor(_options?: WorkflowPredicateOptions) {}

  /**
   * Associates the predicate with a construct that is configuring a trigger
   * for a Glue workflow.
   *
   * @param _scope The construct configuring the Glue trigger.
   * @returns A configuration object that can be used to configure a predicate
   * condition for the Glue trigger.
   */
  protected bindOptions(_scope: IConstruct): any {
    return {};
  }
}