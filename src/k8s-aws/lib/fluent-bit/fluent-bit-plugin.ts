import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from './resolved-fluent-bit-configuration';


/**
 * The types of Fluent Bit plugins that can be configured.
 */
export enum FluentBitPluginType {
  /**
     * A plugin that transforms or filters records.
     */
  FILTER = 'FILTER',

  /**
     * A plugin that configures where output should be sent.
     */
  OUTPUT = 'OUTPUT',

  /**
     * A plugin that read data from input objects into structured objects.
     */
  PARSER = 'PARSER'
}

/**
 * Represents a Fluent Bit plugin that allows for configuration of options and
 * can be used to configure logging from containers.
 */
export interface IFluentBitPlugin {
  /**
     * The name of the fluent bit plugin.
     */
  readonly name: string;

  /**
     * The type of fluent bit plugin.
     */
  readonly pluginType: string;

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     */
  bind(scope: IConstruct): ResolvedFluentBitConfiguration;
}

/**
 * Options that are applicable to all Fluent Bit Plugins regardless of type.
 */
export interface FluentBitPluginCommonOptions {
  /**
     * The name of the fluent bit plugin.
     */
  readonly name: string;

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     */
  readonly pluginType: FluentBitPluginType;
}

/**
 * A Fluent Bit plugin that allows for configuration of options and can be
 * used to configure logging from containers.
 */
export abstract class FluentBitPlugin implements IFluentBitPlugin {
  /**
     * Internal collection keeping track of Fluent Bit configuration fields.
     */
  private readonly _fields: {[key: string]: any[]};

  /**
     * The name of the fluent bit plugin.
     */
  public readonly name: string;

  /**
     * The type of fluent bit plugin.
     */
  readonly pluginType: string;

  /**
     * Collection of all the fields to be added to the Fluent Bit
     * configuration.
     */
  public get fields(): {[key: string]: string[]} {
    return Object.keys(this._fields).reduce((prev, cur) => {
      prev[cur] = this._fields[cur].map((x) => {
        return String(x);
      });

      return prev;
    }, {} as {[key: string]: string[]});
  }


  /**
     * Creates a new instance of the FluentBitPlugin class.
     *
     * @param options Configuration options for the plugin.
     */
  public constructor(options: FluentBitPluginCommonOptions) {
    this._fields = {};

    this.name = options.name;
    this.pluginType = options.pluginType;

    this.addField('Name', this.name);
  }

  /**
      * Adds a new field to the Fluent Bit service configuration.
      *
      * @param key The name of the property being set.
      * @param value The value of the property being set.
      * @returns The Fluent Bit plugin configuration where the property was
      * added.
      */
  public addField(key: string, value: any): FluentBitPlugin {
    if (key in this._fields) {
      this._fields[key].push(value);
    } else {
      this._fields[key] = [
        value,
      ];
    }

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
    return {
      configFile: Object.keys(this._fields).reduce((prev, cur) => {
        this._fields[cur].forEach((x) => {
          prev.push(`    ${cur} ${x}`);
        });

        return prev;
      }, [`[${this.pluginType}]`]).join('\n'),
      fields: this.fields,
    };
  }
}