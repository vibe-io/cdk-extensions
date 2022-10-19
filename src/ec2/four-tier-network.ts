import { Fn, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnVPC, ClientVpnEndpoint, ClientVpnEndpointOptions, DefaultInstanceTenancy, EnableVpnGatewayOptions, FlowLog, FlowLogOptions, GatewayVpcEndpoint, GatewayVpcEndpointOptions, InterfaceVpcEndpoint, InterfaceVpcEndpointOptions, ISubnet, IVpc, NatProvider, Peer, SelectedSubnets, Subnet, SubnetConfiguration, SubnetSelection, SubnetType, VpnConnection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { Construct, IDependable } from 'constructs';
import { divideCidr } from '../utils/networking';


export interface TierConfiguration {
    readonly mapPublicIpOnLaunch?: boolean;
    readonly name: string;
    readonly subnetType: SubnetType;
}

export class AvailabilityZones {
    public static first(count?: number): string[] {
        const azs = Fn.getAzs();
        return Array.from(Array(count ?? 1).keys()).map((x) => {
            return Fn.select(x, azs);
        });
    }
}

/**
 * Configuration for Vpc
 */
export interface TieredVpcProps extends ResourceProps {
  readonly availabilityZones?: string[];
  readonly cidr?: string;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[key: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[key: string]: GatewayVpcEndpointOptions};
  readonly natGatewaySubnets?: SubnetSelection;
  readonly natGateways?: number;
  readonly tierConfiguration: TierConfiguration[];
  readonly vpcName?: string;
  readonly vpnConnections?: {[key: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export class TieredVpc extends Resource implements IVpc {
  // Input properties
  public readonly cidr: string;
  public readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  public readonly enableDnsHostnames?: boolean;
  public readonly enableDnsSupport?: boolean;
  public readonly flowLogs?: {[key: string]: FlowLogOptions};
  public readonly gatewayEndpoints?: {[key: string]: GatewayVpcEndpointOptions};
  public readonly natGatewayProvider?: NatProvider;
  public readonly natGatewaySubnets?: SubnetSelection;
  public readonly natGateways?: number;
  public readonly tierConfiguration: TierConfiguration[];
  public readonly vpcName?: string;
  public readonly vpnConnections?: {[key: string]: VpnConnectionOptions};
  public readonly vpnGateway?: boolean;
  public readonly vpnGatewayAsn?: number;
  public readonly vpnRoutePropagation?: SubnetSelection[];

  // Resource properties
  public readonly resource: CfnVPC;

  // Standard properties
  public readonly availabilityZones: string[];
  public readonly internetConnectivityEstablished: IDependable;
  public readonly isolatedSubnets: ISubnet[];
  public readonly publicSubnets: ISubnet[];
  public readonly privateSubnets: ISubnet[];
  public readonly vpcArn: string;
  public readonly vpcCidrBlock: string;
  public readonly vpcId: string;
  public readonly vpnGatewayId?: string | undefined;


  /**
     * Creates a new instance of the Database class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TieredVpcProps) {
    super(scope, id, props);

    this.availabilityZones = props.availabilityZones ?? AvailabilityZones.first(3);
    this.cidr = props.cidr ?? '10.0.0.0/16';
    this.defaultInstanceTenancy = props.defaultInstanceTenancy;
    this.enableDnsHostnames = props.enableDnsHostnames;
    this.enableDnsSupport = props.enableDnsSupport;
    this.tierConfiguration = props.tierConfiguration;

    this.isolatedSubnets = [];
    this.privateSubnets = [];
    this.publicSubnets = [];

    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock: this.cidr,
      enableDnsHostnames: this.enableDnsHostnames,
      enableDnsSupport: this.enableDnsSupport,
      instanceTenancy: this.defaultInstanceTenancy,
      ipv4IpamPoolId: ,
      ipv4NetmaskLength: ,
    });

    this.vpcId = this.resource.ref;
    this.vpcArn = this.stack.formatArn({
        resource: 'vpc',
        resourceName: this.vpcId,
        service: 'ec2'
    });
    this.vpcCidrBlock = this.resource.attrCidrBlock;

    const tierNetworks = divideCidr(this.cidr, this.tierConfiguration.length);
    for (let x in this.tierConfiguration) {
        const config = this.tierConfiguration[x];
        const subnetNetworks = divideCidr(tierNetworks[x], this.availabilityZones.length);

        subnetNetworks.forEach((x, idx) => {
            const subnet = new Subnet(this, `${config.name}-subnet-az${idx + 1}`, {
                availabilityZone: this.availabilityZones[idx],
                cidrBlock: x,
                mapPublicIpOnLaunch: config.mapPublicIpOnLaunch,
                vpcId: this.vpcId,
            });

            if (config.subnetType === SubnetType.PRIVATE_ISOLATED) {
                this.isolatedSubnets.push(subnet);
            }
            else if (config.subnetType === SubnetType.PRIVATE_WITH_EGRESS) {
                this.privateSubnets.push(subnet);
            }
            else {
                this.privateSubnets.push(subnet);
            }
        });
    }
  }

    public selectSubnets(selection?: SubnetSelection): SelectedSubnets {
        throw new Error('Method not implemented.');
    }

    public enableVpnGateway(options: EnableVpnGatewayOptions): void {
        throw new Error('Method not implemented.');
    }

    public addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection {
        return new VpnConnection(this, id, {
            ...options,
            vpc: this
        });
    }

    public addClientVpnEndpoint(id: string, options: ClientVpnEndpointOptions): ClientVpnEndpoint {
        throw new Error('Method not implemented.');
    }

    public addGatewayEndpoint(id: string, options: GatewayVpcEndpointOptions): GatewayVpcEndpoint {
        throw new Error('Method not implemented.');
    }

    public addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint {
        throw new Error('Method not implemented.');
    }

    public addFlowLog(id: string, options?: FlowLogOptions): FlowLog {
        throw new Error('Method not implemented.');
    }
}
