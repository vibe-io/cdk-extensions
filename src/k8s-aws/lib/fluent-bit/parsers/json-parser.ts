import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '..';
import { FluentBitParserPlugin, FluentBitParserPluginCommonOptions } from './parser-plugin';


/**
 * Options for configuring the JSON Fluent Bit parser plugin.
 *
 * @see [JSON Plugin Documention](https://docs.fluentbit.io/manual/pipeline/parsers/json)
 */
export interface FluentBitJsonParserOptions extends FluentBitParserPluginCommonOptions {
  /**
    * Defines the format of the timestamp on the inbound record.
    *
    * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
    */
  readonly timeFormat?: string;

  /**
     * The key under which timestamp information for the inbound record is
     * given.
     */
  readonly timeKey?: string;
}

/**
 * A Fluent Bit filter that parsed inbound messages in JSON format.
 */
export class FluentBitJsonParser extends FluentBitParserPlugin {
  /**
   * Defines the format of the timestamp on the inbound record.
   *
   * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
   *
   * @group Inputs
   */
  readonly timeFormat?: string;

  /**
   * The key under which timestamp information for the inbound record is
   * given.
   *
   * @group Inputs
   */
  readonly timeKey?: string;


  /**
   * Creates a new instance of the FluentBitJsonParser class.
   *
   * @param options Options for configuring the parser.
   */
  public constructor(name: string, options: FluentBitJsonParserOptions = {}) {
    super(name, 'json', options);

    this.timeFormat = options.timeFormat;
    this.timeKey = options.timeKey;
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
    return {
      configFile: super.renderConfigFile({
        Time_Format: this.timeFormat,
        Time_Key: this.timeKey,
      }),
    };
  }
}