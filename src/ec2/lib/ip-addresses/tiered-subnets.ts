import { AllocateCidrRequest, IIpAddresses, SubnetIpamOptions, Vpc, VpcIpamOptions } from 'aws-cdk-lib/aws-ec2';
import { divideCidr } from '../../../utils/networking';


export class TieredSubnetsOptions {
  public readonly cidr?: string;
  public readonly tierMask?: number;
}

export class TieredSubnets implements IIpAddresses {
  public readonly cidr: string;
  public readonly tierMask?: number;

  public constructor(options: TieredSubnetsOptions) {
    this.cidr = options.cidr ?? Vpc.DEFAULT_CIDR_RANGE;
    this.tierMask = options.tierMask;
  }

  public allocateVpcCidr(): VpcIpamOptions {
    return {
      cidrBlock: this.cidr,
    };
  }

  public allocateSubnetsCidr(input: AllocateCidrRequest): SubnetIpamOptions {
    const tiers = Array.from(new Set<string>(input.requestedSubnets.map((x) => {
      return x.configuration.name;
    })));

    const azs = Array.from(new Set<string>(input.requestedSubnets.map((x) => {
      return x.availabilityZone;
    })));

    const networkMap: {[tier: string]: {[az: string]: string}} = {};
    const tierNetworks = divideCidr(input.vpcCidr, tiers.length, this.tierMask);
    tiers.forEach((tier, tIdx) => {
      networkMap[tier] = {};

      const tierSubnets = input.requestedSubnets.filter((x) => {
        return x.configuration.name === tier;
      });

      const maskBits = Array.from(new Set(tierSubnets.map((x) => {
        return x.configuration.cidrMask;
      })));

      if (maskBits.length > 1) {
        throw new Error([
          'When specifying a custom subnet CidrMask for tiered',
          'subnets all subnets in the same tier must share the have',
          'the same CidrMask.',
        ].join(' '));
      }

      const azNetworks = divideCidr(tierNetworks[tIdx], azs.length, maskBits[0]);
      azs.forEach((az, azIdx) => {
        networkMap[tier][az] = azNetworks[azIdx];
      });
    });

    return {
      allocatedSubnets: input.requestedSubnets.map((x) => {
        return {
          cidr: networkMap[x.configuration.name][x.availabilityZone],
        };
      }),
    };
  }
}
