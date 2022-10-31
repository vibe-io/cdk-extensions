export interface ResolvedFluentBitConfigurationFieldValue {
  toString(): string;
}

/**
 * The output of a Fluent Bit configuration object for consumption be the
 * resource configuring Fluent Bit.
 */
export interface ResolvedFluentBitConfiguration {
  /**
     * The configuration rended as a configuration file that can be read by the
     * Fluent Bit service.
     */
  readonly configFile: string;

  /**
     * The configuration options that were set.
     */
  readonly fields: {[key: string]: string[]};
}