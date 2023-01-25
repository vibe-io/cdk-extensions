import { IConstruct } from 'constructs';


/**
 * Specifies the type of destination where alert manager can send
 * notifications.
 *
 * Corresponds with a config block inside an alert manager receiver
 * configuration.
 */
export class AlertManagerDestinationCategory {
  /**
   * Sends notifications via email.
   *
   * Not currently supported by APS.
   */
  public static readonly EMAIL: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('email_configs');

  /**
   * Sends notifications using Opsgenie.
   *
   * Not currently supported by APS.
   */
  public static readonly OPSGENIE: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('opsgenie_configs');

  /**
   * Sends notifications using PagerDuty.
   *
   * Not currently supported by APS.
   */
  public static readonly PAGERDUTY: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('pagerduty_configs');

  /**
   * Sends notifications using Pushover.
   *
   * Not currently supported by APS.
   */
  public static readonly PUSHOVER: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('pushover_configs');

  /**
   * Sends notifications via Slack.
   *
   * Not currently supported by APS.
   */
  public static readonly SLACK: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('slack_configs');

  /**
   * Sends notifications using Amazon SNS.
   */
  public static readonly SNS: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('sns_configs');

  /**
   * Sends notifications via Telegram.
   *
   * Not currently supported by APS.
   */
  public static readonly TELEGRAM: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('telegram_configs');

  /**
   * Sends notifications using VictorOps.
   *
   * Not currently supported by APS.
   */
  public static readonly VICTOROPS: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('victorops_configs');

  /**
   * Sends notifications via a webhook.
   *
   * Not currently supported by APS.
   */
  public static readonly WEBHOOK: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('webhook_configs');

  /**
   * Sends notifications via WeChat.
   *
   * Not currently supported by APS.
   */
  public static readonly WECHAT: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('wechat_configs');

  /**
   * Sends notifications using Webex.
   *
   * Not currently supported by APS.
   */
  public static readonly WEBEX: AlertManagerDestinationCategory = AlertManagerDestinationCategory.of('webex_configs');

  /**
   * An escape hatch method that allows specifying arbitrary values for the
   * type a receiver field a destination should be placed under.
   *
   * In the event that new destination types are added by alert manager, this
   * can be used to implement custom destinations in the event that it hasn't
   * had the chance to be implemented here.
   *
   * Whenever possible, it is recommended the static values provided be used.
   *
   * @param name The name of the key in a receiver config where the destination
   * being configured should be placed.
   * @returns An object that can be used when building a receiver that
   * specifies the given destination.
   */
  public static of(name: string): AlertManagerDestinationCategory {
    return new AlertManagerDestinationCategory(name);
  }


  /**
   * Creates a new instance of the AlertManagerDestinationCategory class.
   *
   * @param name The name of the category, as it would appear as a key in the
   * configuration for an alert manager receiver.
   */
  private constructor(public readonly name: string) {}
}

/**
 * Represents a destination where alert manager can send notifications.
 */
export interface IAlertManagerDestination {
  /**
   * The destination type being configured.
   *
   * Represents a config block in an alert manager receiver configuration.
   */
  readonly category: AlertManagerDestinationCategory;

  /**
	 * Associates the destination with a construct that is handling the
	 * configuration of alert manager.
	 *
	 * @param scope The construct handling alert manager configuration.
	 * @returns An object representing the configured destination.
	 */
  bind(scope: IConstruct): {[key: string]: any};
}