import { readFileSync } from 'fs';
import { AlertManagerTemplate } from '.';


export interface AlertManagerModularConfigurationOptions {
  readonly templates?: AlertManagerTemplate[];
}

export class AlertManagerModularConfiguration {
  public static fromFile(path: string, options: AlertManagerModularConfigurationOptions): AlertManagerModularConfiguration {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return new AlertManagerModularConfiguration(data, options);
  }

  public static fromString(config: string, options: AlertManagerModularConfigurationOptions): AlertManagerModularConfiguration {
    return new AlertManagerModularConfiguration(config, options);
  }


  private readonly _templates: AlertManagerTemplate[];

  public readonly config: string;

  public get templates(): AlertManagerTemplate[] {
    return [...this._templates];
  }

  private constructor(config: string, options?: AlertManagerModularConfigurationOptions) {
    this._templates = [];

    this.config = config;

    options?.templates?.forEach((x) => {
      this.addTemplate(x);
    });
  }

  public addTemplate(template: AlertManagerTemplate): AlertManagerModularConfiguration {
    this._templates.push(template);
    return this;
  }
}