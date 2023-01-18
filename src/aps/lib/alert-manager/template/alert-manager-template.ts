import { readFileSync } from 'fs';


export class AlertManagerTemplate {
  public static fromFile(path: string): AlertManagerTemplate {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return new AlertManagerTemplate(data);
  }

  public static fromString(content: string): AlertManagerTemplate {
    return new AlertManagerTemplate(content);
  }

  public readonly content: string;

  private constructor(content: string) {
    this.content = content;
  }
}