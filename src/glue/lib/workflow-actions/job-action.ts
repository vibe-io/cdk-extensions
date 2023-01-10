import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { IJob, ITriggerAction } from '../..';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


export interface BookmarkRange {
  readonly from: string;
  readonly to: string;
}


export class BookmarkConfiguration {
  public static disable(): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-disable');
  }

  public static enable(): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-enable');
  }

  public static pause(range?: BookmarkRange): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-pause', range);
  }

  public static of(value: string, range?: BookmarkRange): BookmarkConfiguration {
    return new BookmarkConfiguration(value, range);
  }

  private constructor(public readonly value: string, public readonly range?: BookmarkRange) {}
}

/**
 * Configuration options for the WorkflowJobAction class.
 */
export interface WorkflowJobActionOptions extends WorkflowActionOptions {
  readonly bookmarkConfiguration?: BookmarkConfiguration;
}

/**
 * Represents the configuration for a job that will be triggered as part of a
 * workflow.
 */
export class WorkflowJobAction extends WorkflowActionBase implements ITriggerAction {
  /**
   * The Glue job to be triggered as part of the workflow.
   *
   * @group Inputs
   */
  public readonly job: IJob;


  /**
   * Creates a new instance of the WorkflowJobAction class.
   *
   * @param job The job that should be triggered as part of the workflow.
   * @param options The options affecting how the job should be triggered.
   */
  public constructor(job: IJob, options?: WorkflowJobActionOptions) {
    super(options);

    this.job = job;

    if (options?.bookmarkConfiguration) {
      this.addArgument('--job-bookmark-option', options.bookmarkConfiguration.value);
      if (options.bookmarkConfiguration.range) {
        this.addArgument('--job-bookmark-from', options.bookmarkConfiguration.range.from);
        this.addArgument('--job-bookmark-to', options.bookmarkConfiguration.range.to);
      }
    }
  }

  /**
   * Associates this action with a resource that is configuring a Glue trigger.
   *
   * @param scope The construct configuring the trigger that this action will
   * be used in.
   * @returns The configuration that can be used to configure the underlying
   * trigger resource.
   */
  public bind(scope: IConstruct): CfnTrigger.ActionProperty {
    return {
      ...super.bindOptions(scope),
      jobName: this.job.jobName,
    };
  }
}