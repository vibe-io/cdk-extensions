import { IConstruct } from 'constructs';
import { isArray } from '../../../utils/types';
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
     * The name of the fluent bit plugin.
     */
  public readonly name: string;

  /**
     * The type of fluent bit plugin.
     */
  readonly pluginType: string;


  /**
   * Creates a new instance of the FluentBitPlugin class.
   *
   * @param options Configuration options for the plugin.
   */
  public constructor(options: FluentBitPluginCommonOptions) {
    this.name = options.name;
    this.pluginType = options.pluginType;
  }

  /**
   * Builds a configuration for this plugin and returns the details for
   * consumtion by a resource that is configuring logging.
   *
   * @param _scope The construct configuring logging using Fluent Bit.
   * @returns A configuration for the plugin that con be used by the resource
   * configuring logging.
   */
  public abstract bind(scope: IConstruct): ResolvedFluentBitConfiguration;

  /**
   *
   * @param config The configuration properties to render into a Fluent Bit
   * configuration file.
   * @returns A fluent bit config file representation of the passed properties.
   */
  protected renderConfigFile(config: {[key: string]: any}): string {
    const fullConfig: {[key: string]: any} = {
      Name: this.name,
      ...config,
    };

    return Object.keys(fullConfig).reduce((prev, cur) => {
      const val = fullConfig[cur];
      const arr = isArray(val) ? val : [val];
      arr.filter((x) => {
        return x !== undefined;
      }).forEach((x: any) => {
        prev.push(`    ${cur} ${x}`);
      });

      return prev;
    }, [`[${this.pluginType}]`]).join('\n');
  }
}