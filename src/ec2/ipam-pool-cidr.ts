import { Resource, ResourceProps, Token } from 'aws-cdk-lib';
import { CfnIPAMPoolCidr } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { IIpamPool } from './ipam-pool';


export interface ResolvedIpamPoolCidrConfiguration {
  readonly cidr?: string;
  readonly netmaskLength?: number;
}

export interface IIpamPoolCidrConfiguration {
  readonly inline: boolean;

  bind(scope: IConstruct): ResolvedIpamPoolCidrConfiguration;
}

export class IpamPoolCidrConfiguration {
  public static cidr(cidr: string): IIpamPoolCidrConfiguration {
    return {
      inline: !Token.isUnresolved(cidr),
      bind: (_scope: IConstruct) => {
        return {
          cidr: cidr,
        };
      },
    };
  }

  public static netmask(length: number): IIpamPoolCidrConfiguration {
    return {
      inline: false,
      bind: (_scope: IConstruct) => {
        return {
          netmaskLength: length,
        };
      },
    };
  }
}

export interface IIpamPoolCidr {
  readonly ipamPoolCidrId: string;
  readonly ipamPoolCidrState: string;
}

abstract class IpamPoolCidrBase extends Resource implements IIpamPoolCidr {
  public abstract readonly ipamPoolCidrId: string;
  public abstract readonly ipamPoolCidrState: string;
}

export interface IpamPoolCidrProps extends ResourceProps {
  readonly configuration: IIpamPoolCidrConfiguration;
  readonly ipamPool: IIpamPool;
}

export class IpamPoolCidr extends IpamPoolCidrBase {
  // Input properties
  public readonly configuration: IIpamPoolCidrConfiguration;
  public readonly ipamPool: IIpamPool;

  // Resource properties
  public readonly resource: CfnIPAMPoolCidr;

  public readonly ipamPoolCidrId: string;
  public readonly ipamPoolCidrState: string;


  public constructor(scope: IConstruct, id: string, props: IpamPoolCidrProps) {
    super(scope, id, props);

    this.configuration = props.configuration;
    this.ipamPool = props.ipamPool;

    const resolvedConfiguration = this.configuration.bind(this);

    this.resource = new CfnIPAMPoolCidr(this, 'Resource', {
      cidr: resolvedConfiguration.cidr,
      ipamPoolId: this.ipamPool.ipamPoolId,
      netmaskLength: resolvedConfiguration.netmaskLength,
    });

    this.ipamPoolCidrId = this.resource.attrIpamPoolCidrId;
    this.ipamPoolCidrState = this.resource.attrState;
  }
}