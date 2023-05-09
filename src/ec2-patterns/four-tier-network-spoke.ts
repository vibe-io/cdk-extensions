import { Aspects, ResourceProps } from 'aws-cdk-lib';
import { CfnRoute, DefaultInstanceTenancy, FlowLogOptions, GatewayVpcEndpointOptions, PrivateSubnet, RouterType, SubnetSelection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FourTierNetwork, FourTierNetworkHub, IpAddressManager } from '.';
import { IIpamPool, ITransitGatewayAttachment } from '../ec2';
import { IIpv4CidrAssignment } from '../ec2/lib/cidr-assignment';
import { ITransitGateway } from '../ec2/transit-gateway';


export interface FourTierNetworkSpokeProps extends ResourceProps {
  readonly addressManager?: IpAddressManager;
  readonly availabilityZones?: string[];
  readonly cidr?: IIpv4CidrAssignment;
  readonly clientVpnPool?: IIpamPool;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[id: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[id: string]: GatewayVpcEndpointOptions};
  readonly hub: FourTierNetworkHub;
  readonly maxAzs?: number;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export class FourTierNetworkSpoke extends FourTierNetwork {
  public readonly transitGateway: ITransitGateway;
  public readonly transitGatewayAttachment: ITransitGatewayAttachment;


  public constructor(scope: IConstruct, id: string, props: FourTierNetworkSpokeProps) {
    super(scope, id, {
      ...props,
      natGateways: 0,
    });

    this.transitGateway = props.hub.transitGateway ?? props.hub.enableTransitGateway();
    this.transitGatewayAttachment = this.transitGateway.attachVpc(this, {
      subnets: {
        onePerAz: true,
        subnetGroupName: 'dmz',
      },
    });

    (this.privateSubnets as PrivateSubnet[]).forEach((x) => {
      x.addRoute('DefaultRoute', {
        enablesInternetConnectivity: true,
        routerId: this.transitGateway.transitGatewayId,
        routerType: RouterType.TRANSIT_GATEWAY,
      });
    });

    Aspects.of(this).add({
      visit: (node: IConstruct) => {
        if (node instanceof CfnRoute) {
          node.node.addDependency(this.transitGatewayAttachment);
        }
      },
    });
  }
}