import { ArnFormat, Resource } from 'aws-cdk-lib';
import { DefinitionBody, FieldUtils, JsonPath, Map, Pass, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { HandleResources } from './lib';
import { EvaluateTags } from './lib/evaluate-tags';


export interface ManageAppRunnerServicesProps extends ResourceManagerBaseProps {}

export class ManageAppRunnerServices extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageAppRunnerServicesProps = {}) {
    super(scope, id, props);

    const listServices = new CallAwsService(this, 'list-services', {
      action: 'listServices',
      iamResources: [
        '*',
      ],
      resultPath: '$.Available',
      resultSelector: FieldUtils.renderObject({
        Services: JsonPath.objectAt('$.ServiceSummaryList'),
      }),
      service: 'apprunner',
    });

    const iterateServices = new Map(this, 'iterateServices', {
      itemsPath: '$.Available.Services',
      resultPath: '$.Available.Services',
    });

    const getTags = new CallAwsService(this, 'get-tags', {
      action: 'listTagsForResource',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'service',
          resourceName: '*',
          service: 'apprunner',
        }),
      ],
      parameters: FieldUtils.renderObject({
        ResourceArn: JsonPath.stringAt('$.ServiceArn'),
      }),
      resultPath: '$.Tags',
      resultSelector: FieldUtils.renderObject({
        List: JsonPath.objectAt('$.Tags'),
      }),
      service: 'apprunner',
    });

    const mergeTags = new Pass(this, 'merge-tags', {
      parameters: FieldUtils.renderObject({
        ServiceArn: JsonPath.stringAt('$.ServiceArn'),
        ServiceName: JsonPath.stringAt('$.ServiceName'),
        Tags: JsonPath.stringAt('$.Tags.List'),
      }),
    });

    iterateServices.iterator(getTags
      .next(mergeTags));

    const evaluateTags = new EvaluateTags(this, 'evaluate-tags', {
      desiredTagsPath: '$.Tags',
      resourcesPath: '$.Available.Services',
      tagField: 'Tags',
    });

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: FieldUtils.renderObject({
        ServiceName: JsonPath.stringAt('$.ServiceName'),
      }),
      resourceArnField: 'ServiceArn',
      resourceType: 'app-runner-service',
    });

    const definition = listServices
      .next(iterateServices)
      .next(evaluateTags)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-app-runner-services',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}