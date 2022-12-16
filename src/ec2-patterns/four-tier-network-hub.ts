import { ResourceProps } from 'aws-cdk-lib';
import { DefaultInstanceTenancy, FlowLogOptions, GatewayVpcEndpointOptions, SubnetSelection, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FourTierNetwork } from '.';
import { NatProvider } from '../ec2/lib/nat-providers/nat-provider';
import { ITransitGateway } from '../ec2/transit-gateway';


export interface FourTierNetworkHubProps extends ResourceProps {
  readonly availabilityZones?: string[];
  readonly cidr?: string;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[id: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[id: string]: GatewayVpcEndpointOptions};
  readonly maxAzs?: number;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
  readonly transitGateway: ITransitGateway;
}

export class FourTierNetworkHub extends FourTierNetwork {
  public constructor(scope: IConstruct, id: string, props: FourTierNetworkHubProps) {
    super(scope, id, {
      ...props,
      natGatewayProvider: NatProvider.gateway(),
      natGatewaySubnets: {
        onePerAz: true,
        subnetGroupName: 'public',
      },
    });
  }
}