import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, Fail, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StopRdsInstanceProps extends ResourceManagerProps {}

export class StopRdsInstance extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StopRdsInstanceProps = {}) {
    super(scope, id, props);

    const describeInstance = new CallAwsService(this, 'call-aws-service', {
      action: 'describeDBInstances',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resource: 'db',
          resourceName: '*',
          service: 'rds',
        }),
      ],
      parameters: {
        'DbInstanceIdentifier.$': '$.InstanceId',
      },
      resultPath: '$.Instance',
      service: 'rds',
    });

    const checkCluster = new Choice(this, 'check-cluster');
    const isCluster = Condition.and(
      Condition.isPresent('$.Instance.Details.DbClusterIdentifier'),
      Condition.isNotNull('$.Instance.Details.DbClusterIdentifier'),
    );

    const statusRef = StatusController.statusRef('Status');
    const statusController = new StatusController(this, 'status-controller', {
      readyCondition: Condition.or(
        Condition.stringEquals(statusRef, 'available'),
        Condition.stringEquals(statusRef, 'storage-full'),
      ),
      statusGetter: {
        action: 'describeDBInstances',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'db',
            resourceName: '*',
            service: 'rds',
          }),
        ],
        parameters: {
          'DbInstanceIdentifier.$': '$.InstanceId',
        },
        resultSelector: {
          'Status.$': '$.DbInstances[0].DbInstanceStatus',
        },
        service: 'rds',
      },
      statusSetter: {
        action: 'stopDBInstance',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'db',
            resourceName: '*',
            service: 'rds',
          }),
        ],
        parameters: {
          'DbInstanceIdentifier.$': '$.InstanceId',
        },
        service: 'rds',
      },
      successCondition: Condition.or(
        Condition.stringEquals(statusRef, 'deleting'),
        Condition.stringEquals(statusRef, 'stopped'),
      ),
      unmatchedError: {
        cause: SfnFn.format('Unsupported RDS instance state encountered: {}', [
          statusRef,
        ]),
        error: 'UnsupportedStateError',
      },
      waitCondition: Condition.or(
        Condition.stringEquals(statusRef, 'backing-up'),
        Condition.stringEquals(statusRef, 'configuring-enhanced-monitoring'),
        Condition.stringEquals(statusRef, 'configuring-iam-database-auth'),
        Condition.stringEquals(statusRef, 'configuring-log-exports'),
        Condition.stringEquals(statusRef, 'converting-to-vpc'),
        Condition.stringEquals(statusRef, 'creating'),
        Condition.stringEquals(statusRef, 'delete-precheck'),
        Condition.stringEquals(statusRef, 'maintenance'),
        Condition.stringEquals(statusRef, 'modifying'),
        Condition.stringEquals(statusRef, 'moving-to-vpc'),
        Condition.stringEquals(statusRef, 'rebooting'),
        Condition.stringEquals(statusRef, 'resetting-master-credentials'),
        Condition.stringEquals(statusRef, 'renaming'),
        Condition.stringEquals(statusRef, 'restore-error'),
        Condition.stringEquals(statusRef, 'starting'),
        Condition.stringEquals(statusRef, 'stopping'),
        Condition.stringEquals(statusRef, 'storage-optimization'),
        Condition.stringEquals(statusRef, 'upgrading'),
      ),
    });

    const notSupported = new Fail(this, 'not-supported', {
      cause: 'The instance is part of a database cluster. It should be managed via the cluster itself.',
      error: 'NotSupportedError',
    });

    const definition = describeInstance
      .next(checkCluster
        .when(isCluster, notSupported)
        .otherwise(statusController.render()));

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}