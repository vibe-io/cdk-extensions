import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IVpc, SecurityGroup, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { CfnResolverEndpoint } from 'aws-cdk-lib/aws-route53resolver';
import { Construct } from 'constructs';
import { dot2num, num2dot } from '../../utils/networking';


/**
 * The configuration that determines the function of the Route 53 being created
 */
export enum DemoAccessibility {
  /**
     * Create an inbound resolver. The inbound resolver allows connections from outside of the VPC to
     * resolve DNS queries using the VPC's internal resolver.
     */
  INBOUND = 'INBOUND',

  /**
     * Create an outbound resolver. The outbound resolver allows the VPC's internal resolver to make
     * DNS queries to external DNS endpoints based on domain.
     */
  OUTBOUND = 'OUTBOUND'
}

/**
 * Generic configuration for a Resolver Endpoint resource
 */
export interface ResolverEndpointBaseProps extends ResourceProps {
  /**
     * Determins the functionality of the resolver. An ininbound resolvder allows external services to
     * make queries agains the VPC's internal resolver. An outbound resolver allows the VPC internal
     * resolver to make queries against external resolvers based on a set of configured rules.
     */
  readonly direction: string;

  /**
     * An optional offset from the start of a subnet's CIDR range that should be used for creating
     * resolver endpoints. This allows the endpoint IP's to be predicatable and therefor consistent
     * and used by other services that need to know specific IP addresses. If not specified resolver
     * endpoints will be created with IP addresses randomly chosen from the IP's available in the
     * subnet.
     */
  readonly subnetOffset?: number;

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

export class ResolverEndpointBase extends Resource {
  // Input properties
  public readonly direction: string;
  private readonly subnetOffset?: number;
  public readonly vpc: IVpc;

  // Resource properties
  public readonly securityGroup: SecurityGroup;
  public readonly resolverEndpoint: CfnResolverEndpoint;

  // Standard properties

  /**
     * The Amazon Resource Name (ARN) of the resolver endpoint.
     */
  public readonly resolverEndpointArn: string;

  /**
     * Indicates whether the resolver endpoint allows inbound or outbound DNS queries.
     */
  public readonly resolverEndpointDirection: string;

  /**
     * The ID of the VPC that you want to create the resolver endpoint in.
     */
  public readonly resolverEndpointHostVpcId: string;

  /**
     * The ID of the resolver endpoint.
     */
  public readonly resolverEndpointId: string;

  /**
     * The number of IP addresses that the resolver endpoint can use for DNS queries.
     */
  public readonly resolverEndpointIpAddressCount: string;

  /**
     * The IP addresses of the resolver. Only available if `subnetOffset` is specified.
     */
  public readonly resolverEndpointIps?: string[];

  /**
     * The name that you assigned to the resolver endpoint when you created the endpoint.
     */
  public readonly resolverEndpointName: string;


  /**
     * Creates a new instance of the ResolverEndpointBase class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: ResolverEndpointBaseProps) {
    super(scope, id, props);

    this.direction = props.direction;
    this.subnetOffset = props.subnetOffset;
    this.vpc = props.vpc;

    const fmtDirection = this.direction.charAt(0).toUpperCase() + this.direction.slice(1).toLowerCase();
    this.securityGroup = new SecurityGroup(this, 'security-group', {
      allowAllOutbound: false,
      description: `${fmtDirection} resolver security group for ${this.vpc.vpcId}`,
      vpc: this.vpc,
    });

    this.resolverEndpoint = new CfnResolverEndpoint(this, 'Resource', {
      direction: props.direction,
      ipAddresses: this.vpc.selectSubnets(props.subnets).subnets.map((x): CfnResolverEndpoint.IpAddressRequestProperty => {
        return {
          ip: this.offsetSubnet(x.ipv4CidrBlock),
          subnetId: x.subnetId,
        };
      }),
      name: `${this.direction.toLowerCase()}-resolver`,
      securityGroupIds: [
        this.securityGroup.securityGroupId,
      ],
    });

    // If IP's were explicitly specified we will make them available
    const resolverIps = (this.resolverEndpoint.ipAddresses as CfnResolverEndpoint.IpAddressRequestProperty[]).map((x) => {
      return x.ip;
    });

    this.resolverEndpointIps = resolverIps.every((x) => x) ? resolverIps as string[] : undefined;

    // Expose CloudFormation tokens so they'll be available to other resources
    this.resolverEndpointArn = this.resolverEndpoint.attrArn;
    this.resolverEndpointDirection = this.resolverEndpoint.attrDirection;
    this.resolverEndpointHostVpcId = this.resolverEndpoint.attrHostVpcId;
    this.resolverEndpointId = this.resolverEndpoint.attrResolverEndpointId;
    this.resolverEndpointIpAddressCount = this.resolverEndpoint.attrIpAddressCount;
    this.resolverEndpointName = this.resolverEndpoint.attrName;
  }

  /**
     * Gets an IP address offset by a specific amount from the start of a CIDR range. The amount it is
     * offset is determined by the {@link ResolverEndpointBaseProps.subnetOffset | subnet offsetSubnet}
     * property.
     *
     * @param cidr The CIDR range you want to calculate the offset for.
     * @returns An IP address offset by the configured amount.
     */
  private offsetSubnet(cidr: string): string | undefined {
    if (this.subnetOffset) {
      let ip = cidr.split('/')[0];
      return num2dot(dot2num(ip) + this.subnetOffset);
    } else {
      return undefined;
    }
  }
}