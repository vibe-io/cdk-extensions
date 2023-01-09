import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { ICrawler, ITriggerAction } from '../..';
import { WorkflowActionBase, WorkflowActionOptions } from './action-base';


export class WorkflowCrawlerAction extends WorkflowActionBase implements ITriggerAction {
  // Input properties
  public readonly crawler: ICrawler;


  public constructor(crawler: ICrawler, options?: WorkflowActionOptions) {
    super(options);

    this.crawler = crawler;
  }

  public bind(scope: IConstruct): CfnTrigger.ActionProperty {
    return {
      ...super.bindOptions(scope),
      crawlerName: this.crawler.crawlerName,
    };
  }
}