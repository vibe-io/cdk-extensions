import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StartEcsServiceProps extends ResourceManagerBaseProps {}

export class StartEcsService extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StartEcsServiceProps = {}) {
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

    const checkStopped = new Choice(this, 'check-stopped');
    const isStopped = Condition.numberEquals('$.Initial.Desired', 0);

    const getTarget = new CallAwsService(this, 'get-target', {
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
      resultPath: '$.Target',
      resultSelector: {
        'Count.$': SfnFn.stringToJson('$.Parameter.Value'),
      },
      service: 'ssm',
    });

    const desiredRef = StatusController.statusRef('Desired');
    const runningRef = StatusController.statusRef('Running');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.numberEquals(desiredRef, 0),
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
          'DesiredCount.$': '$.Target.Count',
          'Service.$': '$.ServiceName',
        },
        service: 'ecs',
      },
      successCondition: Condition.numberGreaterThanEqualsJsonPath(runningRef, desiredRef),
      waitCondition: Condition.numberLessThanJsonPath(runningRef, desiredRef),
    });

    const definition = getInitialCount
      .next(checkStopped
        .when(isStopped, getTarget.next(statusController.render()))
        .otherwise(statusController.success));

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'start-ecs-service',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}