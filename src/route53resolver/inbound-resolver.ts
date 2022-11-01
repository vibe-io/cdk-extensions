import { ResourceProps } from 'aws-cdk-lib';
import { IVpc, Peer, Port, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ResolverEndpointBase } from './resolver-endpoint-base';


/**
 * Configuration for the Inbound Resolver resource.
 */
export interface InboundResolverProps extends ResourceProps {
  /**
     * A list of CIDR ranges that the Inbound Resolver allows to connect to it to make DNS queries.
     *
     * @default InboundResolver.DEFAULT_INBOUND_CIDRS
     */
  readonly inboundCidrs?: string[];

  /**
     * The selection criteria to use to determine which subnets in a VPC resolver endpoints should be
     * created in. As a matter of best practice, at least 3 subnets in different availablity zones should
     * be used.
     */
  readonly subnets: SubnetSelection;

  /**
     * The VPC where the resolver endpoints should be created.
     */
  readonly vpc: IVpc;
}

export class InboundResolver extends ResolverEndpointBase {
  // Static properties
  /**
   * By default allows outbound to all RFC1918 ranges.
   */
  public static readonly DEFAULT_INBOUND_CIDRS: string[] = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
  ];
  public static readonly DIRECTION: string = 'INBOUND';
  public static readonly SUBNET_OFFSET: number = 4;

  // Input properties
  public readonly inboundCidrs: string[];


  /**
     * Creates a new instance of the InboundResolver class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: InboundResolverProps) {
    super(scope, id, {
      ...props,
      direction: InboundResolver.DIRECTION,
      subnetOffset: InboundResolver.SUBNET_OFFSET,
    });

    this.inboundCidrs = props.inboundCidrs ?? InboundResolver.DEFAULT_INBOUND_CIDRS;

    for (let cidr of this.inboundCidrs) {
      this.securityGroup.addIngressRule(Peer.ipv4(cidr), Port.tcp(53), `TCP DNS from ${cidr}`);
      this.securityGroup.addIngressRule(Peer.ipv4(cidr), Port.udp(53), `UDP DNS from ${cidr}`);
    }
  }
}