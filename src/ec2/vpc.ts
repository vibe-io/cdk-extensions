import { Aspects, Lazy, Resource, ResourceProps, Tags } from 'aws-cdk-lib';
import { CfnInternetGateway, CfnRoute, CfnVPC, CfnVPCGatewayAttachment, CfnVPNGatewayRoutePropagation, ClientVpnEndpoint, ClientVpnEndpointOptions, DefaultInstanceTenancy, EnableVpnGatewayOptions, FlowLog, FlowLogOptions, FlowLogResourceType, GatewayVpcEndpoint, GatewayVpcEndpointOptions, InterfaceVpcEndpoint, InterfaceVpcEndpointOptions, ISubnet, IVpc, SelectedSubnets, Subnet, SubnetFilter, SubnetSelection, SubnetType, Vpc, VpnConnection, VpnConnectionOptions, VpnConnectionType, VpnGateway } from 'aws-cdk-lib/aws-ec2';
import { CompositeDependable } from 'aws-cdk-lib/aws-iam';
import { Construct, DependencyGroup, IConstruct, IDependable } from 'constructs';
import { AvailabilityZones } from '../utils/availability-zones';
import { divideCidr } from '../utils/networking';


/**
 * Tracks subnet metadata that is relavent to the VPC but not typically
 * available from a subnet construct directly.
 */
interface SubnetInfo {
  /**
     * The accessibility the subnet will have as defined by the official CDK
     * SubnetType classifications.
     *
     * The value of this will determine how the route tables are configured for
     * the network ACL's as well as which resourced the subnet may be used to
     * host.
     *
     * @see [CDK SubnetType enum](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetType.html)
     * @see [VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
     */
  readonly accessibility: SubnetType;

  /**
     * A human friendly name that gives a general idea of the role which the
     * subnet will play in the network.
     *
     * Subnets can be grouped together by name to allow easy deployment of
     * resources.
     *
     * Typically a VPC will contain multiple subnets in a group that span
     * availability zones. This allows for services to be easily deployed to
     * support high availability across AWS data centers.
     */
  readonly groupName: string;

  /**
     * The inner subnet resource to which the other metadata is referring.
     */
  readonly subnet: ISubnet;
}

/**
 * Configuration options for adding a subnet to a VPC.
 */
export interface SubnetOptions {
  /**
     * The accessibility the subnet will have as defined by the official CDK
     * SubnetType classifications.
     *
     * The value of this will determine how the route tables are configured for
     * the network ACL's as well as which resourced the subnet may be used to
     * host.
     *
     * @see [CDK SubnetType enum](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetType.html)
     * @see [VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
     */
  readonly accessibility: SubnetType;

  /**
     * The AWS availability zone where the subnet should be created.
     *
     * @see [Subnet.AvailabilityZoneId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-availabilityzoneid)
     * @see [AWS Availability Zone documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)
     */
  readonly availabilityZone: string;

  /**
     * The IPv4 CIDR block assigned to the subnet.
     *
     * @see [Subnet.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-cidrblock)
     */
  readonly cidr: string;

  /**
     * A human friendly name that gives a general idea of the role which the
     * subnet will play in the network.
     *
     * Subnets can be grouped together by name to allow easy deployment of
     * resources.
     *
     * Typically a VPC will contain multiple subnets in a group that span
     * availability zones. This allows for services to be easily deployed to
     * support high availability across AWS data centers.
     */
  readonly groupName: string;

  /**
     * Indicates whether instances launched in this subnet receive a public
     * IPv4 address.
     *
     * @default false
     *
     * @see [Subnet.MapPublicIpOnLaunch](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-mappubliciponlaunch)
     */
  readonly mapPublicIpOnLaunch?: boolean;
}

/**
 * Configuration for the VpcBase class.
 */
interface VpcBaseProps extends ResourceProps {
  /**
     * The IPv4 network range for the VPC, in CIDR notation.
     *
     * @default Vpc.DEFAULT_CIDR_RANGE
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-cidrblock)
     */
  readonly cidr?: string;

  /**
     * The allowed tenancy of instances launched into the VPC.
     *
     * @default DefaultInstanceTenancy.DEFAULT
     *
     * @see [VPC.InstanceTenancy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-instancetenancy)
     * @see [Dedicated Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html)
     */
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;

  /**
     * Indicates whether the instances launched in the VPC get DNS hostnames.
     * If enabled, instances in the VPC get DNS hostnames; otherwise, they do
     * not.
     *
     * @default true
     *
     * @see [VPC.EnableDnsHostnames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednshostnames)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsHostnames?: boolean;

  /**
     * Indicates whether the DNS resolution is supported for the VPC. If
     * enabled, queries to the Amazon provided DNS server at the
     * 169.254.169.253 IP address, or the reserved IP address at the base of
     * the VPC network range "plus two" succeed. If disabled, the Amazon
     * provided DNS service in the VPC that resolves public DNS hostnames to IP
     * addresses is not enabled.
     *
     * @default true
     *
     * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsSupport?: boolean;

  /**
     * The name of the VPC to be created. This is primarily used for tagging
     * and resource naming purposed though could also be used in the discovery
     * of resources and billing reports.
     */
  readonly name?: string;
}

/**
 * Base class that provides common functionality for base classes.
 */
abstract class VpcBase extends Resource implements IVpc {
  /**
     * The default CIDR range used when creating VPCs. This can be overridden
     * using VpcProps when creating a VPCNetwork resource. e.g.
     * `new VpcResource(this, { cidr: '192.168.0.0./16' })`
     */
  public static readonly DEFAULT_CIDR_RANGE = Vpc.DEFAULT_CIDR_RANGE;

  /**
     * An object that represents all the dependencies that must be created
     * within the VPC before internet connectivity is available.
     *
     * This is tracked here primarily for convenience. It is implemented in the
     * IVpc interface as an IDependable which we would need to cast to add
     * resources to.
     *
     * @group Internal
     */
  private readonly _internetConnectivityEstablished: DependencyGroup;

  /**
   * The internet gateway resource associated with the VPC. Will be added when
   * the VPC is locked if any public subnets are available.
   */
  private _internetGateway?: CfnInternetGateway;

  /**
     * Specifies whether the VPC should be considered locked.
     *
     * Once a VPC is locked it means that other resources have attempted to
     * retrieve information from it and so it can no longer be modified in
     * order to ensure consistency in the resources it provides.
     *
     * Once a VPC is locked actions like adding new subnets are no longer
     * available and will result in an error.
     *
     * @group Internal
     */
  private _locked: boolean = false;

  /**
     * A virtual private gateway for the VPC.
     *
     * A virtual private gateway is the endpoint on the VPC side of your VPN connection.
     *
     * @see [AWS::EC2::VPNGateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html)
     */
  private _vpnGateway?: VpnGateway;


  /**
     * Contains subnet resources and metadata for the subnets that have been
     * added to the VPC.
     *
     * @group protected
     */
  protected readonly _subnetInfo: SubnetInfo[] = [];


  /**
     * The IPv4 network range for the VPC, in CIDR notation.
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-cidrblock)
     *
     * @group Inputs
     */
  public readonly cidr: string;

  /**
     * The allowed tenancy of instances launched into the VPC.
     *
     * @see [VPC.InstanceTenancy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-instancetenancy)
     * @see [Dedicated Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html)
     *
     * @group Inputs
     */
  public readonly defaultInstanceTenancy: DefaultInstanceTenancy;

  /**
     * Indicates whether the instances launched in the VPC get DNS hostnames.
     * If enabled, instances in the VPC get DNS hostnames; otherwise, they do
     * not.
     *
     * @see [VPC.EnableDnsHostnames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednshostnames)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     *
     * @group Inputs
     */
  public readonly enableDnsHostnames: boolean;

  /**
     * Indicates whether the DNS resolution is supported for the VPC. If
     * enabled, queries to the Amazon provided DNS server at the
     * 169.254.169.253 IP address, or the reserved IP address at the base of
     * the VPC network range "plus two" succeed. If disabled, the Amazon
     * provided DNS service in the VPC that resolves public DNS hostnames to IP
     * addresses is not enabled.
     *
     * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  public readonly enableDnsSupport: boolean;

  /**
     * The name of the VPC to be created. This is primarily used for tagging
     * and resource naming purposed though could also be used in the discovery
     * of resources and billing reports.
     */
  readonly name: string;


  /**
     * The underlying VPC CloudFormation resource.
     *
     * @see [AWS::Athena::VPC](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html)
     *
     * @group Resources
     */
  public readonly resource: CfnVPC;

  /**
     * A virtual private gateway for the VPC.
     *
     * A virtual private gateway is the endpoint on the VPC side of your VPN connection.
     *
     * @group Resources
     *
     * @see [AWS::EC2::VPNGateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html)
     */
  public get vpnGateway(): VpnGateway | undefined {
    return this._vpnGateway;
  }

  /**
   * Returns the ID of the internet gateway associated with the VPC.
   *
   * An internet gateway is added when the VPC has any subnets that are set to
   * public in order to allow for internet access.
   *
   * Accessing this property will case the VPC to be locked meaning no new
   * subnets can be added.
   */
  public get internetGatewayId(): string | undefined {
    if (!this.locked) {
      this.lock();
    }

    return this._internetGateway?.ref;
  }

  /**
     * Indicates whether the instances launched in the VPC get DNS hostnames.
     * If enabled, instances in the VPC get DNS hostnames; otherwise, they do
     * not.
     *
     * @see [VPC.EnableDnsHostnames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednshostnames)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     *
     * @group Inputs
     */
  public readonly dnsHostnamesEnabled: boolean;

  /**
      * Indicates whether the DNS resolution is supported for the VPC. If
      * enabled, queries to the Amazon provided DNS server at the
      * 169.254.169.253 IP address, or the reserved IP address at the base of
      * the VPC network range "plus two" succeed. If disabled, the Amazon
      * provided DNS service in the VPC that resolves public DNS hostnames to IP
      * addresses is not enabled.
      *
      * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
      * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
      */
  public readonly dnsSupportEnabled: boolean;

  /**
     * The AWS availability zones in which the VPC has subnets.
     *
     * @see [AWS Availability Zone documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)
     */
  public readonly availabilityZones: string[];

  /**
     * Dependable that can be depended upon to force internet connectivity
     * established on the VPC.
     */
  public readonly internetConnectivityEstablished: IDependable;

  /**
     * List of isolated subnets in the VPC.
     *
     * Subnets that are isolated will not get route to either the internet
     * gateway or a NAT gateway.
     */
  public readonly isolatedSubnets: ISubnet[];

  /**
     * List of private subnets in the VPC.
     *
     * Subnets that are private will get a route to a NAT gateway for internet
     * access.
     */
  public readonly privateSubnets: ISubnet[];

  /**
     * List of public subnets in the VPC.
     *
     * Subnets that are public will get a route to an internet gateway for
     * internet access.
     */
  public readonly publicSubnets: ISubnet[];

  /**
     * The Amazon Resource Name (ARN) of the VPC.
     *
     * @see [Amazon Resource Names](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html)
     */
  public readonly vpcArn: string;

  /**
     * The primary IPv4 CIDR block for the VPC. For example, `10.0.0.0/16`.
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#aws-resource-ec2-vpc-return-values)
     */
  public readonly vpcCidrBlock: string;

  /**
     * The ID of the VPC.
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#aws-resource-ec2-vpc-return-values)
     */
  public readonly vpcId: string;

  /**
     * Identifier for the VPN gateway.
     *
     * @see [AWS::EC2::VPNGateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html)
     */
  public readonly vpnGatewayId?: string | undefined;


  /**
   * Returns the type of subnet that will be returned by default when querying
   * subnets.
   *
   * Accessing this property will case the VPC to be locked meaning no new
   * subnets can be added.
   */
  public get defaultAccessibility(): SubnetType {
    if (!this.locked) {
      this.lock();
    }

    if (this.privateSubnets.length > 0) {
      return SubnetType.PRIVATE_WITH_EGRESS;
    } else if (this.isolatedSubnets.length > 0) {
      return SubnetType.PRIVATE_ISOLATED;
    } else {
      return SubnetType.PUBLIC;
    }
  }

  /**
     * Specifies whether the VPC should be considered locked.
     *
     * Once a VPC is locked it means that other resources have attempted to
     * retrieve information from it and so it can no longer be modified in
     * order to ensure consistency in the resources it provides.
     *
     * Once a VPC is locked actions like adding new subnets are no longer
     * available and will result in an error.
     */
  public get locked(): boolean {
    return this._locked;
  }

  /**
     * Returns a list of all subnets in the VPC.
     */
  public get subnets(): ISubnet[] {
    return this._subnetInfo.map((x) => {
      return x.subnet;
    });
  }


  /**
     * Creates a new instance of the VpcBase class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  public constructor(scope: Construct, id: string, props: VpcBaseProps) {
    super(scope, id, props);

    this.cidr = props.cidr ?? VpcBase.DEFAULT_CIDR_RANGE;
    this.defaultInstanceTenancy = props.defaultInstanceTenancy ?? DefaultInstanceTenancy.DEFAULT;
    this.enableDnsHostnames = props.enableDnsHostnames ?? true;
    this.enableDnsSupport = props.enableDnsSupport ?? true;
    this.name = props.name ?? this.node.path;

    this.dnsHostnamesEnabled = this.enableDnsHostnames;
    this.dnsSupportEnabled = this.enableDnsSupport;

    this.availabilityZones = [];
    this.isolatedSubnets = [];
    this.privateSubnets = [];
    this.publicSubnets = [];

    this._internetConnectivityEstablished = new DependencyGroup();
    this.internetConnectivityEstablished = this._internetConnectivityEstablished;

    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock: this.cidr,
      enableDnsHostnames: this.enableDnsHostnames,
      enableDnsSupport: this.enableDnsSupport,
      instanceTenancy: this.defaultInstanceTenancy,
    });

    this.vpcId = this.resource.ref;

    this.vpcArn = this.stack.formatArn({
      resource: 'vpc',
      resourceName: this.vpcId,
      service: 'ec2',
    });
    this.vpcCidrBlock = this.resource.attrCidrBlock;

    this.vpnGatewayId = Lazy.string({
      produce: () => {
        return this._vpnGateway?.gatewayId;
      },
    });

    Tags.of(this).add('Name', this.name);

    Aspects.of(this).add({
      visit: (node: IConstruct) => {
        if (node === this && !this.locked) {
          this.lock();
        }
      },
    });
  }

  /**
     * Adds a new client VPN endpoint to this VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the client VPN endpoint.
     * @returns The client VPN endpoint that was created.
     */
  public addClientVpnEndpoint(id: string, options: ClientVpnEndpointOptions): ClientVpnEndpoint {
    return new ClientVpnEndpoint(this, id, {
      ...options,
      vpc: this,
    });
  }

  /**
     * Adds a new Flow Log to this VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the flow log.
     * @returns The VPC flow log that was created.
     */
  public addFlowLog(id: string, options?: FlowLogOptions): FlowLog {
    return new FlowLog(this, id, {
      ...options,
      resourceType: FlowLogResourceType.fromVpc(this),
    });
  }

  /**
     * Adds a new gateway endpoint to this VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the gateway endpoint.
     * @returns The gateway endpoint that was created.
     */
  public addGatewayEndpoint(id: string, options: GatewayVpcEndpointOptions): GatewayVpcEndpoint {
    return new GatewayVpcEndpoint(this, id, {
      ...options,
      vpc: this,
    });
  }

  /**
     * Adds a new interface endpoint to this VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the interface endpoint.
     * @returns The interface endpoint that was created.
     */
  public addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint {
    return new InterfaceVpcEndpoint(this, id, {
      ...options,
      vpc: this,
    });
  }

  /**
     * Adds a new VPN connection to this VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the VPN connection.
     * @returns The VPN connection that was created.
     */
  public addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection {
    return new VpnConnection(this, id, {
      ...options,
      vpc: this,
    });
  }

  /**
     * Adds a VPN Gateway to this VPC.
     *
     * @param options Configuration options for the VPN gateway.
     */
  public enableVpnGateway(options: EnableVpnGatewayOptions): void {
    if (this.vpnGateway) {
      throw new Error('A VPN gateway is already enabled.');
    }

    this._vpnGateway = new VpnGateway(this, 'VpnGateway', {
      amazonSideAsn: options.amazonSideAsn,
      type: VpnConnectionType.IPSEC_1,
    });

    const attachment = new CfnVPCGatewayAttachment(this, 'VPCVPNGW', {
      vpnGatewayId: this._vpnGateway.gatewayId,
      vpcId: this.vpcId,
    });

    const routePropagationSelection = options.vpnRoutePropagation ?? [{}];
    const routeTableIds = new Set(routePropagationSelection.reduce((prev, cur) => {
      return [...prev, ...this.selectSubnets(cur).subnets.map((x) => {
        return x.routeTable.routeTableId;
      })];
    }, [] as string[]));

    const routePropagation = new CfnVPNGatewayRoutePropagation(this, 'RoutePropagation', {
      routeTableIds: Array.from(routeTableIds),
      vpnGatewayId: this._vpnGateway.gatewayId,
    });

    routePropagation.node.addDependency(attachment);
  }

  public selectSubnets(selection?: SubnetSelection): SelectedSubnets {
    // If configuration isn't currently locked lock it now to ensure
    // selection results stay consistent.
    if (!this.locked) {
      this.lock();
    }

    const groupName = selection?.subnetGroupName;
    const subnets = selection?.subnets;
    const accessibility = selection?.subnetType ?? ((groupName || subnets) ? undefined : this.defaultAccessibility);

    // Build a list of filters provided by the builting SubnetFilter class.
    const filters: SubnetFilter[] = selection?.subnetFilters ?? [];

    if (selection?.availabilityZones) {
      filters.push(SubnetFilter.availabilityZones(selection?.availabilityZones));
    }

    if (selection?.onePerAz) {
      filters.push(SubnetFilter.onePerAz());
    }

    // If a name filtrer is passed make sure the group actually exists.
    const availableGroups = Array.from(new Set(this._subnetInfo.map((x) => {
      return x.groupName;
    })));
    if (groupName && !availableGroups.includes(groupName)) {
      throw new Error([
        `There are no subnet groups with name '${groupName}' in this VPC.`,
        `Available names: ${availableGroups.join(',')}`,
      ].join(' '));
    }

    // Get a baseline set of subnets from the details we can't use SubnetFilter for.
    const baseline = this._subnetInfo.filter((x) => {
      if (groupName && groupName !== x.groupName) { return false; }
      if (accessibility && accessibility !== x.accessibility) { return false; }
      if (subnets && !subnets.includes(x.subnet)) { return false; }
      return true;
    }).map((x) => {
      return x.subnet;
    });

    // Apply the generic filters to further scope down the result.
    const result = filters.reduce((prev, cur) => {
      return cur.selectSubnets(prev);
    }, baseline);

    // Pull the metadata back out to figure out things like accessibility.
    const info = this._subnetInfo.filter((x) => {
      return result.includes(x.subnet);
    });

    // Build the result.
    return {
      get availabilityZones(): string[] {
        return result.map((x) => {
          return x.availabilityZone;
        });
      },
      hasPublic: info.some((x) => {
        return x.accessibility === SubnetType.PUBLIC;
      }),
      internetConnectivityEstablished: new CompositeDependable(...result.map((x) => {
        return x.internetConnectivityEstablished;
      })),
      isPendingLookup: false,
      subnetIds: result.map((x) => {
        return x.subnetId;
      }),
      subnets: result,
    };
  }

  /**
     * Adds a subnet to the VPC.
     *
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options Configuration options for the subnet.
     * @returns The subnet that was created.
     */
  protected addVpcSubnet(id: string, options: SubnetOptions): ISubnet {
    if (this.locked) {
      throw new Error([
        "Can't add a new subnet to a VPC after it has been locked.",
        'Ensure all subnets for the VPC are added before calling any',
        'methods that try to access them (such as selectSubnets).',
      ].join(' '));
    }

    if (!this.availabilityZones.includes(options.availabilityZone)) {
      this.availabilityZones.push(options.availabilityZone);
    }

    const subnet = new Subnet(this, id, {
      availabilityZone: options.availabilityZone,
      cidrBlock: options.cidr,
      mapPublicIpOnLaunch: options.mapPublicIpOnLaunch ?? (options.accessibility === SubnetType.PUBLIC),
      vpcId: this.vpcId,
    });

    this._subnetInfo.push({
      accessibility: options.accessibility,
      groupName: options.groupName,
      subnet: subnet,
    });

    Tags.of(subnet).add('aws-cdk:subnet-name', options.groupName, {
      includeResourceTypes: [
        'AWS::EC2::Subnet',
      ],
    });
    Tags.of(subnet).add('aws-cdk:subnet-type', options.accessibility, {
      includeResourceTypes: [
        'AWS::EC2::Subnet',
      ],
    });

    if (options.accessibility === SubnetType.PRIVATE_ISOLATED) { this.isolatedSubnets.push(subnet); }
    if (options.accessibility === SubnetType.PRIVATE_WITH_EGRESS) { this.privateSubnets.push(subnet); }
    if (options.accessibility === SubnetType.PUBLIC) { this.publicSubnets.push(subnet); }

    return subnet;
  }

  /**
     * Locks the VPC to prevent changes from being made.
     *
     * Once other constructs start referencing resources from the VPC it
     * should be locked to prevent inconsistencies in resources referencing the
     * VPC.
     */
  protected lock(): void {
    if (this.publicSubnets.length > 0) {
      const igw = new CfnInternetGateway(this, 'IGW');
      const att = new CfnVPCGatewayAttachment(this, 'VPCGW', {
        internetGatewayId: igw.ref,
        vpcId: this.resource.ref,
      });

      this._internetGateway = igw;
      this._internetConnectivityEstablished.add(igw);

      this.publicSubnets.forEach((x) => {
        const route = new CfnRoute(x, 'DefaultRoute', {
          destinationCidrBlock: '0.0.0.0/0',
          gatewayId: this._internetGateway?.ref,
          routeTableId: x.routeTable.routeTableId,
        });
        route.node.addDependency(att);


        (x.internetConnectivityEstablished as DependencyGroup).add(route);
      });
    }

    this._locked = true;
  }
}


/**
 * Configuration for a CustomVpc.
 */
export interface CustomVpcProps {
  /**
     * The IPv4 network range for the VPC, in CIDR notation.
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-cidrblock)
     */
  readonly cidr?: string;

  /**
     * The allowed tenancy of instances launched into the VPC.
     *
     * @see [VPC.InstanceTenancy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-instancetenancy)
     * @see [Dedicated Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html)
     */
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;

  /**
     * Indicates whether the instances launched in the VPC get DNS hostnames.
     * If enabled, instances in the VPC get DNS hostnames; otherwise, they do
     * not.
     *
     * @see [VPC.EnableDnsHostnames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednshostnames)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsHostnames?: boolean;

  /**
     * Indicates whether the DNS resolution is supported for the VPC. If
     * enabled, queries to the Amazon provided DNS server at the
     * 169.254.169.253 IP address, or the reserved IP address at the base of
     * the VPC network range "plus two" succeed. If disabled, the Amazon
     * provided DNS service in the VPC that resolves public DNS hostnames to IP
     * addresses is not enabled.
     *
     * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsSupport?: boolean;

  /**
     * A list of subnet configuration options for subnets you wish to add to
     * the VPC.
     */
  readonly subnets?: SubnetOptions[];
}

/**
 * The custom VPC allows you to create CDK compatible VPC's while specifying
 * your own custom subnet networking configurations.
 *
 * Using this you can specify any subnet allocation and placemnt you want
 * without being constrained by the auto-subnetting of the built in CDK
 * construct.
 *
 * This is an advanced resource and is meant more as an escape hatch for
 * special situations where the built in functionality is insufficient.
 */
export class CustomVpc extends VpcBase {
  /**
     * Creates a new instance of the CustomVpc class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  public constructor(scope: Construct, id: string, props: CustomVpcProps = {}) {
    super(scope, id, {
      cidr: props.cidr,
      defaultInstanceTenancy: props.defaultInstanceTenancy,
      enableDnsHostnames: props.enableDnsHostnames,
      enableDnsSupport: props.enableDnsSupport,
    });

    props.subnets?.forEach((x) => {
      this.addSubnet(x);
    });
  }

  /**
     * Adds a subnet to the VPC.
     *
     * You can only add subnets up until the point that other resources start
     * to reference them after which attempts to add new subnets will result in
     * an error.
     *
     * @param options Configuration options for the subnet.
     * @returns The subnet that was added.
     */
  public addSubnet(options: SubnetOptions): ISubnet {
    const idx = this._subnetInfo.filter((x) => {
      return x.groupName === options.groupName;
    }).length;

    return this.addVpcSubnet(`${options.groupName}Subnet${idx + 1}`, options);
  }
}


/**
 * Configuration options for a tier within a tiered VPC..
 */
export interface TierConfiguration {
  /**
     * The accessibility the subnets in this tier will have as defined by the
     * official CDK SubnetType classifications.
     *
     * The value of this will determine how the route tables are configured for
     * the network ACL's as well as which resourced the subnet may be used to
     * host.
     *
     * @see [CDK SubnetType enum](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetType.html)
     * @see [VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
     */
  readonly accessibility?: SubnetType;

  /**
     * Indicates whether instances launched in this tier receive a public IPv4
     * address.
     *
     * @default false
     *
     * @see [Subnet.MapPublicIpOnLaunch](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-mappubliciponlaunch)
     */
  readonly mapPublicIpOnLaunch?: boolean;

  /**
     * A human friendly name for the tier that give a general idea of the role
     * which the tier plays in the overall network topology.
     */
  readonly name: string;

  /**
     * The CIDR mask to use when creating subnets within this tier.
     *
     * By default subnets will be created with the largest possible network
     * size that will allow one subnet to be created in each availability zone
     * in the VPC.
     *
     * You can set this to a smaller netmask to provide room for future
     * expansion (adding additional availability zones to the VPC).
     */
  readonly subnetMask?: number;
}

/**
 * Configuration options for a TieredVpc.
 */
export interface TieredVpcProps {
  /**
     * A list of availability zones which the VPC will span.
     *
     * A subnet will be added to the VPC in every availability zone for each
     * tier in the VPC.
     *
     * @see [Subnet.AvailabilityZoneId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-availabilityzoneid)
     * @see [AWS Availability Zone documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)
     */
  readonly availabilityZones?: string[];

  /**
     * The IPv4 network range for the VPC, in CIDR notation.
     *
     * @see [VPC.CidrBlock](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-cidrblock)
     */
  readonly cidr?: string;

  /**
     * The allowed tenancy of instances launched into the VPC.
     *
     * @see [VPC.InstanceTenancy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-instancetenancy)
     * @see [Dedicated Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html)
     */
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;

  /**
     * Indicates whether the DNS resolution is supported for the VPC. If
     * enabled, queries to the Amazon provided DNS server at the
     * 169.254.169.253 IP address, or the reserved IP address at the base of
     * the VPC network range "plus two" succeed. If disabled, the Amazon
     * provided DNS service in the VPC that resolves public DNS hostnames to IP
     * addresses is not enabled.
     *
     * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsHostnames?: boolean;

  /**
     * Indicates whether the DNS resolution is supported for the VPC. If
     * enabled, queries to the Amazon provided DNS server at the
     * 169.254.169.253 IP address, or the reserved IP address at the base of
     * the VPC network range "plus two" succeed. If disabled, the Amazon
     * provided DNS service in the VPC that resolves public DNS hostnames to IP
     * addresses is not enabled.
     *
     * @see [VPC.EnableDnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html#cfn-ec2-vpc-enablednssupport)
     * @see [DNS attributes in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#vpc-dns-support)
     */
  readonly enableDnsSupport?: boolean;

  /**
     * The CIDR mask that controls the size of a subnet tier.
     *
     * By default tiers will be created with the largest possible network
     * size that will fit all the tiers within the CIDR of the VPC.
     *
     * You can set this to a smaller netmask to provide room for future
     * expansion (adding additional tiers to the VPC).
     */
  readonly tierMask?: number;

  /**
     * Configuration for the tiers that comprise the VPC.
     */
  readonly tiers: TierConfiguration[];
}

export interface IVpcTier {
  readonly subnets: ISubnet[];
}

/**
 * The tiered VPC is a VPC in which all networking is broken into tiers.
 *
 * Tiers are similar to the standard subnet groups in the vanilla CDK VPC
 * construct except for the fact that each tier has a dedicated CIDR range
 * associated with them.
 *
 * When subnets are created they will be created starting at the start of their
 * tier's CIDR block.
 *
 * This allows for more concise networking as all subnets in a tier can have
 * their network summarized using their tier's CIDR range.
 */
export class TieredVpc extends VpcBase {
  /**
     * Configuration for the tiers that comprise the VPC.
     *
     * @group Inputs
     */
  public readonly tierConfiguration: TierConfiguration[];


  /**
     * A collection of the tiers that make up this VPC.
     *
     * @group Resources
     */
  public readonly tiers: {[name: string]: IVpcTier};


  /**
     * Creates a new instance of the TieredVpc class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  public constructor(scope: Construct, id: string, props: TieredVpcProps) {
    super(scope, id, {
      cidr: props.cidr,
      defaultInstanceTenancy: props.defaultInstanceTenancy,
      enableDnsHostnames: props.enableDnsHostnames,
      enableDnsSupport: props.enableDnsSupport,
    });

    this.tierConfiguration = props.tiers;

    this.tiers = {};

    const availabilityZones = props.availabilityZones ?? AvailabilityZones.first(3);
    const tierNetworks = divideCidr(this.cidr, this.tierConfiguration.length, props.tierMask);

    this.tierConfiguration.forEach((tier, tIdx) => {
      const subnets = divideCidr(tierNetworks[tIdx], availabilityZones.length, tier.subnetMask);

      this.tiers[tier.name] = {
        subnets: subnets.map((subnet, sIdx) => {
          return this.addVpcSubnet(`${tier.name}Subnet${sIdx + 1}`, {
            accessibility: tier.accessibility ?? SubnetType.PRIVATE_ISOLATED,
            availabilityZone: availabilityZones[sIdx],
            cidr: subnet,
            groupName: tier.name,
            mapPublicIpOnLaunch: tier.mapPublicIpOnLaunch,
          });
        }),
      };
    });
  }
}
