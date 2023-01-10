import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { IJob, ITriggerPredicate } from '../..';
import { WorkflowPredicateBase, PredicateLogicalOperator, WorkflowPredicateOptions } from './predicate-base';


/**
 * State a Glue job must be in in order to satisfy a predicate condition to
 * trigger a part of a workflow.
 */
export enum JobState {
  /**
   * A job that has finished and ended with an error.
   */
  FAILED = 'FAILED',

  /**
   * A job which was stopped before completion.
   */
  STOPPED = 'STOPPED',

  /**
   * A job which has finished successfully.
   */
  SUCCEEDED = 'SUCCEEDED',

  /**
   * A job which timed out without completing.
   */
  TIMEOUT = 'TIMEOUT'
}

/**
 * Configuration options that specify the state a job must meet in order to
 * satisfy the conditions of the predicate.
 */
export interface WorkflowJobPredicateOptions extends WorkflowPredicateOptions {
  /**
   * The logical operator which should be applied in determining whether a job
   * meets the requested conditions.
   * 
   * At the moment, the only supported operator is `EQUALS`.
   * 
   * @see [Trigger Predicate.Conditions.LogicalOperator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator)
   */
  readonly logicalOperator?: PredicateLogicalOperator;

  /**
   * The state that the job must be in in order to meet the criteria to trigger
   * the next stage of the workflow.
   * 
   * @see [Trigger Predicate.Conditions.State](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-state)
   */
  readonly state?: JobState;
}

/**
 * Represents a condition that is predicated on a Glue job completion.
 * 
 * The condition can be used to create a trigger that controls the execution of
 * downstream tasks in a workflow.
 */
export class WorkflowJobPredicate extends WorkflowPredicateBase implements ITriggerPredicate {
  /**
   * The job which must complete in order to meet the requirements to trigger
   * the next stage of the workflow.
   * 
   * @see [Trigger Predicate.Conditions.JobName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-jobname)
   * 
   * @group Inputs
   */
  public readonly job: IJob;

  /**
   * The logical operator which should be applied in determining whether a job
   * meets the requested conditions.
   * 
   * At the moment, the only supported operator is `EQUALS`.
   * 
   * @see [Trigger Predicate.Conditions.LogicalOperator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator)
   * 
   * @group Inputs
   */
  public readonly logicalOperator: PredicateLogicalOperator;

  /**
   * The state that the job must be in in order to meet the criteria to trigger
   * the next stage of the workflow.
   * 
   * @see [Trigger Predicate.Conditions.State](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-state)
   * 
   * @group Inputs
   */
  public readonly state: JobState;


  /**
   * Creates a new instance of the WorkflowJobPredicate class.
   * 
   * @param job The job which must complete in order to meet the requirements
   * to trigger the next stage of the workflow.
   * @param options Options specifying the conditions the job must meet to
   * trigger the next stage of the workflow.
   */
  public constructor(job: IJob, options?: WorkflowJobPredicateOptions) {
    super(options);

    this.job = job;
    this.logicalOperator = options?.logicalOperator ?? PredicateLogicalOperator.EQUALS;
    this.state = options?.state ?? JobState.SUCCEEDED;
  }

  /**
   * Associates the predicate with a construct that is configuring a trigger
   * for a Glue workflow.
   * 
   * @param scope The construct configuring the Glue trigger.
   * @returns A configuration object that can be used to configure a predicate
   * condition for the Glue trigger.
   */
  public bind(scope: IConstruct): CfnTrigger.ConditionProperty {
    return {
      ...super.bindOptions(scope),
      jobName: this.job.jobName,
      logicalOperator: this.logicalOperator,
      state: this.state,
    };
  }
}