


import { Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, Fail, FieldUtils, IntegrationPattern, JsonPath, Parallel, Pass, StateMachine, Succeed, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { EventBridgePutEvents, StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { ManageAutoScalingGroups } from './manage-auto-scaling-groups';
import { ManageEc2Instances } from './manage-ec2-instances';
import { ManageEcsServices } from './manage-ecs-services';
import { ManageRdsClusters } from './manage-rds-clusters';
import { ManageRdsInstances } from './manage-rds-instances';
import { StartAppRunnerService } from './start-app-runner-service';
import { StartAutoScalingGroup } from './start-auto-scaling-group';
import { StartEc2Instance } from './start-ec2-instance';
import { StartEcsService } from './start-ecs-service';
import { StartRdsCluster } from './start-rds-cluster';
import { StartRdsInstance } from './start-rds-instance';
import { StopAppRunnerService } from './stop-app-runner-service';
import { StopRdsInstance } from './stop-rds-instance';
import { StopRdsCluster } from './stop-rds-cluster';
import { StopEcsService } from './stop-ecs-service';
import { StopEc2Instance } from './stop-ec2-instance';
import { StopAutoScalingGroup } from './stop-auto-scaling-group';


export interface ResourceManagerProps extends ResourceManagerBaseProps {}

export class ResourceManager extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ResourceManagerProps = {}) {
    super(scope, id, props);

    const addDefaults = new Pass(this, 'add-defaults', {
      parameters: {
        DryRun: false,
      },
      resultPath: '$.Defaults',
    });

    const mergeDefaults = new Pass(this, 'merge-defaults', {
      parameters: {
        'Merged.$': 'States.JsonMerge($.Defaults, $$.Execution.Input, false)',
      },
      outputPath: '$.Merged',
    });

    const putInitEvent = new EventBridgePutEvents(this, 'put-init-event', {
      entries: [{
        detail: TaskInput.fromObject({
          action: JsonPath.stringAt('$.Action'),
          dryRun: JsonPath.stringAt('$.DryRun'),
          eventType: 'INIT',
          execution: JsonPath.stringAt('$$.Execution'),
          stateMachine: JsonPath.stringAt('$$.StateMachine'),
          tags: JsonPath.stringAt('$.Tags'),
        }),
        detailType: 'Resource Manager Lifecycle Event',
        source: 'resource-manager',
      }],
      resultPath: JsonPath.DISCARD,
    });

    const parallel = new Parallel(this, 'parallel', {
      resultPath: '$.Result',
      resultSelector: FieldUtils.renderObject({
        Executions: JsonPath.objectAt('$[*].Output'),
      }),
    });

    const handleAutoScalingGroups = new StepFunctionsStartExecution(this, 'handle-auto-scaling-groups', {
      associateWithParent: true,
      integrationPattern: IntegrationPattern.RUN_JOB,
      input: TaskInput.fromObject({
        'Action.$': '$.Action',
        'DryRun.$': '$.DryRun',
        'Tags.$': '$.Tags',
      }),
      stateMachine: StateMachine.fromStateMachineName(this, 'auto-scaling-group-manager', 'manage-auto-scaling-groups'),
    });

    const handleEc2Instances = new StepFunctionsStartExecution(this, 'handle-ec2-instances', {
      associateWithParent: true,
      integrationPattern: IntegrationPattern.RUN_JOB,
      input: TaskInput.fromObject({
        'Action.$': '$.Action',
        'DryRun.$': '$.DryRun',
        'Tags.$': '$.Tags',
      }),
      stateMachine: StateMachine.fromStateMachineName(this, 'ec2-instance-manager', 'manage-ec2-instances'),
    });

    const handleEcsServices = new StepFunctionsStartExecution(this, 'handle-ecs-services', {
      associateWithParent: true,
      integrationPattern: IntegrationPattern.RUN_JOB,
      input: TaskInput.fromObject({
        'Action.$': '$.Action',
        'DryRun.$': '$.DryRun',
        'Tags.$': '$.Tags',
      }),
      stateMachine: StateMachine.fromStateMachineName(this, 'ecs-service-manager', 'manage-ecs-services'),
    });

    const handleRdsClusters = new StepFunctionsStartExecution(this, 'handle-rds-clusters', {
      associateWithParent: true,
      integrationPattern: IntegrationPattern.RUN_JOB,
      input: TaskInput.fromObject({
        'Action.$': '$.Action',
        'DryRun.$': '$.DryRun',
        'Tags.$': '$.Tags',
      }),
      stateMachine: StateMachine.fromStateMachineName(this, 'rds-cluster-manager', 'manage-rds-clusters'),
    });

    const handleRdsInstances = new StepFunctionsStartExecution(this, 'handle-rds-instances', {
      associateWithParent: true,
      integrationPattern: IntegrationPattern.RUN_JOB,
      input: TaskInput.fromObject({
        'Action.$': '$.Action',
        'DryRun.$': '$.DryRun',
        'Tags.$': '$.Tags',
      }),
      stateMachine: StateMachine.fromStateMachineName(this, 'rds-instance-manager', 'manage-rds-instances'),
    });

    parallel.branch(
      handleAutoScalingGroups,
      handleEc2Instances,
      handleEcsServices,
      handleRdsClusters,
      handleRdsInstances,
    );

    const summarizeResults = new Pass(this, 'summarize-results', {
      parameters: FieldUtils.renderObject({
        Action: JsonPath.stringAt('$.Action'),
        DryRun: JsonPath.stringAt('$.DryRun'),
        Resources: {
          Failed: {
            Count: JsonPath.arrayLength(JsonPath.listAt('$[*].Failed.Resources[*]')),
            Resources: JsonPath.objectAt('$[*].Failed.Resources[*]'),
          },
          Success: {
            Count: JsonPath.arrayLength(JsonPath.listAt('$[*].Success.Resources[*]')),
            Resources: JsonPath.objectAt('$[*].Success.Resources[*]'),
          },
        },
        Tags: JsonPath.stringAt('$.Tags'),
      }),
    });

    const checkFailed = new Choice(this, 'check-failed');
    const hasFailedResourcesCondition = Condition.numberGreaterThan('$.Resources.Failed.Count', 0);

    const putSuccessEvent = this.makeResultEvent('success');
    const success = new Succeed(this, 'success');

    const putFailedEvent = this.makeResultEvent('failed');
    const fail = new Fail(this, 'fail');

    const definition = addDefaults
      .next(mergeDefaults)
      .next(putInitEvent)
      .next(parallel)
      .next(summarizeResults)
      .next(checkFailed
        .when(hasFailedResourcesCondition, putFailedEvent
          .next(fail))
        .otherwise(putSuccessEvent
          .next(success)));

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'resource-manager',
      tracingEnabled: props.tracingEnabled ?? true,
    });

    new ManageAutoScalingGroups(this, 'manage-auto-scaling-groups');
    new ManageEc2Instances(this, 'manage-ec2-instances');
    new ManageEcsServices(this, 'manage-ecs-services');
    new ManageRdsClusters(this, 'manage-rds-clusters');
    new ManageRdsInstances(this, 'manage-rds-instances');

    new StartAppRunnerService(this, 'start-app-runner-service');
    new StartAutoScalingGroup(this, 'start-auto-scaling-group');
    new StartEc2Instance(this, 'start-ec2-instance');
    new StartEcsService(this, 'start-ecs-service');
    new StartRdsCluster(this, 'start-rds-cluster');
    new StartRdsInstance(this, 'start-rds-instance');

    new StopAppRunnerService(this, 'stop-app-runner-service');
    new StopAutoScalingGroup(this, 'stop-auto-scaling-group');
    new StopEc2Instance(this, 'stop-ec2-instance');
    new StopEcsService(this, 'stop-ecs-service');
    new StopRdsCluster(this, 'stop-rds-cluster');
    new StopRdsInstance(this, 'stop-rds-instance');
  }

  private makeResultEvent(result: string) {
    return new EventBridgePutEvents(this, `put-${result}-event`, {
      entries: [{
        detail: TaskInput.fromObject({
          action: JsonPath.stringAt('$.Action'),
          dryRun: JsonPath.stringAt('$.DryRun'),
          eventType: 'COMPLETE',
          execution: JsonPath.stringAt('$$.Execution'),
          resources: JsonPath.stringAt('$.Resources'),
          result: result.toUpperCase(),
          stateMachine: JsonPath.stringAt('$$.StateMachine'),
          tags: JsonPath.stringAt('$.Tags'),
        }),
        detailType: 'Resource Manager Lifecycle Event',
        source: 'resource-manager',
      }],
      resultPath: JsonPath.DISCARD,
    });
  }
}