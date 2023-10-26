import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StartAutoScalingGroupProps extends ResourceManagerProps {}

export class StartAutoScalingGroup extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StartAutoScalingGroupProps = {}) {
    super(scope, id, props);

    const getInitialCount = new CallAwsService(this, 'get-initial-count', {
      action: 'describeAutoScalingGroups',
      iamResources: [],
      parameters: {
        'AutoScalingGroupNames.$': SfnFn.array('$.AutoScalingGroupName'),
      },
      resultPath: '$.Initial',
      resultSelector: {
        'Desired.$': '$.AutoScalingGroups[0].DesiredCapacity',
        'Max.$': '$.AutoScalingGroups[0].MaxSize',
        'Min.$': '$.AutoScalingGroups[0].MinSize',
      },
      service: 'autoscaling',
    });

    const checkStopped = new Choice(this, 'check-stopped');
    const isStopped = Condition.numberEquals('$.Initial.Desired', 0);

    const getTarget = new CallAwsService(this, 'get-target', {
      action: 'getParameter',
      iamResources: [],
      parameters: {
        'Name.$': SfnFn.format('/scaling/asg/{}', [
          '$.AutoScalingGroupName'
        ]),
      },
      resultPath: '$.Target',
      resultSelector: {
        'Settings.$': SfnFn.stringToJson('$.Parameter.Value'),
      },
      service: 'ssm',
    });

    const desiredRef = StatusController.statusRef('Desired');
    const runningRef = StatusController.statusRef('Running');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.numberEquals(desiredRef, 0),
      statusGetter: {
        action: 'describeAutoScalingGroups',
        iamResources: [
          '*',
        ],
        parameters: {
          'AutoScalingGroupNames.$': SfnFn.array('$.AutoScalingGroupName'),
        },
        resultSelector: {
          'Desired.$': '$.AutoScalingGroups[0].DesiredCapacity',
          'Running.$': SfnFn.arrayLength("$.AutoScalingGroups[0].Instances[?(@.LifecycleState!='Standby')]")
        },
        service: 'autoscaling',
      },
      statusSetter: {
        action: 'updateAutoScalingGroup',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'autoScalingGroup',
            resourceName: '*',
            service: 'autoscaling',
          }),
        ],
        parameters: {
          'AutoScalingGroupName.$': '$.AutoScalingGroupName',
          'DesiredCapacity.$': '$.Target.Settings.Desired',
          'MaxSize.$': '$.Target.Settings.Max',
          'MinSize.$': '$.Target.Settings.Min',
        },
        service: 'autoscaling',
      },
      successCondition: Condition.and(
        Condition.numberGreaterThan(desiredRef, 0),
        Condition.numberGreaterThanEqualsJsonPath(runningRef, desiredRef),
      ),
      waitCondition: Condition.and(
        Condition.numberGreaterThan(desiredRef, 0),
        Condition.numberLessThanJsonPath(runningRef, desiredRef),
      ),
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
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}