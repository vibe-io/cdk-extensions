import { Resource } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, JsonPath, Map, Pass, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { ResourceManagerBaseProps } from './lib/inputs';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { resolveLogging } from './lib/logging';
import { SfnFn } from '../stepfunctions';
import { BuildFilters, HandleResources } from './lib';


export interface ManageEc2InstancesProps extends ResourceManagerBaseProps {}

export class ManageEc2Instances extends Resource {
  public readonly logGroup?: ILogGroup;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: ManageEc2InstancesProps = {}) {
    super(scope, id, props);

    const buildFilters = new BuildFilters(this, 'build-filters', {
      tagsPath: '$.Tags',
    });

    const describeInstances = new CallAwsService(this, 'describe-instances', {
      action: 'describeInstances',
      iamResources: [
        '*'
      ],
      parameters: {
        'Filters.$': '$.Filters',
      },
      resultSelector: {
        'Instances.$': '$.Reservations[*].Instances[*]',
      },
      service: 'ec2',
    });

    const filterResources = new Map(this, 'filter-resources', {
      itemsPath: '$.Instances',
      parameters: {
        'Instance.$': '$$.Map.Item.Value',
      },
      outputPath: '$[?(@.Matched==true)]',
    });

    const extractAutoScaling = new Pass(this, 'extract-auto-scaling', {
      parameters: {
        'TagCount.$': SfnFn.arrayLength("$.Instance.Tags[?(@.Key=='aws:autoscaling:groupName')]"),
      },
      resultPath: '$.AutoScaling',
    });

    const checkAutoScaling = new Choice(this, 'check-auto-scaling');
    const isAutoScalingCondition = Condition.numberGreaterThan('$.AutoScaling.TagCount', 0);

    const resourceArn = SfnFn.format('arn:{}:ec2:{}:{}:instance/{}', [
      SfnFn.partition(),
      SfnFn.region(),
      SfnFn.account(),
      '$.Instance.InstanceId',
    ]);

    const reportMatched = new Pass(this, 'report-matched', {
      parameters: {
        'ResourceArn.$': resourceArn,
        'ResourceId.$': '$.Instance.InstanceId',
        'Matched': true,
      }
    });

    const reportUnmatched = new Pass(this, 'report-unmatched', {
      parameters: {
        'ResourceArn.$': resourceArn,
        'ResourceId.$': '$.Instance.InstanceId',
        'Matched': false,
      }
    });

    filterResources.iterator(extractAutoScaling
      .next(checkAutoScaling
        .when(isAutoScalingCondition, reportUnmatched)
        .otherwise(reportMatched)));

    const handleResources = new HandleResources(this, 'handle-resources', {
      itemsPath: '$',
      childInput: {
        InstanceId: JsonPath.stringAt('$.ResourceId'),
      },
      resourceArnField: 'ResourceArn',
      resourceType: 'ec2-instance',
    });

    const definition = buildFilters
      .next(describeInstances)
      .next(filterResources)
      .next(handleResources);

    const logging = resolveLogging(this, props.logging);
    this.logGroup = logging?.destination;

    this.stateMachine = new StateMachine(this, 'Resource', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: logging,
      stateMachineName: 'manage-ec2-instances',
      tracingEnabled: props.tracingEnabled ?? true,
    });
  }
}