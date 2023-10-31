import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, FieldUtils, JsonPath, Map, Pass, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { HandleResources } from './lib';
import { EvaluateTags } from './lib/evaluate-tags';


export interface ManageRdsInstancesProps extends ResourceManagerBaseProps {}

export class ManageRdsInstances extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageRdsInstancesProps = {}) {
    super(scope, id, props);

    const describeInstances = new CallAwsService(this, 'describe-instances', {
      action: 'describeDBInstances',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resource: 'db',
          resourceName: '*',
          service: 'rds',
        }),
      ],
      resultPath: '$.Available',
      resultSelector: FieldUtils.renderObject({
        Instances: JsonPath.objectAt('$.DbInstances'),
      }),
      service: 'rds',
    });

    const filterInstances = new Map(this, 'filter-instances', {
      itemsPath: '$.Available.Instances',
      resultPath: '$.Available',
      resultSelector: {
        'Instances.$': '$[?(@.Matched==true)].Resource',
      },
    });

    // Don't manage instances in a cluster or instances that don't support
    // stopping per official documentation:
    // https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html#USER_StopInstance.Limitations
    const checkUnsupported = new Choice(this, 'check-unsupported');
    const isUnsupported = Condition.or(
      Condition.and(
        Condition.isPresent('$.DbClusterIdentifier'),
        Condition.isNotNull('$.DbClusterIdentifier'),
      ),
      Condition.and(
        Condition.isPresent('$.ReadReplicaDBInstanceIdentifiers[0]'),
      ),
      Condition.and(
        Condition.isPresent('$.ReadReplicaSourceDBInstanceIdentifier'),
        Condition.isNotNull('$.ReadReplicaSourceDBInstanceIdentifier'),
      ),
      Condition.and(
        Condition.isPresent('$.MultiAZ'),
        Condition.booleanEquals('$.MultiAZ', true),
        Condition.stringMatches('$.Engine', 'sqlserver-*'),
      ),
    );

    const reportMatched = new Pass(this, 'report-matched', {
      parameters: {
        'Matched': true,
        'Resource.$': '$',
      }
    });

    const reportNotMatched = new Pass(this, 'report-not-matched', {
      parameters: {
        'Matched': false,
        'Resource.$': '$',
      }
    });

    filterInstances.iterator(checkUnsupported
      .when(isUnsupported, reportNotMatched)
      .otherwise(reportMatched));

    const evaluateTags = new EvaluateTags(this, 'evaluate-tags', {
      desiredTagsPath: '$.Tags',
      resourcesPath: '$.Available.Instances',
      tagField: 'TagList',
    });

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: FieldUtils.renderObject({
        InstanceId: JsonPath.stringAt('$.DbInstanceIdentifier'),
      }),
      resourceArnField: 'DbInstanceArn',
      resourceType: 'rds-instance',
    });

    const definition = describeInstances
      .next(filterInstances)
      .next(evaluateTags)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-rds-instances',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}