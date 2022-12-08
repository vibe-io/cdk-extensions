import { ResourceProps } from 'aws-cdk-lib';
import { DefaultInstanceTenancy } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FourTierNetwork } from '.';
import { NatProvider } from '../ec2/lib/nat-providers/nat-provider';
import { ITransitGateway } from '../ec2/transit-gateway';


export interface FourTierNetworkSpokeProps extends ResourceProps {
  readonly availabilityZones?: string[];
  readonly cidr?: string;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly transitGateway: ITransitGateway;
}

export class FourTierNetworkSpoke extends FourTierNetwork {
  public constructor(scope: IConstruct, id: string, props: FourTierNetworkSpokeProps) {
    super(scope, id, {
      availabilityZones: props?.availabilityZones,
      defaultInstanceTenancy: props?.defaultInstanceTenancy,
      enableDnsHostnames: props?.enableDnsHostnames,
      enableDnsSupport: props?.enableDnsSupport,
      natGatewayProvider: NatProvider.transitGateway({
        transitGateway: props.transitGateway,
      }),
      natGatewaySubnets: {
        onePerAz: true,
        subnetGroupName: 'dmz',
      },
    });
  }
}