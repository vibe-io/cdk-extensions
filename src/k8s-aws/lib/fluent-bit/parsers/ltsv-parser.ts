import { FluentBitParserPlugin, FluentBitParserPluginCommonOptions, ParserPluginDataType } from './parser-plugin';


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
export class LtsvParser extends FluentBitParserPlugin {
  public constructor(name: string, options: FluentBitLtsvParserOptions = {}) {
    super(name, 'ltsv', options);

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