import { FluentBitPlugin, FluentBitPluginType } from '../fluent-bit-plugin';


export interface FluentBitOutputPluginCommonOptions {
  readonly match?: string;
}

export abstract class FluentBitOutputPlugin extends FluentBitPlugin {
  public constructor(name: string, options: FluentBitOutputPluginCommonOptions = {}) {
    super({
      name: name,
      pluginType: FluentBitPluginType.OUTPUT,
    });

    this.addField('Match', options.match ?? '*');
  }
}