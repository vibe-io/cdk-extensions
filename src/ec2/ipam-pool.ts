import { Annotations, CfnTag, Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnIPAMPool } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { AddressConfiguration } from '.';
import { IIpamAllocation, IpamAllocation, IpamAllocationOptions } from './ipam-allocation';
import { IIpamPoolCidr, IIpamPoolCidrConfiguration, IpamPoolCidr } from './ipam-pool-cidr';
import { IIpamScope, IpamScope } from './ipam-scope';


export class IpamConsumer {
  public static readonly EC2: IpamConsumer = IpamConsumer.of('ec2');

  public static of(name: string): IpamConsumer {
    return new IpamConsumer(name);
  }


  private constructor(public readonly name: string) {}
}

export class PublicIpSource {
  public static readonly AMAZON: PublicIpSource = PublicIpSource.of('amazon');
  public static readonly BYOIP: PublicIpSource = PublicIpSource.of('byoip');

  public static of(name: string): PublicIpSource {
    return new PublicIpSource(name);
  }


  private constructor(public readonly name: string) {}
}

export interface IIpamPool {
  readonly ipamPoolArn: string;
  readonly ipamPoolDepth: number;
  readonly ipamPoolIpamArn: string;
  readonly ipamPoolId: string;
  readonly ipamPoolScopeArn: string;
  readonly ipamPoolScopeType: string;
  readonly ipamPoolState: string;
  readonly ipamPoolStateMessage: string;

  addCidrToPool(id: string, options: AddCidrToPoolOptions): AddCidrToPoolResult;
  addChildPool(id: string, options?: AddChildPoolOptions): IIpamPool;
  allocateCidrFromPool(id: string, options?: IpamAllocationOptions): IIpamAllocation;
}

export interface AddChildPoolOptions {
  readonly addressConfiguration?: AddressConfiguration;
  readonly autoImport?: boolean;
  readonly consumer?: IpamConsumer;
  readonly description?: string;
  readonly locale?: string;
  readonly provisionedCidrs?: string[];
  readonly publicIpSource?: PublicIpSource;
  readonly tagRestrictions?: { [key: string]: string };
}

export interface AddCidrToPoolOptions {
  readonly allowInline?: boolean;
  readonly configuration: IIpamPoolCidrConfiguration;
}

export interface AddCidrToPoolResult {
  readonly cidr?: IIpamPoolCidr;
  readonly inline: boolean;
}

abstract class IpamPoolBase extends Resource implements IIpamPool {
  public abstract readonly ipamPoolArn: string;
  public abstract readonly ipamPoolDepth: number;
  public abstract readonly ipamPoolIpamArn: string;
  public abstract readonly ipamPoolId: string;
  public abstract readonly ipamPoolScopeArn: string;
  public abstract readonly ipamPoolScopeType: string;
  public abstract readonly ipamPoolState: string;
  public abstract readonly ipamPoolStateMessage: string;


  public addCidrToPool(id: string, options: AddCidrToPoolOptions): AddCidrToPoolResult {
    return {
      cidr: new IpamPoolCidr(this, `cidr-${id}`, {
        ...options,
        ipamPool: this,
      }),
      inline: false,
    };
  }

  public addChildPool(id: string, options: AddChildPoolOptions = {}): IIpamPool {
    return new IpamPool(this, `pool-${id}`, {
      ...options,
      ipamScope: IpamScope.fromIpamScopeAttributes(this, `import-scope-${id}`, {
        ipamScopeArn: this.ipamPoolScopeArn,
        scopeType: this.ipamPoolScopeType,
      }),
      parentPool: this,
    });
  }

  public allocateCidrFromPool(id: string, options: IpamAllocationOptions = {}): IIpamAllocation {
    return new IpamAllocation(this, `allocation-${id}`, {
      ...options,
      ipamPool: this,
    });
  }
}

export interface IpamPoolOptions {
  readonly addressConfiguration?: AddressConfiguration;
  readonly autoImport?: boolean;
  readonly consumer?: IpamConsumer;
  readonly description?: string;
  readonly locale?: string;
  readonly parentPool?: IIpamPool;
  readonly provisionedCidrs?: string[];
  readonly publicIpSource?: PublicIpSource;
  readonly tagRestrictions?: { [key: string]: string };
}

export interface IpamPoolProps extends ResourceProps, IpamPoolOptions {
  readonly ipamScope: IIpamScope;
}

export class IpamPool extends IpamPoolBase {
  // Internal properties
  private readonly _provisionedCidrs: string[];
  private readonly _tagRestrictions: { [key: string]: string };

  // Input properties
  public readonly addressConfiguration?: AddressConfiguration;
  public readonly autoImport?: boolean;
  public readonly consumer?: IpamConsumer;
  public readonly description?: string;
  public readonly ipamScope: IIpamScope;
  public readonly locale?: string;
  public readonly parentPool?: IIpamPool;
  public readonly publicIpSource?: PublicIpSource;

  // Resource properties
  public readonly resource: CfnIPAMPool;

  public readonly ipamPoolArn: string;
  public readonly ipamPoolDepth: number;
  public readonly ipamPoolIpamArn: string;
  public readonly ipamPoolId: string;
  public readonly ipamPoolScopeArn: string;
  public readonly ipamPoolScopeType: string;
  public readonly ipamPoolState: string;
  public readonly ipamPoolStateMessage: string;


  public constructor(scope: IConstruct, id: string, props: IpamPoolProps) {
    super(scope, id, props);

    this._tagRestrictions = {};
    this._provisionedCidrs = [];

    this.addressConfiguration = props.addressConfiguration ?? AddressConfiguration.ipv4();
    this.autoImport = props.autoImport;
    this.consumer = props.consumer;
    this.description = props.description;
    this.ipamScope = props.ipamScope;
    this.locale = props.locale;
    this.parentPool = props.parentPool;
    this.publicIpSource = props.publicIpSource;

    this.resource = new CfnIPAMPool(this, 'Resource', {
      addressFamily: this.addressConfiguration.family,
      allocationDefaultNetmaskLength: this.addressConfiguration.defaultNetmaskLength,
      allocationMaxNetmaskLength: this.addressConfiguration.maxNetmaskLength,
      allocationMinNetmaskLength: this.addressConfiguration.minNetmaskLength,
      allocationResourceTags: Lazy.any(
        {
          produce: () => {
            Object.keys(this._tagRestrictions).map((x): CfnTag => {
              return {
                key: x,
                value: this._tagRestrictions[x],
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      autoImport: this.autoImport,
      awsService: this.consumer?.name,
      description: this.description,
      ipamScopeId: this.ipamScope.ipamScopeId,
      locale: this.locale,
      provisionedCidrs: Lazy.any(
        {
          produce: () => {
            return this._provisionedCidrs.map((x): CfnIPAMPool.ProvisionedCidrProperty => {
              return {
                cidr: x,
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      publicIpSource: this.publicIpSource?.name,
      publiclyAdvertisable: this.addressConfiguration.publiclyAdvertisable,
      sourceIpamPoolId: this.parentPool?.ipamPoolId,
    });

    this.ipamPoolArn = this.resource.attrArn;
    this.ipamPoolDepth = this.resource.attrPoolDepth;
    this.ipamPoolId = this.resource.ref;
    this.ipamPoolIpamArn = this.resource.attrIpamArn;
    this.ipamPoolScopeArn = this.resource.attrIpamScopeArn;
    this.ipamPoolScopeType = this.resource.attrIpamScopeType;
    this.ipamPoolState = this.resource.attrState;
    this.ipamPoolStateMessage = this.resource.attrStateMessage;
  }

  public addCidrToPool(id: string, options: AddCidrToPoolOptions): AddCidrToPoolResult {
    if ((options.allowInline ?? true) && options.configuration.inline) {
      const resolvedConfiguration = options.configuration.bind(this);
      const cidr = resolvedConfiguration.cidr;

      if (!cidr) {
        Annotations.of(this).addWarning([
          'Attempted to register an inline IPAM pool CIDR using a',
          'configuration that does not provide a concrete CIDR. This likely',
          'indicates a misconfigured custom configuration. Attempting to fall',
          'back to using a non-inline implementation. Because binding was',
          'already attempted for an inline configuration consistency cannot',
          'be guaranteed.',
        ].join(' '));

        return super.addCidrToPool(id, options);
      }

      if (this._provisionedCidrs.includes(cidr)) {
        throw new Error([
          `Attempted to register duplicate cidr '${cidr}' to IPAM pool`,
          `'${this.node.path}.`,
        ].join(' '));
      }

      this._provisionedCidrs.push(cidr);

      return {
        inline: true,
      };
    } else {
      return super.addCidrToPool(id, options);
    }
  }

  public addTagRestriction(key: string, value: string): IIpamPool {
    if (key in this._tagRestrictions) {
      throw new Error([
        `Attempted to add duplicate tag restriction for key '${key}' to IPAM`,
        `pool '${this.node.path}'.`,
      ].join(' '));
    }

    this._tagRestrictions[key] = value;
    return this;
  }
}