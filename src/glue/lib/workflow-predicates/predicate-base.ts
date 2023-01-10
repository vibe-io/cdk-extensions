import { ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export enum PredicateLogicalOperator {
  EQUALS = 'EQUALS'
}

/**
 * Options for a generic Glue Trigger predicate.
 */
export interface PredicateOptions extends ResourceProps {}

export class PredicateBase {
  public constructor(_options?: PredicateOptions) {}

  protected bindOptions(_scope: IConstruct): any {
    return {};
  }
}