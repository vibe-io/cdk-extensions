import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { ICrawler, ITriggerAction } from '../..';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


/**
 * Configuration options for the WorkflowCrawlerAction class.
 */
export class WorkflowCrawlerAction extends WorkflowActionBase implements ITriggerAction {
  /**
   * The Glue crawler to be triggered as part of the workflow.
   *
   * @group Inputs
   */
  public readonly crawler: ICrawler;


  /**
   * Creates a new instance of the WorkflowCrawlerAction class.
   *
   * @param crawler The crawler that should be triggered as part of the
   * workflow.
   * @param options The options affecting how the crawler should be triggered.
   */
  public constructor(crawler: ICrawler, options?: WorkflowActionOptions) {
    super(options);

    this.crawler = crawler;
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
      crawlerName: this.crawler.crawlerName,
    };
  }
}