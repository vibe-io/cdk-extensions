import { AlertManagerModularConfiguration, AlertManagerModularConfigurationOptions } from '.';
import { AlertManagerYamlConfiguration } from './yaml-configuration';

export class AlertManagerConfiguration {
  public static modularConfigurationFromFile(path: string, options: AlertManagerModularConfigurationOptions): AlertManagerModularConfiguration {
    return AlertManagerModularConfiguration.fromFile(path, options);
  }

  public static modularConfigurationFromString(config: string, options: AlertManagerModularConfigurationOptions): AlertManagerModularConfiguration {
    return AlertManagerModularConfiguration.fromString(config, options);
  }

  public static yamlConfigurationFromFile(path: string): AlertManagerYamlConfiguration {
    return AlertManagerYamlConfiguration.fromFile(path);
  }

  public static yamlConfigurationFromString(config: string): AlertManagerYamlConfiguration {
    return AlertManagerYamlConfiguration.fromString(config);
  }
}