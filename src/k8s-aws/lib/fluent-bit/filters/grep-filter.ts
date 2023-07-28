import { IConstruct } from 'constructs';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';


/**
 * Configures a pattern to match against a Fluent Bit record.
 */
export interface FluentBitGrepRegex {
  /**
   * Whether the matched expression should exclude or include records from
   * being output.
   *
   * When this is true, only records that match the given expression will be
   * output.
   *
   * When this is false, only records that do not match the given expression
   * will be output.
   *
   * @default false
   */
  readonly exclude?: boolean;

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
     * The pattern to use for filtering records processed by the plugin.
     */
  readonly pattern: FluentBitGrepRegex;
}

/**
 * A Fluent Bit filter that allows log records to be kept or discarded based
 * on whether they match a given regular expression or not.
 */
export class FluentBitGrepFilter extends FluentBitFilterPluginBase {
  /**
     * The pattern to use for filtering records processed by the plugin.
     *
     * @group Inputs
     */
  public readonly pattern: FluentBitGrepRegex;


  /**
   * Creates a new instance of the FluentBitKinesisFirehoseOutput class.
   *
   * @param options Options for configuring the filter.
   */
  public constructor(options: FluentBitGrepFilterOptions) {
    super('grep', options);

    this.pattern = options.pattern;
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
    const key = (this.pattern.exclude ?? false) ? 'Exclude' : 'Regex';

    return {
      configFile: super.renderConfigFile({
        [key]: `${this.pattern.key} ${this.pattern.regex}`,
      }),
    };
  }
}