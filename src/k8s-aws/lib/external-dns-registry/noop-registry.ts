import { IConstruct } from 'constructs';
import { IExternalDnsRegistry } from '.';
import { ExternalDnsRegistryConfiguration } from './registry-base';


/**
 * A placeholder ExternalDNS registry that says ExternalDNS should use not use
 * a registry.
 *
 * When configuring ExternalDNS without a registry, the service has no idea the
 * original creator and maintainer of DNS records. This means that there are
 * likely to be conflicts if there are multiple services that could create or
 * change DNS records in the same zone.
 */
export class NoopRegistry implements IExternalDnsRegistry {
  /**
     * The type name of ExternalDNS registry.
     */
  public readonly registryType: string;

  /**
     * Creates a new instance of the NoopRegistry class.
     */
  public constructor() {
    this.registryType = 'noop';
  }

  /**
     * Generates an object with all the information needed to use the registry
     * in a given CDK scope.
     *
     * @param _scope The CDK resource that is configuring ExternalDNS.
     * @returns A configuration object representing the implementation of this
     * registry.
     */
  public bind(_scope: IConstruct): ExternalDnsRegistryConfiguration {
    return {
      registryType: this.registryType,
    };
  }
}