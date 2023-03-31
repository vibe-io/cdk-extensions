import { IConstruct } from 'constructs';
import { FluentBitParserPluginBase, FluentBitParserPluginCommonOptions, ParserPluginDataType } from './parser-plugin-base';
import { ResolvedFluentBitConfiguration } from '..';


/**
 * Options for configuring the LTSV Fluent Bit parser plugin.
 *
 * @see [LTSV Plugin Documention](https://docs.fluentbit.io/manual/pipeline/parsers/ltsv)
 */
export interface FluentBitLtsvParserOptions extends FluentBitParserPluginCommonOptions {
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

  /**
     * Maps group names matched by the regex to the data types they should be
     * interpreted as.
     */
  readonly types?: {[key: string]: ParserPluginDataType};
}

/**
 * A Fluent Bit filter that parsed inbound messages in LTSV format.
 */
export class FluentBitLtsvParser extends FluentBitParserPluginBase {
  /**
   * Defines the format of the timestamp on the inbound record.
   *
   * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
   *
   * @default Inputs
   */
  readonly timeFormat?: string;

  /**
   * The key under which timestamp information for the inbound record is
   * given.
   *
   * @default Inputs
   */
  readonly timeKey?: string;

  /**
   * Maps group names matched by the regex to the data types they should be
   * interpreted as.
   *
   * @default Inputs
   */
  readonly types?: {[key: string]: ParserPluginDataType};


  /**
   * Creates a new instance of the FluentBitLtsvParser class.
   *
   * @param options Options for configuring the parser.
   */
  public constructor(name: string, options: FluentBitLtsvParserOptions = {}) {
    super(name, 'ltsv', options);

    this.timeFormat = options.timeFormat;
    this.timeKey = options.timeKey;
    this.types = options.types;
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
    const types = this.types ?? {};
    const noTypes = !Object.keys(types).length;

    return {
      configFile: super.renderConfigFile({
        Time_Format: this.timeFormat,
        Time_Key: this.timeKey,
        Types: noTypes ? undefined : Object.keys(types).map((x) => {
          return `${x}:${types[x].name}`;
        }).join(' '),
      }),
    };
  }
}