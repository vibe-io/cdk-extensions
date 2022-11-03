import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '..';
import { FluentBitParserPluginBase, FluentBitParserPluginCommonOptions, ParserPluginDataType } from './parser-plugin-base';


/**
 * Options for configuring the Regex Fluent Bit parser plugin.
 *
 * @see [Regex Plugin Documention](https://docs.fluentbit.io/manual/pipeline/parsers/regular-expression)
 */
export interface FluentBitRegexParserOptions extends FluentBitParserPluginCommonOptions {
  /**
     * The regular expression to use to parse the incoming records.
     *
     * Use regex group names to define the name of fields being captured.
     */
  readonly regex: string;

  /**
     * If enabled, the parser ignores empty value of the record.
     */
  readonly skipEmptyValues?: boolean;

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
 * A Fluent Bit filter that parsed inbound messages using regular expressions.
 */
export class FluentBitRegexParser extends FluentBitParserPluginBase {
  /**
   * The regular expression to use to parse the incoming records.
   *
   * Use regex group names to define the name of fields being captured.
   *
   * @group Inputs
   */
  public readonly regex: string;

  /**
   * If enabled, the parser ignores empty value of the record.
   *
   * @group Inputs
   */
  public readonly skipEmptyValues?: boolean;

  /**
   * Defines the format of the timestamp on the inbound record.
   *
   * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
   *
   * @group Inputs
   */
  public readonly timeFormat?: string;

  /**
   * The key under which timestamp information for the inbound record is
   * given.
   *
   * @group Inputs
   */
  public readonly timeKey?: string;

  /**
   * Maps group names matched by the regex to the data types they should be
   * interpreted as.
   *
   * @group Inputs
   */
  public readonly types?: {[key: string]: ParserPluginDataType};


  /**
   * Creates a new instance of the FluentBitLtsvParser class.
   *
   * @param options Options for configuring the parser.
   */
  public constructor(name: string, options: FluentBitRegexParserOptions) {
    super(name, 'regex', options);

    this.regex = options.regex;
    this.skipEmptyValues = options.skipEmptyValues;
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
        Regex: this.regex,
        Skip_Empty_Values: this.skipEmptyValues,
        Time_Format: this.timeFormat,
        Time_Key: this.timeKey,
        Types: noTypes ? undefined : Object.keys(types).map((x) => {
          return `${x}:${types[x].name}`;
        }).join(' '),
      }),
    };
  }
}