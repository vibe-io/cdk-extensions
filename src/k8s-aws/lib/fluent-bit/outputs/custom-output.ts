import { IConstruct } from 'constructs';
import { FluentBitOutputPluginBase, FluentBitOutputPluginCommonOptions } from '.';
import { ResolvedFluentBitConfiguration } from '..';


/**
 * Options that are applicable to all Fluent Bit Plugins regardless of type.
 */
export interface FluentBitCustomOutputPluginOptions extends FluentBitOutputPluginCommonOptions {
  /**
     * The options used to configure the plugin.
     */
  readonly fields: {[key: string]: string[]};

  /**
     * The name of the Fluent Bit plugin that will handle output.
     */
  readonly name: string;
}

/**
 * A Fluent Bit plugin that allows for configuration of options and can be
 * used to configure logging from containers.
 */
export class FluentBitCustomOutputPlugin extends FluentBitOutputPluginBase {
  /**
     * Internal collection keeping track of Fluent Bit configuration fields.
     */
  private readonly _fields: {[key: string]: any[]};

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
     * Creates a new instance of the FluentBitCustomOutputPlugin class.
     *
     * @param options Configuration options for the plugin.
     */
  public constructor(options: FluentBitCustomOutputPluginOptions) {
    super(options.name);

    this._fields = {};
  }

  /**
      * Adds a new field to the Fluent Bit service configuration.
      *
      * @param key The name of the property being set.
      * @param values The values of the property being set.
      * @returns The Fluent Bit plugin configuration where the property was
      * added.
      */
  public addField(key: string, ...values: string[]): FluentBitCustomOutputPlugin {
    if (key in this._fields) {
      this._fields[key].concat(values);
    } else {
      this._fields[key] = [...values];
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
      configFile: this.renderConfigFile(this._fields),
    };
  }
}