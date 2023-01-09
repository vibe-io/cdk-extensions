import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { Job } from '../glue/constructs/job';
import { ITriggerAction, Trigger } from '../glue/constructs/trigger';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


export interface JobActionOptions extends WorkflowActionOptions {
  readonly enableBookmarks?: boolean;
}

export class JobAction extends WorkflowActionBase implements ITriggerAction {
  // Input properties
  public readonly job: Job;


  public constructor(job: Job, options?: JobActionOptions) {
    super(options);

    this.job = job;

    if (options?.enableBookmarks) {
      this.addArgument('--job-bookmark-option', 'job-bookmark-enable');
    }
  }

  public bind(trigger: Trigger): CfnTrigger.ActionProperty {
    return {
      ...super.bindOptions(trigger),
      jobName: this.job.jobName,
    };
  }
}