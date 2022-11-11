import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';


export class ModifyCondition {
  /**
     * Condition that returns true if any key matches a specified regular
     * expression.
     *
     * @param regex The regular expression to evaluate against field keys.
     * @returns A ModifyCondition object representing the condition.
     */
  public static aKeyMatches(regex: string): ModifyCondition {
    return ModifyCondition.of('A_key_matches', [
      regex,
    ]);
  }

  /**
     * Condition that returns true if a specified key does not exist.
     *
     * @param key The key to check for existence.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyDoesNotExists(key: string): ModifyCondition {
    return ModifyCondition.of('Key_does_not_exist', [
      key,
    ]);
  }

  /**
     * Condition that returns true if a specified key exists.
     *
     * @param key The key to check for existence.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyExists(key: string): ModifyCondition {
    return ModifyCondition.of('Key_exists', [
      key,
    ]);
  }

  /**
     * Condition that returns true if a specified key exists and its value
     * does not match the specified value.
     *
     * @param key The key to check for existence.
     * @param value The value to check for the given key.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyValueDoesNotEqual(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Key_value_does_not_equal', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if a specified key exists and its value
     * does not match the specified regular expression.
     *
     * @param key The key to check for existence.
     * @param value The regular expression to check for the given key.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyValueDoesNotMatch(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Key_value_does_not_match', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if a specified key exists and its value
     * matches the specified regular expression.
     *
     * @param key The key to check for existence.
     * @param value The regular expression to match for the given key.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyValueMatches(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Key_value_matches', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if a specified key exists and its value
     * matches the specified value.
     *
     * @param key The key to check for existence.
     * @param value The value to match for the given key.
     * @returns A ModifyCondition object representing the condition.
     */
  public static keyValueEquals(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Key_value_equals', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if all keys matching a specified regular
     * expression have values that do not match another regular expression.
     *
     * @param key The regular expression to use to filter keys.
     * @param value The regular expression to check the value of fields.
     * @returns A ModifyCondition object representing the condition.
     */
  public static matchingKeysDoNotHaveMatchingValues(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Matching_keys_do_not_have_matching_values', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if all keys matching a specified regular
     * expression have values that match another regular expression.
     *
     * @param key The regular expression to use to filter keys.
     * @param value The regular expression to check the value of fields.
     * @returns A ModifyCondition object representing the condition.
     */
  public static matchingKeysHaveMatchingValues(key: string, value: string): ModifyCondition {
    return ModifyCondition.of('Matching_keys_have_matching_values', [
      key,
      value,
    ]);
  }

  /**
     * Condition that returns true if no key matches a specified regular
     * expression.
     *
     * @param regex The regular expression to evaluate against field keys.
     * @returns A ModifyCondition object representing the condition.
     */
  public static noKeyMatches(regex: string): ModifyCondition {
    return ModifyCondition.of('No_key_matches', [
      regex,
    ]);
  }

  /**
     * An escape hatch method that allows fo defining custom conditions to be
     * evaluated by the modify Fluent Bit filter plugin.
     *
     * @param condition The name of the condition to be evaluated.
     * @param args The arguments to the operation.
     * @returns A ModifyCondition object representing the options provided.
     */
  public static of(condition: string, args: string[]): ModifyCondition {
    return new ModifyCondition(condition, args);
  }


  /**
     * Internal collection of arguments that apply to the operation.
     */
  private _args: string[];

  /**
     * The name of the condition being evaluated.
     */
  readonly condition: string;

  /**
     * Collection of arguments that apply to the condition.
     */
  public get args(): string[] {
    return this._args;
  }

  /**
     * Creates a new instance of the ModifyCondition class.
     *
     * @param condition The name of the condition being performed.
     * @param args The arguments that apply to the condition.
     */
  private constructor(condition: string, args: string[]) {
    this.condition = condition;
    this._args = args;
  }

  /**
     * Gets a string representation of the arguments of this condition for use
     * in a Fluent Bit plugin field.
     *
     * @returns A fluent bit value string.
     */
  public toString(): string {
    return this.args.join(' ');
  }
}

export class ModifyOperation {
  /**
     * Sets a field in the output to a specific value.
     *
     * If a field with the same name already exists it will be kept as is.
     *
     * @param key The key name of the field to set.
     * @param value The value to set for the specified field.
     * @returns A ModifyOperation object representing the add operation.
     */
  public static add(key: string, value: string): ModifyOperation {
    return ModifyOperation.of('Add', [
      key,
      value,
    ]);
  }

  /**
     * Copies a field from the input to a field with a new name if the field
     * exists and a field with the new name does not exist.
     *
     * If a field with the new name already exists it is overwritten.
     *
     * @param originalKey The key in the input to be copied.
     * @param newKey The new name of the field to be copied to.
     * @returns A ModifyOperation object representing the copy operation.
     */
  public static copy(originalKey: string, newKey: string): ModifyOperation {
    return ModifyOperation.of('Copy', [
      originalKey,
      newKey,
    ]);
  }

  /**
     * Copies a field from the input to a field with a new name if the field
     * exists and a field with the new name does not exist.
     *
     * @param originalKey The key in the input to be copied.
     * @param newKey The new name of the field to be copied to.
     * @returns A ModifyOperation object representing the copy operation.
     */
  public static hardCopy(originalKey: string, newKey: string): ModifyOperation {
    return ModifyOperation.of('Hard_copy', [
      originalKey,
      newKey,
    ]);
  }

  /**
     * Renames a field from the input if the field exists.
     *
     * If a field with the desired name already exists it is overwritten.
     *
     * @param originalKey The key in the input to be renamed.
     * @param renamedKey The new name of the key in the output.
     * @returns A ModifyOperation object representing the rename operation.
     */
  public static hardRename(originalKey: string, renamedKey: string): ModifyOperation {
    return ModifyOperation.of('Hard_rename', [
      originalKey,
      renamedKey,
    ]);
  }

  /**
     * Moves fiels matching the given wildcard key to the end of the message.
     *
     * @param key The wildcard to to match.
     * @returns A ModifyOperation object representing the move operation.
     */
  public static moveToEnd(key: string): ModifyOperation {
    return ModifyOperation.of('Move_to_end', [
      key,
    ]);
  }

  /**
     * Moves fiels matching the given wildcard key to the start of the message.
     *
     * @param key The wildcard to to match.
     * @returns A ModifyOperation object representing the move operation.
     */
  public static moveToStart(key: string): ModifyOperation {
    return ModifyOperation.of('Move_to_start', [
      key,
    ]);
  }

  /**
     * Removes a field in the output with a specific key.
     *
     * @param key The key name of the field to remove.
     * @returns A ModifyOperation object representing the remove operation.
     */
  public static remove(key: string): ModifyOperation {
    return ModifyOperation.of('Remove', [
      key,
    ]);
  }

  /**
     * Removes all fields in the output matching the regular expression.
     *
     * @param regex The regular expression specifying which fields to remove.
     * @returns A ModifyOperation object representing the remove operation.
     */
  public static removeRegex(regex: string): ModifyOperation {
    return ModifyOperation.of('Remove_regex', [
      regex,
    ]);
  }

  /**
     * Removes all fields in the output matching the wildcard key.
     *
     * @param key The wildcard expression specifying which fields to remove.
     * @returns A ModifyOperation object representing the remove operation.
     */
  public static removeWildcard(key: string): ModifyOperation {
    return ModifyOperation.of('Remove_wildcard', [
      key,
    ]);
  }

  /**
     * Renames a field from the input if the field exists and a field with the
     * new name does not exist.
     *
     * @param originalKey The key in the input to be renamed.
     * @param renamedKey The new name of the key in the output.
     * @returns A ModifyOperation object representing the rename operation.
     */
  public static rename(originalKey: string, renamedKey: string): ModifyOperation {
    return ModifyOperation.of('Rename', [
      originalKey,
      renamedKey,
    ]);
  }

  /**
     * Sets a field in the output to a specific value.
     *
     * If a field with the same name already exists it will be overridden with
     * the specified value.
     *
     * @param key The key name of the field to set.
     * @param value The value to set for the specified field.
     * @returns A ModifyOperation object representing the set operation.
     */
  public static set(key: string, value: string): ModifyOperation {
    return ModifyOperation.of('Set', [
      key,
      value,
    ]);
  }

  /**
     * An escape hatch method that allows fo defining custom operations to be
     * performed by the modify Fluent Bit filter plugin.
     *
     * @param operation The name of the operation to be performed.
     * @param args The arguments to the operation.
     * @returns A ModifyOperation object representing the options provided.
     */
  public static of(operation: string, args: string[]): ModifyOperation {
    return new ModifyOperation(operation, args);
  }


  /**
     * Internal collection of arguments that apply to the operation.
     */
  private _args: string[];

  /**
     * The name of the operation being performed.
     */
  readonly operation: string;

  /**
     * Collection of arguments that apply to the operation.
     */
  public get args(): string[] {
    return this._args;
  }

  /**
     * Creates a new instance of the Modify operations class.
     *
     * @param operation The name of the operation being performed.
     * @param args The arguments that apply to the operation.
     */
  private constructor(operation: string, args: string[]) {
    this.operation = operation;
    this._args = args;
  }

  /**
     * Gets a string representation of the arguments of this operation for use
     * in a Fluent Bit plugin field.
     *
     * @returns A fluent bit value string.
     */
  public toString(): string {
    return this.args.join(' ');
  }
}

/**
 * Options for configuring the Modify Fluent Bit filter plugin.
 *
 * @see [Modify Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/modify)
 */
export interface FluentBitModifyFilterOptions extends FluentBitFilterPluginCommonOptions {
  readonly conditions?: ModifyCondition[];
  readonly operations?: ModifyOperation[];
}

/**
 * A Fluent Bit filter that allows changing records using rules and conditions.
 */
export class FluentBitModifyFilter extends FluentBitFilterPluginBase {
  /**
     * Internal collection of conditions to apply for the filter.
     */
  private readonly _conditions: ModifyCondition[];

  /**
     * Internal collection of operations to apply for the filter.
     */
  private readonly _operations: ModifyOperation[];


  /**
     * Collection of conditions to apply for the filter.
     */
  public get conditions(): ModifyCondition[] {
    return [...this._conditions];
  }

  /**
     * Collection of operations to apply for the filter.
     */
  public get operations(): ModifyOperation[] {
    return [...this._operations];
  }


  /**
     * Creates a new instance of the FluentBitModifyFilter class.
     *
     * @param options The configuration options to use for filter.
     */
  public constructor(options: FluentBitModifyFilterOptions = {}) {
    super('modify', options);

    this._conditions = [];
    this._operations = [];

    options.conditions?.forEach((x) => {
      this.addCondition(x);
    });

    options.operations?.forEach((x) => {
      this.addOperation(x);
    });
  }

  /**
     * Adds a new condition to the modify filter.
     *
     * All conditions must evaluate to `true` in order for operations are
     * performed.
     *
     * If one or more conditions do not evaluate to true, no conditions are
     * performed.
     *
     * @param condition The condition to add to the filter.
     * @returns The modify filter to which the condition was added.
     */
  public addCondition(condition: ModifyCondition): FluentBitModifyFilter {
    this._conditions.push(condition);
    return this;
  }

  /**
     * Adds a new operation to the modify filter.
     *
     * @param operation The operation to add to the filter.
     * @returns The modify filter to which the operation was added.
     */
  public addOperation(operation: ModifyOperation): FluentBitModifyFilter {
    this._operations.push(operation);
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
    if (this._operations.length === 0) {
      throw new Error([
        'At least one operation must be specified when creating a Fluent Bit',
        'record modifier filter.',
      ].join(' '));
    }

    return {
      configFile: this.renderConfigFile({
        ...(this.conditions.reduce((prev, cur) => {
          const args = cur.args.join(' ');
          if (cur.condition in prev) {
            prev[cur.condition].push(args);
          } else {
            prev[cur.condition] = [
              args,
            ];
          }

          return prev;
        }, {} as {[key: string]: string[]})),
        ...(this.operations.reduce((prev, cur) => {
          const args = cur.args.join(' ');
          if (cur.operation in prev) {
            prev[cur.operation].push(args);
          } else {
            prev[cur.operation] = [
              args,
            ];
          }

          return prev;
        }, {} as {[key: string]: string[]})),
      }),
    };
  }
}