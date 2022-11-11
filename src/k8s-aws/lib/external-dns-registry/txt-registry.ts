import { IConstruct } from 'constructs';
import { IExternalDnsRegistry } from '.';
import { ExternalDnsRegistryConfiguration } from './registry-base';


/**
 * Configuration options for setting up a TXT registry for ExternalDNS.
 */
export interface TxtRegistryOptions {
  /**
   * A unique identifier that is used to establish ownership of managed DNS
   * records.
   *
   * Prevents conflicts in the event of multiple clusters running external-dns.
   *
   * @default Unique address of the owning CDK node.
   */
  readonly ownerId?: string;

  /**
   * A prefix to be added top TXT ownership records.
   *
   * By default, the ownership record is a TXT record with the same name as the
   * managed record that was created. This causes issues as some record types
   * (CNAME's) do not allow duplicate records of a different type.
   *
   * This prefix is used to prevent such name collissions while still allowing
   * DNS ownership records to be created.
   *
   * @default 'edns.''
   */
  readonly prefix?: string;
}

/**
 * An ExternalDNS registry that tracks DNS record ownership information using
 * DNS TXT records.
 *
 * @see [About TXT records](https://support.google.com/a/answer/2716800?hl=en)
 */
export class TxtRegistry implements IExternalDnsRegistry {
  /**
     * The default prefix to append to TXT ownership records creates for the
     * registry.
     */
  public static readonly DEFAULT_PREFIX: string = 'edns.';

  /**
     * A special value that specifies ExternalDNS should not use any prefix
     * when creating TXT ownership records.
     *
     * This is not recommended as it is likely to cause issues with record
     * creation and management with some record types that do not allow other
     * records with the same name and different types to exist (CNAME's).
     *
     * However, if this behavior is desired this value can be passed as the
     * prefix to override the default behavior with will set a prefix if none
     * is provided as input.
     */
  public static readonly NO_PREFIX: string = '::NO_PREFIX::';

  /**
     * A unique identifier that is used to establish ownership of managed DNS
     * records.
     *
     * Prevents conflicts in the event of multiple clusters running external-dns.
     *
     * @group Inputs
     */
  readonly ownerId?: string;

  /**
     * A prefix to be added top TXT ownership records.
     *
     * By default, the ownership record is a TXT record with the same name as the
     * managed record that was created. This causes issues as some record types
     * (CNAME's) do not allow duplicate records of a different type.
     *
     * This prefix is used to prevent such name collissions while still allowing
     * DNS ownership records to be created.
     */
  public readonly prefix?: string;

  /**
     * The type name of ExternalDNS registry.
     */
  public readonly registryType: string;

  /**
     * Creates a new instance of the NoopRegistry class.
     *
     * @param options Options configuring how ExternalDNS will use TXT records
     * to validate ownership.
     */
  public constructor(options: TxtRegistryOptions={}) {
    this.registryType = 'txt';

    this.ownerId = options.ownerId;
    this.prefix = options.prefix === TxtRegistry.NO_PREFIX ? undefined : (options.prefix ?? TxtRegistry.DEFAULT_PREFIX);
  }

  /**
     * Generates an object with all the information needed to use the registry
     * in a given CDK scope.
     *
     * @param scope The CDK resource that is configuring ExternalDNS.
     * @returns A configuration object representing the implementation of this
     * registry.
     */
  public bind(scope: IConstruct): ExternalDnsRegistryConfiguration {
    return {
      properties: {
        txtOwnerId: this.ownerId ?? scope.node.addr,
        txtPrefix: this.prefix,
      },
      registryType: this.registryType,
    };
  }
}