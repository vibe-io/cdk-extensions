import { ArnFormat, IResolvable, Resource, Token } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { AddressConfiguration, AdvertiseService } from '.';
import { IIpamPool, IpamPool, PublicIpSource } from './ipam-pool';
import { IIpamScope, IpamScopeAttributes } from './ipam-scope';
import { ResourceImporter } from '../utils/importer';


export interface IPublicIpamScope extends IIpamScope {
  addAwsProvidedIpv6Pool(id: string, options: AddAwsProvidedIpv6PoolOptions): IIpamPool;
  addByoipIpv4Pool(id: string, options: AddByoipIpv4PoolOptions): IIpamPool;
  addByoipIpv6Pool(id: string, options: AddByoipIpv6PoolOptions): IIpamPool;
}

export interface AddAwsProvidedIpv6PoolOptions {
  readonly defaultNetmaskLength?: number;
  readonly description?: string;
  readonly locale: string;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
  readonly name?: string;
  readonly netmask?: number;
  readonly tagRestrictions?: { [key: string]: string };
}

export interface AddByoipIpv4PoolOptions {
  readonly advertiseService?: AdvertiseService;
  readonly defaultNetmaskLength?: number;
  readonly description?: string;
  readonly locale?: string;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
  readonly name?: string;
  readonly tagRestrictions?: { [key: string]: string };
}

export interface AddByoipIpv6PoolOptions {
  readonly advertiseService?: AdvertiseService;
  readonly defaultNetmaskLength?: number;
  readonly description?: string;
  readonly locale?: string;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
  readonly name?: string;
  readonly publiclyAdvertisable?: boolean;
  readonly tagRestrictions?: { [key: string]: string };
}

abstract class PublicIpamScopeBase extends Resource implements IPublicIpamScope {
  /**
   * The ARN of the scope.
   */
  public abstract readonly ipamScopeArn: string;

  /**
    * The ID of an IPAM scope.
    */
  public abstract readonly ipamScopeId: string;

  /**
    * The ARN of an IPAM.
    */
  public abstract readonly ipamScopeIpamArn: string;

  /**
    * Defines if the scope is the default scope or not.
    */
  public abstract readonly ipamScopeIsDefault: IResolvable;

  /**
    * The number of pools in a scope.
    */
  public abstract readonly ipamScopePoolCount: number;

  /**
    * The type of the scope.
    */
  public abstract readonly ipamScopeType: string;

  public addAwsProvidedIpv6Pool(id: string, options: AddAwsProvidedIpv6PoolOptions): IIpamPool {
    return new IpamPool(this, `pool-ipv6-${id}`, {
      addressConfiguration: AddressConfiguration.ipv6({
        advertiseService: AdvertiseService.EC2,
        defaultNetmaskLength: options.defaultNetmaskLength,
        maxNetmaskLength: options.maxNetmaskLength,
        minNetmaskLength: options.minNetmaskLength,
        publiclyAdvertisable: true,
      }),
      description: options.description,
      ipamScope: this,
      locale: options.locale,
      name: options.name,
      publicIpSource: PublicIpSource.AMAZON,
      tagRestrictions: options.tagRestrictions,
    });
  }

  public addByoipIpv4Pool(id: string, options: AddByoipIpv4PoolOptions): IIpamPool {
    return new IpamPool(this, `pool-ipv4-${id}`, {
      addressConfiguration: AddressConfiguration.ipv4({
        defaultNetmaskLength: options.defaultNetmaskLength,
        maxNetmaskLength: options.maxNetmaskLength,
        minNetmaskLength: options.minNetmaskLength,
      }),
      description: options.description,
      ipamScope: this,
      locale: options.locale,
      name: options.locale,
      publicIpSource: PublicIpSource.BYOIP,
      tagRestrictions: options.tagRestrictions,
    });
  }

  public addByoipIpv6Pool(id: string, options: AddByoipIpv6PoolOptions): IIpamPool {
    return new IpamPool(this, `pool-ipv6-${id}`, {
      addressConfiguration: AddressConfiguration.ipv6({
        advertiseService: options.advertiseService,
        defaultNetmaskLength: options.defaultNetmaskLength,
        maxNetmaskLength: options.maxNetmaskLength,
        minNetmaskLength: options.minNetmaskLength,
        publiclyAdvertisable: options.publiclyAdvertisable,
      }),
      description: options.description,
      ipamScope: this,
      locale: options.locale,
      name: options.name,
      publicIpSource: PublicIpSource.BYOIP,
      tagRestrictions: options.tagRestrictions,
    });
  }
}

export class PublicIpamScope {
  /**
   * The format for Amazon Resource Names (ARN's) for IPAM scope resources.
   */
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  /**
   * Imports an existing IPAM scope by specifying its Amazon Resource Name
   * (ARN).
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param ipamScopeArn The ARN of the existing IPAM scope to be imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeArn(scope: IConstruct, id: string, ipamScopeArn: string): IPublicIpamScope {
    return PublicIpamScope.fromIpamScopeAttributes(scope, id, {
      ipamScopeArn: ipamScopeArn,
    });
  }

  /**
   * Imports an existing IAPM scope by explicitly specifying its attributes.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attrs The attributes of the existing IPAM scope to be imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeAttributes(scope: IConstruct, id: string, attrs: IpamScopeAttributes): IPublicIpamScope {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: PublicIpamScope.ARN_FORMAT,
      service: 'ec2',
      resource: 'ipam-scope',
    });

    const identities = importer.resolveIdentities(attrs.ipamScopeArn, attrs.ipamScopeId);
    const props = importer.resolveProperties({
      ipamScopeIpamArn: attrs.ipam?.ipamArn,
      ipamScopeIsDefault: attrs.isDefault,
      ipamScopePoolCount: attrs.poolCount,
      ipamScopeType: attrs.scopeType,
    });

    class Import extends PublicIpamScopeBase {
      public readonly ipamScopeArn: string = identities.arn;
      public readonly ipamScopeId: string = identities.id;
      public readonly ipamScopeIpamArn: string = Token.asString(props.ipamScopeIpamArn);
      public readonly ipamScopeIsDefault: IResolvable = Token.asAny(props.ipamScopeIsDefault);
      public readonly ipamScopePoolCount: number = Token.asNumber(props.ipamScopePoolCount);
      public readonly ipamScopeType: string = Token.asString(props.ipamScopeType);
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing IPAM scope by explicitly specifying its AWS generated
   * ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param ipamScopeId The AWS generated ID of the existing IPAM scope to be
   * imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeId(scope: IConstruct, id: string, ipamScopeId: string): IPublicIpamScope {
    return PublicIpamScope.fromIpamScopeAttributes(scope, id, {
      ipamScopeId: ipamScopeId,
    });
  }
}