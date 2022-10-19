import { Annotations, Fn, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnVPC, ClientVpnEndpoint, ClientVpnEndpointOptions, DefaultInstanceTenancy, EnableVpnGatewayOptions, FlowLog, FlowLogOptions, GatewayVpcEndpoint, GatewayVpcEndpointOptions, InterfaceVpcEndpoint, InterfaceVpcEndpointOptions, ISubnet, IVpc, NatProvider, SelectedSubnets, Subnet, SubnetConfiguration, SubnetSelection, VpnConnection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { Construct, IDependable } from 'constructs';


export enum SubnetStrategy {
    CUSTOM = 'CUSTOM',
    SIMPLE = 'SIMPLE',
    TIERED = 'TIERED'
}

export interface SubnetOptions {
    readonly availabilityZone?: string;
    readonly cidr: string;
    readonly subnetGroup: string;
    readonly mapPublicIpOnLaunch?: boolean;
}

export interface tierOptions {
    readonly cidr?: string;
    readonly mask?: string;
    readonly name: string;
}

/**
 * Configuration for Vpc
 */
export interface VpcProps extends ResourceProps {
  readonly cidr?: string;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[key: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[key: string]: GatewayVpcEndpointOptions};
  readonly maxAzs?: number;
  readonly natGatewayProvider?: NatProvider;
  readonly natGatewaySubnets?: SubnetSelection;
  readonly natGateways?: number;
  readonly subnetConfiguration?: SubnetConfiguration[];
  readonly subnetStrategy?: SubnetStrategy;
  readonly vpcName?: string;
  readonly vpnConnections?: {[key: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export class Vpc extends Resource implements IVpc {
  // Internal properties
  public readonly _availabilityZones: string[] = [];
  public readonly _subnets: Subnet[] = [];
  public readonly _tiers: tierOptions[] = [];
  public _subnetsLocked: boolean = false;

  // Input properties
  public readonly cidr?: string;
  public readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  public readonly enableDnsHostnames?: boolean;
  public readonly enableDnsSupport?: boolean;
  public readonly flowLogs?: {[key: string]: FlowLogOptions};
  public readonly gatewayEndpoints?: {[key: string]: GatewayVpcEndpointOptions};
  public readonly maxAzs: number;
  public readonly natGatewayProvider?: NatProvider;
  public readonly natGatewaySubnets?: SubnetSelection;
  public readonly natGateways?: number;
  public readonly subnetStrategy?: SubnetStrategy;
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
  constructor(scope: Construct, id: string, props: VpcProps = {}) {
    super(scope, id, props);

    this.cidr = props.cidr;
    this.defaultInstanceTenancy = props.defaultInstanceTenancy;
    this.enableDnsHostnames = props.enableDnsHostnames;
    this.enableDnsSupport = props.enableDnsSupport;
    this.maxAzs = props.maxAzs ?? 3;
    this.subnetStrategy = props.subnetStrategy ?? SubnetStrategy.SIMPLE;

    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock: this.cidr,
      enableDnsHostnames: this.enableDnsHostnames,
      enableDnsSupport: this.enableDnsSupport,
      instanceTenancy: this.defaultInstanceTenancy,
      ipv4IpamPoolId: ,
      ipv4NetmaskLength: ,
    });

    this.vpcId = this.resource.ref;
    this.vpcArn = 
    this.vpcCidrBlock = this.resource.attrCidrBlock;

    
  }

  selectSubnets(selection?: SubnetSelection): SelectedSubnets {
    throw new Error('Method not implemented.');
  }

    enableVpnGateway(options: EnableVpnGatewayOptions): void {
        throw new Error('Method not implemented.');
    }
    addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection {
        throw new Error('Method not implemented.');
    }
    addClientVpnEndpoint(id: string, options: ClientVpnEndpointOptions): ClientVpnEndpoint {
        throw new Error('Method not implemented.');
    }
    addGatewayEndpoint(id: string, options: GatewayVpcEndpointOptions): GatewayVpcEndpoint {
        throw new Error('Method not implemented.');
    }
    addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint {
        throw new Error('Method not implemented.');
    }
    addFlowLog(id: string, options?: FlowLogOptions): FlowLog {
        throw new Error('Method not implemented.');
    }

  public addAvailabilityZone(zone: string): void {
      this._availabilityZones.push(zone);
  }

  public addTier(options: tierOptions): void {

  }

  protected lockSubnets(): void {
    this._subnetsLocked = true;

    if (this.subnetStrategy === SubnetStrategy.CUSTOM) {
        if (this._subnets.length === 0) {
            Annotations.of(this).addError([
                'Attempted to reference subnets on a VPC with custom subnetting',
                'before any subnets were added. Please call addSubnet to add at least',
                "one subnet to the VPC before trying to reference the VPC's subnets."
            ].join(' '));
        }

        return;
    }
  }

  protected createSubnetsSimple(): void {
      this._tiers.filter((x) => {
          return !!x.mask;
      });
  }

  protected createSubnetsTiered(): void {

  }
}
