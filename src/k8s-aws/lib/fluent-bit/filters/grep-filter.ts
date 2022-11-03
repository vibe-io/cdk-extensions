import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';


/**
 * Configures a pattern to match against a Fluent Bit record.
 */
export interface FluentBitGrepRegex {
  /**
   * The key of the fields which you want to filter using the regex.
   */
  readonly key: string;

  /**
   * The regular expression to apply to the specified field.
   */
  readonly regex: string;
}

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
  readonly exclude?: FluentBitGrepRegex;

  /**
     * Keep records in which the content of KEY matches the regular expression.
     */
  readonly regex?: FluentBitGrepRegex;
}

/**
 * A Fluent Bit filter that allows log records to be kept or discarded based
 * on whether they match a given regular expression or not.
 */
export class FluentBitGrepFilter extends FluentBitFilterPluginBase {
  /**
     * Exclude records in which the content of KEY matches the regular
     * expression.
     */
  readonly exclude?: FluentBitGrepRegex;

  /**
      * Keep records in which the content of KEY matches the regular expression.
      */
  readonly regex?: FluentBitGrepRegex;


  /**
   * Creates a new instance of the FluentBitKinesisFirehoseOutput class.
   *
   * @param options Options for configuring the filter.
   */
  public constructor(options: FluentBitGrepFilterOptions = {}) {
    super('grep', options);

    this.exclude = options.exclude;
    this.regex = options.regex;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(_scope: IConstruct): ResolvedFluentBitConfiguration {
    if (this.regex === undefined && this.exclude === undefined) {
      throw new Error([
        'When using the Fluent Bit grep plugin at least one of',
        "'exclude' or 'regex' must be specified.",
      ].join(' '));
    }

    return {
      configFile: super.renderConfigFile({
        Exclude: this.exclude ? `${this.exclude.key} ${this.exclude.regex}` : undefined,
        Regex: this.regex ? `${this.regex.key} ${this.regex.regex}` : undefined,
      }),
    };
  }
}