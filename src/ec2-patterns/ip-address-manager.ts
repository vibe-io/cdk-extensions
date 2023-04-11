import { Resource, ResourceProps, Stack, Token } from 'aws-cdk-lib';
import { Fact, RegionInfo } from 'aws-cdk-lib/region-info';
import { IConstruct } from 'constructs';
import { IIpamPool, Ipam, IpamPool, IpamPoolCidrConfiguration, IPAM_ENABLED_FACT } from '../ec2';
import { AddressConfiguration } from '../ec2/lib';
import { ResourceShare, SharedPrincipal } from '../ram';
import { SharedResource } from '../ram-resources';


export interface IpAddressManagerSharingProps {
  readonly allowExternalPricipals?: boolean;
  readonly enabled?: boolean;
}

export interface IpAddressManagerProps extends ResourceProps {
  readonly defaultPoolCidrs?: string[];
  readonly defaultPoolAllocationMask?: number;
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

export class IpAddressManager extends Resource {
  public static readonly DEFAULT_CIDR: string = '10.0.0.0/8';
  public static readonly DEFAULT_POOL_ALLOCATION_MASK: number = 16;

  // Internal properties
  private readonly _privatePools: { [key: string]: IIpamPool };

  // Input properties
  public readonly allowExternalPricipals: boolean;
  public readonly sharingEnabled: boolean;

  // Resource properties
  public readonly ipam: Ipam;

  public get resourceShare(): ResourceShare | undefined {
    return this.resourceShare;
  }


  public constructor(scope: IConstruct, id: string, props: IpAddressManagerProps = {}) {
    super(scope, id);

    this._privatePools = {};

    this.allowExternalPricipals = props.sharing?.allowExternalPricipals ?? true;
    this.sharingEnabled = props.sharing?.enabled ?? true;

    this.ipam = new Ipam(this, 'ipam', {
      description: 'Global IP address manager.',
    });

    this.addPrivatePool('default', {
      cidrs: props.defaultPoolCidrs ?? [
        IpAddressManager.DEFAULT_CIDR,
      ],
      defaultNetmaskLength: props.defaultPoolAllocationMask ?? IpAddressManager.DEFAULT_POOL_ALLOCATION_MASK,
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

  public addPrivatePool(name: string, options: AddPoolOptions = {}): IIpamPool {
    if (name in this._privatePools) {
      throw new Error([
        'Attempted to register a duplicate private IPAM pool with the name',
        `'${name}'.`,
      ].join());
    }

    const pool = this.ipam.defaultPrivateScope.addPool(name, {
      addressConfiguration: AddressConfiguration.ipv4({
        defaultNetmaskLength: options.defaultNetmaskLength,
      }),
      name: name,
      provisionedCidrs: options.cidrs,
    });

    this._privatePools[name] = pool;
    return pool;
  }

  public addRegion(region: string): void {
    this.ipam.addRegion(region);
  }

  protected addStagePool(scope: IConstruct, parent: IIpamPool): IpamPool {
    const scopeStack = Stack.of(scope);
    const scopeName = `${scopeStack.account}-${scopeStack.region}`;

    const existingPool = parent.node.tryFindChild(`pool-${scopeName}`) as IpamPool;
    if (existingPool) {
      return existingPool;
    }

    const newPool = parent.addChildPool(scopeName, {
      addressConfiguration: AddressConfiguration.ipv4(),
      name: scopeName,
    });

    this.registerAccount(scopeStack.account, newPool);
    return newPool as IpamPool;
  }

  public allocatePrivateNetwork(scope: IConstruct, id: string, options: AllocatePrivateNetworkOptions = {}): IpamPool {
    const poolName = options.pool ?? 'default';
    const pool = this._privatePools[poolName];

    if (pool === undefined) {
      throw new Error([
        `No pool named '${poolName}' found in IP address manager.`,
      ].join(' '));
    }

    const scopePool = this.addStagePool(scope, pool);

    const mask = options.netmask ?? scopePool.addressConfiguration?.defaultNetmaskLength ?? 16;
    scopePool.addCidrToPool(id, {
      configuration: IpamPoolCidrConfiguration.netmask(mask),
    });

    return scopePool;
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
}