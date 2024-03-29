import { Names } from 'aws-cdk-lib';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { Construct, IConstruct } from 'constructs';
import { AlertManagerConfiguration } from './configuration';
import { AlertManagerDestination } from './destinations/destination';
import { IAlertManagerDestination } from './destinations/destination-base';
import { AlertManagerSnsDestination, AlertManagerSnsDestinationOptions } from './destinations/sns-destination';


/**
 * Configuration for the aler manager route.
 */
export interface AlertManagerReceiverProps {
  /**
   * Details for alerting providers where events routed to this receiver should
   * be sent,
   */
  readonly destinations?: IAlertManagerDestination[];

  /**
   * The name of the receiver which can be referenced in the other parts of the
   * configuration.
   */
  readonly name?: string;
}

/**
 * Represents a notification integration within alert manager.
 *
 * @see [Receiver configuration](https://prometheus.io/docs/alerting/latest/configuration/#receiver)
 */
export class AlertManagerReceiver extends Construct {
  /**
   * Internal collection of destinations which define details for alerting
   * providers where events routed to this receiver should be sent.
   */
  private readonly _destinations: IAlertManagerDestination[];

  /**
   * The name of the receiver which can be referenced in the other parts of the
   * configuration.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * Collection of destinations which define details for alerting providers
   * where events routed to this receiver should be sent.
   *
   * @group Inputs
   */
  public get destinations(): IAlertManagerDestination[] {
    return [...this._destinations];
  }


  /**
   * Creates a new instance of the AlertManagerReceiver class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of this construct.
   */
  public constructor(scope: AlertManagerConfiguration, id: string, props: AlertManagerReceiverProps = {}) {
    super(scope, id);

    this._destinations = [];

    this.name = props.name ?? Names.uniqueId(this);

    props.destinations?.forEach((x) => {
      this.addDestination(x);
    });
  }

  /**
   * Adds a new generic destination that should receive alerts that have been
   * routed to this receiver.
   *
   * @param destination The destination where alerts routed to this receiver
   * should be sent.
   * @returns The receiver where the destination was added.
   */
  public addDestination(destination: IAlertManagerDestination): AlertManagerReceiver {
    this._destinations.push(destination);
    return this;
  }

  /**
   * Adds a new SNS destination that should receive alerts that have been
   * routed to this receiver.
   *
   * @param topic The SNS topic where alerts should be sent.
   * @param options Options configuring how alerts should be sent to the SNS
   * topic.
   * @returns The SnsDestination object that was added to the receiver.
   */
  public addSnsTopic(topic: ITopic, options?: AlertManagerSnsDestinationOptions): AlertManagerSnsDestination {
    const destination = AlertManagerDestination.snsTopic(topic, options);
    this.addDestination(destination);
    return destination;
  }

  /**
   * Associates the receiver with a construct that is handling the
   * configuration of alert manager that will consume the configuration.
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @returns An alert manager `receiver` configuration object.
   */
  public bind(scope: IConstruct): { [key: string]: any } {
    const destination_configs: { [key: string]: { [key: string]: any }[] } = {};
    this._destinations.forEach((x) => {
      const config_group = destination_configs[x.category.name] ?? [];
      const resolved_config = x.bind(scope);
      config_group.push(resolved_config);
      destination_configs[x.category.name] = config_group;
    });

    return {
      ...destination_configs,
      name: this.name,
    };
  }
}