import { ResourceProps } from 'aws-cdk-lib';
import { DefaultInstanceTenancy, FlowLogOptions, GatewayVpcEndpointOptions, PrivateSubnet, RouterType, SubnetSelection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FourTierNetwork } from '.';
import { ITransitGatewayAttachment } from '../ec2';
import { INetworkProvider } from '../ec2/lib/ip-addresses/network-provider';
import { ITransitGateway } from '../ec2/transit-gateway';


export interface FourTierNetworkSpokeProps extends ResourceProps {
  readonly availabilityZones?: string[];
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[id: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[id: string]: GatewayVpcEndpointOptions};
  readonly maxAzs?: number;
  readonly networkProvider?: INetworkProvider;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
  readonly transitGateway: ITransitGateway;
}

export class FourTierNetworkSpoke extends FourTierNetwork {
  public readonly transitGatewayAttachment: ITransitGatewayAttachment;


  public constructor(scope: IConstruct, id: string, props: FourTierNetworkSpokeProps) {
    super(scope, id, {
      ...props,
      natGateways: 0,
    });

    this.transitGatewayAttachment = props.transitGateway.attachVpc(this, {
      subnets: {
        onePerAz: true,
        subnetGroupName: 'dmz',
      },
    });

    (this.privateSubnets as PrivateSubnet[]).forEach((x) => {
      x.addRoute('DefaultRoute', {
        routerId: props.transitGateway.transitGatewayId,
        routerType: RouterType.TRANSIT_GATEWAY,
        enablesInternetConnectivity: true,
      });
    });
  }
}