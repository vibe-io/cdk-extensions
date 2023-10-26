import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StopAutoScalingGroupProps extends ResourceManagerProps {}

export class StopAutoScalingGroup extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StopAutoScalingGroupProps = {}) {
    super(scope, id, props);

    const getInitialCount = new CallAwsService(this, 'get-initial-count', {
      action: 'describeAutoScalingGroups',
      iamResources: [
        '*',
      ],
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

    const checkRunning = new Choice(this, 'check-running');
    const isRunning = Condition.numberGreaterThan('$.Initial.Desired', 0);

    const putState = new CallAwsService(this, 'put-state', {
      action: 'putParameter',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'parameter',
          resourceName: 'scaling/asg/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/asg/{}', [
          '$.AutoScalingGroupName',
        ]),
        'Overwrite': true,
        'Type': 'String',
        'Value.$': SfnFn.jsonToString('$.Initial'),
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
          resourceName: 'scaling/asg/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/asg/{}', [
          '$.AutoScalingGroupName',
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
          resourceName: 'scaling/asg/*',
          service: 'ssm',
        }),
      ],
      parameters: {
        'Name.$': SfnFn.format('/scaling/asg/{}', [
          '$.AutoScalingGroupName',
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
    const runningRef = StatusController.statusRef('Running');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.numberGreaterThan(desiredRef, 0),
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
          'DesiredCapacity': 0,
          'MaxSize': 0,
          'MinSize': 0,
        },
        service: 'autoscaling',
      },
      successCondition: Condition.and(
        Condition.numberEquals(desiredRef, 0),
        Condition.numberEquals(runningRef, 0),
      ),
      waitCondition: Condition.and(
        Condition.numberEquals(desiredRef, 0),
        Condition.numberGreaterThan(runningRef, 0),
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
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}