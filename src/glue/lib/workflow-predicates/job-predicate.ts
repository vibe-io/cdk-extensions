import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { IJob, ITriggerPredicate } from '../..';
import { WorkflowPredicateBase, PredicateLogicalOperator, WorkflowPredicateOptions } from './predicate-base';


export enum JobState {
  FAILED = 'FAILED',
  STOPPED = 'STOPPED',
  SUCCEEDED = 'SUCCEEDED',
  TIMEOUT = 'TIMEOUT'
}

export interface WorkflowJobPredicateOptions extends WorkflowPredicateOptions {
  readonly logicalOperator?: PredicateLogicalOperator;
  readonly state?: JobState;
}

export class WorkflowJobPredicate extends WorkflowPredicateBase implements ITriggerPredicate {
  // Input properties
  public readonly job: IJob;
  public readonly logicalOperator: PredicateLogicalOperator;
  public readonly state: JobState;


  public constructor(job: IJob, options?: WorkflowJobPredicateOptions) {
    super(options);

    this.job = job;
    this.logicalOperator = options?.logicalOperator ?? PredicateLogicalOperator.EQUALS;
    this.state = options?.state ?? JobState.SUCCEEDED;
  }

  public bind(scope: IConstruct): CfnTrigger.ConditionProperty {
    return {
      ...super.bindOptions(scope),
      jobName: this.job.jobName,
      logicalOperator: this.logicalOperator,
      state: this.state,
    };
  }
}