import { Lazy } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IPrometheusRule } from './prometheus-rule';


/**
 * Options needed to configure a Prometheus recording rule inside an APS rules
 * configuration.
 */
export interface RecordingRuleProps {
  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and the result recorded as a new set of
   * time series with the metric name as given by `record`.
   *
   * @see [Querying prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)
   */
  readonly expression: string;

  /**
   * Labels to add or overwrite before storing the result.
   */
  readonly labels: { [labelName: string]: string };

  /**
   * The name of the time series to output to. Must be a valid metric name.
   */
  readonly record: string;
}

/**
 * Recording rules allow you to precompute frequently needed or computationally
 * expensive expressions and save their result as a new set of time series.
 * Querying the precomputed result will then often be much faster than
 * executing the original expression every time it is needed. This is
 * especially useful for dashboards, which need to query the same expression
 * repeatedly every time they refresh.
 *
 * @see [Defining recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
 */
export class RecordingRule implements IPrometheusRule {
  /**
   * Internal collection of labels to add or overwrite before storing the
   * result.
   */
  public readonly _labels: { [labelName: string]: string };

  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and the result recorded as a new set of
   * time series with the metric name as given by `record`.
   *
   * @see [Querying prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)
   *
   * @group Inputs
   */
  public readonly expression: string;

  /**
   * The name of the time series to output to. Must be a valid metric name.
   *
   * @group Inputs
   */
  public readonly record: string;

  /**
   * Labels to add or overwrite before storing the result.
   */
  public get labels(): { [labelName: string]: string } {
    return { ...this._labels };
  }


  /**
   * Creates a new instance of the RecordingRule class.
   *
   * @param props Arguments defining the configuration of the reporting rule.
   */
  public constructor(props: RecordingRuleProps) {
    this._labels = {};

    this.expression = props.expression;
    this.record = props.record;
  }

  /**
   * Sets a new label and value that will be added or overridden before storing
   * the result.
   *
   * @param label The name of the label to add.
   * @param value The values of the label to add.
   * @returns The recording rule that the label was added to.
   */
  public addLabel(label: string, value: string): RecordingRule {
    if (label in this._labels) {
      throw new Error([
        'Cannot add duplicate label to Prometheus recording rule with the',
        `label value '${label}'.`,
      ].join(' '));
    }

    this._labels[label] = value;
    return this;
  }

  /**
   * Associates the recording rule with a construct that is configuring an APS
   * rule groups namespace.
   *
   * @param _scope The construct handling the configuration of the APS rule
   * groups namespace that will be consuming this rule.
   * @returns The rendered configuration for the rule as expected by and APS
   * rules config file.
   */
  public bind(_scope: IConstruct): { [key: string]: any } {
    return {
      expression: this.expression,
      labels: Lazy.any({
        produce: () => {
          return !!Object.keys(this._labels).length ? this._labels : undefined;
        },
      }),
      record: this.record,
    };
  }
}