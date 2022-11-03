import { Duration } from 'aws-cdk-lib';
import { AppendedRecord, FluentBitGrepFilter, FluentBitGrepRegex, FluentBitKubernetesFilter, FluentBitModifyFilter, FluentBitNestFilter, FluentBitParserFilter, FluentBitRecordModifierFilter, FluentBitRewriteTagFilter, FluentBitThrottleFilter, IFluentBitFilterPlugin, ModifyOperation, NestFilterOperation, RewriteTagRule } from '.';
import { FluentBitMatch, IFluentBitParserPlugin } from '..';


/**
 * Standard filter options which can be applied to Fluent Bit to control the
 * output and formatting of logs.
 *
 * Filters change the structure of log records by doing things like adding
 * metadata to a record, restructuring a record, or adding and removing fields.
 */
export class FluentBitFilter {
  /**
     * Creates a filter that adds fields to a record that matches the given
     * pattern.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param records The fields to be added to matched records.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static appendFields(match: FluentBitMatch, ...records: AppendedRecord[]): IFluentBitFilterPlugin {
    return new FluentBitRecordModifierFilter({
      match: match,
      records: records,
    });
  }

  /**
     * Creates a filter that removes a set of fields from any records that
     * match a given pattern.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param fields The fields which should be removed from the record if they
     * are present.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static blacklistFields(match: FluentBitMatch, ...fields: string[]): IFluentBitFilterPlugin {
    return new FluentBitRecordModifierFilter({
      match: match,
      remove: fields,
    });
  }

  /**
     * Filters log entries based on a pattern. Log entries can be removed and
     * not forwarded based on whether they match or do not match the given
     * pattern.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param pattern The pattern to match against incoming records.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static grep(match: FluentBitMatch, pattern: FluentBitGrepRegex): IFluentBitFilterPlugin {
    return new FluentBitGrepFilter({
      match: match,
      pattern: pattern,
    });
  }

  /**
     * Adds Kubernetes metadata to output records including pod information,
     * labels, etc..
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static kubernetes(match: FluentBitMatch): IFluentBitFilterPlugin {
    return new FluentBitKubernetesFilter({
      match: match,
    });
  }

  /**
     * Applies various transformations to matched records including adding,
     * removing, copying, and renaming fields.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param operations The operations to apply to the matched records.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static modify(match: FluentBitMatch, ...operations: ModifyOperation[]): IFluentBitFilterPlugin {
    return new FluentBitModifyFilter({
      match: match,
      operations: operations,
    });
  }

  /**
     * Lifts nested fields in a record up to their parent object.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param nestedUnder The record object under which you want to lift
     * fields.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static lift(match: FluentBitMatch, nestedUnder: string): IFluentBitFilterPlugin {
    return new FluentBitNestFilter({
      match: match,
      operation: NestFilterOperation.lift({
        nestedUnder: nestedUnder,
      }),
    });
  }

  /**
     * Nests a set of fields in a record under into a specified object.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param nestUnder The record object under which you want to nest matched
     * fields.
     * @param fields The fields to nest under the specified object.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static nest(match: FluentBitMatch, nestUnder: string, ...fields: string[]): IFluentBitFilterPlugin {
    return new FluentBitNestFilter({
      match: match,
      operation: NestFilterOperation.nest({
        nestUnder: nestUnder,
        wildcards: fields,
      }),
    });
  }

  /**
     * Applies a set of parsers to matched records.
     *
     * The parser is used to read the input record and set structured fields in
     * the output.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param parsers The parser plugins to use to read matched records.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static parser(match: FluentBitMatch, ...parsers: IFluentBitParserPlugin[]): IFluentBitFilterPlugin {
    return new FluentBitParserFilter({
      match: match,
      parsers: parsers,
    });
  }

  /**
     * Allows modification of tags set by the input configuration to affect the
     * routing of when records are output.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param rules The rules that define the matching criteria of format of
     * the tag for the matching record.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static rewriteTag(match: FluentBitMatch, ...rules: RewriteTagRule[]): IFluentBitFilterPlugin {
    return new FluentBitRewriteTagFilter({
      match: match,
      rules: rules,
    });
  }

  /**
     * Sets an average rate of messages that are allowed to be output over a
     * configured period of time.
     *
     * When the rate of messages surpasses the configured limits messages will
     * be dropped.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param rate The average amount of messages over a given period.
     * @param interval The interval of time over rate should be sampled to
     * calculate an average.
     * @param window Amount of intervals to calculate average over.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static throttle(match: FluentBitMatch, interval: Duration, rate: number, window: number): IFluentBitFilterPlugin {
    return new FluentBitThrottleFilter({
      interval: interval,
      match: match,
      rate: rate,
      window: window,
    });
  }

  /**
     * Creates a filter that removes all fields in a record that are not
     * approved.
     *
     * @param match A pattern filtering to which records the filter should be
     * applied.
     * @param fields The fields which are allowed to appear in the output
     * record.
     * @returns A filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static whitelistFields(match: FluentBitMatch, ...fields: string[]): IFluentBitFilterPlugin {
    return new FluentBitRecordModifierFilter({
      allow: fields,
      match: match,
    });
  }
}
