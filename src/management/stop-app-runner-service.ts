import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Condition, DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';


export interface StopAppRunnerServiceProps extends ResourceManagerBaseProps {}

export class StopAppRunnerService extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StopAppRunnerServiceProps = {}) {
    super(scope, id, props);

    const describeService = new CallAwsService(this, 'describe-service', {
      action: 'describeService',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'service',
          resourceName: '*',
          service: 'apprunner',
        }),
      ],
      parameters: {
        'ServiceArn.$': SfnFn.format(`arn:{}:apprunner:{}:{}:service/{}`, [
          SfnFn.arrayGetItem(SfnFn.stringSplit('$$.Execution.Id', ':'), 1),
          SfnFn.arrayGetItem(SfnFn.stringSplit('$$.Execution.Id', ':'), 3),
          SfnFn.arrayGetItem(SfnFn.stringSplit('$$.Execution.Id', ':'), 4),
          '$.ServiceName',
        ]),
      },
      resultSelector: {
        'ServiceArn.$': '$.Service.ServiceArn',
        'ServiceName.$': '$.Service.ServiceName',
      },
      service: 'apprunner',
    });

    const statusRef = StatusController.statusRef('Status');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.stringEquals(statusRef, 'RUNNING'),
      statusGetter: {
        action: 'describeService',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            resource: 'service',
            resourceName: '*',
            service: 'apprunner',
          }),
        ],
        parameters: {
          'ServiceArn.$': '$.ServiceArn',
        },
        resultSelector: {
          'Status.$': '$.Service.Status',
        },
        service: 'apprunner',
      },
      statusSetter: {
        action: 'pauseService',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            resource: 'service',
            resourceName: '*',
            service: 'apprunner',
          }),
        ],
        parameters: {
          'ServiceArn.$': '$.ServiceArn',
        },
        service: 'apprunner',
      },
      successCondition: Condition.or(
        Condition.stringEquals(statusRef, 'DELETED'),
        Condition.stringEquals(statusRef, 'PAUSED'),
      ),
      unmatchedError: {
        cause: SfnFn.format('Encounted an unknown or inactionable AppRunner service state: {}', [
          statusRef,
        ]),
        error: 'UnsupportedStateError',
      },
      waitCondition: Condition.stringEquals(statusRef, 'OPERATION_IN_PROGRESS'),
    });

    const definition = describeService
      .next(statusController.render());

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'stop-app-runner-service',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}