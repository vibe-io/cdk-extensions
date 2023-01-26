/**
 * The logical operator an alert manager matcher should use when evaluating
 * filters for labels.
 */
export enum MatchOperator {
  /**
   * Evaluate an alert manager filter on the basis that the label matches the
   * string it is being compared against.
   */
  EQUALS = '=',

  /**
   * Evaluate an alert manager filter on the basis that the label does not
   * match the string it is being compared against.
   */
  NOT_EQUALS = '!=',

  /**
   * Evaluate an alert manager filter on the basis that the label matches the
   * regular expression it is being compared against.
   */
  RE_EQUALS = '=~',

  /**
   * Evaluate an alert manager filter on the basis that the label does not
   * match the regular expression it is being compared against.
   */
  RE_NOT_EQUALS = '!~'
}

/**
 * An expression that alert manager can use to evaluate incoming alerts to
 * determine the actions it should take.
 */
export class AlertManagerMatcher {
  /**
   * Creates a compund matcher expression by joining one or more other matcher
   * objects.
   *
   * @param matchers The matcher objects to join into a compound expression.
   * @returns A compound matcher representing the joined expressions.
   */
  public static fromCompound(...matchers: AlertManagerMatcher[]): AlertManagerMatcher {
    if (matchers.length === 0) {
      throw new Error([
        'Must specify at least one sub-matcher when creating a compound',
        'matcher statement.',
      ].join(' '));
    } else if (matchers.length === 1) {
      return matchers[0];
    } else {
      const joined = matchers.map((x) => {
        return x.expression;
      }).join(', ');
      return new AlertManagerMatcher(`{${joined}}`);
    }
  }

  /**
   * Builds a simple matcher using the standard components supported by the
   * matcher expression syntax. Handles formatting an escaping of values.
   *
   * @param label The Prometheus label name to match against.
   * @param operator The logical operator to use when evaluating the matcher.
   * @param value The value being compared against the specified label using
   * the specified operator.
   * @returns A matcher object representing the given operation.
   */
  public static fromComponents(label: string, operator: MatchOperator, value: string): AlertManagerMatcher {
    const escapedValue = AlertManagerMatcher.escapePromQl(value);
    return new AlertManagerMatcher(`${label} ${operator} "${escapedValue}"`);
  }

  /**
   * Creates a matcher from a raw string expression. This allows for specifying
   * arbitrary matching conditions that may be too complex to be supported by
   * the other means of constructing matchers.
   *
   * @see [Matcher expression syntax](https://prometheus.io/docs/alerting/latest/configuration/#matcher)
   *
   * @param expression The PromQL-like expression to use for matching.
   * @returns A matcher object representing the given expression.
   */
  public static fromString(expression: string): AlertManagerMatcher {
    return new AlertManagerMatcher(expression);
  }

  /**
   * Escapes a string to be compatible with the PromQL like syntax used by
   * alert manager matcher expressions.
   *
   * @param value The string to be escaped.
   * @returns The escaped version of the string.
   */
  private static escapePromQl(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }


  /**
   * Creates a new instance of the AlertManagerMatcher class.
   *
   * @param expression The PromQL like expression to use for the matcher.
   */
  private constructor(public readonly expression: string) {}
}