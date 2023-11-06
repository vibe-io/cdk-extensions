import { ArnFormat, Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, FieldUtils, JsonPath, Map, Pass, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { HandleResources } from './lib';
import { EvaluateTags } from './lib/evaluate-tags';


export interface ManageRdsClustersProps extends ResourceManagerBaseProps {}

export class ManageRdsClusters extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageRdsClustersProps = {}) {
    super(scope, id, props);

    const describeClusters = new CallAwsService(this, 'describe-clusters', {
      action: 'describeDBClusters',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resource: 'cluster',
          resourceName: '*',
          service: 'rds',
        }),
      ],
      resultPath: '$.Available',
      resultSelector: FieldUtils.renderObject({
        Clusters: JsonPath.objectAt('$.DbClusters'),
      }),
      service: 'rds',
    });

    const filterClusters = new Map(this, 'filter-clusters', {
      itemsPath: '$.Available.Clusters',
      resultPath: '$.Available',
      resultSelector: {
        'Clusters.$': '$[?(@.Matched==true)].Resource',
      },
    });

    // Don't manage clusters that don't support stopping per official
    // documentation:
    // https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-cluster-stop-start.html#aurora-cluster-stop-limitations
    const checkUnsupported = new Choice(this, 'check-unsupported');
    const isUnsupported = Condition.and(
      Condition.isPresent('$.EngineMode'),
      Condition.stringEquals('$.EngineMode', 'serverless'),
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

    filterClusters.iterator(checkUnsupported
      .when(isUnsupported, reportNotMatched)
      .otherwise(reportMatched));

    const evaluateTags = new EvaluateTags(this, 'evaluate-tags', {
      desiredTagsPath: '$.Tags',
      resourcesPath: '$.Available.Clusters',
      tagField: 'TagList',
    });

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: FieldUtils.renderObject({
        ClusterId: JsonPath.stringAt('$.DbClusterIdentifier'),
      }),
      resourceArnField: 'DbClusterArn',
      resourceType: 'rds-cluster',
    });

    const definition = describeClusters
      .next(filterClusters)
      .next(evaluateTags)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-rds-clusters',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}