import { readFileSync } from 'fs';
import { Duration, Lazy, Stack } from 'aws-cdk-lib';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct, IConstruct } from 'constructs';
import { IAlertManagerDestination } from './destinations/destination-base';
import { AlertManagerInhibitRule, AlertManagerInhibitRuleProps } from './inhibit-rule';
import { AlertManagerMatcher } from './matcher';
import { AlertManagerReceiver, AlertManagerReceiverProps } from './receiver';
import { AlertManagerRoute } from './route';
import { AlertManagerTemplate } from './template';
import { TimeInterval, TimeIntervalProps } from './time-interval';


/**
 * The details that are needed to configure alert manager for an Amazon APS
 * workspace.
 */
export interface AlertManagerConfigurationDetails {
  /**
   * The rendered alert manager configuration in the format expected by an
   * Amazon APS workspace.
   */
  readonly contents: string;
}

/**
 * Represents an alert manager configuration object that can be used by
 * resources configuring alerting for Amazon APS.
 */
export interface IAlertManagerConfiguration {
  /**
   * Adds a new template to the configuration. The template can be referenced
   * within the configuration to control the formatting of the alerts being sent.
   *
   * @param template The template to add to the configuration.
   * @returns The configuration object where the template was added.
   */
  addTemplate(template: AlertManagerTemplate): IAlertManagerConfiguration;

  /**
   * Associates the configuration with a construct that is handling the
   * configuration of alert manager for an APS workspace.
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the configuration.
   * @returns Alert manager configuration details.
   */
  bind(scope: IConstruct): AlertManagerConfigurationDetails;
}

/**
 * Generic base class for alert manager configurations that provides common
 * functionality shared by both constructed and imported configurations.
 */
abstract class AlertManagerConfigurationBase extends Construct implements IAlertManagerConfiguration {
  /**
   * Internal collection fo templates that are referenced in the alert manager
   * configuration.
   */
  private readonly _templates: AlertManagerTemplate[];

  /**
   * Collection of alert manager templates that the configuration uses to
   * format the alerts that it sends.
   *
   * @group Inputs
   */
  public get templates(): AlertManagerTemplate[] {
    return [...this._templates];
  }

  /**
   * Creates a new instance of the AlertManagerConfigurationBase class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   */
  public constructor(scope: IConstruct, id: string) {
    super(scope, id);

    this._templates = [];
  }

  /**
   * Adds a new template to the configuration. The template can be referenced
   * within the configuration to control the formatting of the alerts being sent.
   *
   * @param template The template to add to the configuration.
   * @returns The configuration object where the template was added.
   */
  public addTemplate(template: AlertManagerTemplate): IAlertManagerConfiguration {
    this._templates.push(template);
    return this;
  }

  /**
   * Associates the configuration with a construct that is handling the
   * configuration of alert manager for an APS workspace.
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the configuration.
   * @returns Alert manager configuration details.
   */
  public abstract bind(scope: IConstruct): AlertManagerConfigurationDetails;
}

/**
 * Configuration options that control the default behavior of alerts.
 *
 * These are the settings that will be used for any alerts that do not match a
 * child node in the default routing tree or alerts that do match a child node
 * that doesn't override the settings provded here.
 *
 * The default route does not support all the settings supported by other
 * (child) routes.
 */
export interface DefaultRouteOptions {
  /**
   * The labels by which incoming alerts are grouped together. For example,
   * multiple alerts coming in for cluster=A and alertname=LatencyHigh would be
   * batched into a single group.
   */
  readonly groupByLabels?: string[];

  /**
   * How long to wait before sending a notification about new alerts that are
   * added to a group of alerts for which an initial notification has already
   * been sent (usually ~5m or more).
   */
  readonly groupInterval?: Duration;

  /**
   * How long to initially wait to send a notification for a group of alerts.
   * Allows to wait for an inhibiting alert to arrive or collect more initial
   * alerts for the same group (usually ~0s to few minutes).
   */
  readonly groupWait?: Duration;

  /**
   * A list of matchers that an alert has to fulfill to match the node.
   */
  readonly matchers?: AlertManagerMatcher[];

  /**
   * How long to wait before sending a notification again if it has already
   * been sent successfully for an alert. (Usually ~3h or more).
   */
  readonly repeatInterval?: Duration;
}

/**
 * Configuration for alert manager running on Amazon APS.
 */
export interface AlertManagerConfigurationProps {
  /**
   * Destinations where all alerts generated by APS should be sent.
   */
  readonly defaultReceiverDestinations?: IAlertManagerDestination[];

  /**
   * Options for configuring the behavior of the default route that gets
   * created for alerts.
   *
   * The default route for alert manager does not support all options allowed
   * by child routes.
   */
  readonly defaultRoute?: DefaultRouteOptions;

  /**
   * The SNS topic where alerts should be sent if no other destinations for
   * alert manager are configured.
   *
   * If no default topic is specified and no default receiver destinations are
   * added then a new SNS topic will be created.
   *
   * The default topic is not automatically added as a destination if a more
   * specific list of destinations is provided. As such, if you want to be sure
   * the specified topic receives alerts it should also be included in the
   * `defaultReceiverDestinations` list.
   */
  readonly defaultTopic?: ITopic;
}

/**
 * Represents a Prometheus alert manager configuration that can be used by
 * Amazon APS to send generated alerts to one or more destinations. Currently
 * the only destination type supported by APS is Amazon SNS.
 *
 * @see [APS Configuration Files](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-config.html)
 * @see [Alert manager configuration specification](https://prometheus.io/docs/alerting/latest/configuration/)
 */
export class AlertManagerConfiguration extends AlertManagerConfigurationBase {
  /**
   * Imports an alert manager configuration from a raw string in the format
   * expected by Amazon APS.
   *
   * The string should combine both the alert manager configuration and the
   * alert template content into a single file. To import a configuration that
   * has the alert manager configuration and templates being loaded from
   * different files/sources use {@link fromSplitConfigurationContent} instead.
   *
   * @see [APS Configuration Files](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-config.html)
   * @see [Alert manager configuration specification](https://prometheus.io/docs/alerting/latest/configuration/)
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param content A YAML formatted string specifying the alert manager
   * configuration as expected by Amazon APS.
   * @returns An object that can be used to configure alert manager for APS.
   */
  public static fromFullConfigurationContent(scope: IConstruct, id: string, content: string): IAlertManagerConfiguration {
    class Import extends AlertManagerConfigurationBase {
      public addTemplate(_template: AlertManagerTemplate): IAlertManagerConfiguration {
        throw new Error([
          'Cannot add templates to alert manager configurations that are',
          'imported using a full configuration spec.',
        ].join(' '));
      }

      public bind(_scope: IConstruct): AlertManagerConfigurationDetails {
        return {
          contents: content,
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Imports an alert manager configuration using a file in the format expected
   * by Amazon APS.
   *
   * The file should combine both the alert manager configuration and the alert
   * template content into a single file. To import a configuration that has
   * the alert manager configuration and templates being loaded from different
   * files/sources use {@link fromSplitConfigurationFiles} instead.
   *
   * @see [APS Configuration Files](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-config.html)
   * @see [Alert manager configuration specification](https://prometheus.io/docs/alerting/latest/configuration/)
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param path The path to the file containing the APS alert manager
   * configuration.
   * @returns An object that can be used to configure alert manager for APS.
   */
  public static fromFullConfigurationFile(scope: IConstruct, id: string, path: string): IAlertManagerConfiguration {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return AlertManagerConfiguration.fromFullConfigurationContent(scope, id, data);
  }

  /**
   * Imports an alert manager configuration from a raw string.
   *
   * The string should be in YAML format and follow the alert manager
   * configuration specifications. To import a configuration using a string
   * that combines the alert manager configuration with the template content
   * that is already in the format expected by Amazon APS use the import method
   * {@link fromFullConfigurationContent} instead.
   *
   * If the configuration references any templates then each template the
   * configuration references should be specified using the `templates`
   * argument. Templates can be read from their own separate files on disk or
   * as a string.
   *
   * @see [Alert manager configuration specification](https://prometheus.io/docs/alerting/latest/configuration/)
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param content A YAML formatted string specifying the alert manager
   * configuration.
   * @param templates The templates referenced by the imported configuration.
   * @returns An object that can be used to configure alert manager for APS.
   */
  public static fromSplitConfigurationContent(scope: IConstruct, id: string, content: string, templates?: AlertManagerTemplate[]): IAlertManagerConfiguration {
    class Import extends AlertManagerConfigurationBase {
      public bind(scope: IConstruct): AlertManagerConfigurationDetails {
        return {
          contents: Stack.of(scope).toJsonString({
            alertmanager_config: content,
            template_files: this.templates.reduce((prev, cur) => {
              prev[cur.name] = cur.content;
              return prev;
            }, {} as { [key: string]: string }),
          }),
        };
      }
    }

    const config = new Import(scope, id);
    templates?.forEach((x) => {
      config.addTemplate(x);
    });

    return config;
  }

  /**
   * Imports an alert manager configuration from a file.
   *
   * The file is a YAML file that follows the alert manager configuration
   * specifications. To import a configuration file that combines the alert
   * manager configuration with the template content that is already in the
   * format expected by Amazon APS use the import method
   * {@link fromFullConfigurationFile} instead.
   *
   * If the configuration references any templates then each template the
   * configuration references should be specified using the `templates`
   * argument. Templates can be read from their own separate files on disk or
   * as a string.
   *
   * @see [Alert manager configuration specification](https://prometheus.io/docs/alerting/latest/configuration/)
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param path The path to the file containing the alert manager
   * specification.
   * @param templates The templates referenced by the imported configuration.
   * @returns An object that can be used to configure alert manager for APS.
   */
  public static fromSplitConfigurationFiles(scope: IConstruct, id: string, path: string, templates?: AlertManagerTemplate[]): IAlertManagerConfiguration {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return AlertManagerConfiguration.fromSplitConfigurationContent(scope, id, data, templates);
  }


  /**
   * The receiver configuring the destinations where all alerts that are not
   * matched by a child route in the routing tree will be sent.
   *
   * @see [Receiver Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#receiver)
   *
   * @group Resources
   */
  public readonly defaultReceiver: AlertManagerReceiver;

  /**
   * The default root route withing the routing tree. Serves as the default
   * configuration for all alerts. Sends alerts to the default receiver.
   *
   * Must match all alerts and cannot be muted or deactivated. To add more
   * advanced configurations create additional routes as children of the
   * default route.
   *
   * @see [Route OfficialDocumentation](https://prometheus.io/docs/alerting/latest/configuration/#route)
   *
   * @group Resources
   */
  public readonly defaultRoute: AlertManagerRoute;

  /**
   * The topic that the default receiver will send messages to if no other
   * destinations are added to the receiver.
   *
   * If destinations are specified for the default receiver then this topic
   * will not be used as a destination. This is only a fallback value if no
   * other destinations are specified.
   *
   * The topic uses lazy creation to ensure it is only created if it is needed.
   * Referencing this topic anywhere (such as by adding subscriptions) will
   * cause it to be created. If other destinations are given for the default
   * receiver and this topic is never referenced by any external code it will
   * not be created.
   *
   * @group Resources
   */
  public readonly defaultTopic: ITopic;

  /**
   * Collection of inhibit rules that mute an alert under scecific sets of
   * circumstances.
   *
   * @see [Inhibit Rule Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule)
   *
   * @group Resource
   */
  public get inhibitRules(): AlertManagerInhibitRule[] {
    const result: AlertManagerInhibitRule[] = [];
    this.node.children.forEach((x) => {
      if (x instanceof AlertManagerInhibitRule) {
        result.push(x);
      }
    });

    return result;
  }

  /**
   * Collection of notification integrations that provide the details for how
   * and where generated alerts should be sent.
   *
   * @see [Receiver Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule)
   *
   * @group Resources
   */
  public get receivers(): AlertManagerReceiver[] {
    const result: AlertManagerReceiver[] = [];
    this.node.children.forEach((x) => {
      if (x instanceof AlertManagerReceiver) {
        result.push(x);
      }
    });

    return result;
  }

  /**
   * Collection of timing configurations that can be used to control when
   * specific alerts should be muted or activated.
   *
   * @see [Time Interval Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#time_interval)
   *
   * @group Resources
   */
  public get timeIntervals(): TimeInterval[] {
    const result: TimeInterval[] = [];
    this.node.children.forEach((x) => {
      if (x instanceof TimeInterval) {
        result.push(x);
      }
    });

    return result;
  }


  /**
   * Creates a new instance of the AlertManagerConfiguration class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the construct.
   */
  public constructor(scope: IConstruct, id: string, props: AlertManagerConfigurationProps = {}) {
    super(scope, id);

    this.defaultReceiver = this.addReciever('default', {
      destinations: props.defaultReceiverDestinations,
      name: 'default',
    });

    this.defaultRoute = new AlertManagerRoute(this, 'route-default', {
      ...(props.defaultRoute ?? {}),
      receiver: this.defaultReceiver,
    });

    this.defaultTopic = props.defaultTopic ?? Topic.fromTopicArn(this, 'lazy-topic', Lazy.string({
      produce: () => {
        const innerId = 'topic-default';
        const inner = this.node.tryFindChild(innerId) as ITopic ?? new Topic(this, innerId);
        return inner.topicArn;
      },
    }));
  }

  /**
   * Adds a new inhibit rule that can mute alerts under specific circumstances.
   *
   * @param id Unique identifier for the inhibit rule.
   * @param options Details for the rule being created.
   * @returns The inhibit rule that was added to the configuration.
   */
  public addInhibitRule(id: string, options: AlertManagerInhibitRuleProps): AlertManagerInhibitRule {
    return new AlertManagerInhibitRule(this, `inhibit-rule-${id}`, options);
  }

  /**
   * Adds a new receiver to the configuration. The receiver can be used to
   * specify one or more destinations where alerts should be sent when matched
   * by a route in the routing tree.
   *
   * @param id Unique identifier for the receiver.
   * @param options Details for the receiver being created.
   * @returns The receiver that was added to the configuration.
   */
  public addReciever(id: string, options: AlertManagerReceiverProps): AlertManagerReceiver {
    return new AlertManagerReceiver(this, `receiver-${id}`, options);
  }

  /**
   * Adds a new time interval to the configuration. Time intervals can be used
   * to mute or activate groups of alerts under specific circumstances.
   *
   * Time intervals are referenced by routes in the routing tree to control the
   * behavior of the route. Time intervals to mute or activate alerts cannot be
   * added to the default route.
   *
   * @param id Unique identifier for the time interval.
   * @param options Details for the time interval being created.
   * @returns The time interval that was added to the configuration.
   */
  public addTimeInterval(id: string, options: TimeIntervalProps): TimeInterval {
    return new TimeInterval(this, `time-interval-${id}`, options);
  }

  /**
   * Associates the configuration with a construct that is handling the
   * configuration of alert manager for an APS workspace.
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the configuration.
   * @returns Alert manager configuration details.
   */
  public bind(scope: IConstruct): AlertManagerConfigurationDetails {
    return {
      contents: Lazy.string({
        produce: () => {
          if (this.defaultReceiver.destinations.length === 0) {
            this.defaultReceiver.addSnsTopic(this.defaultTopic);
          }

          return Stack.of(this).toJsonString({
            alertmanager_config: {
              inhibit_rules: this.inhibitRules.map((x) => {
                return x.bind(scope);
              }),
              receivers: this.receivers.map((x) => {
                return x.bind(scope);
              }),
              route: this.defaultRoute.bind(scope),
              time_intervals: this.timeIntervals.map((x) => {
                return x.bind(scope);
              }),
            },
            template_files: this.templates.reduce((prev, cur) => {
              prev[cur.name] = cur.content;
              return prev;
            }, {} as { [key: string]: string }),
          });
        },
      }),
    };
  }
}