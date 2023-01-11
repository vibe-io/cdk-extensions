import { WorkflowCrawlerPredicate, WorkflowCrawlerPredicateOptions, WorkflowJobPredicate, WorkflowJobPredicateOptions } from '.';
import { ICrawler, IJob } from '../..';


/**
 * Predicate conditions for controlling trigger activation in a Glue workflow.
 */
export class WorkflowPredicate {
  /**
   * A predicate condition dependent on the completion of a Glue crawler.
   *
   * @param crawler The crawler which must complete in order to meet the
   * requirements to trigger the next stage of the workflow.
   * @param options Options specifying the conditions the crawler must meet to
   * trigger the next stage of the workflow.
   * @returns A workflow condition that is predicated on the completion of the
   * specified Glue crawler.
   */
  public static crawler(crawler: ICrawler, options?: WorkflowCrawlerPredicateOptions): WorkflowCrawlerPredicate {
    return new WorkflowCrawlerPredicate(crawler, options);
  }

  /**
   * A predicate condition dependent on the completion of a Glue job.
   *
   * @param job The job which must complete in order to meet the requirements
   * to trigger the next stage of the workflow.
   * @param options Options specifying the conditions the job must meet to
   * trigger the next stage of the workflow.
   * @returns A workflow condition that is predicated on the completion of the
   * specified Glue crawler.
   */
  public static job(job: IJob, options?: WorkflowJobPredicateOptions): WorkflowJobPredicate {
    return new WorkflowJobPredicate(job, options);
  }
}