import { IConstruct } from 'constructs';
import { IParserPlugin } from '../parsers/parser-plugin';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPlugin, FluentBitFilterPluginCommonOptions } from './filter-plugin';


/**
 * Options for configuring the Parser Fluent Bit filter plugin.
 *
 * @see [Parser Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/parser)
 */
export interface FluentBitParserFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * Specify field name in record to parse.
     */
  readonly keyName?: string;

  /**
     * The parsers to use to interpret the field.
     */
  readonly parsers?: IParserPlugin[];

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
export class ParserFilter extends FluentBitFilterPlugin {
  /**
     * Internal collection of the parsers that should be used to evaluate the
     * filter.
     */
  private readonly _parsers: IParserPlugin[];


  /**
     * Collection of the parsers that should be used to evaluate the filter.
     */
  public get parsers(): IParserPlugin[] {
    return [...this._parsers];
  }


  /**
     * Creates a new instance of the ParserFilter class.
     *
     * @param options The configuration options to use for filter.
     */
  public constructor(options: FluentBitParserFilterOptions = {}) {
    super('parser', options);

    this._parsers = [];

    if (options.keyName !== undefined) {
      this.addField('Key_Name', options.keyName);
    }

    if (options.preserveKey !== undefined) {
      this.addField('Preserve_Key', String(options.preserveKey));
    }

    if (options.reserveData !== undefined) {
      this.addField('Reserve_Data', String(options.reserveData));
    }
  }

  /**
     * Adds a new parser to apply to matched log entries.
     *
     * @param parser The parser to use for matched log entries.
     * @returns The parser filter that the parser plugin was registered with.
     */
  public addParser(parser: IParserPlugin): ParserFilter {
    this._parsers.push(parser);
    this.addField('Parser', parser.name);
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
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    if (this._parsers.length === 0) {
      throw new Error([
        'At least on parser must be specified when creating a Fluent',
        'Bit parser filter.',
      ].join(' '));
    }

    return super.bind(scope);
  }
}