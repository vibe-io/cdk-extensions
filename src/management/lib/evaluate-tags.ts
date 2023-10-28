import { Choice, Condition, FieldUtils, INextable, JsonPath, Map, Pass, State, StateMachineFragment } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";


export interface BuildFilterProps {
  readonly desiredTagsPath: string;
  readonly resourcesPath?: string;
  readonly tagField: string;
}

export class EvaluateTags extends StateMachineFragment {
  public readonly desiredTagsPath: string;
  public readonly resourcesPath?: string;
  public readonly tagField: string;

  public readonly endStates: INextable[];
  public readonly startState: State;


  public constructor(scope: IConstruct, id: string, props: BuildFilterProps) {
    super(scope, id);

    this.desiredTagsPath = props.desiredTagsPath;
    this.resourcesPath = props.resourcesPath;
    this.tagField = props.tagField;

    const iterateAvailable = new Map(this, 'iterate-available', {
      itemsPath: this.resourcesPath,
      parameters: FieldUtils.renderObject({
        Current: JsonPath.objectAt('$$.Map.Item.Value'),
        DesiredTags: JsonPath.objectAt(this.desiredTagsPath),
        ResourceTags: JsonPath.objectAt(`$$.Map.Item.Value.${this.tagField}`),
      }),
      outputPath: '$[?(@.MissingFilters==false)].Resource',
    });

    const iterateDesiredTags = new Map(this, 'iterate-desired-tags', {
      itemsPath: '$.DesiredTags',
      parameters: FieldUtils.renderObject({
        DesiredTag: JsonPath.objectAt('$$.Map.Item.Value'),
        ResourceTags: JsonPath.objectAt('$.ResourceTags'),
      }),
      resultPath: '$.FilterEvaluation',
    });

    const iterateResourceTags = new Map(this, 'iterate-resource-tags', {
      itemsPath: '$.ResourceTags',
      parameters: FieldUtils.renderObject({
        DesiredTag: JsonPath.objectAt('$.DesiredTag'),
        ResourceTag: JsonPath.objectAt('$$.Map.Item.Value'),
      }),
      outputPath: '$[*].Matched',
    });

    const determineValueMatch = new Pass(this, 'determine-value-match', {
      parameters: FieldUtils.renderObject({
        DesiredTag: JsonPath.objectAt('$.DesiredTag'),
        MatchedValue: JsonPath.arrayContains(
          JsonPath.listAt('$.DesiredTag.Values'),
          JsonPath.stringAt('$.ResourceTag.Value'),
        ),
        ResourceTag: JsonPath.objectAt('$.ResourceTag'),
      }),
    });

    const checkTagMatch = new Choice(this, 'check-tag-match');
    const isTagMatchedCondition = Condition.and(
      Condition.stringEqualsJsonPath('$.ResourceTag.Key', '$.DesiredTag.Key'),
      Condition.booleanEquals('$.MatchedValue', true),
    );

    const reportTagMatched = new Pass(this, 'report-tag-matched', {
      parameters: FieldUtils.renderObject({
        Matched: true,
      }),
    });

    const reportTagNotMatched = new Pass(this, 'report-tag-not-matched', {
      parameters: FieldUtils.renderObject({
        Matched: false,
      }),
    });

    iterateResourceTags.iterator(determineValueMatch
      .next(checkTagMatch
        .when(isTagMatchedCondition, reportTagMatched)
        .otherwise(reportTagNotMatched)));
    
    const determineDesiredTagSatisfied = new Pass(this, 'determine-desired-tag-satisfied', {
      parameters: {
        'Matched.$': 'States.ArrayContains($, true)',
      },
      outputPath: '$.Matched',
    });

    iterateDesiredTags.iterator(iterateResourceTags
      .next(determineDesiredTagSatisfied));

    const determineResourceMatched = new Pass(this, 'determine-resource-matched', {
      parameters: {
        'MissingFilters.$': 'States.ArrayContains($.FilterEvaluation, false)',
        'Resource.$': '$.Current',
      },
    });

    iterateAvailable.iterator(iterateDesiredTags
      .next(determineResourceMatched));

    this.startState = iterateAvailable;
    this.endStates = iterateAvailable.endStates;
  }
}