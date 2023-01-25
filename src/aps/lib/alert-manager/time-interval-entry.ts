import { Lazy } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


/**
 * The days of the week to be used in Prometheus alert manager configurations.
 */
export enum Weekday {
  /**
   * Sunday
   */
  SUNDAY = 'sunday',

  /**
   * Monday
   */
  MONDAY = 'monday',

  /**
   * Tuesday
   */
  TUESDAY = 'tuesday',

  /**
   * Wednesday
   */
  WEDNESDAY = 'wednesday',

  /**
   * Thursday
   */
  THURSDAY = 'thursday',

  /**
   * Friday
   */
  FRIDAY = 'friday',

  /**
   * Saturday
   */
  SATURDAY = 'saturday'
}

/**
 * A range specifying the numerical days in the month.
 *
 * Days begin at 1. Negative values are also accepted which begin at the end of
 * the month, e.g. -1 during January would represent January 31. For example:
 * `start: 1` and `end: 5` or `start:-3` and `end: -1` would both be valid
 * ranges.
 *
 * Extending past the start or end of the month will cause it to be clamped.
 * E.g. specifying `start: 1` and `end: 31` during February will clamp the
 * actual end date to 28 or 29 depending on leap years.
 *
 * Inclusive on both ends.
 */
export interface DayOfMonthRange {
  /**
   * The last day of the month for which the range should apply (inclusive).
   */
  readonly end: number;

  /**
   * The first day of the month for which the range should apply.
   */
  readonly start: number;
}

/**
 * A range of calendar months identified by number, where January = 1.
 *
 * Ranges are also accepted by specifying `end` inclusive on both ends.
 */
export interface MonthRange {
  /**
   * The month at the end of the range if the range should cover multiple
   * months (inclusive).
   */
  readonly end?: number;

  /**
   * The month where the range should start.
   */
  readonly start: number;
}

/**
 * Ranges inclusive of the starting time and exclusive of the end time to make
 * it easy to represent times that start/end on hour boundaries.
 *
 * For example, `start: '17:00'` and `end: '24:00'` will begin at 17:00 and
 * finish immediately before 24:00.
 */
export interface TimeRange {
  /**
   * The end time, specified in the format 'HH:MM' using 24 hour time.
   */
  readonly end: string;

  /**
   * The start time, specified in the format 'HH:MM' using 24 hour time.
   */
  readonly start: string;
}

/**
 * A day of the week, where the week begins on Sunday and ends on Saturday.
 *
 * For convenience, ranges are also accepted by specifying `end` and are
 * inclusive on both ends.
 */
export interface WeekdayRange {
  /**
   * The day of the week where the range should end.
   *
   * If not specified, the range will end at the end of the day specified by
   * `start`.
   */
  readonly end?: Weekday;

  /**
   * The day of the week where the range should start.
   */
  readonly start: Weekday;
}

/**
 * A numerical range of years.
 *
 * Ranges to cover multiple years are accepted. For example, `start: 2020` and
 * `end: 2022`.
 *
 * Inclusive on both ends.
 */
export interface YearRange {
  /**
   * The year where the range should end.
   *
   * If not specified, the range will end at the end of the year specified by
   * `start`.
   */
  readonly end?: number;

  /**
   * The year where the range should start.
   */
  readonly start: number;
}


/**
 * Configuration for the alert manager time interval.
 */
export interface TimeIntervalEntryProps {
  /**
   * A list of ranges specifying the days of the month that the time interval
   * should apply for.
   */
  readonly daysOfTheMonth?: DayOfMonthRange[];

  /**
   * A list of ranges specifying the months that the time interval should apply
   * for.
   */
  readonly months?: MonthRange[];

  /**
   * A list of ranges specifying the time periods that the time interval should
   * apply for.
   */
  readonly times?: TimeRange[];

  /**
   * A string that matches a location in the IANA time zone database.
   *
   * For example, 'Australia/Sydney'. The location provides the time zone for
   * the time interval.
   *
   * You may also use `Local` as a location to use the local time of the
   * machine where Alertmanager is running, or `UTC` for UTC time. If no
   * timezone is provided, the time interval is taken to be in UTC time.
   */
  readonly timeZone?: string;

  /**
   * A list of ranges specifying the weekdays that the time interval should
   * apply for.
   */
  readonly weekdays?: WeekdayRange[];

  /**
   * A list of ranges specifying the years that the time interval should apply
   * for.
   */
  readonly years?: YearRange[];
}

/**
 * An object specifying a collection of ranges that together make up an
 * interval of time.
 *
 * Referenced by alert manager to define periods for which certain settings
 * should apply.
 *
 * @see [Time Interval Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#time_interval-0)
 */
export class TimeIntervalEntry {
  /**
   * Internal collection of day of the month ranges for which this time
   * interval will apply.
   */
  private readonly _daysOfTheMonth: DayOfMonthRange[];

  /**
   * Internal collection of month ranges for which this time interval will
   * apply.
   */
  private readonly _months: MonthRange[];

  /**
   * Internal collection of time ranges for which this time interval will
   * apply.
   */
  private readonly _times: TimeRange[];

  /**
   * Internal collection of weekday ranges for which this time interval will
   * apply.
   */
  private readonly _weekdays: WeekdayRange[];

  /**
   * Internal collection of year ranges for which this time interval will
   * apply.
   */
  private readonly _years: YearRange[];

  /**
   * A string that matches a location in the IANA time zone database.
   *
   * For example, 'Australia/Sydney'. The location provides the time zone for
   * the time interval.
   *
   * You may also use `Local` as a location to use the local time of the
   * machine where Alertmanager is running, or `UTC` for UTC time. If no
   * timezone is provided, the time interval is taken to be in UTC time.
   *
   * @group Inputs
   */
  public readonly timeZone?: string;

  /**
   * Collection of day of the month ranges for which this time interval will
   * apply.
   *
   * @group Inputs
   */
  public get daysOfTheMonth(): DayOfMonthRange[] {
    return [...this._daysOfTheMonth];
  }

  /**
   * Collection of month ranges for which this time interval will apply.
   *
   * @group Inputs
   */
  public get months(): MonthRange[] {
    return [...this._months];
  }

  /**
   * Collection of time ranges for which this time interval will apply.
   *
   * @group Inputs
   */
  public get times(): TimeRange[] {
    return [...this._times];
  }

  /**
   * Collection of weekday ranges for which this time interval will apply.
   *
   * @group Inputs
   */
  public get weekdays(): WeekdayRange[] {
    return [...this._weekdays];
  }

  /**
   * Collection of year ranges for which this time interval will apply.
   *
   * @group Inputs
   */
  public get years(): YearRange[] {
    return [...this._years];
  }


  /**
   * Creates a new instance of the TimeIntervalEntry class.
   *
   * @param options Configuration options that define the TimeIntervalEntry.
   */
  public constructor(options: TimeIntervalEntryProps) {
    this._daysOfTheMonth = [];
    this._months = [];
    this._times = [];
    this._weekdays = [];
    this._years = [];

    this.timeZone = options.timeZone;

    options.daysOfTheMonth?.forEach((x) => {
      this.addDaysOfTheMonth(x.start, x.end);
    });

    options.months?.forEach((x) => {
      this.addMonth(x.start, x.end);
    });

    options.times?.forEach((x) => {
      this.addTimes(x.start, x.end);
    });

    options.weekdays?.forEach((x) => {
      this.addWeekday(x.start, x.end);
    });

    options.years?.forEach((x) => {
      this.addYears(x.start, x.end);
    });
  }

  /**
   * Adds a range specifying the numerical days in the month.
   *
   * Days begin at 1. Negative values are also accepted which begin at the end
   * of the month, e.g. -1 during January would represent January 31. For
   * example: `start: 1` and `end: 5` or `start:-3` and `end: -1` would both be
   * valid ranges.
   *
   * Extending past the start or end of the month will cause it to be clamped.
   * E.g. specifying `start: 1` and `end: 31` during February will clamp the
   * actual end date to 28 or 29 depending on leap years.
   *
   * Inclusive on both ends.
   *
   * @param start The first day of the month for which the range should apply.
   * @param end The last day of the month for which the range should apply
   * (inclusive).
   * @returns The time interval the range was added to.
   */
  public addDaysOfTheMonth(start: number, end: number): TimeIntervalEntry {
    this._daysOfTheMonth.push({ start, end });
    return this;
  }

  /**
   * A range of calendar months identified by number, where January = 1.
   *
   * Ranges are also accepted by specifying `end` inclusive on both ends.
   *
   * @param start The month where the range should start.
   * @param end The month at the end of the range if the range should cover
   * multiple months (inclusive).
   * @returns The time interval the range was added to.
   */
  public addMonth(start: number, end?: number): TimeIntervalEntry {
    this._months.push({ start, end });
    return this;
  }

  /**
   * Ranges inclusive of the starting time and exclusive of the end time to
   * make it easy to represent times that start/end on hour boundaries.
   *
   * For example, `start: '17:00'` and `end: '24:00'` will begin at 17:00 and
   * finish immediately before 24:00.
   *
   * @param start The start time, specified in the format 'HH:MM' using 24 hour
   * time.
   * @param end The end time, specified in the format 'HH:MM' using 24 hour
   * time.
   * @returns The time interval the range was added to.
   */
  public addTimes(start: string, end: string): TimeIntervalEntry {
    this._times.push({ start, end });
    return this;
  }

  /**
   * Adds a day of the week, where the week begins on Sunday and ends on
   * Saturday.
   *
   * For convenience, ranges are also accepted by specifying `end` and are
   * inclusive on both ends.
   *
   * @param start The day of the week where the range should start.
   * @param end The day of the week where the range should end. If not
   * specified, the range will end at the end of the day specified by `start`.
   * @returns The time interval the range was added to.
   */
  public addWeekday(start: Weekday, end?: Weekday): TimeIntervalEntry {
    this._weekdays.push({ start, end });
    return this;
  }

  /**
   * Adds a numerical range of years.
   *
   * Ranges to cover multiple years are accepted. For example, `start: 2020` and
   * `end: 2022`.
   *
   * Inclusive on both ends.
   *
   * @param start The year where the range should start.
   * @param end The year where the range should end. If not specified, the
   * range will end at the end of the year specified by `start`.
   * @returns The time interval the range was added to.
   */
  public addYears(start: number, end?: number): TimeIntervalEntry {
    this._years.push({ start, end });
    return this;
  }

  /**
   * Associates the time interval with a construct that is handling the
   * configuration of alert manager.
   *
   * @param _scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @returns An alert manager `time_interval` configuration object.
   */
  public bind(_scope: IConstruct): { [key: string]: any } {
    return {
      days_of_month: Lazy.list(
        {
          produce: () => {
            return this._daysOfTheMonth.map((x) => {
              return `${x.start}:${x.end}`;
            });
          },
        },
        {
          omitEmpty: true,
        },
      ),
      location: this.timeZone,
      months: Lazy.list(
        {
          produce: () => {
            return this._months.map((x) => {
              return x.end ? `${x.start}:${x.end}` : `${x.start}`;
            });
          },
        },
        {
          omitEmpty: true,
        },
      ),
      times: Lazy.any(
        {
          produce: () => {
            return this._times.map((x) => {
              return {
                end_time: x.end,
                start_time: x.start,
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      weekdays: Lazy.list(
        {
          produce: () => {
            return this._weekdays.map((x) => {
              return x.end ? `${x.start}:${x.end}` : `${x.start}`;
            });
          },
        },
        {
          omitEmpty: true,
        },
      ),
      years: Lazy.list(
        {
          produce: () => {
            return this._years.map((x) => {
              return x.end ? `${x.start}:${x.end}` : `${x.start}`;
            });
          },
        },
        {
          omitEmpty: true,
        },
      ),
    };
  }
}