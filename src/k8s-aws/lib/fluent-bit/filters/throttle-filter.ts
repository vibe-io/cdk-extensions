import { Duration } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { FluentBitFilterPlugin, FluentBitFilterPluginCommonOptions } from './filter-plugin';


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
     * Amount of intervals to calculate average over. Default 5.
     */
  readonly window?: number;
}

/**
 * A Fluent Bit filter that sets the average *Rate* of messages per *Interval*,
 * based on leaky bucket and sliding window algorithm. In case of overflood,
 * it will leak within certain rate.
 */
export class ThrottleFilter extends FluentBitFilterPlugin {
  public constructor(options: FluentBitThrottleFilterOptions = {}) {
    super('throttle', options);

    if (options.interval !== undefined) {
      this.addField('Interval', `${options.interval.toSeconds()}s`);
    }

    if (options.printStatus !== undefined) {
      this.addField('Print_Status', String(options.printStatus));
    }

    if (options.rate !== undefined) {
      this.addField('Rate', options.rate.toString());
    }

    if (options.window !== undefined) {
      this.addField('Window', options.window.toString());
    }
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    if (this.fields.Interval === undefined || this.fields.Rate === undefined || this.fields.Window === undefined) {
      throw new Error([
        'When using the Fluent Bit throttle plugin the fields',
        "'Interval', 'Rate', and 'Window' are required.",
      ].join(' '));
    }

    return super.bind(scope);
  }
}