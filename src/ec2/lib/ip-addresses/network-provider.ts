import { VpcIpamOptions } from 'aws-cdk-lib/aws-ec2';
import { IIpamPool } from '../..';


export interface INetworkProvider {
  readonly ipamOptions: VpcIpamOptions;
  readonly netmask: number;
}

export class NetworkProvider {
  public static cidr(cidr: string): INetworkProvider {
    return {
      ipamOptions: {
        cidrBlock: cidr,
      },
      netmask: parseInt(cidr.split('/')[0]),
    };
  }

  public static ipamPool(pool: IIpamPool, netmask: number): INetworkProvider {
    return {
      ipamOptions: {
        ipv4IpamPoolId: pool.ipamPoolId,
        ipv4NetmaskLength: netmask,
      },
      netmask: netmask,
    };
  }
}