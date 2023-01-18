import { readFileSync } from 'fs';


export class AlertManagerYamlConfiguration {
  public static fromFile(path: string): AlertManagerYamlConfiguration {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return new AlertManagerYamlConfiguration(data);
  }

  public static fromString(config: string): AlertManagerYamlConfiguration {
    return new AlertManagerYamlConfiguration(config);
  }


  public readonly config: string;

  private constructor(config: string) {
    this.config = config;
  }
}