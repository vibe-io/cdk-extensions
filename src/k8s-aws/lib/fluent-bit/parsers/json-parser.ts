import { FluentBitParserPlugin, FluentBitParserPluginCommonOptions } from './parser-plugin';


/**
 * Options for configuring the JSON Fluent Bit parser plugin.
 *
 * @see [JSON Plugin Documention](https://docs.fluentbit.io/manual/pipeline/parsers/json)
 */
export interface FluentBitJsonParserOptions extends FluentBitParserPluginCommonOptions {/**
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
export class JsonParser extends FluentBitParserPlugin {
  public constructor(name: string, options: FluentBitJsonParserOptions = {}) {
    super(name, 'json', options);

    if (options.timeFormat !== undefined) {
      this.addField('Time_Format', options.timeFormat);
    }

    if (options.timeKey !== undefined) {
      this.addField('Time_Key', options.timeKey);
    }
  }
}