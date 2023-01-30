import { readFileSync } from 'fs';


/**
 * A template that can be used for formatting alerts sent by alert manager.
 *
 * @see [Go templating system](https://pkg.go.dev/text/template)
 * @see [Notification template reference](https://prometheus.io/docs/alerting/latest/notifications/)
 * @see [Notification template examples](https://prometheus.io/docs/alerting/latest/notification_examples/)
 */
export class AlertManagerTemplate {
  /**
   * Loads an alert template from the local filesystem.
   *
   * @param path The path to the file containg the template.
   * @returns An object representing the template that can be used when
   * configuring alert manager for Amzon APS.
   */
  public static fromFile(path: string): AlertManagerTemplate {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return new AlertManagerTemplate(data);
  }

  /**
   * Loads an alert manager template using a template string.
   *
   * @param content The template content as a string. Uses the Go templating
   * system.
   * @returns An object representing the template that can be used when
   * configuring alert manager for Amzon APS.
   */
  public static fromString(content: string): AlertManagerTemplate {
    return new AlertManagerTemplate(content);
  }


  /**
   * The template content as a string. Uses the Go templating system.
   *
   * @group Inputs
   */
  public readonly content: string;


  /**
   * Creates a new instance of the AlertManagerTemplate class.
   *
   * @param name The name of the template. Used to reference the template
   * within the alert manager configuration.
   * @param content The template content as a string. Uses the Go templating
   * system.
   */
  private constructor(content: string) {
    this.content = content;
  }
}