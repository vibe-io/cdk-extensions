import { CfnResource, Lazy, Names, ResourceProps, Stack, Stage } from 'aws-cdk-lib';
import { CfnFlowLog, FlowLogDestination, FlowLogMaxAggregationInterval, FlowLogResourceType, FlowLogTrafficType, LogFormat } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { FlowLogFormat } from '.';
import { FlowLogsBucket } from '../s3-buckets';


/**
 * Configuration for the FlowLog class.
 */
export interface FlowLogProps extends ResourceProps {
  /**
   * The location where flow logs should be delivered.
   *
   * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
   * @see [FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)
   *
   * @group Inputs
   */
  readonly destination?: FlowLogDestination;

  /**
   * The name of the FlowLog.
   *
   * @group Inputs
   */
  readonly flowLogName?: string;

  /**
   * The fields to include in the flow log record, in the order in which they
   * should appear.
   *
   * @see [FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)
   *
   * @group Inputs
   */
  readonly logFormat?: FlowLogFormat;

  /**
   * The maximum interval of time during which a flow of packets is captured
   * and aggregated into a flow log record.
   *
   * @see [FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)
   *
   * @group Inputs
   */
  readonly maxAggregationInterval?: FlowLogMaxAggregationInterval;

  /**
   * Details for the resource from which flow logs will be captured.
   *
   * @see [FlowLog ResourceId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourceid)
   * @see [FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype)
   *
   * @group Inputs
   */
  readonly resourceType: FlowLogResourceType;

  /**
   * The type of traffic to monitor (accepted traffic, rejected traffic, or
   * all traffic).
   *
   * @see [FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype)
   *
   * @group Inputs
   */
  readonly trafficType?: FlowLogTrafficType;
}

export class FlowLog extends ec2.FlowLog {
  /**
   * The location where flow logs should be delivered.
   *
   * @see [FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)
   * @see [FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)
   *
   * @group Inputs
   */
  public readonly destination: FlowLogDestination;

  /**
   * The name of the FlowLog.
   *
   * @group Inputs
   */
  public readonly flowLogName?: string;

  /**
   * The fields to include in the flow log record, in the order in which they
   * should appear.
   *
   * @see [FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)
   *
   * @group Inputs
   */
  public readonly logFormat: FlowLogFormat;

  /**
   * The maximum interval of time during which a flow of packets is captured
   * and aggregated into a flow log record.
   *
   * @see [FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)
   *
   * @group Inputs
   */
  public readonly maxAggregationInterval?: FlowLogMaxAggregationInterval;

  /**
   * Details for the resource from which flow logs will be captured.
   *
   * @see [FlowLog ResourceId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourceid)
   * @see [FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype)
   *
   * @group Inputs
   */
  public readonly resourceType: FlowLogResourceType;

  /**
   * The type of traffic to monitor (accepted traffic, rejected traffic, or
   * all traffic).
   *
   * @see [FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype)
   *
   * @group Inputs
   */
  public readonly trafficType: FlowLogTrafficType;


  /**
   * The underlying FlowLog CloudFormation resource.
   *
   * @see [AWS::EC2::FlowLog](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html)
   *
   * @group Resources
   */
  public readonly resource: CfnFlowLog;


  /**
   * Creates a new instance of the FlowLog class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  constructor(scope: IConstruct, id: string, props: FlowLogProps) {
    const makeProxyBucket = () => {
      const proxyId = `bucket-proxy::${scope.node.addr}::${id}`;
      return Bucket.fromBucketName(Stack.of(scope), proxyId, Lazy.string({
        produce: () => {
          const bucket = this.node.findChild('bucket') as IBucket;
          return bucket.bucketName;
        },
      }));
    };

    const format = props.logFormat ?? FlowLogFormat.V2;
    const destination = props.destination ?? FlowLogDestination.toS3(makeProxyBucket());

    super(scope, id, {
      destination: destination,
      flowLogName: props.flowLogName,
      logFormat: [
        LogFormat.custom(Lazy.string({
          produce: () => {
            return format.template;
          },
        })),
      ],
      maxAggregationInterval: props.maxAggregationInterval,
      resourceType: props.resourceType,
      trafficType: props.trafficType,
    });

    if (!props.destination) {
      new FlowLogsBucket(this, 'bucket', {
        format: format,
        bucketName: Names.uniqueId(this).toLowerCase(),
      });
    }

    this.destination = destination;
    this.flowLogName = props.flowLogName;
    this.logFormat = format;
    this.maxAggregationInterval = props.maxAggregationInterval;
    this.resourceType = props.resourceType;
    this.trafficType = props.trafficType ?? FlowLogTrafficType.ALL;

    this.resource = this.node.defaultChild as CfnFlowLog;

    // The CDK implementation of flow logs adds dependencies that could be
    // invalid when references are made across stages. We need to remove them
    // to prevent errors.
    this.resource.obtainDependencies().forEach((x) => {
      if (Stage.of(x) !== Stage.of(this) && CfnResource.isCfnResource(x)) {
        this.resource.removeDependency(x);
      }
    });
  }
}
