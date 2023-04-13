import { VpcIpamOptions } from 'aws-cdk-lib/aws-ec2';
import { IIpamPool } from '../../ipam-pool-base';


export interface ICidrProvider {
  readonly ipamOptions: VpcIpamOptions;
  readonly ipamPool?: IIpamPool;
  readonly netmask: number;
}

export class CidrProvider {
  public static cidr(cidr: string): ICidrProvider {
    return {
      ipamOptions: {
        cidrBlock: cidr,
      },
      netmask: parseInt(cidr.split('/')[0]),
    };
  }

  public static ipamPool(pool: IIpamPool, netmask: number): ICidrProvider {
    return {
      ipamOptions: {
        ipv4IpamPoolId: pool.ipamPoolId,
        ipv4NetmaskLength: netmask,
      },
      ipamPool: pool,
      netmask: netmask,
    };
  }
}