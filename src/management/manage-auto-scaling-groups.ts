import { Resource } from 'aws-cdk-lib';
import { DefinitionBody, JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { BuildFilters, HandleResources } from './lib';


export interface ManageAutoScalingGroupsProps extends ResourceManagerBaseProps {}

export class ManageAutoScalingGroups extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageAutoScalingGroupsProps = {}) {
    super(scope, id, props);

    const buildFilters = new BuildFilters(this, 'build-filters', {
      tagsPath: '$.Tags',
    });

    const describeAutoScalingGroups = new CallAwsService(this, 'describe-auto-scaling-groups', {
      action: 'describeAutoScalingGroups',
      iamResources: [
        '*'
      ],
      parameters: {
        'Filters.$': '$.Filters',
      },
      outputPath: '$.AutoScalingGroups',
      service: 'autoscaling',
    });

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: {
        AutoScalingGroupName: JsonPath.stringAt('$.AutoScalingGroupName'),
      },
      resourceArnField: 'AutoScalingGroupARN',
      resourceType: 'auto-scaling-group',
    });

    const definition = buildFilters
      .next(describeAutoScalingGroups)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-auto-scaling-groups',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}