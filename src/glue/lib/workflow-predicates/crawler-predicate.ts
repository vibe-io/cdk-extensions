import { CfnTrigger } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';
import { ICrawler, ITriggerPredicate } from '../..';
import { WorkflowPredicateBase, PredicateLogicalOperator, WorkflowPredicateOptions } from './predicate-base';


/**
 * State a Glue crawler must be in in order to satisfy a predicate condition to
 * trigger a part of a workflow.
 */
export enum CrawlerState {
  /**
   * A crawler execution was cancelled before it could finish.
   */
  CANCELLED = 'CANCELLED',

  /**
   * A crawler that has finished and ended in an error.
   */
  FAILED = 'FAILED',

  /**
   * A crawler which has finished successfully.
   */
  SUCCEEDED = 'SUCCEEDED'
}

/**
 * Configuration options that specify the state a crawler must meet in order to
 * satisfy the conditions of the predicate.
 */
export interface WorkflowCrawlerPredicateOptions extends WorkflowPredicateOptions {
  /**
   * The logical operator which should be applied in determining whether a
   * crawler meets the requested conditions.
   *
   * At the moment, the only supported operator is `EQUALS`.
   *
   * @see [Trigger Predicate.Conditions.LogicalOperator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator)
   */
  readonly logicalOperator?: PredicateLogicalOperator;

  /**
   * The state that the crawler must be in in order to meet the criteria to
   * trigger the next stage of the workflow.
   *
   * @see [Trigger Predicate.Conditions.CrawlState](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-crawlstate)
   */
  readonly state?: CrawlerState;
}

/**
 * Represents a condition that is predicated on a Glue crawler completion.
 *
 * The condition can be used to create a trigger that controls the execution of
 * downstream tasks in a workflow.
 */
export class WorkflowCrawlerPredicate extends WorkflowPredicateBase implements ITriggerPredicate {
  /**
   * The crawler which must complete in order to meet the requirements to
   * trigger the next stage of the workflow.
   *
   * @see [Trigger Predicate.Conditions.CrawlerName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-crawlername)
   *
   * @group Inputs
   */
  public readonly crawler: ICrawler;

  /**
   * The logical operator which should be applied in determining whether a
   * crawler meets the requested conditions.
   *
   * At the moment, the only supported operator is `EQUALS`.
   *
   * @see [Trigger Predicate.Conditions.LogicalOperator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator)
   */
  public readonly logicalOperator: PredicateLogicalOperator;

  /**
   * The state that the crawler must be in in order to meet the criteria to
   * trigger the next stage of the workflow.
   *
   * @see [Trigger Predicate.Conditions.CrawlState](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-crawlstate)
   */
  public readonly state: CrawlerState;


  /**
   * Creates a new instance of the WorkflowCrawlerPredicate class.
   *
   * @param crawler The crawler which must complete in order to meet the
   * requirements to trigger the next stage of the workflow.
   * @param options Options specifying the conditions the crawler must meet to
   * trigger the next stage of the workflow.
   */
  public constructor(crawler: ICrawler, options?: WorkflowCrawlerPredicateOptions) {
    super(options);

    this.crawler = crawler;
    this.logicalOperator = options?.logicalOperator ?? PredicateLogicalOperator.EQUALS;
    this.state = options?.state ?? CrawlerState.SUCCEEDED;
  }

  /**
   * Associates the predicate with a construct that is configuring a trigger
   * for a Glue workflow.
   *
   * @param scope The construct configuring the Glue trigger.
   * @returns A configuration object that can be used to configure a predicate
   * condition for the Glue trigger.
   */
  public bind(scope: IConstruct): CfnTrigger.ConditionProperty {
    return {
      ...super.bindOptions(scope),
      crawlerName: this.crawler.crawlerName,
      crawlState: this.state,
      logicalOperator: this.logicalOperator,
    };
  }
}