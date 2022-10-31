import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPlugin, FluentBitFilterPluginCommonOptions } from './filter-plugin';


/**
 * Options for configuring the Grep Fluent Bit filter plugin.
 *
 * @see [Grep Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/grep)
 */
export interface FluentBitGrepFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * Exclude records in which the content of KEY matches the regular
     * expression.
     */
  readonly exclude?: string;

  /**
     * Keep records in which the content of KEY matches the regular expression.
     */
  readonly regex?: string;
}

/**
 * A Fluent Bit filter that allows log records to be kept or discarded based
 * on whether they match a given regular expression or not.
 */
export class GrepFilter extends FluentBitFilterPlugin {
  public constructor(options: FluentBitGrepFilterOptions = {}) {
    super('grep', options);

    if (options.exclude !== undefined) {
      this.addField('Exclude', options.exclude);
    }

    if (options.regex !== undefined) {
      this.addField('Regex', options.regex);
    }
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    if (this.fields.Regex === undefined && this.fields.Exclude === undefined) {
      throw new Error([
        'When using the Fluent Bit grep plugin at least one of',
        "'exclude' or 'regex' must be specified.",
      ].join(' '));
    }

    return super.bind(scope);
  }
}