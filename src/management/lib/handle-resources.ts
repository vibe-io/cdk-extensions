import { Choice, Condition, Fail, FieldUtils, INextable, JsonPath, Map, Pass, State, StateMachineFragment, Succeed } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { SfnFn } from "../../stepfunctions";
import { ExecuteHandler } from "./execute-handler";


export interface HandleResourcesProps {
  readonly actionPath?: string;
  readonly childInput?: {[key: string]: any};
  readonly itemsPath: string;
  readonly resourceArnField: string;
  readonly resourceType: string;
}

export class HandleResources extends StateMachineFragment {
  private static readonly DEFAULT_ACTION_PATH: string = '$$.Execution.Input.Action';

  private readonly checkDryRun: Choice;
  private readonly checkFailed: Choice;
  private readonly fail: Fail;
  private readonly formatDryRun: Pass;
  private readonly handleResource: ExecuteHandler;
  private readonly iterateResources: Map;
  private readonly recordFailure: Pass;
  private readonly recordSuccess: Pass;
  private readonly success: Succeed;

  public readonly actionPath: string;
  public readonly childInput: {[key: string]: any};
  public readonly itemsPath: string;
  public readonly resourceArnField: string;
  public readonly resourceType: string;

  public readonly endStates: INextable[];
  public readonly startState: State;


  public constructor(scope: IConstruct, id: string, props: HandleResourcesProps) {
    super(scope, id);

    this.actionPath = props.actionPath ?? HandleResources.DEFAULT_ACTION_PATH;
    this.childInput = props.childInput ?? {};
    this.itemsPath = props.itemsPath;
    this.resourceArnField = props.resourceArnField;
    this.resourceType = props.resourceType;

    this.checkDryRun = new Choice(this, 'check-dry-run');
    const isDryRunCondition = Condition.and(
      Condition.isPresent('$$.Execution.Input.DryRun'),
      Condition.booleanEquals('$$.Execution.Input.DryRun', true),
    );

    this.iterateResources = new Map(this, 'iterate-resources', {
      itemsPath: this.itemsPath,
      resultSelector: FieldUtils.renderObject({
        Failed: {
          Count: JsonPath.arrayLength(JsonPath.objectAt("$[*][?(@.Result=='failed')]")),
          Resources: JsonPath.objectAt("$[*][?(@.Result=='failed')].ResourceArn"),
        },
        Success: {
          Count: JsonPath.arrayLength(JsonPath.objectAt("$[*][?(@.Result=='success')]")),
          Resources: JsonPath.objectAt("$[*][?(@.Result=='success')].ResourceArn"),
        },
      }),
    });

    this.handleResource = new ExecuteHandler(this, 'handle-resources', {
      action: JsonPath.stringAt(this.actionPath),
      input: this.childInput,
      resourceType: this.resourceType,
      resultPath: JsonPath.DISCARD,
    });

    this.recordSuccess = new Pass(this, 'record-success', {
      parameters: {
        'ResourceArn.$': `$.${this.resourceArnField}`,
        'Result': 'success'
      },
    });

    this.recordFailure = new Pass(this, 'record-failure', {
      parameters: {
        'ResourceArn.$': `$.${this.resourceArnField}`,
        'Result': 'failed'
      },
    });

    this.iterateResources.iterator(this.handleResource.next(this.recordSuccess));
    this.handleResource.addCatch(this.recordFailure, {
      errors: [
        'States.ALL',
      ],
      resultPath: '$.Error',
    });

    this.formatDryRun = new Pass(this, 'format-dry-run', {
      parameters: {
        'Failed': {
          'Count': 0,
          'Resources': [],
        },
        'Success': {
          'Count.$': SfnFn.arrayLength('$'),
          'Resources.$': `$[*].${this.resourceArnField}`,
        },
      },
    });

    this.checkFailed = new Choice(this, 'check-failed');
    const hasFailedResourcesCondition = Condition.and(
      Condition.numberGreaterThan('$.Failed.Count', 0),
      Condition.isNotPresent('$$.Execution.Input.AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID'),
    )

    this.fail = new Fail(this, 'fail');
    this.success = new Succeed(this, 'success');

    const mainFlow = this.checkDryRun
      .when(isDryRunCondition, this.formatDryRun)
      .otherwise(this.iterateResources)
      .afterwards();

    const resultFlow = this.checkFailed
      .when(hasFailedResourcesCondition, this.fail)
      .otherwise(this.success);

    mainFlow.next(resultFlow);

    this.startState = this.checkDryRun;
    this.endStates = [];
  }
}