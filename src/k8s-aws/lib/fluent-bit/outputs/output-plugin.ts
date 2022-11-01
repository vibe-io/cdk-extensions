import { IFluentBitPlugin } from '../../..';
import { FluentBitPlugin, FluentBitPluginType } from '../fluent-bit-plugin';


export interface FluentBitOutputPluginCommonOptions {
  readonly match?: string;
}

export interface IFluentBitOutputPlugin extends IFluentBitPlugin {}

export abstract class FluentBitOutputPlugin extends FluentBitPlugin implements IFluentBitOutputPlugin {
  public constructor(name: string, options: FluentBitOutputPluginCommonOptions = {}) {
    super({
      name: name,
      pluginType: FluentBitPluginType.OUTPUT,
    });

    this.addField('Match', options.match ?? '*');
  }
}