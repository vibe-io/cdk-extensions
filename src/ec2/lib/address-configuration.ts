export class AdvertiseService {
  public static readonly EC2: AdvertiseService = AdvertiseService.of('ec2');
  public static readonly NONE: AdvertiseService = new AdvertiseService();

  public static of(name: string): AdvertiseService {
    return new AdvertiseService(name);
  }


  private constructor(public readonly name?: string) {}
}

export interface NetmaskLengthOptions {
  readonly defaultNetmaskLength?: number;
  readonly maxNetmaskLength?: number;
  readonly minNetmaskLength?: number;
}

export interface Ipv4ConfigurationOptions extends NetmaskLengthOptions {}

export interface Ipv6ConfigurationOptions extends NetmaskLengthOptions {
  readonly advertiseService?: AdvertiseService;
  readonly publiclyAdvertisable?: boolean;
}

export interface AddressConfigurationProps extends NetmaskLengthOptions {
  readonly advertiseService?: AdvertiseService;
  readonly family: string;
  readonly publiclyAdvertisable?: boolean;
}

export class AddressConfiguration {
  public static ipv4(options: Ipv4ConfigurationOptions = {}): AddressConfiguration {
    const checkConstraints = (field: string, value?: number): void => {
      if (value !== undefined && (value < 0 || value > 32)) {
        throw new Error([
          'Netmasks for IPV4 CIDR ranges must be between 0 and 32. Got',
          `${value} for '${field}'.`,
        ].join(' '));
      }
    };

    checkConstraints('defaultNetmaskLength', options.defaultNetmaskLength);
    checkConstraints('maxNetmaskLength', options.maxNetmaskLength);
    checkConstraints('minNetmaskLength', options.minNetmaskLength);

    return AddressConfiguration.of({
      ...options,
      family: 'ipv4',
    });
  }

  public static ipv6(options: Ipv6ConfigurationOptions = {}): AddressConfiguration {
    const checkConstraints = (field: string, value?: number): void => {
      if (value !== undefined && (value < 0 || value > 128)) {
        throw new Error([
          'Netmasks for IPV6 CIDR ranges must be between 0 and 128. Got',
          `${value} for '${field}'.`,
        ].join(' '));
      }
    };

    checkConstraints('defaultNetmaskLength', options.defaultNetmaskLength);
    checkConstraints('maxNetmaskLength', options.maxNetmaskLength);
    checkConstraints('minNetmaskLength', options.minNetmaskLength);

    return AddressConfiguration.of({
      ...options,
      family: 'ipv6',
    });
  }

  public static of(props: AddressConfigurationProps): AddressConfiguration {
    return new AddressConfiguration(props);
  }


  public readonly advertiseService?: AdvertiseService;
  public readonly defaultNetmaskLength?: number;
  public readonly family: string;
  public readonly publiclyAdvertisable?: boolean;
  public readonly maxNetmaskLength?: number;
  public readonly minNetmaskLength?: number;

  private constructor(props: AddressConfigurationProps) {
    this.advertiseService = props.advertiseService;
    this.defaultNetmaskLength = props.defaultNetmaskLength;
    this.family = props.family;
    this.publiclyAdvertisable = props.publiclyAdvertisable;
    this.maxNetmaskLength = props.maxNetmaskLength;
    this.minNetmaskLength = props.minNetmaskLength;
  }
}