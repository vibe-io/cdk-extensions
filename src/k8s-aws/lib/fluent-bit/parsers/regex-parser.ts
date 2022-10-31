import { FluentBitParserPlugin, FluentBitParserPluginCommonOptions, ParserPluginDataType } from './parser-plugin';


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
export class RegexParser extends FluentBitParserPlugin {
  public constructor(name: string, options: FluentBitRegexParserOptions) {
    super(name, 'regex', options);

    this.addField('Regex', options.regex);

    if (options.skipEmptyValues !== undefined) {
      this.addField('Skip_Empty_Values', String(options.skipEmptyValues));
    }

    if (options.timeFormat !== undefined) {
      this.addField('Time_Format', options.timeFormat);
    }

    if (options.timeKey !== undefined) {
      this.addField('Time_Key', options.timeKey);
    }

    if (options.types !== undefined) {
      const types = options.types;
      this.addField('Types', Object.keys(types).map((x) => {
        return `${x}:${types[x].name}`;
      }).join(' '));
    }
  }
}