import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';
import { IJob, ITriggerAction } from '../..';


/**
 * A range of job run ID's that specify the job bookmark state of a Glue job
 * which has had its bookmark state set to paused.
 *
 * @see [Using job bookmarks in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html#monitor-continuations-implement)
 */
export interface BookmarkRange {
  /**
   * The run ID which represents all the input that was processed until the
   * last successful run before and including the specified run ID. The
   * corresponding input is ignored.
   */
  readonly from: string;

  /**
   * The run ID which represents all the input that was processed until the
   * last successful run before and including the specified run ID. The
   * corresponding input excluding the input identified by the
   * {@link BookmarkRange.from | from} is processed by the job. Any input later
   * than this input is also excluded for processing.
   */
  readonly to: string;
}

/**
 * Controls the bookmark state of a Glue job.
 *
 * @see [Using job bookmarks in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html#monitor-continuations-implement)
 */
export class BookmarkConfiguration {
  /**
   * Job bookmarks are not used, and the job always processes the entire
   * dataset. You are responsible for managing the output from previous job
   * runs.
   *
   * @returns A configuration object that disabled job bookmarks.
   */
  public static disable(): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-disable');
  }

  /**
   * Causes the job to update the state after a run to keep track of previously
   * processed data. If your job has a source with job bookmark support, it
   * will keep track of processed data, and when a job runs, it processes new
   * data since the last checkpoint.
   *
   * @returns A configuration object that enables job bookmarks.
   */
  public static enable(): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-enable');
  }

  /**
   * Process incremental data since the last successful run or the data in a
   * specified range, without updating the state of last bookmark. You are
   * responsible for managing the output from previous job runs.
   *
   * @param range The range of run ID's that should have their data processed.
   * @returns A configuration object that pauses job bookmarks.
   */
  public static pause(range?: BookmarkRange): BookmarkConfiguration {
    return BookmarkConfiguration.of('job-bookmark-pause', range);
  }

  /**
   * An escape hatch method that allows specifying arbitrary values for the
   * `job-bookmark-option` argument of a Glue job.
   *
   * @param value The value to pass to the `job-bookmark-option` argument.
   * @param range An optional range of job ID's that will correspond to the
   * `job-bookmark-from` and `job-bookmark-to` arguments.
   * @returns A configuration object that represents the provided bookmark
   * configuration.
   */
  public static of(value: string, range?: BookmarkRange): BookmarkConfiguration {
    return new BookmarkConfiguration(value, range);
  }

  /**
   * Creates a new instance of the BookmarkConfiguration class.
   *
   * @param value The value to pass to the `job-bookmark-option` argument.
   * @param range An optional range of job ID's that will correspond to the
   * `job-bookmark-from` and `job-bookmark-to` arguments.
   */
  private constructor(
    public readonly value: string,
    public readonly range?: BookmarkRange,
  ) {}
}

/**
 * Configuration options for the WorkflowJobAction class.
 */
export interface WorkflowJobActionOptions extends WorkflowActionOptions {
  /**
   * The bookmark configuration override to use for the Glue job that is being
   * triggered.
   */
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