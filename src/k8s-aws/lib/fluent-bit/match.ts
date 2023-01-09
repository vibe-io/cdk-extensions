/**
 * Matching patterns supported by Fluent Bit plugins for scoping down incoming
 * records.
 */
export enum FluentBitMatchEvaluator {
  /**
     * A basic pattern match supporting the star (`*`) character as a wildcard.
     */
  GLOB = 'Match',

  /**
     * Full pattern matching using regular expressions.
     */
  REGEX = 'Match_Regex'
}

/**
 * Represents a filter that can be applied to Filter and Output plugins that
 * scopes down what records the given filter should apply to.
 */
export class FluentBitMatch {
  /**
     * Represents a pattern that will match all log entries.
     */
  public static readonly ALL: FluentBitMatch = FluentBitMatch.glob('*');

  /**
     * Creates a match pattern that supports basic wildcard matching using the
     * star character (`*`).
     *
     * @param pattern The pattern to use to match against the tags of an
     * incoming record. It's case sensitive and support the star (`*`)
     * character as a wildcard.
     * @returns A match object representing the given pattern.
     */
  public static glob(pattern: string): FluentBitMatch {
    return new FluentBitMatch(FluentBitMatchEvaluator.GLOB, pattern);
  }

  /**
     * Creates a match pattern that supports full regex matching.
     *
     * @param pattern A regular expression to match against the tags of
     * incoming records.
     * @returns A match object representing the given pattern.
     */
  public static regex(pattern: string): FluentBitMatch {
    return new FluentBitMatch(FluentBitMatchEvaluator.REGEX, pattern);
  }


  /**
     * The pattern matching syntax to use when evaluating incoming tags.
     *
     * @group Inputs
     */
  public readonly evaluator: FluentBitMatchEvaluator;

  /**
     * The pattern to compare against the tags of incoming records.
     *
     * @group Inputs
     */
  public readonly pattern: string;

  /**
     * Creates a new instance of the FluentBitMatch class.
     *
     * @param evaluator The pattern matching syntax to use when evaluating
     * incoming tags.
     * @param pattern The pattern to compare against the tags of incoming
     * records.
     */
  private constructor(evaluator: FluentBitMatchEvaluator, pattern: string) {
    this.evaluator = evaluator;
    this.pattern = pattern;
  }

  /**
     * Creates a record object that can be used to represent the match in
     * Fluent Bit configuration files.
     *
     * @returns The object that can be used to represent this match object.
     */
  public toObject(): {[key: string]: string} {
    return {
      [this.evaluator]: this.pattern,
    };
  }

  /**
     * Creates a string representation of this match object that reflects how
     * it will appear in a Fluent Bit configuration file.
     *
     * @returns A string representation of this match.
     */
  public toString(): string {
    return `${this.evaluator} ${this.pattern}`;
  }
}