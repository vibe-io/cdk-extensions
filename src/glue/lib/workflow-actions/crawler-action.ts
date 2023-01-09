import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { Crawler } from '../glue/constructs/crawler';
import { ITriggerAction, Trigger } from '../glue/constructs/trigger';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


export class WorkflowCrawlerAction extends WorkflowActionBase implements ITriggerAction {
  // Input properties
  public readonly crawler: Crawler;


  public constructor(crawler: Crawler, options?: WorkflowActionOptions) {
    super(options);

    this.crawler = crawler;
  }

  public bind(trigger: Trigger): CfnTrigger.ActionProperty {
    return {
      ...super.bindOptions(trigger),
      crawlerName: this.crawler.crawlerName,
    };
  }
}