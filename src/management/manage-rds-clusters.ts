import { ArnFormat, Resource } from 'aws-cdk-lib';
import { DefinitionBody, FieldUtils, JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
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