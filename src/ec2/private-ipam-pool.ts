import { IConstruct } from 'constructs';
import { IpamPool } from './ipam-pool-base';
import { AddressConfiguration } from './lib';
import { IPrivateIpamScope } from './private-ipam-scope';


export interface PrivateIpamPoolProps {
  readonly autoImport?: boolean;
  readonly defaultNetmaskLength?: number;
  readonly description?: string;
  readonly locale?: string;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
  readonly name?: string;
  readonly provisionedCidrs?: string[];
  readonly scope: IPrivateIpamScope;
  readonly tagRestrictions?: { [key: string]: string };
}

export class PrivateIpamPool extends IpamPool {
  // Input properties
  public readonly description?: string;
  public readonly locale?: string;
  public readonly name?: string;
  public readonly scope: IPrivateIpamScope;


  public constructor(scope: IConstruct, id: string, props: PrivateIpamPoolProps) {
    super(scope, id, {
      addressConfiguration: AddressConfiguration.ipv4({
        defaultNetmaskLength: props.defaultNetmaskLength,
        maxNetmaskLength: props.maxNetmaskLength,
        minNetmaskLength: props.minNetmaskLength,
      }),
      description: props.description,
      ipamScope: props.scope,
      locale: props.locale,
      name: props.name,
      tagRestrictions: props.tagRestrictions,
    });

    this.description = props.description;
    this.locale = props.locale;
    this.name = props.name;
    this.scope = props.scope;
  }
}