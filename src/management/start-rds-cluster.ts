import { ArnFormat, Duration, Resource } from 'aws-cdk-lib';
import { Condition, DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { ResourceManagerProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { StatusController } from './lib/status-controller';


export interface StartRdsClusterProps extends ResourceManagerProps {}

export class StartRdsCluster extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: StartRdsClusterProps = {}) {
    super(scope, id, props);

    const statusRef = StatusController.statusRef('Status');
    const statusController = new StatusController(this, 'status-controller', {
      pollDelay: Duration.seconds(60),
      readyCondition: Condition.stringEquals(statusRef, 'stopped'),
      statusGetter: {
        action: 'describeDBClusters',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'cluster',
            resourceName: '*',
            service: 'rds',
          }),
        ],
        parameters: {
          'DbClusterIdentifier.$': '$.ClusterId',
        },
        resultSelector: {
          'Status.$': '$.DbClusters[0].Status',
        },
        service: 'rds',
      },
      statusSetter: {
        action: 'startDBCluster',
        iamResources: [
          this.stack.formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'cluster',
            resourceName: '*',
            service: 'rds',
          }),
        ],
        parameters: {
          'DbClusterIdentifier.$': '$.ClusterId',
        },
        service: 'rds',
      },
      successCondition: Condition.or(
        Condition.stringEquals(statusRef, 'available'),
        Condition.stringEquals(statusRef, 'deleting'),
      ),
      unmatchedError: {
        cause: SfnFn.format('Unsupported RDS cluster state encountered: {}', [
          statusRef,
        ]),
        error: 'UnsupportedStateError',
      },
      waitCondition: Condition.or(
        Condition.stringEquals(statusRef, 'backing-up'),
        Condition.stringEquals(statusRef, 'backtracking'),
        Condition.stringEquals(statusRef, 'creating'),
        Condition.stringEquals(statusRef, 'failing-over'),
        Condition.stringEquals(statusRef, 'maintenance'),
        Condition.stringEquals(statusRef, 'migrating'),
        Condition.stringEquals(statusRef, 'modifying'),
        Condition.stringEquals(statusRef, 'promoting'),
        Condition.stringEquals(statusRef, 'renaming'),
        Condition.stringEquals(statusRef, 'resetting-master-credentials'),
        Condition.stringEquals(statusRef, 'starting'),
        Condition.stringEquals(statusRef, 'stopping'),
        Condition.stringEquals(statusRef, 'storage-optimization'),
        Condition.stringEquals(statusRef, 'update-iam-db-auth'),
        Condition.stringEquals(statusRef, 'upgrading'),
      ),
    });

    const definition = statusController.render()

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}