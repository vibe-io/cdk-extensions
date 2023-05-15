import { ResourceProps, Stack, Token } from 'aws-cdk-lib';
import { DefaultInstanceTenancy, GatewayVpcEndpointOptions, RouterType, Subnet, SubnetSelection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FlowLogOptions, FourTierNetwork, IpAddressManager } from '.';
import { AddIsolatedClientVpnEndpointOptions } from './four-tier-network';
import { FourTierNetworkSpoke } from './four-tier-network-spoke';
import { NetworkIsolatedClientVpnEndpoint } from './network-isolated-client-vpn-endpoint';
import { IIpamPool, ITransitGatewayRouteTable, TransitGateway, TransitGatewayProps } from '../ec2';
import { IIpv4CidrAssignment, Ipv4CidrAssignment } from '../ec2/lib/cidr-assignment';
import { NatProvider } from '../ec2/lib/nat-providers/nat-provider';
import { ITransitGateway } from '../ec2/transit-gateway';
import { GlobalNetwork } from '../networkmanager/global-network';
import { IResourceShare, ISharedPrincipal, ResourceShare, SharedPrincipal } from '../ram';
import { SharedResource } from '../ram-resources';


export interface FourTierNetworkShareProperties {
  readonly autoAddAccounts?: boolean;
  readonly allowExternalPrincipals?: boolean;
  readonly pricipals?: ISharedPrincipal[];
}

export interface AddSpokeNetworkProps {
  readonly availabilityZones?: string[];
  readonly cidr?: IIpv4CidrAssignment;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: { [id: string]: FlowLogOptions };
  readonly gatewayEndpoints?: { [id: string]: GatewayVpcEndpointOptions };
  readonly maxAzs?: number;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export interface FourTierNetworkHubProps extends ResourceProps {
  readonly addressManager?: IpAddressManager;
  readonly availabilityZones?: string[];
  readonly cidr?: IIpv4CidrAssignment;
  readonly clientVpnPool?: IIpamPool;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly defaultTransitGatewayRouteTable?: ITransitGatewayRouteTable;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: { [id: string]: FlowLogOptions };
  readonly gatewayEndpoints?: { [id: string]: GatewayVpcEndpointOptions };
  readonly globalNetwork?: GlobalNetwork;
  readonly maxAzs?: number;
  readonly sharing?: FourTierNetworkShareProperties;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export class FourTierNetworkHub extends FourTierNetwork {
  private readonly _flowLogConfiguration?: { [id: string]: FlowLogOptions };
  private readonly _sharedAccounts: string[];

  private _clientVpns: NetworkIsolatedClientVpnEndpoint[];
  private _resourceShare?: IResourceShare;
  private _transitGateway?: ITransitGateway;

  public readonly defaultTransitGatewayRouteTable?: ITransitGatewayRouteTable;
  public readonly globalNetwork?: GlobalNetwork;
  public readonly sharing: FourTierNetworkShareProperties;

  public get transitGateway(): ITransitGateway | undefined {
    return this._transitGateway;
  }


  public constructor(scope: IConstruct, id: string, props: FourTierNetworkHubProps = {}) {
    super(scope, id, {
      ...props,
      natGatewayProvider: NatProvider.gateway(),
      natGatewaySubnets: {
        onePerAz: true,
        subnetGroupName: 'public',
      },
    });

    this._clientVpns = [];
    this._flowLogConfiguration = props.flowLogs;

    this.defaultTransitGatewayRouteTable = props.defaultTransitGatewayRouteTable;
    this.globalNetwork = props.globalNetwork;
    this.sharing = props.sharing ?? {
      autoAddAccounts: true,
    };

    if (this.sharing.pricipals) {
      const resourceShare = this._ensureResourceShare();

      this.sharing.pricipals.forEach((x) => {
        resourceShare.addPrincipal(x);
      });
    }

    this._sharedAccounts = [];
  }

  private _addSharedAccount(accountId: string): void {
    if (!this._sharedAccounts.includes(accountId)) {
      const resourceShare = this._ensureResourceShare();
      resourceShare.addPrincipal(SharedPrincipal.fromAccountId(accountId));
      this._sharedAccounts.push(accountId);
    }
  }

  private _ensureResourceShare(): IResourceShare {
    const transitGateway = this.transitGateway ?? this.enableTransitGateway();

    if (!this._resourceShare) {
      this._resourceShare = new ResourceShare(this, 'resource-share', {
        resources: [
          SharedResource.fromTransitGateway(transitGateway),
        ],
        ...this.sharing,
      });
      return this._resourceShare;
    } else {
      return this._resourceShare;
    }
  }

  public addIsolatedClientVpnEndpoint(id: string, options: AddIsolatedClientVpnEndpointOptions): NetworkIsolatedClientVpnEndpoint {
    const vpn = super.addIsolatedClientVpnEndpoint(id, options);
    this._clientVpns.push(vpn);

    if (this.transitGateway) {
      vpn.registerTransitGateway(this.transitGateway);
    }

    return vpn;
  }

  public addSpoke(scope: IConstruct, id: string, props: AddSpokeNetworkProps = {}): FourTierNetworkSpoke {
    if (this.transitGateway === undefined) {
      this.enableTransitGateway();
    }

    if (this.sharing.autoAddAccounts) {
      const scopeAccount = Stack.of(scope).account;

      if (!Token.isUnresolved(scopeAccount) && scopeAccount !== this.stack.account) {
        this._addSharedAccount(scopeAccount);
      }
    }

    const provider = (!props.cidr && this.ipamPool) ? Ipv4CidrAssignment.ipamPool({
      pool: this.ipamPool,
      netmask: this.netmask,
    }) : props.cidr;

    return new FourTierNetworkSpoke(scope, id, {
      addressManager: this.addressManager,
      cidr: provider,
      defaultInstanceTenancy: this.defaultInstanceTenancy,
      enableDnsHostnames: this.enableDnsHostnames,
      enableDnsSupport: this.enableDnsSupport,
      flowLogs: this._flowLogConfiguration,
      hub: this,
      ...props,
    });
  }

  public enableTransitGateway(props: TransitGatewayProps = {}): ITransitGateway {
    if (this._transitGateway) {
      throw new Error([
        `Transit gateway is already enabled for VPC ${this.node.path}`,
      ].join(' '));
    }

    const transitGateway = new TransitGateway(this, 'transit-gateway', {
      autoAcceptSharedAttachments: true,
      defaultRouteTableId: this.defaultTransitGatewayRouteTable?.transitGatewayRouteTableId,
      ...props,
    });

    const attachment = transitGateway.attachVpc(this, {
      subnets: {
        onePerAz: true,
        subnetGroupName: 'dmz',
      },
    });

    transitGateway.defaultRouteTable?.addRoute('default', {
      attachment: attachment,
      cidr: '0.0.0.0/0',
    });

    [this.publicSubnets, this.privateSubnets, this.isolatedSubnets].forEach((group) => {
      group.forEach((subnet) => {
        (subnet as Subnet).addRoute('rfc1918-10-0-0-0--8', {
          routerId: transitGateway.transitGatewayId,
          routerType: RouterType.TRANSIT_GATEWAY,
          destinationCidrBlock: '10.0.0.0/8',
        });
        (subnet as Subnet).addRoute('rfc1918-172-16-0-0--12', {
          routerId: transitGateway.transitGatewayId,
          routerType: RouterType.TRANSIT_GATEWAY,
          destinationCidrBlock: '172.16.0.0/12',
        });
        (subnet as Subnet).addRoute('rfc1918-192-168-0-0--16', {
          routerId: transitGateway.transitGatewayId,
          routerType: RouterType.TRANSIT_GATEWAY,
          destinationCidrBlock: '192.168.0.0/16',
        });
      });
    });

    this.globalNetwork?.registerTransitGateway(transitGateway.node.addr, {
      transitGateway: transitGateway,
    });

    this._clientVpns.forEach((x) => {
      x.registerTransitGateway(transitGateway);
    });

    this._transitGateway = transitGateway;
    return this._transitGateway;
  }
}