import { ArnFormat, Resource } from 'aws-cdk-lib';
import { DefinitionBody, FieldUtils, JsonPath, Map, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { HandleResources } from './lib';
import { EvaluateTags } from './lib/evaluate-tags';


export interface ManageEcsServicesProps extends ResourceManagerBaseProps {}

export class ManageEcsServices extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageEcsServicesProps = {}) {
    super(scope, id, props);

    const listClusters = new CallAwsService(this, 'list-clusters', {
      action: 'listClusters',
      iamResources: [
        '*',
      ],
      resultPath: '$.Clusters',
      resultSelector: {
        'Arns.$': '$.ClusterArns'
      },
      service: 'ecs',
    });

    const iterateClusters = new Map(this, 'iterate-clusters', {
      itemsPath: '$.Clusters.Arns',
      resultSelector: {
        'Services.$': '$[*][?(@.Tags)]',
      },
      resultPath: '$.Available',
      parameters: {
        'ClusterArn.$': '$$.Map.Item.Value',
      },
    });

    const listServices = new CallAwsService(this, 'list-services', {
      action: 'listServices',
      iamResources: [
        '*',
      ],
      parameters: {
        'Cluster.$': '$.ClusterArn',
      },
      resultPath: '$.Services',
      resultSelector: {
        'Arns.$': '$.ServiceArns',
      },
      service: 'ecs',
    });

    const iterateServices = new Map(this, 'iterate-services', {
      itemsPath: '$.Services.Arns',
      parameters: {
        'ClusterArn.$': '$.ClusterArn',
        'ServiceArn.$': '$$.Map.Item.Value',
      },
    });

    const describeService = new CallAwsService(this, 'describe-service', {
      action: 'describeServices',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'service',
          resourceName: '*',
          service: 'ecs',
        }),
      ],
      outputPath: '$.Services[0]',
      parameters: {
        'Cluster.$': '$.ClusterArn',
        'Include': [
          'TAGS',
        ],
        'Services.$': 'States.Array($.ServiceArn)',
      },
      service: 'ecs',
    });

    iterateServices.iterator(describeService);

    iterateClusters.iterator(listServices
      .next(iterateServices));

    const evaluateTags = new EvaluateTags(this, 'evaluate-tags', {
      desiredTagsPath: '$.Tags',
      resourcesPath: '$.Available.Services',
      tagField: 'Tags',
    });

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: FieldUtils.renderObject({
        ClusterName: JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.stringAt('$.ClusterArn'), '/'), 1),
        ServiceName: JsonPath.stringAt('$.ServiceName'),
      }),
      resourceArnField: 'ServiceArn',
      resourceType: 'ecs-service',
    });

    const definition = listClusters
      .next(iterateClusters)
      .next(evaluateTags)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-ecs-services',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}