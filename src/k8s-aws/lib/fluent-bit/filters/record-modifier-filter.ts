import { IConstruct } from 'constructs';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';


/**
 * Represents a record field to be added by the record modifier Fluent Bit
 * filter plugin.
 */
export interface AppendedRecord {
  /**
     * The name of the field to be added.
     */
  readonly fieldName: string;

  /**
     * The value that the added field should be set to.
     */
  readonly value: string;
}

/**
 * Options for configuring the Record Modifier Fluent Bit filter plugin.
 *
 * @see [Record Modifier Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/record-modifier)
 */
export interface FluentBitRecordModifierFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * If a tag is not match, that field is removed.
     */
  readonly allow?: string[];

  /**
     * Add fields to the output.
     */
  readonly records?: AppendedRecord[];

  /**
     * If a tag is match, that field is removed.
     */
  readonly remove?: string[];
}

/**
 * A Fluent Bit filter that allows appending fields or excluding specific
 * fields.
 */
export class FluentBitRecordModifierFilter extends FluentBitFilterPluginBase {
  /**
     * Internal collection of tags that are allowed on a matched input record.
     *
     * If a tag is not match it is removed.
     */
  private readonly _allow: string[];

  /**
     * Internal collection of the records to be appending to matched input.
     */
  private readonly _records: AppendedRecord[];

  /**
     * Internal collection of tags to exclude from a matched input record.
     *
     * If a tag is matched it is removed.
     */
  private readonly _remove: string[];


  /**
     * Collection of tags that are allowed on a matched input record.
     *
     * If a tag is not matched it is removed.
     */
  public get allow(): string[] {
    return [...this._allow];
  }

  /**
     * Collection of the records to be appending to matched input.
     */
  public get records(): AppendedRecord[] {
    return [...this._records];
  }

  /**
     * Collection of tags to exclude from a matched input record.
     *
     * If a tag is matched it is removed.
     */
  public get remove(): string[] {
    return [...this._remove];
  }


  /**
     * Creates a new instance of the FluentBitRecordModifierFilter class.
     *
     * @param options The configuration options to use for filter.
     */
  public constructor(options: FluentBitRecordModifierFilterOptions = {}) {
    super('record_modifier', options);

    this._allow = [];
    this._records = [];
    this._remove = [];

    options.allow?.forEach((x) => {
      this.addAllow(x);
    });

    options.records?.forEach((x) => {
      this.addRecord(x);
    });

    options.remove?.forEach((x) => {
      this.addRemove(x);
    });
  }

  /**
     * Adds a tag to be allowed on a matched input record.
     *
     * If a tag is not matched it is removed.
     *
     * @param tag The tag to add to the allow list
     * @returns The record modifier filter that the tag plugin was registered
     * with.
     */
  public addAllow(tag: string): FluentBitRecordModifierFilter {
    this._allow.push(tag);
    return this;
  }

  /**
     * Add a record to be appended to matched events.
     *
     * @param record The record to be appended to matched input.
     * @returns The record modifier filter that the tag plugin was registered
     * with.
     */
  public addRecord(record: AppendedRecord): FluentBitRecordModifierFilter {
    this._records.push(record);
    return this;
  }

  /**
     * Adds a tag to be removed on a matched input record.
     *
     * If a tag is matched it is removed.
     *
     * @param tag The tag to add to the allow list
     * @returns The record modifier filter that the tag plugin was registered
     * with.
     */
  public addRemove(tag: string): FluentBitRecordModifierFilter {
    this._remove.push(tag);
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
    if (this._allow.length === 0 && this._records.length === 0 && this._remove.length === 0) {
      throw new Error([
        'At least one allow, remove, or record rule must be specified',
        'when creating a Fluent Bit record modifier filter.',
      ].join(' '));
    }

    return {
      configFile: this.renderConfigFile({
        Allowlist_key: this.allow,
        Record: this.records.map((x) => {
          return `${x.fieldName} ${x.value}`;
        }),
        Remove_key: this.remove,
      }),
    };
  }
}