import { IConstruct } from 'constructs';
import { DataSize } from '../../../../core';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';


/**
 * Define a buffering mechanism for the new records created by the rewrite tag
 * Fluent Bit filter plugin.
 */
export class EmitterStorageType {
  /**
     * Buffer records on the filesystem.
     *
     * This is recommended if the destination for new records generated might
     * face backpressure due to latency or slow network speeds.
     */
  public static readonly FILESYSTEM = EmitterStorageType.of('filesystem');

  /**
     * Buffer records in memory.
     *
     * This is the default behavior.
     */
  public static readonly MEMORY = EmitterStorageType.of('memory');

  /**
     * An escape hatch that allows for specifying a custom value for the
     * rewrite tag plugin's `Emitter_Storage.type` field.
     *
     * @param name The name of the buffering type to use.
     * @returns
     */
  public static of(name: string): EmitterStorageType {
    return new EmitterStorageType(name);
  }


  /**
     * The name of the emitter storage type as it should appear in the plugin
     * configuration file.
     */
  public readonly name: string;

  /**
     * Creates a new instance of the EmitterStorageType class.
     *
     * @param name The name of the emitter storage type as it should appear in
     * the plugin configuration file.
     */
  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * Defines the matching criteria and the format of the Tag for the rewrite tag
 * Fluent Bit filter plugin.
 *
 * @see [Rules](https://docs.fluentbit.io/manual/pipeline/filters/rewrite-tag#rules)
 */
export interface RewriteTagRule {
  /**
     * If a rule matches a rule the filter will emit a copy of the record with
     * the new defined Tag.
     *
     * The property keep takes a boolean value to define if the original
     * record with the old Tag must be preserved and continue in the pipeline
     * or just be discarded.
     *
     * @see [Keep](https://docs.fluentbit.io/manual/pipeline/filters/rewrite-tag#keep)
     */
  readonly keep: boolean;

  /**
     * The key represents the name of the record key that holds the value that
     * we want to use to match our regular expression.
     *
     * A key name is specified and prefixed with a `$`.
     *
     * @see [Key](https://docs.fluentbit.io/manual/pipeline/filters/rewrite-tag#key)
     */
  readonly key: string;

  /**
     * If a regular expression has matched the value of the defined key in the
     * rule, we are ready to compose a new Tag for that specific record.
     *
     * The tag is a concatenated string that can contain any of the following
     * characters: `a-z,A-Z,0-9` and `.-,`.
     *
     * @see [New Tag](https://docs.fluentbit.io/manual/pipeline/filters/rewrite-tag#new-tag)
     */
  readonly newTag: string;

  /**
     * Using a simple regular expression we can specify a matching pattern to
     * use against the value of the key specified, also we can take advantage
     * of group capturing to create custom placeholder values.
     *
     * @see [Regex](https://docs.fluentbit.io/manual/pipeline/filters/rewrite-tag#regex)
     * @see [Rubular regex tester](https://rubular.com/)
     */
  readonly regex: string;
}

/**
 * Options for configuring the Parser Fluent Bit filter plugin.
 *
 * @see [Parser Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/parser)
 */
export interface FluentBitRewriteTagFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * When the filter emits a record under the new Tag, there is an internal
     * emitter plugin that takes care of the job. Since this emitter expose
     * metrics as any other component of the pipeline, you can use this
     * property to configure an optional name for it.
     */
  readonly emitterName?: string;

  /**
     * Define a buffering mechanism for the new records created.
     *
     * Note these records are part of the emitter plugin.
     */
  readonly emitterStorageType?: EmitterStorageType;

  /**
     * Set a limit on the amount of memory the tag rewrite emitter can consume
     * if the outputs provide backpressure.
     *
     * @default 10M
     */
  readonly emitterMemBufLimit?: DataSize;

  /**
     * Defines the matching criteria and the format of the Tag for the matching
     * record.
     */
  readonly rules?: RewriteTagRule[];
}

/**
 * A Fluent Bit filter that allows parsing of fields in event records.
 */
export class FluentBitRewriteTagFilter extends FluentBitFilterPluginBase {
  /**
     * Internal collection of rules defining matching criteria and the format
     * of the tag for the matching record.
     *
     * @group Internal
     */
  private readonly _rules: RewriteTagRule[];

  /**
     * When the filter emits a record under the new Tag, there is an internal
     * emitter plugin that takes care of the job. Since this emitter expose
     * metrics as any other component of the pipeline, you can use this
     * property to configure an optional name for it.
     *
     * @group Inputs
     */
  readonly emitterName?: string;

  /**
      * Define a buffering mechanism for the new records created.
      *
      * Note these records are part of the emitter plugin.
      *
      * @group Inputs
      */
  readonly emitterStorageType?: EmitterStorageType;

  /**
      * Set a limit on the amount of memory the tag rewrite emitter can consume
      * if the outputs provide backpressure.
      *
      * @group Inputs
      */
  readonly emitterMemBufLimit?: DataSize;

  /**
     * Collection of rules defining matching criteria and the format of the tag
     * for the matching record.
     *
     * @group Inputs
     */
  public get rules(): RewriteTagRule[] {
    return [...this._rules];
  }


  /**
     * Creates a new instance of the FluentBitRewriteTagFilter class.
     *
     * @param options The configuration options to use for filter.
     */
  public constructor(options: FluentBitRewriteTagFilterOptions = {}) {
    super('rewrite_tag', options);

    this._rules = [];

    this.emitterMemBufLimit = options.emitterMemBufLimit;
    this.emitterName = options.emitterName;
    this.emitterStorageType = options.emitterStorageType;

    options.rules?.forEach((x) => {
      this.addRule(x);
    });
  }

  /**
     * Adds a new rule to apply to matched log entries.
     *
     * @param rule The rule to apply for matched log entries.
     * @returns The parser filter that the parser plugin was registered with.
     */
  public addRule(rule: RewriteTagRule): FluentBitRewriteTagFilter {
    this._rules.push(rule);
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
    if (this._rules.length === 0) {
      throw new Error([
        'At least one rule must be specified when creating a Fluent',
        'Bit rewrite tag filter.',
      ].join(' '));
    }

    return {
      configFile: this.renderConfigFile({
        'Emitter_Mem_Buf_Limit': this.emitterMemBufLimit ? `${this.emitterMemBufLimit?.toMebibytes()}M` : undefined,
        'Emitter_Name': this.emitterName,
        'Emitter_Storage.type': this.emitterStorageType,
        'Rule': this.rules.map((x) => {
          return `${x.key} ${x.regex} ${x.newTag} ${x.keep}`;
        }),
      }),
    };
  }
}