import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, Fail, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StartEc2InstanceProps extends ResourceManagerBaseProps {}

export class StartEc2Instance extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StartEc2InstanceProps = {}) {
    super(scope, id, props);

    const getAutoScalingTags = new CallAwsService(this, 'get-auto-scaling-tags', {
      action: 'describeTags',
      iamResources: [
        '*'
      ],
      parameters: {
        'Filters': [
          {
            'Name': 'resource-id',
            'Values.$': SfnFn.array('$.InstanceId'),
          },
          {
            'Name': 'resource-type',
            'Values': [
              'instance',
            ]
          },
          {
            'Name': 'key',
            'Values': [
              'aws:autoscaling:groupName',
            ],
          },
        ],
      },
      resultPath: '$.AutoScaling',
      resultSelector: {
        'TagCount.$': SfnFn.arrayLength('$.Tags'),
      },
      service: 'ec2',
    });

    const checkAutoScaling = new Choice(this, 'check-auto-scaling');
    const isAutoScalingCondition = Condition.numberGreaterThan('$.AutoScaling.TagCount', 0);

    const notSupported = new Fail(this, 'not-supported', {
      cause: 'The instance is part of an Auto Scaling Group. It should be managed via the Auto Scaling Group itself.',
      error: 'NotSupportedError',
    });

    const stateRef = StatusController.statusRef('State');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.stringEquals(stateRef, 'stopped'),
      statusGetter: {
        action: 'describeInstances',
        iamResources: [
          '*',
        ],
        parameters: {
          'InstanceIds.$': SfnFn.array('$.InstanceId'),
        },
        resultSelector: {
          'State.$': '$.Reservations[0].Instances[0].State.Name',
        },
        service: 'ec2',
      },
      statusSetter: {
        action: 'startInstances',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            resource: 'instance',
            resourceName: '*',
            service: 'ec2',
          }),
        ],
        parameters: {
          'InstanceIds.$': SfnFn.array('$.InstanceId'),
        },
        service: 'ec2',
      },
      successCondition: Condition.or(
        Condition.stringEquals(stateRef, 'running'),
        Condition.stringEquals(stateRef, 'shutting-down'),
        Condition.stringEquals(stateRef, 'terminated'),
      ),
      unmatchedError: {
        cause: SfnFn.format('Unknown EC2 instance state encountered: {}', [
          stateRef,
        ]),
        error: 'UnknownStateError',
      },
      waitCondition: Condition.or(
        Condition.stringEquals(stateRef, 'pending'),
        Condition.stringEquals(stateRef, 'stopping'),
      ),
    });

    const definition = getAutoScalingTags
      .next(checkAutoScaling
        .when(isAutoScalingCondition, notSupported)
        .otherwise(statusController.render()));

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'start-ec2-instance',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}