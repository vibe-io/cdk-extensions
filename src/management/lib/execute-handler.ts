import { FieldUtils, IntegrationPattern, JsonPath, TaskMetricsConfig, TaskStateBase, TaskStateBaseProps, Timeout } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { ArnFormat, Aws, Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";


export interface ExecuteHandlerProps extends TaskStateBaseProps {
  readonly actionPath: string;
  readonly comment?: string;
  readonly input: {[key: string]: any};
  readonly inputPath?: string;
  readonly outputPath?: string;
  readonly resultPath?: string;
  readonly resultSelector?: {[key: string]: any};
  readonly resourceType: string;
  readonly taskTimeout?: Timeout;
}

export class ExecuteHandler extends TaskStateBase {
  private readonly actionPath: string;
  private readonly input: {[key: string]: any};
  private readonly resourceType: string;

  protected readonly taskMetrics?: TaskMetricsConfig;
  protected readonly taskPolicies?: PolicyStatement[];


  public constructor(scope: IConstruct, id: string, props: ExecuteHandlerProps) {
    super(scope, id, {
      ...props,
      integrationPattern: IntegrationPattern.RUN_JOB,
    });

    this.actionPath = props.actionPath;
    this.input = props.input;
    this.resourceType = props.resourceType;

    this.taskPolicies = this._createAccessPolicy();
  }

  protected _renderTask(): any {
    return {
      Parameters: FieldUtils.renderObject({
        Input: {
          ...this.input,
          AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID: JsonPath.executionId,
        },
        StateMachineArn: JsonPath.format('arn:{}:states:{}:{}:stateMachine:{}-{}', ...[
          Aws.PARTITION,
          JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.executionId, ':'), 3),
          JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.executionId, ':'), 4),
          JsonPath.stringAt(this.actionPath),
          this.resourceType,
        ]),
      }),
      Resource: `arn:${Aws.PARTITION}:states:::states:startExecution.sync:2`,
    };
  }

  private _createAccessPolicy(): PolicyStatement[] {
    const stack = Stack.of(this);

    return [
      new PolicyStatement({
        actions: [
          'states:StartExecution',
        ],
        resources: [
          stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'stateMachine',
            resourceName: `start-${this.resourceType}`,
            service: 'states',
          }),
          stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'stateMachine',
            resourceName: `stop-${this.resourceType}`,
            service: 'states',
          }),
        ],
      }),
      new PolicyStatement({
        actions: [
          'states:DescribeExecution',
          'states:StopExecution',
        ],
        resources: [
          stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'execution',
            resourceName: `start-${this.resourceType}*`,
            service: 'states',
          }),
          stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'execution',
            resourceName: `stop-${this.resourceType}*`,
            service: 'states',
          }),
        ],
      }),
      new PolicyStatement({
        actions: [
          'events:DescribeRule',
          'events:PutRule',
          'events:PutTargets',
        ],
        resources: [
          stack.formatArn({
            service: 'events',
            resource: 'rule',
            resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
          }),
        ],
      }),
    ];
  }
}