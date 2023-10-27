import { INextable, Map, Pass, State, StateMachineFragment } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { SfnFn } from "../../stepfunctions";


export interface BuildFiltersProps {
  readonly tagsPath: string;
  readonly resultPath?: string;
}

export class BuildFilters extends StateMachineFragment {
  private static readonly DEFAULT_RESULT_PATH: string = '$.Filters';

  private readonly iterateInput: Map;
  private readonly filterFromTag: Pass;

  public readonly tagsPath: string;
  public readonly resultPath: string;

  public readonly endStates: INextable[];
  public readonly startState: State;


  public constructor(scope: IConstruct, id: string, props: BuildFiltersProps) {
    super(scope, id);

    this.tagsPath = props.tagsPath;
    this.resultPath = props.resultPath ?? BuildFilters.DEFAULT_RESULT_PATH;

    this.iterateInput = new Map(this, 'build-tags', {
      itemsPath: this.tagsPath,
      resultPath: this.resultPath,
    });

    this.filterFromTag = new Pass(this, 'filter-from-tag', {
      parameters: {
        'Name.$': SfnFn.format('tag:{}', [
          '$.Name',
        ]),
        'Values.$': '$.Values',
      }
    });

    this.iterateInput.iterator(this.filterFromTag);

    this.startState = this.iterateInput;
    this.endStates = this.iterateInput.endStates;
  }
}