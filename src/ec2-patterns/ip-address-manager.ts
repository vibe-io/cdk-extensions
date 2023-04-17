import { Resource, ResourceProps, Stack, Token } from 'aws-cdk-lib';
import { Fact, RegionInfo } from 'aws-cdk-lib/region-info';
import { IConstruct } from 'constructs';
import { IIpamPool, Ipam, IpamPool, IpamPoolCidrConfiguration, IpamPoolProps, IpamScope, IPAM_ENABLED_FACT } from '../ec2';
import { AddChildPoolOptions, AddCidrToPoolOptions, AddCidrToPoolResult } from '../ec2/ipam-pool';
import { AddressConfiguration } from '../ec2/lib';
import { ICidrProvider, CidrProvider } from '../ec2/lib/ip-addresses/network-provider';
import { ResourceShare, SharedPrincipal } from '../ram';
import { SharedResource } from '../ram-resources';


interface CascadingIpamPoolProps extends IpamPoolProps {
  readonly cascade?: boolean;
}

interface CascadingAddChildPoolOptions extends AddChildPoolOptions {
  readonly cascade?: boolean;
}

class CascadingIpamPool extends IpamPool {
  private readonly cascade: boolean;


  public constructor(scope: IConstruct, id: string, props: CascadingIpamPoolProps) {
    super(scope, id, props);

    this.cascade = props.cascade ?? true;
  }

  public addCidrToPool(id: string, options: AddCidrToPoolOptions): AddCidrToPoolResult {
    const result = super.addCidrToPool(id, options);

    if (this.parentPool && this.cascade) {
      const parentResult = this.parentPool.addCidrToPool(`${id}-${this.node.addr}`, options);
      if (parentResult.cidr) {
        result.cidr?.node.addDependency(parentResult.cidr);
      }
    }

    return result;
  }

  public addChildPool(id: string, options?: CascadingAddChildPoolOptions): IIpamPool {
    if (!this.validateChildLocale(options?.locale)) {
      throw new Error([
        `Cannot add IPAM pool with a locale of '${options!.locale}' to IPAM`,
        `pool '${this.node.path}' with the locale '${this.locale}'.`,
      ].join(' '));
    }

    return new CascadingIpamPool(this, `pool-${id}`, {
      locale: this.locale,
      ...options,
      ipamScope: IpamScope.fromIpamScopeAttributes(this, `import-scope-${id}`, {
        ipamScopeArn: this.ipamPoolScopeArn,
        scopeType: this.ipamPoolScopeType,
      }),
      parentPool: this,
    });
  }
}

export interface IpAddressManagerSharingProps {
  readonly allowExternalPricipals?: boolean;
  readonly enabled?: boolean;
}

export interface IpAddressManagerProps extends ResourceProps {
  readonly vpcAllocationMask?: number;
  readonly vpcPoolCidrs?: string[];
  readonly vpcRegionMask?: number;
  readonly regions?: string[];
  readonly sharing?: IpAddressManagerSharingProps;
}

export interface AddPoolOptions {
  readonly cidrs?: string[];
  readonly defaultNetmaskLength?: number;
}

export interface AllocatePrivateNetworkOptions {
  readonly netmask?: number;
  readonly pool?: string;
}

export interface GetVpcConfigurationOptions {
  readonly netmask?: number;
}

export class IpAddressManager extends Resource {
  public static readonly DEFAULT_VPC_ALLOCATION_MASK: number = 16;
  public static readonly DEFAULT_VPC_POOL_CIDRS: string[] = [
    '10.0.0.0/8',
  ];
  public static readonly DEFAULT_VPC_REGION_MASK: number = 11;

  // Internal properties
  private readonly privateVpcPool: CascadingIpamPool;

  // Input properties
  public readonly allowExternalPricipals: boolean;
  public readonly sharingEnabled: boolean;
  public readonly vpcAllocationMask: number;

  // Resource properties
  public readonly ipam: Ipam;

  public get resourceShare(): ResourceShare | undefined {
    return this.resourceShare;
  }


  public constructor(scope: IConstruct, id: string, props: IpAddressManagerProps = {}) {
    super(scope, id);

    this.allowExternalPricipals = props.sharing?.allowExternalPricipals ?? true;
    this.sharingEnabled = props.sharing?.enabled ?? true;
    this.vpcAllocationMask = props.vpcAllocationMask ?? IpAddressManager.DEFAULT_VPC_ALLOCATION_MASK;

    this.ipam = new Ipam(this, 'ipam', {
      description: 'Global IP address manager.',
    });

    this.privateVpcPool = new CascadingIpamPool(this, 'private-vpc-pool', {
      addressConfiguration: AddressConfiguration.ipv4({}),
      ipamScope: this.ipam.defaultPrivateScope,
      name: 'vpc',
      provisionedCidrs: props.vpcPoolCidrs ?? IpAddressManager.DEFAULT_VPC_POOL_CIDRS,
    });

    const localRegion = RegionInfo.get(this.stack.region);
    const localPartition = Token.isUnresolved(this.stack.partition) ? localRegion.partition : this.stack.partition;
    const regions = props.regions ?? RegionInfo.regions.filter((x) => {
      return !x.isOptInRegion;
    }).filter((x) => {
      return Fact.find(x.name, IPAM_ENABLED_FACT) === 'ENABLED';
    }).filter((x) => {
      return x.partition === localPartition;
    }).map((x) => {
      return x.name;
    });

    regions.forEach((x) => {
      this.addRegion(x);
    });
  }

  public addRegion(region: string): void {
    this.ipam.addRegion(region);
  }

  protected privateVpcPoolForRegion(region: string): IIpamPool {
    if (Token.isUnresolved(region)) {
      throw new Error([
        'Resources requesting private CIDR ranges from IP address manager',
        'must have a fully resolved region.',
      ].join(' '));
    }

    return this.privateVpcPool.node.tryFindChild(`pool-${region}`) as IIpamPool ?? this.privateVpcPool.addChildPool(region, {
      cascade: false,
      locale: region,
      name: region,
    });
  }

  protected privateVpcPoolForEnvironment(account: string, region: string): IIpamPool {
    if (Token.isUnresolved(account) || Token.isUnresolved(region)) {
      throw new Error([
        'Resources requesting private CIDR ranges from IP address manager',
        'must have a fully resolved environment.',
      ].join(' '));
    }

    const regional = this.privateVpcPoolForRegion(region);
    const existingPool = regional.node.tryFindChild(`pool-${account}`) as IIpamPool;

    if (existingPool) {
      return existingPool;
    } else {
      const newPool = regional.addChildPool(account, {
        addressConfiguration: AddressConfiguration.ipv4(),
        autoImport: true,
        name: account,
      });

      return newPool;
    }
  }

  public getVpcConfiguration(scope: IConstruct, id: string, options: GetVpcConfigurationOptions = {}): ICidrProvider {
    const scopeStack = Stack.of(scope);
    const scopeAccount = scopeStack.account;
    const scopeRegion = scopeStack.region;

    const netmask = options.netmask ?? this.vpcAllocationMask;
    const scopePool = this.privateVpcPoolForEnvironment(scopeAccount, scopeRegion);
    scopePool.addCidrToPool(id, {
      configuration: IpamPoolCidrConfiguration.netmask(netmask),
    });

    return CidrProvider.ipamPool(scopePool, netmask);
  }

  protected registerAccount(account: string, pool: IIpamPool): void {
    if (account === this.stack.account) {
      return;
    } else if (!this.sharingEnabled) {
      throw new Error([
        `Attempted to allocated IP address space to account '${account}' from`,
        `IP Address Manager in '${this.stack.account}' however sharing of`,
        'IPAM resources is disabled.',
      ].join(' '));
    }

    const resourceShareId = `resource-share-${account}`;
    const resourceShare = this.node.tryFindChild(resourceShareId) as ResourceShare ?? new ResourceShare(this, resourceShareId, {
      allowExternalPrincipals: this.allowExternalPricipals,
      autoDiscoverAccounts: false,
      principals: [
        SharedPrincipal.fromAccountId(account),
      ],
    });

    resourceShare.addResource(SharedResource.fromIpamPool(pool));
  }

  public registerCidr(scope: IConstruct, id: string, cidr: string): void {
    const scopeStack = Stack.of(scope);
    const scopeAccount = scopeStack.account;
    const scopeRegion = scopeStack.region;

    const scopePool = this.privateVpcPoolForEnvironment(scopeAccount, scopeRegion);
    scopePool.addCidrToPool(id, {
      configuration: IpamPoolCidrConfiguration.cidr(cidr),
      allowInline: true,
    });
  }
}