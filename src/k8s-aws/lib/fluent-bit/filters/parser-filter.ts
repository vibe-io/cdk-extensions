import { IConstruct } from 'constructs';
import { IFluentBitParserPlugin } from '../parsers/parser-plugin-base';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';


/**
 * Options for configuring the Parser Fluent Bit filter plugin.
 *
 * @see [Parser Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/parser)
 */
export interface FluentBitParserFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * Specify field name in record to parse.
     */
  readonly keyName: string;

  /**
     * The parsers to use to interpret the field.
     */
  readonly parsers?: IFluentBitParserPlugin[];

  /**
     * Keep original `keyName` field in the parsed result.
     *
     * If `false`, the field will be removed.
     *
     * @default false
     */
  readonly preserveKey?: boolean;

  /**
     * Keep all other original fields in the parsed result.
     *
     * If `false`, all other original fields will be removed.
     *
     * @default false
     */
  readonly reserveData?: boolean;
}

/**
 * A Fluent Bit filter that allows parsing of fields in event records.
 */
export class FluentBitParserFilter extends FluentBitFilterPluginBase {
  /**
     * Internal collection of the parsers that should be used to evaluate the
     * filter.
     */
  private readonly _parsers: IFluentBitParserPlugin[];

  /**
     * Specify field name in record to parse.
     */
  public readonly keyName: string;

  /**
      * Keep original `keyName` field in the parsed result.
      *
      * If `false`, the field will be removed.
      *
      * @default false
      */
  public readonly preserveKey?: boolean;

  /**
      * Keep all other original fields in the parsed result.
      *
      * If `false`, all other original fields will be removed.
      *
      * @default false
      */
  public readonly reserveData?: boolean;

  /**
     * Collection of the parsers that should be used to evaluate the filter.
     */
  public get parsers(): IFluentBitParserPlugin[] {
    return [...this._parsers];
  }


  /**
     * Creates a new instance of the FluentBitParserFilter class.
     *
     * @param options The configuration options to use for filter.
     */
  public constructor(options: FluentBitParserFilterOptions) {
    super('parser', options);

    this._parsers = [];

    this.keyName = options.keyName;
    this.preserveKey = options.preserveKey;
    this.reserveData = options.reserveData;

    options.parsers?.forEach((x) => {
      this.addParser(x);
    });
  }

  /**
     * Adds a new parser to apply to matched log entries.
     *
     * @param parser The parser to use for matched log entries.
     * @returns The parser filter that the parser plugin was registered with.
     */
  public addParser(parser: IFluentBitParserPlugin): FluentBitParserFilter {
    this._parsers.push(parser);
    return this;
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
    if (this._parsers.length === 0) {
      throw new Error([
        'At least on parser must be specified when creating a Fluent',
        'Bit parser filter.',
      ].join(' '));
    }

    return {
      configFile: this.renderConfigFile({
        Key_Name: this.keyName,
        Parser: this._parsers.map((x) => {
          return x.name;
        }),
        Preserve_Key: this.preserveKey,
        Reserve_Data: this.reserveData,
      }),
      parsers: this.parsers,
    };
  }
}