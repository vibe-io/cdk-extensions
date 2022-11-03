import { FluentBitJsonParser, FluentBitLogfmtParser, FluentBitLtsvParser, FluentBitRegexParser, IFluentBitParserPlugin } from '.';


/**
 * Standard parse comfigurations which can be applied to Fluent Bit to allow
 * for parsing data from incoming records.
 *
 * The records to which parsers are applied is controlled using the parser
 * filter.
 *
 * @see {@link FluentBitParserFilter}
 */
export class FluentBitParser {
  /**
     * Creates a parser that processes records that are formatted in JSON.
     *
     * @param name The name of the parser which will be used for referencing it
     * in other configurations.
     * @returns A parser object that can be applied to the Fluent Bit
     * configuration.
     */
  public static json(name: string): IFluentBitParserPlugin {
    return new FluentBitJsonParser(name);
  }

  /**
     * Creates a parser that processes records that are formatted using the
     * `logfmt` standard.
     *
     * @see [Logfmt overview](https://brandur.org/logfmt)
     * @see [Golang logfmt documentation](https://pkg.go.dev/github.com/kr/logfmt)
     *
     * @param name The name of the parser which will be used for referencing it
     * in other configurations.
     * @returns A parser object that can be applied to the Fluent Bit
     * configuration.
     */
  public static logfmt(name: string): IFluentBitParserPlugin {
    return new FluentBitLogfmtParser(name);
  }

  /**
     * Creates a parser that processes records that are formatted using the
     * `ltsv` standard.
     *
     * @see [LTSV](http://ltsv.org/)
     *
     * @param name The name of the parser which will be used for referencing it
     * in other configurations.
     * @returns A parser object that can be applied to the Fluent Bit
     * configuration.
     */
  public static ltsv(name: string): IFluentBitParserPlugin {
    return new FluentBitLtsvParser(name);
  }

  /**
     * Creates a parser that uses regular expressions to parse incoming
     * records.
     *
     * @param name The name of the parser which will be used for referencing it
     * in other configurations.
     * @param regex The regular expression to use to parse records.
     * @returns A parser object that can be applied to the Fluent Bit
     * configuration.
     */
  public static regex(name: string, regex: string): IFluentBitParserPlugin {
    return new FluentBitRegexParser(name, {
      regex: regex,
    });
  }
}
