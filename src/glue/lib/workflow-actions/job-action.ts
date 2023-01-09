import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { IJob, ITriggerAction } from '../..';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


export interface WorkflowJobActionOptions extends WorkflowActionOptions {
  readonly enableBookmarks?: boolean;
}

export class WorkflowJobAction extends WorkflowActionBase implements ITriggerAction {
  // Input properties
  public readonly job: IJob;


  public constructor(job: IJob, options?: WorkflowJobActionOptions) {
    super(options);

    this.job = job;

    if (options?.enableBookmarks) {
      this.addArgument('--job-bookmark-option', 'job-bookmark-enable');
    }
  }

  public bind(scope: IConstruct): CfnTrigger.ActionProperty {
    return {
      ...super.bindOptions(scope),
      jobName: this.job.jobName,
    };
  }
}