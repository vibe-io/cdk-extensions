import { IConstruct } from 'constructs';
import { IIpamPool, IIpv4IpamPool, IIpv6IpamPool, IpamAllocationConfiguration } from '..';


export enum AddressFamily {
  IPV4 = 'ipv4',
  IPV6 = 'ipv6',
}

export interface CidrAssignmentCidrDetails {
  readonly family: AddressFamily;
  readonly cidr: string;
  readonly netmask: number;
}

export interface CidrAssignmentIpamDetails {
  readonly amazonAllocated?: boolean;
  readonly family: AddressFamily;
  readonly ipamPool?: IIpamPool;
  readonly netmask: number;
}

export interface CidrAssignmentDetails {
  readonly cidrDetails?: CidrAssignmentCidrDetails;
  readonly ipamDetails?: CidrAssignmentIpamDetails;
}

export interface CidrAssignmentBindOptions {
  readonly maxNetmask?: number;
  readonly minNetmask?: number;
}

export interface ICidrAssignment {
  getCidr(scope: IConstruct, id: string, options: CidrAssignmentBindOptions): CidrAssignmentCidrDetails;
  getCidrOrIpamConfiguration(options: CidrAssignmentBindOptions): CidrAssignmentDetails;
}

export interface IIpv4CidrAssignment extends ICidrAssignment {}

export interface Ipv4CidrAssignmentCustomOptions {
  readonly cidr: string;
}

export interface Ipv4CidrAssignmentIpamPoolOptions {
  readonly allocationId?: string;
  readonly netmask?: number;
  readonly pool: IIpv4IpamPool;
}

export class Ipv4CidrAssignment {
  public static custom(options: Ipv4CidrAssignmentCustomOptions): IIpv4CidrAssignment {
    const cidr = options.cidr;

    return {
      getCidr: () => {
        return {
          cidr: cidr,
          family: AddressFamily.IPV4,
          netmask: parseInt(cidr.split('/')[1]),
        };
      },
      getCidrOrIpamConfiguration: () => {
        return {
          cidrDetails: {
            cidr: cidr,
            family: AddressFamily.IPV4,
            netmask: parseInt(cidr.split('/')[1]),
          },
        };
      },
    };
  }

  public static ipamPool(options: Ipv4CidrAssignmentIpamPoolOptions): IIpv4CidrAssignment {
    const pool = options.pool;
    const netmask = options.netmask ?? 16;

    return {
      getCidr: (scope: IConstruct, id: string) => {
        const allocation = pool.allocateCidrFromPool(id, {
          allocation: IpamAllocationConfiguration.netmask(netmask),
          scope: scope,
        });

        return {
          cidr: allocation.ipamAllocationCidr,
          family: AddressFamily.IPV4,
          netmask: netmask,
        };
      },
      getCidrOrIpamConfiguration: () => {
        return {
          ipamDetails: {
            family: AddressFamily.IPV4,
            ipamPool: pool,
            netmask: netmask,
          },
        };
      },
    };
  }
}


export interface IIpv6CidrAssignment extends ICidrAssignment {}

export interface Ipv6CidrAssignmentCustomOptions {
  readonly cidr: string;
}

export interface Ipv6CidrAssignmentIpamPoolOptions {
  readonly allocationId?: string;
  readonly netmask?: number;
  readonly pool: IIpv6IpamPool;
}

export class Ipv6CidrAssignment {
  public static custom(options: Ipv4CidrAssignmentCustomOptions): IIpv6CidrAssignment {
    const cidr = options.cidr;

    return {
      getCidr: () => {
        return {
          cidr: cidr,
          family: AddressFamily.IPV6,
          netmask: parseInt(cidr.split('/')[1]),
        };
      },
      getCidrOrIpamConfiguration: () => {
        return {
          cidrDetails: {
            cidr: cidr,
            family: AddressFamily.IPV6,
            netmask: parseInt(cidr.split('/')[1]),
          },
        };
      },
    };
  }

  public static ipamPool(options: Ipv6CidrAssignmentIpamPoolOptions): IIpv6CidrAssignment {
    const pool = options.pool;
    const netmask = options.netmask ?? 64;

    return {
      getCidr: (scope: IConstruct, id: string) => {
        const allocation = pool.allocateCidrFromPool(id, {
          allocation: IpamAllocationConfiguration.netmask(netmask),
          scope: scope,
        });

        return {
          cidr: allocation.ipamAllocationCidr,
          family: AddressFamily.IPV6,
          netmask: netmask,
        };
      },
      getCidrOrIpamConfiguration: () => {
        return {
          ipamDetails: {
            family: AddressFamily.IPV6,
            ipamPool: pool,
            netmask: netmask,
          },
        };
      },
    };
  }
}