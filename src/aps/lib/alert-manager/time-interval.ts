import { Lazy } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlertManagerConfiguration } from './configuration';
import { TimeIntervalEntry } from './time-interval-entry';


/**
 * Configuration for the alert manager time interval.
 */
export interface TimeIntervalProps {
  /**
   * The interval definitions that define the periods of time that the time
   * interval should apply for.
   */
  readonly intervals?: TimeIntervalEntry[];

  /**
   * The name of the time interval as it will be referenced throught the rest
   * of the alert manager configuration.
   */
  readonly name: string;
}

/**
 * Represents a named interval of time that may be referenced by the alert
 * manager router to mute/activate particular routes for particular times of
 * day.
 *
 * @see [Time Interval Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#time_interval-0)
 */
export class TimeInterval extends Construct {
  /**
   * Internal collection of interval entries that defined the the full scope of
   * the periods for which the time interval should apply.
   */
  private readonly _intervals: TimeIntervalEntry[];

  /**
   * The name of the time interval as it will be referenced throught the rest
   * of the alert manager configuration.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * Collection of interval entries that defined the the full scope of the
   * periods for which the time interval should apply.
   *
   * @group Inputs
   */
  public get intervals(): TimeIntervalEntry[] {
    return [...this._intervals];
  }


  /**
   * Creates a new instance of the TimeInterval class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param options Arguments related to the configuration of this construct.
   */
  public constructor(scope: AlertManagerConfiguration, id: string, options: TimeIntervalProps) {
    super(scope, id);

    this._intervals = [];

    this.name = options.name;

    options.intervals?.forEach((x) => {
      this.addInterval(x);
    });
  }

  /**
   * Adds a new time interval entry to the time interval.
   *
   * @param interval The the time interval entry to be added.
   * @returns The time interval to which the entry was added.
   */
  public addInterval(interval: TimeIntervalEntry): TimeInterval {
    this._intervals.push(interval);
    return this;
  }

  /**
   * Associates the time interval with a construct that is handling the
   * configuration of alert manager.
   *
   * @param scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @returns An alert manager `time_interval` configuration object.
   */
  public bind(scope: IConstruct): { [key: string]: any } {
    return {
      name: this.name,
      time_interval: Lazy.any(
        {
          produce: () => {
            return this._intervals.map((x) => {
              return x.bind(scope);
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
    };
  }
}