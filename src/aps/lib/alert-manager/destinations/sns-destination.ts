import { ArnFormat, Lazy, Stack } from 'aws-cdk-lib';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../../../../utils/formatting';
import { AlertManagerDestinationCategory, IAlertManagerDestination } from './destination-base';


/**
 * Optional configuration for an alert manager SNS destination.
 */
export interface AlertManagerSnsDestinationOptions {
  /**
   * The SNS API URL i.e. https://sns.us-east-2.amazonaws.com.
   *
   * If not specified, the SNS API URL from the SNS SDK will be used.
   */
  readonly apiUrl?: string;

  /**
   * SNS message attributes.
   */
  readonly attributes?: {[key: string]: string};

  /**
   * The message content of the SNS notification.
   */
  readonly message?: string;

  /**
   * Controls whether to notify about resolved alerts.
   */
  readonly sendResolved?: boolean;

  /**
   * Subject line when the message is delivered to email endpoints.
   */
  readonly subject?: string;
}

/**
 * Configuration for an alert manager SNS destination.
 */
export interface AlertManagerSnsDestinationProps extends AlertManagerSnsDestinationOptions {
  /**
   * SNS topic where alerts will be sent.
   *
   * If you are using a FIFO SNS topic you should set a message group interval
   * longer than 5 minutes to prevent messages with the same group key being
   * deduplicated by the SNS default deduplication window.
   */
  readonly topic: ITopic;
}

/**
 * An alert manager destination that provides details for sending alert
 * notifications to an Amazon SNS topic.
 *
 * @see [Alert manager SNS configuration](https://prometheus.io/docs/alerting/latest/configuration/#sns_config)
 */
export class AlertManagerSnsDestination implements IAlertManagerDestination {
  /**
   * Internal collection of attributes to be applied to SNS messages.
   */
  private readonly _attributes: { [key: string]: string };

  /**
   * The SNS API URL i.e. https://sns.us-east-2.amazonaws.com.
   *
   * If not specified, the SNS API URL from the SNS SDK will be used.
   *
   * @group Inputs
   */
  public readonly apiUrl?: string;

  /**
   * The message content of the SNS notification.
   *
   * @group Inputs
   */
  public readonly message?: string;

  /**
   * Controls whether to notify about resolved alerts.
   *
   * @group Inputs
   */
  public readonly sendResolved?: boolean;

  /**
   * Subject line when the message is delivered to email endpoints.
   *
   * @groups Inputs
   */
  public readonly subject?: string;

  /**
   * SNS topic where alerts will be sent.
   *
   * If you are using a FIFO SNS topic you should set a message group interval
   * longer than 5 minutes to prevent messages with the same group key being
   * deduplicated by the SNS default deduplication window.
   *
   * @group Inputs
   */
  public readonly topic: ITopic;

  /**
   * Attributes to be applied to SNS messages.
   *
   * @group Inputs
   */
  public get attributes(): { [key: string]: string } {
    return { ...this._attributes };
  }

  /**
   * The destination type being configured.
   *
   * Represents a config block in an alert manager receiver configuration.
   */
  public readonly category: AlertManagerDestinationCategory;


  /**
   * Creates a new instance of the AlertManagerSnsDestination class.
   *
   * @param options Arguments related to the configuration of the destination.
   */
  public constructor(options: AlertManagerSnsDestinationProps) {
    this._attributes = {};

    this.category = AlertManagerDestinationCategory.SNS;

    this.apiUrl = options.apiUrl;
    this.message = options.message;
    this.sendResolved = options.sendResolved;
    this.subject = options.subject;
    this.topic = options.topic;

    const attributes = options.attributes ?? {};
    Object.keys(attributes).forEach((x) => {
      this.addAttribute(x, attributes[x]);
    });
  }

  /**
   * Registers a new attribute to be added to sent SNS messages.
   *
   * @param key The name of the attribute.
   * @param value The value to use for the named attribute.
   * @returns The sns destination object the attribute was added to.
   */
  public addAttribute(key: string, value: string): AlertManagerSnsDestination {
    if (key in this._attributes && value !== this._attributes[key]) {
      throw new Error([
        `Tried to add duplicate key '${key}' to SNS destination attributes`,
        `with a value of '${value}'. However an attribute already exists for`,
        `'${key}' with a value of '${this._attributes[key]}'.`,
      ].join(' '));
    }

    this._attributes[key] = value;
    return this;
  }

  /**
   * Associates the destination with a construct that is handling the
   * configuration of alert manager.
   *
   * @param scope The construct handling alert manager configuration.
   * @returns An object representing the configured destination.
   */
  public bind(scope: IConstruct): { [key: string]: any } {
    const stack = Stack.of(scope);
    const topicRegion = stack.splitArn(this.topic.topicArn, ArnFormat.NO_RESOURCE_NAME).region!;

    return definedFieldsOrUndefined({
      api_url: this.apiUrl,
      attributes: Lazy.any({
        produce: () => {
          return !!Object.keys(this._attributes).length ? this._attributes : undefined;
        },
      }),
      message: this.message,
      send_resolved: this.sendResolved,
      sigv4: {
        region: topicRegion,
      },
      subject: this.subject,
      topic_arn: this.topic.topicArn,
    })!;
  }
}