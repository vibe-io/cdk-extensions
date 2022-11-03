import { IFluentBitPlugin } from '../../..';
import { FluentBitPlugin, FluentBitPluginType } from '../fluent-bit-plugin';


/**
 * Configuration options that apply to all Fluent Bit output plugins.
 */
export interface FluentBitOutputPluginCommonOptions {
  /**
   * The pattern to match for records that this output should apply to.
   */
  readonly match?: string;
}

/**
 * Represents a Fluent Bit plugin that controls log output to a given
 * destination.
 */
export interface IFluentBitOutputPlugin extends IFluentBitPlugin {}

/**
 * Represents a Fluent Bit plugin that controls log output to a given
 * destination.
 */
export abstract class FluentBitOutputPluginBase extends FluentBitPlugin implements IFluentBitOutputPlugin {
  /**
   * The pattern to match for records that this output should apply to.
   *
   * @group Inputs
   */
  public readonly match: string;


  /**
   * Creates a new instance of the FluentBitOutputPlugin class.
   *
   * @param name The name of the output plugin to configure.
   * @param options Configuration options that apply to all Fluent Bit output
   * plugin.
   */
  public constructor(name: string, options: FluentBitOutputPluginCommonOptions = {}) {
    super({
      name: name,
      pluginType: FluentBitPluginType.OUTPUT,
    });

    this.match = options.match ?? '*';
  }

  /**
   * Renders a Fluent Bit configuration file for the plugin.
   *
   * @param config The configuration options to render into a configuration
   * file.
   * @returns A rendered plugin configuration file.
   */
  protected renderConfigFile(config: { [key: string]: any }): string {
    return super.renderConfigFile({
      Match: this.match,
      ...config,
    });
  }
}