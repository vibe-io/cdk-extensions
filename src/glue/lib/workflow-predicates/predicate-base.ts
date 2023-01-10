import { ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export enum PredicateLogicalOperator {
  EQUALS = 'EQUALS'
}

/**
 * Options for a generic Glue Trigger predicate.
 */
export interface WorkflowPredicateOptions extends ResourceProps {}

export class WorkflowPredicateBase {
  public constructor(_options?: WorkflowPredicateOptions) {}

  protected bindOptions(_scope: IConstruct): any {
    return {};
  }
}