import { Duration } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { FluentBitFilterPluginBase, FluentBitFilterPluginCommonOptions } from './filter-plugin-base';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';


/**
 * Options for configuring the Throttle Fluent Bit filter plugin.
 *
 * @see [Throttle Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/throttle)
 */
export interface FluentBitThrottleFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * Time interval
     */
  readonly interval?: Duration;

  /**
     * Whether to print status messages with current rate and the limits to
     * information logs
     */
  readonly printStatus?: boolean;

  /**
     * Amount of messages for the time.
     */
  readonly rate?: number;

  /**
     * Amount of intervals to calculate average over.
     *
     * @default 5
     */
  readonly window?: number;
}

/**
 * A Fluent Bit filter that sets the average *Rate* of messages per *Interval*,
 * based on leaky bucket and sliding window algorithm. In case of overflood,
 * it will leak within certain rate.
 */
export class FluentBitThrottleFilter extends FluentBitFilterPluginBase {
  /**
   * Time interval
   *
   * @group Inputs
   */
  readonly interval: Duration;

  /**
    * Whether to print status messages with current rate and the limits to
    * information logs
    *
    * @group Inputs
    */
  readonly printStatus?: boolean;

  /**
    * Amount of messages for the time.
    *
    * @group Inputs
    */
  readonly rate: number;

  /**
    * Amount of intervals to calculate average over.
    *
    * @group Inputs
    */
  readonly window: number;


  /**
   * Creates a new instance of the FluentBitThrottleFilter class.
   *
   * @param options Options for configuring the filter.
   */
  public constructor(options: FluentBitThrottleFilterOptions = {}) {
    super('throttle', options);

    this.interval = options.interval ?? Duration.seconds(1);
    this.printStatus = options.printStatus;
    this.rate = options.rate ?? 5;
    this.window = options.window ?? 5;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(_scope: IConstruct): ResolvedFluentBitConfiguration {
    return {
      configFile: this.renderConfigFile({
        Interval: `${this.interval.toSeconds()}s`,
        Print_Status: this.printStatus,
        Rate: this.rate,
        Window: this.window,
      }),
    };
  }
}