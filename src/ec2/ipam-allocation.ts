import { Fn, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnIPAMAllocation } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { IIpamPool } from './ipam-pool';
import { DynamicReference } from '../core/dynamic-reference';


export interface ResolvedIpamAllocationConfiguration {
  readonly cidr?: string;
  readonly netmaskLength?: number;
}

export interface IIpamAllocationConfiguration {
  bind(scope: IConstruct): ResolvedIpamAllocationConfiguration;
}

export class IpamAllocationConfiguration {
  public static auto(): IIpamAllocationConfiguration {
    return {
      bind: (_scope: IConstruct) => {
        return {};
      },
    };
  }

  public static cidr(cidr: string): IIpamAllocationConfiguration {
    return {
      bind: (_scope: IConstruct) => {
        return {
          cidr: cidr,
        };
      },
    };
  }

  public static netmask(length: number): IIpamAllocationConfiguration {
    return {
      bind: (_scope: IConstruct) => {
        return {
          netmaskLength: length,
        };
      },
    };
  }
}

export interface IIpamAllocation {
  readonly ipamAllocationCidr: string;
  readonly ipamAllocationId: string;
}

abstract class IpamAllocationBase extends Resource implements IIpamAllocation {
  public abstract readonly ipamAllocationCidr: string;
  public abstract readonly ipamAllocationId: string;
}

export interface IpamAllocationOptions {
  readonly allocation?: IIpamAllocationConfiguration;
  readonly description?: string;
}

export interface IpamAllocationProps extends ResourceProps, IpamAllocationOptions {
  readonly ipamPool: IIpamPool;
}

export class IpamAllocation extends IpamAllocationBase {
  // Input properties
  public readonly allocation: IIpamAllocationConfiguration;
  public readonly description?: string;
  public readonly ipamPool: IIpamPool;

  // Resource properties
  public readonly resource: CfnIPAMAllocation;

  public readonly ipamAllocationCidr: string;
  public readonly ipamAllocationId: string;


  public constructor(scope: IConstruct, id: string, props: IpamAllocationProps) {
    super(scope, id, props);

    this.allocation = props.allocation ?? IpamAllocationConfiguration.auto();
    this.description = props.description;
    this.ipamPool = props.ipamPool;

    const resolvedConfiguration = this.allocation.bind(this);

    this.resource = new CfnIPAMAllocation(this, 'Resource', {
      cidr: resolvedConfiguration.cidr,
      description: this.description,
      ipamPoolId: this.ipamPool.ipamPoolId,
      netmaskLength: resolvedConfiguration.netmaskLength,
    });

    this.ipamAllocationCidr = DynamicReference.string(this, Fn.select(2, Fn.split('|', this.resource.ref, 3)));
    this.ipamAllocationId = DynamicReference.string(this, this.resource.attrIpamPoolAllocationId);
  }
}