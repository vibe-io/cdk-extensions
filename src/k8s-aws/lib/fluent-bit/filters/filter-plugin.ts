import { IFluentBitPlugin } from '..';
import { FluentBitPlugin, FluentBitPluginType } from '../fluent-bit-plugin';


export interface FluentBitFilterPluginCommonOptions {
  readonly match?: string;
}

export interface IFluentBitFilterPlugin extends IFluentBitPlugin {}

export abstract class FluentBitFilterPlugin extends FluentBitPlugin implements IFluentBitFilterPlugin {
  public constructor(name: string, options: FluentBitFilterPluginCommonOptions = {}) {
    super({
      name: name,
      pluginType: FluentBitPluginType.FILTER,
    });

    this.addField('Match', options.match ?? '*');
  }
}