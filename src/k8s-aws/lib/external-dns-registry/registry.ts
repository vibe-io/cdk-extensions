import { AwsServiceDiscoveryRegistry } from './aws-service-discovery-registry';
import { NoopRegistry } from './noop-registry';
import { TxtRegistry, TxtRegistryOptions } from './txt-registry';


/**
 * Helper class that provides access to the available ExternalDns registry
 * options.
 */
export class ExternalDnsRegistry {
  /**
     * An ExternalDNS registry that tracks DNS record ownership information
     * using AWS Service Discovery.
     *
     * @see [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html)
     *
     * @returns A ExternalDNS registry object configured to use AWS Cloud Map
     * for ownership information.
     */
  public static awsServiceDiscovery(): AwsServiceDiscoveryRegistry {
    return new AwsServiceDiscoveryRegistry();
  }

  /**
     * A placeholder ExternalDNS registry that says ExternalDNS should use not
     * use a registry.
     *
     * When configuring ExternalDNS without a registry, the service has no idea
     * the original creator and maintainer of DNS records. This means that
     * there are likely to be conflicts if there are multiple services that
     * could create or change DNS records in the same zone.
     *
     * @returns An object that instructs ExternalDNS to not store record
     * ownership information and will perform record updates without
     * validation.
     */
  public static noop(): NoopRegistry {
    return new NoopRegistry();
  }

  /**
     * An ExternalDNS registry that tracks DNS record ownership information
     * using DNS TXT records.
     *
     * @see [About TXT records](https://support.google.com/a/answer/2716800?hl=en)
     *
     * @param options Options configuring how ExternalDNS will use TXT records
     * to validate ownership.
     * @returns A ExternalDNS registry object configured to use DNS TXT records
     * for ownership information.
     */
  public static txt(options: TxtRegistryOptions={}): TxtRegistry {
    return new TxtRegistry(options);
  }
}