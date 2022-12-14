import { Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnFlowLog, FlowLogResourceType, FlowLogTrafficType, IFlowLog } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FlowLogsBucket } from '../s3-buckets';
import { FlowLogDestination } from './lib/flow-log-destination';


export enum FlowLogAggregationInterval {
  /**
     * Flow logs will be written at least every 60 seconds.
     */
  ONE_MINUTE = 60,

  /**
     * Flow logs will be written at least every ten minutes.
     */
  TEN_MINUTES = 600
}

export enum FlowLogDataType {
  /**
     * 32 bit signed int.
     */
  INT_32 = 'INT_32',

  /**
     * 64 bit signed int.
     */
  INT_64 = 'INT_64',

  /**
     * UTF-8 encoded character string.
     */
  STRING = 'STRING'
}

export class FlowLogField {
  /**
     * The AWS account ID of the owner of the source network interface for
     * which traffic is recorded. If the network interface is created by an
     * AWS service, for example when creating a VPC endpoint or Network Load
     * Balancer, the record might display unknown for this field.
     */
  public static readonly ACCOUNT_ID: FlowLogField = new FlowLogField('account-id', FlowLogDataType.STRING);

  /**
     * The action that is associated with the traffic:
     *
     * ACCEPT: The recorded traffic was permitted by the security groups and
     * network ACLs.
     * REJECT: The recorded traffic was not permitted by the security groups
     * or network ACLs.
     */
  public static readonly ACTION: FlowLogField = new FlowLogField('action', FlowLogDataType.STRING);

  /**
     * The ID of the Availability Zone that contains the network interface for
     * which traffic is recorded. If the traffic is from a sublocation, the
     * record displays a '-' symbol for this field.
     */
  public static readonly AZ_ID: FlowLogField = new FlowLogField('az-id', FlowLogDataType.STRING);

  /**
     * The number of bytes transferred during the flow.
     */
  public static readonly BYTES: FlowLogField = new FlowLogField('bytes', FlowLogDataType.INT_64);

  /**
     * The destination address for outgoing traffic, or the IPv4 or IPv6
     * address of the network interface for incoming traffic on the network
     * interface. The IPv4 address of the network interface is always its
     * private IPv4 address.
     *
     * See also:
     * {@link FlowLogField.PKT_DSTADDR | PKT_DSTADDR}
     */
  public static readonly DSTADDR: FlowLogField = new FlowLogField('dstaddr', FlowLogDataType.STRING);

  /**
     * The destination port of the traffic.
     */
  public static readonly DSTPORT: FlowLogField = new FlowLogField('dstport', FlowLogDataType.INT_32);

  /**
     * The time, in Unix seconds, when the last packet of the flow was
     * received within the aggregation interval. This might be up to 60
     * seconds after the packet was transmitted or received on the network
     * interface.
     */
  public static readonly END: FlowLogField = new FlowLogField('end', FlowLogDataType.INT_64);

  /**
     * The direction of the flow with respect to the interface where traffic
     * is captured. The possible values are: ingress | egress.
     */
  public static readonly FLOW_DIRECTION: FlowLogField = new FlowLogField('flow-direction', FlowLogDataType.STRING);

  /**
     * The ID of the instance that's associated with network interface for
     * which the traffic is recorded, if the instance is owned by you. Returns
     * a '-' symbol for a requester-managed network interface; for example,
     * the network interface for a NAT gateway.
     *
     * See also:
     * [Request-managed ENI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/requester-managed-eni.html)
     */
  public static readonly INSTANCE_ID: FlowLogField = new FlowLogField('instance-id', FlowLogDataType.STRING);

  /**
     * The ID of the network interface for which the traffic is recorded.
     */
  public static readonly INTERFACE_ID: FlowLogField = new FlowLogField('interface-id', FlowLogDataType.STRING);

  /**
     * The logging status of the flow log:
     *
     * OK: Data is logging normally to the chosen destinations.
     * NODATA: There was no network traffic to or from the network interface
     * during the aggregation interval.
     * SKIPDATA ??? Some flow log records were skipped during the aggregation
     * interval. This might be because of an internal capacity constraint, or
     * an internal error.
     */
  public static readonly LOG_STATUS: FlowLogField = new FlowLogField('log-status', FlowLogDataType.STRING);

  /**
     * The number of packets transferred during the flow.
     */
  public static readonly PACKETS: FlowLogField = new FlowLogField('packets', FlowLogDataType.INT_64);

  /**
     * The name of the subset of IP address ranges for the pkt-dstaddr field,
     * if the destination IP address is for an AWS service. For a list of
     * possible values, see the {@link FlowLogField.PKT_SRC_AWS_SERVICE | PKT_SRC_AWS_SERVICE} field.
     */
  public static readonly PKT_DST_AWS_SERVICE: FlowLogField = new FlowLogField('pkt-dst-aws-service', FlowLogDataType.STRING);

  /**
     * The packet-level (original) destination IP address for the traffic. Use
     * this field with the dstaddr field to distinguish between the IP address
     * of an intermediate layer through which traffic flows, and the final
     * destination IP address of the traffic. For example, when traffic flows
     * through a network interface for a NAT gateway, or where the IP address
     * of a pod in Amazon EKS is different from the IP address of the network
     * interface of the instance node on which the pod is running (for
     * communication within a VPC).
     *
     * See also:
     * [Flow Log Example NAT](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-nat)
     */
  public static readonly PKT_DSTADDR: FlowLogField = new FlowLogField('pkt-dstaddr', FlowLogDataType.STRING);

  /**
     * The name of the subset of IP address ranges for the pkt-srcaddr field,
     * if the source IP address is for an AWS service. The possible values
     * are: AMAZON | AMAZON_APPFLOW | AMAZON_CONNECT | API_GATEWAY |
     * CHIME_MEETINGS | CHIME_VOICECONNECTOR | CLOUD9 | CLOUDFRONT |
     * CODEBUILD | DYNAMODB | EBS | EC2 | EC2_INSTANCE_CONNECT |
     * GLOBALACCELERATOR | KINESIS_VIDEO_STREAMS | ROUTE53 |
     * ROUTE53_HEALTHCHECKS | ROUTE53_HEALTHCHECKS_PUBLISHING |
     * ROUTE53_RESOLVER | S3 | WORKSPACES_GATEWAYS.
     */
  public static readonly PKT_SRC_AWS_SERVICE: FlowLogField = new FlowLogField('pkt-src-aws-service', FlowLogDataType.STRING);

  /**
     * The packet-level (original) source IP address of the traffic. Use this
     * field with the srcaddr field to distinguish between the IP address of
     * an intermediate layer through which traffic flows, and the original
     * source IP address of the traffic. For example, when traffic flows
     * through a network interface for a NAT gateway, or where the IP address
     * of a pod in Amazon EKS is different from the IP address of the network
     * interface of the instance node on which the pod is running (for
     * communication within a VPC).
     *
     * See also:
     * [Flow Log Example NAT](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-nat)
     */
  public static readonly PKT_SRCADDR: FlowLogField = new FlowLogField('pkt-srcaddr', FlowLogDataType.STRING);

  /**
     * The IANA protocol number of the traffic.
     *
     * See also:
     * [Assigned Internet Protocol Numbers](http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml).
     */
  public static readonly PROTOCOL: FlowLogField = new FlowLogField('protocol', FlowLogDataType.INT_32);

  /**
     * The Region that contains the network interface for which traffic is
     * recorded.
     */
  public static readonly REGION: FlowLogField = new FlowLogField('region', FlowLogDataType.STRING);

  /**
     * The source address for incoming traffic, or the IPv4 or IPv6 address of
     * the network interface for outgoing traffic on the network interface.
     * The IPv4 address of the network interface is always its private IPv4
     * address.
     *
     * See also:
     * {@link FlowLogField.PKT_SRCADDR | PKT_SRCADDR}
     */
  public static readonly SRCADDR: FlowLogField = new FlowLogField('srcaddr', FlowLogDataType.STRING);

  /**
     * The source port of the traffic.
     */
  public static readonly SRCPORT: FlowLogField = new FlowLogField('srcport', FlowLogDataType.INT_32);

  /**
     * The time, in Unix seconds, when the first packet of the flow was
     * received within the aggregation interval. This might be up to 60
     * seconds after the packet was transmitted or received on the network
     * interface.
     */
  public static readonly START: FlowLogField = new FlowLogField('start', FlowLogDataType.INT_64);

  /**
     * The ID of the sublocation that contains the network interface for which
     * traffic is recorded. If the traffic is not from a sublocation, the
     * record displays a '-' symbol for this field.
     */
  public static readonly SUBLOCATION_ID: FlowLogField = new FlowLogField('sublocation-id', FlowLogDataType.STRING);

  /**
     * The type of sublocation that's returned in the sublocation-id field.
     * The possible values are: wavelength | outpost | localzone. If the
     * traffic is not from a sublocation, the record displays a '-' symbol
     * for this field.
     *
     * See also:
     * [Wavelength](https://aws.amazon.com/wavelength/)
     * [Outposts](https://docs.aws.amazon.com/outposts/latest/userguide/)
     * [Local Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-local-zones)
     */
  public static readonly SUBLOCATION_TYPE: FlowLogField = new FlowLogField('sublocation-type', FlowLogDataType.STRING);

  /**
     * The ID of the subnet that contains the network interface for which the
     * traffic is recorded.
     */
  public static readonly SUBNET_ID: FlowLogField = new FlowLogField('subnet-id', FlowLogDataType.STRING);

  /**
     * The bitmask value for the following TCP flags:
     *
     * FIN: 1
     * SYN: 2
     * RST: 4
     * PSH: 8
     * ACK: 16
     * SYN-ACK: 18
     * URG: 32
     *
     * When a flow log entry consists of only ACK packets, the flag value is
     * 0, not 16.
     *
     * TCP flags can be OR-ed during the aggregation interval. For short
     * connections, the flags might be set on the same line in the flow log
     * record, for example, 19 for SYN-ACK and FIN, and 3 for SYN and FIN.
     *
     * See also:
     * [TCP Segment Structure](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_segment_structure)
     * [TCP Flag Sequence](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-tcp-flag)
     */
  public static readonly TCP_FLAGS: FlowLogField = new FlowLogField('tcp-flags', FlowLogDataType.INT_32);

  /**
     * The path that egress traffic takes to the destination. To determine
     * whether the traffic is egress traffic, check the flow-direction field.
     * The possible values are as follows. If none of the values apply, the
     * field is set to -.
     *
     * 1: Through another resource in the same VPC
     * 2: Through an internet gateway or a gateway VPC endpoint
     * 3: Through a virtual private gateway
     * 4: Through an intra-region VPC peering connection
     * 5: Through an inter-region VPC peering connection
     * 6: Through a local gateway
     * 7: Through a gateway VPC endpoint (Nitro-based instances only)
     * 8: Through an internet gateway (Nitro-based instances only)
     */
  public static readonly TRAFFIC_PATH: FlowLogField = new FlowLogField('traffic-path', FlowLogDataType.INT_32);

  /**
     * The type of traffic. The possible values are: IPv4 | IPv6 | EFA.
     *
     * See also:
     * [Elastic Fabric Adapter](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html)
     */
  public static readonly TYPE: FlowLogField = new FlowLogField('type', FlowLogDataType.STRING);

  /**
     * The VPC Flow Logs version. If you use the default format, the version
     * is 2. If you use a custom format, the version is the highest version
     * among the specified fields. For example, if you specify only fields
     * from version 2, the version is 2. If you specify a mixture of fields
     * from versions 2, 3, and 4, the version is 4.
     */
  public static readonly VERSION: FlowLogField = new FlowLogField('version', FlowLogDataType.INT_32);

  /**
     * The ID of the VPC that contains the network interface for which the
     * traffic is recorded.
     */
  public static readonly VPC_ID: FlowLogField = new FlowLogField('vpc-id', FlowLogDataType.STRING);


  /**
     * The name of the Flow Log field, as it should be used when building a
     * format string.
     */
  public readonly name: string;

  /**
     * The data type of the field as it would appear in Parquet. For
     * information on the type for various files, see documentation on the
     * [available fields](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html#flow-logs-fields).
     */
  public readonly type: FlowLogDataType;

  /**
     * Creates a new instance of the FlowLogField class.
     *
     * @param name The name of the Flow Log field, as it should be used when
     * building a format string.
     * @param type The data type of the field as it would appear in Parquet.
     * For information on the type for various files, see documentation on the
     * [available fields](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html#flow-logs-fields).
     */
  constructor(name: string, type: FlowLogDataType) {
    this.name = name;
    this.type = type;
  }
}

export class FlowLogFormat {
  /**
     * The basic set of fields included in most flow logs. This is the default
     * format that is used when new flow logs are created without specifying a
     * custom format.
     */
  public static readonly V2: FlowLogFormat = new FlowLogFormat(
    FlowLogField.VERSION,
    FlowLogField.ACCOUNT_ID,
    FlowLogField.INTERFACE_ID,
    FlowLogField.SRCADDR,
    FlowLogField.DSTADDR,
    FlowLogField.SRCPORT,
    FlowLogField.DSTPORT,
    FlowLogField.PROTOCOL,
    FlowLogField.PACKETS,
    FlowLogField.BYTES,
    FlowLogField.START,
    FlowLogField.END,
    FlowLogField.ACTION,
    FlowLogField.LOG_STATUS,
  );

  /**
     * Includes all the fields available in V2. Adds fields to help identify
     * AWS resources associated with traffic as well as fields that give
     * greater visibility into protocol specific details.
     */
  public static readonly V3: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V2.fields,
    FlowLogField.VPC_ID,
    FlowLogField.SUBNET_ID,
    FlowLogField.INSTANCE_ID,
    FlowLogField.TCP_FLAGS,
    FlowLogField.TYPE,
    FlowLogField.PKT_SRCADDR,
    FlowLogField.PKT_DSTADDR,
  );

  /**
     * Includes all the fields available in V3. Adds fields for identifying
     * the region and availabilty zone associated with flows, as well as
     * details related to extended zones such as Wavelength, Outputs, and
     * Local Zones.
     */
  public static readonly V4: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V3.fields,
    FlowLogField.REGION,
    FlowLogField.AZ_ID,
    FlowLogField.SUBLOCATION_TYPE,
    FlowLogField.SUBLOCATION_ID,
  );

  /**
     * Includes all the fields available in V4. Adds fields to help identify
     * related AWS services and improve visibility into packet routing.
     */
  public static readonly V5: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V4.fields,
    FlowLogField.PKT_SRC_AWS_SERVICE,
    FlowLogField.PKT_DST_AWS_SERVICE,
    FlowLogField.FLOW_DIRECTION,
    FlowLogField.TRAFFIC_PATH,
  );


  /**
     * The fields that make up the flow log format, in the order that they
     * should appear in the log entries.
     */
  public readonly fields: FlowLogField[];

  /**
     * The rendered format string in the format expected by AWS when creating
     * a new Flow Log.
     */
  public readonly template: string;

  /**
     * Creates a new instance of the FlowLogFormat class.
     *
     * @param fields The fields that should be included in the flow log output.
     */
  constructor(...fields: FlowLogField[]) {
    this.fields = fields;

    this.template = Lazy.uncachedString({
      produce: () => {
        return this.fields.map((x) => {
          return `\${${x.name}}`;
        }).join(' ');
      },
    });
  }

  /**
     * Adds a new field to the flow log output. New fields are added at the
     * end of a log entry after all the other fields that came before it.
     *
     * @param field The field to add to the FlowLogFormat.
     */
  public addField(field: FlowLogField): void {
    this.fields.push(field);
  }
}


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
     * The fields to include in the flow log record, in the order in which they
     * should appear. For a list of available fields, see {@link FlowLogField}.
     *
     * @see [FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)
     *
     * @group Inputs
     */
  readonly format?: FlowLogFormat;

  /**
     * The maximum interval of time during which a flow of packets is captured
     * and aggregated into a flow log record.
     *
     * @see [FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)
     *
     * @group Inputs
     */
  readonly maxAggregationInterval?: FlowLogAggregationInterval;

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

export class FlowLog extends Resource implements IFlowLog {
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
     * The fields to include in the flow log record, in the order in which they
     * should appear. For a list of available fields, see {@link FlowLogField}.
     *
     * @see [FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)
     *
     * @group Inputs
     */
  public readonly format: FlowLogFormat;

  /**
     * The maximum interval of time during which a flow of packets is captured
     * and aggregated into a flow log record.
     *
     * @see [FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)
     *
     * @group Inputs
     */
  public readonly maxAggregationInterval?: FlowLogAggregationInterval;

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
     * The Amazon Resource Name (ARN) of the flow log.
     */
  public readonly flowLogArn: string;

  /**
     * The ID of the flow log.
     */
  public readonly flowLogId: string;


  /**
     * Creates a new instance of the FlowLog class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: IConstruct, id: string, props: FlowLogProps) {
    super(scope, id);

    this.format = props.format ?? FlowLogFormat.V2;
    this.maxAggregationInterval = props.maxAggregationInterval;
    this.resourceType = props.resourceType;
    this.trafficType = props.trafficType ?? FlowLogTrafficType.ALL;

    this.destination = props.destination ?? FlowLogDestination.toS3(
      new FlowLogsBucket(this, 'bucket', {
        format: this.format,
        bucketName: Names.uniqueId(this).toLowerCase(),
      }),
    );

    const resolvedDestination = this.destination.bind(this);

    this.resource = new CfnFlowLog(this, 'Resource', {
      deliverLogsPermissionArn: resolvedDestination.role?.roleArn,
      destinationOptions: resolvedDestination.destinationOptions,
      logDestination: resolvedDestination.s3Path,
      logDestinationType: resolvedDestination.destinationType,
      logFormat: this.format.template,
      logGroupName: resolvedDestination.logGroup?.logGroupName,
      maxAggregationInterval: this.maxAggregationInterval,
      resourceId: this.resourceType.resourceId,
      resourceType: this.resourceType.resourceType,
      trafficType: this.trafficType,
    });

    this.flowLogArn = this.stack.formatArn({
      resource: 'vpc-flow-log',
      resourceName: this.resource.ref,
      service: 'ec2',
    });
    this.flowLogId = this.resource.ref;
  }
}
