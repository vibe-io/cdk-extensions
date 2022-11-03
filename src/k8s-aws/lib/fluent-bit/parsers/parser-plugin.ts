import { FluentBitPlugin, FluentBitPluginType, IFluentBitPlugin } from '../fluent-bit-plugin';


/**
 * Represents the various types of data that can be mapped in Fluent Bit using
 * a parser plugin.
 */
export class ParserPluginDataType {
  /**
     * Object that is true or false.
     */
  public static BOOL: ParserPluginDataType = ParserPluginDataType.of('bool');

  /**
     * Floating point number values.
     */
  public static FLOAT: ParserPluginDataType = ParserPluginDataType.of('float');

  /**
     * Hexidecimal number values.
     */
  public static HEX: ParserPluginDataType = ParserPluginDataType.of('hex');

  /**
     * While number values.
     */
  public static INTEGER: ParserPluginDataType = ParserPluginDataType.of('integer');

  /**
     * Logfmt formatted data.
     *
     * @see [Logfmt overview](https://brandur.org/logfmt)
     * @see [Golang logfmt documentation](https://pkg.go.dev/github.com/kr/logfmt)
     */
  public static LOGFMT: ParserPluginDataType = ParserPluginDataType.of('logfmt');

  /**
     * Labeled tab-separated values.
     *
     * @see [LTSV](http://ltsv.org/).
     */
  public static LTSV: ParserPluginDataType = ParserPluginDataType.of('ltsv');

  /**
     * Regular expression.
     */
  public static REGEX: ParserPluginDataType = ParserPluginDataType.of('regex');

  /**
     * Text data.
     */
  public static STRING: ParserPluginDataType = ParserPluginDataType.of('string');

  /**
     * An escape hatch method that allow specifying arbitrary custom data
     * types.
     *
     * @param name The name of the data type.
     * @returns An object representing the data type.
     */
  public static of(name: string): ParserPluginDataType {
    return new ParserPluginDataType(name);
  }


  /**
     * The name of the data type.
     */
  public readonly name: string;

  /**
     * Cretaes a new instance of the ParserPluginDataType class.
     *
     * @param name The name of the data type.
     */
  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * Configuration options that apply to all Fluent Bit parser plugins.
 */
export interface FluentBitParserPluginCommonOptions {}

/**
 * Represents a Fluent Bit plugin that parses inbound records to populate
 * fields.
 */
export interface IFluentBitParserPlugin extends IFluentBitPlugin {
  readonly format: string;
}

/**
 * Represents a Fluent Bit plugin that parses inbound records to populate
 * fields.
 */
export abstract class FluentBitParserPlugin extends FluentBitPlugin implements IFluentBitParserPlugin {
  /**
   * The data format that the parser extracts records from.
   *
   * @group Inputs
   */
  public readonly format: string;


  /**
   * Creates a new instance of the FluentBitParserPlugin class.
   *
   * @param name The name of the output plugin to configure.
   * @param format The data format that the parser extracts records from.
   * @param options Configuration options that apply to all Fluent Bit output
   * plugin.
   */
  public constructor(name: string, format: string, _options: FluentBitParserPluginCommonOptions = {}) {
    super({
      name: name,
      pluginType: FluentBitPluginType.PARSER,
    });

    this.format = format;
  }

  /**
   * Renders a Fluent Bit configuration file for the plugin.
   *
   * @param config The configuration options to render into a configuration
   * file.
   * @returns A rendered plugin configuration file.
   */
  protected renderConfigFile(config: { [key: string]: any }): string {
    return super.renderConfigFile({
      Format: this.format,
      ...config,
    });
  }
}