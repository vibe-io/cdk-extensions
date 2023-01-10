import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { ICrawler, ITriggerPredicate } from '../..';
import { PredicateBase, PredicateLogicalOperator, PredicateOptions } from './predicate-base';


export enum CrawlerState {
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED'
}

export interface CrawlerPredicateOptions extends PredicateOptions {
  readonly logicalOperator: PredicateLogicalOperator;
  readonly state?: CrawlerState;
}

export class CrawlerPredicate extends PredicateBase implements ITriggerPredicate {
  // Input properties
  public readonly crawler: ICrawler;
  public readonly logicalOperator: PredicateLogicalOperator;
  public readonly state: CrawlerState;


  public constructor(crawler: ICrawler, options?: CrawlerPredicateOptions) {
    super(options);

    this.crawler = crawler;
    this.logicalOperator = options?.logicalOperator ?? PredicateLogicalOperator.EQUALS;
    this.state = options?.state ?? CrawlerState.SUCCEEDED;
  }

  public bind(scope: IConstruct): CfnTrigger.ConditionProperty {
    return {
      ...super.bindOptions(scope),
      crawlerName: this.crawler.crawlerName,
      crawlState: this.state,
      logicalOperator: this.logicalOperator,
    };
  }
}