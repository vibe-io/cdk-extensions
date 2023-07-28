import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { TransitGatewayNatProvider, TransitGatewayNatProviderOptions } from './transit-gateway-provider';


export class NatProvider {
  public static gateway(props?: ec2.NatGatewayProps): ec2.NatProvider {
    return ec2.NatProvider.gateway(props);
  }

  public static instance(props: ec2.NatInstanceProps): ec2.NatProvider {
    return ec2.NatProvider.instance(props);
  }

  public static transitGateway(props: TransitGatewayNatProviderOptions): ec2.NatProvider {
    return new TransitGatewayNatProvider(props);
  }
}