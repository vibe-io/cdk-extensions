import { IConstruct } from 'constructs';
import { IpamPool } from './ipam-pool-base';
import { AddressConfiguration, AdvertiseService } from './lib';
import { IPublicIpamScope } from './public-ipam-scope';


export interface AwsProvidedIpv6IpamPoolProps {
  readonly defaultNetmaskLength?: number;
  readonly description?: string;
  readonly locale: string;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
  readonly name?: string;
  readonly netmask?: number;
  readonly scope: IPublicIpamScope;
  readonly tagRestrictions?: { [key: string]: string };
}

export class AwsProvidedIpv6IpamPool extends IpamPool {
  // Static properties
  public static readonly DEFAULT_NETMASK: number = 40;

  // Input properties
  public readonly description?: string;
  public readonly locale: string;
  public readonly name?: string;
  public readonly netmask: number;
  public readonly scope: IPublicIpamScope;


  public constructor(scope: IConstruct, id: string, props: AwsProvidedIpv6IpamPoolProps) {
    const netmask = props.netmask ?? AwsProvidedIpv6IpamPool.DEFAULT_NETMASK;

    super(scope, id, {
      addressConfiguration: AddressConfiguration.ipv6({
        advertiseService: AdvertiseService.EC2,
        defaultNetmaskLength: props.defaultNetmaskLength,
        maxNetmaskLength: props.maxNetmaskLength,
        minNetmaskLength: props.minNetmaskLength,
        publiclyAdvertisable: true,
      }),
      description: props.description,
      ipamScope: props.scope,
      locale: props.locale,
      name: props.name,
      tagRestrictions: props.tagRestrictions,
    });

    this.description = props.description;
    this.locale = props.locale;
    this.netmask = netmask;
    this.name = props.name;
    this.scope = props.scope;
  }
}