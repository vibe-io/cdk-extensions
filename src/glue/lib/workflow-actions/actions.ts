import { WorkflowCrawlerAction, WorkflowCrawlerActionOptions, WorkflowJobAction, WorkflowJobActionOptions } from ".";
import { ICrawler, IJob } from "../..";


/**
 * Actions to be started by a Glue workflow trigger when it is activated.
 */
export class WorkflowAction {
  /**
   * An action that runs a crawler as part of a Glue workflow.
   * 
   * @param crawler The crawler to run as part of the workflow.
   * @param options The options configuring how the crawler should be run.
   * @returns A workflow action that runs the crawler with the given options.
   */
  public static crawler(crawler: ICrawler, options?: WorkflowCrawlerActionOptions): WorkflowCrawlerAction {
    return new WorkflowCrawlerAction(crawler, options);
  }

  /**
   * An action that runs a Glue job as part of a workflow.
   * 
   * @param job The job to run as part of the workflow.
   * @param options The options configuring how the job should be run.
   * @returns A workflow action that runs the job with the given options.
   */
  public static job(job: IJob, options?: WorkflowJobActionOptions): WorkflowJobAction {
    return new WorkflowJobAction(job, options);
  }
}