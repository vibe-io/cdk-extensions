import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StopEcsServiceProps extends ResourceManagerBaseProps {}

export class StopEcsService extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StopEcsServiceProps = {}) {
    super(scope, id, props);

    const getInitialCount = new CallAwsService(this, 'get-initial-count', {
      action: 'describeServices',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'service',
          resourceName: '*',
          service: 'ecs',
        }),
      ],
      parameters: {
        'Cluster.$': '$.ClusterName',
        'Services.$': SfnFn.array('$.ServiceName'),
      },
      resultPath: '$.Initial',
      resultSelector: {
        'Desired.$': '$.Services[0].DesiredCount',
        'Pending.$': '$.Services[0].PendingCount',
        'Running.$': '$.Services[0].RunningCount',
      },
      service: 'ecs',
    });

    const checkRunning = new Choice(this, 'check-running');
    const isRunning = Condition.numberGreaterThan('$.Initial.Desired', 0);

    const putState = new CallAwsService(this, 'put-state', {
      action: 'putParameter',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'parameter',
          resourceName: 'scaling/ecs/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/ecs/{}/{}', [
          '$.ClusterName',
          '$.ServiceName',
        ]),
        'Overwrite': true,
        'Type': 'String',
        'Value.$': SfnFn.format('{}', [
          '$.Initial.Desired',
        ]),
      },
      resultPath: JsonPath.DISCARD,
      service: 'ssm',
    });

    const getCachedCount = new CallAwsService(this, 'get-cached-count', {
      action: 'getParameter',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'parameter',
          resourceName: 'scaling/ecs/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/ecs/{}/{}', [
          '$.ClusterName',
          '$.ServiceName',
        ]),
      },
      resultPath: JsonPath.DISCARD,
      service: 'ssm',
    });

    const putSkipped = new CallAwsService(this, 'put-skipped', {
      action: 'putParameter',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'parameter',
          resourceName: 'scaling/ecs/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/ecs/{}/{}', [
          '$.ClusterName',
          '$.ServiceName',
        ]),
        'Type': 'String',
        'Value': this.stack.toJsonString({
          'Skipped': true,
        }),
      },
      resultPath: JsonPath.DISCARD,
      service: 'ssm',
    });

    const desiredRef = StatusController.statusRef('Desired');
    const pendingRef = StatusController.statusRef('Pending');
    const runningRef = StatusController.statusRef('Running');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.numberGreaterThan(desiredRef, 0),
      statusGetter: {
        action: 'describeServices',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            resource: 'service',
            resourceName: '*',
            service: 'ecs',
          }),
        ],
        parameters: {
          'Cluster.$': '$.ClusterName',
          'Services.$': SfnFn.array('$.ServiceName'),
        },
        resultSelector: {
          'Desired.$': '$.Services[0].DesiredCount',
          'Pending.$': '$.Services[0].PendingCount',
          'Running.$': '$.Services[0].RunningCount',
        },
        service: 'ecs',
      },
      statusSetter: {
        action: 'updateService',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            resource: 'service',
            resourceName: '*',
            service: 'ecs',
          }),
        ],
        parameters: {
          'Cluster.$': '$.ClusterName',
          'DesiredCount': 0,
          'Service.$': '$.ServiceName',
        },
        service: 'ecs',
      },
      successCondition: Condition.and(
        Condition.numberEquals(desiredRef, 0),
        Condition.numberEquals(pendingRef, 0),
        Condition.numberEquals(runningRef, 0),
      ),
      waitCondition: Condition.and(
        Condition.numberEquals(desiredRef, 0),
        Condition.or(
          Condition.numberGreaterThan(pendingRef, 0),
          Condition.numberGreaterThan(runningRef, 0),
        )
      ),
    });

    getCachedCount.addCatch(putSkipped.next(statusController.success), {
      errors: [
        'Ssm.ParameterNotFoundException',
      ],
      resultPath: JsonPath.DISCARD,
    });

    const definition = getInitialCount
      .next(checkRunning
        .when(isRunning, putState
          .next(statusController.render()))
        .otherwise(getCachedCount
          .next(statusController.success)));

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'stop-ecs-service',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}