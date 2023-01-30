import { Duration, Lazy } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IPrometheusRule } from './prometheus-rule-base';


/**
 * Options needed to configure a Prometheus alerting rule inside an APS rules
 * configuration.
 */
export interface AlertingRuleProps {
  /**
   * The name of the alert. Must be a valid label value.
   */
  readonly alert: string;

  /**
   * Annotations to add to each alert. Supports templating.
   */
  readonly annotations?: { [labelName: string]: string };

  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and all resultant time series become
   * pending/firing alerts.
   *
   * @see [Querying prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)
   */
  readonly expression: string;

  /**
   * Labels to add or overwrite for each alert.
   */
  readonly labels?: { [labelName: string]: string };

  /**
   * Alerts are considered firing once they have been returned for this long.
   * Alerts which have not yet fired for long enough are considered pending.
   */
  readonly period?: Duration;
}

/**
 * Alerting rules allow you to define alert conditions based on Prometheus
 * expression language expressions and to send notifications about firing
 * alerts to an external service. Whenever the alert expression results in one
 * or more vector elements at a given point in time, the alert counts as active
 * for these elements' label sets.
 *
 * @see [Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
 */
export class AlertingRule implements IPrometheusRule {
  /**
   * Internal collection of annotations to add to each alert.
   */
  private readonly _annotations: { [labelName: string]: string };

  /**
   * Internal collection of labels to add or overwrite for each alert.
   */
  private readonly _labels: { [labelName: string]: string };

  /**
   * The name of the alert. Must be a valid label value.
   *
   * @group Onputs
   */
  public readonly alert: string;

  /**
   * The PromQL expression to evaluate. Every evaluation cycle this is
   * evaluated at the current time, and all resultant time series become
   * pending/firing alerts.
   *
   * @see [Querying prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)
   *
   * @group Inputs
   */
  public readonly expression: string;

  /**
   * Alerts are considered firing once they have been returned for this long.
   * Alerts which have not yet fired for long enough are considered pending.
   *
   * @group Inputs
   */
  public readonly period?: Duration;


  /**
   * Creates a new instance of the AlertingRule class.
   *
   * @param props Arguments defining the configuration of the alerting rule.
   */
  public constructor(props: AlertingRuleProps) {
    this._annotations = {};
    this._labels = {};

    this.alert = props.alert;
    this.expression = props.expression;
    this.period = props.period;

    if (props.annotations) {
      const annotations = props.annotations;
      Object.keys(annotations).forEach((x) => {
        this.addAnnotation(x, annotations[x]);
      });
    }

    if (props.labels) {
      const labels = props.labels;
      Object.keys(labels).forEach((x) => {
        this.addLabel(x, labels[x]);
      });
    }
  }

  /**
   * Sets a new annotation that will be added to each generated alert.
   *
   * @param label The name of the annotation to add.
   * @param template The template that will be used to render the value of the
   * annotation.
   * @returns The alerting rule that the annotation was added to.
   */
  public addAnnotation(label: string, template: string): AlertingRule {
    if (label in this._annotations) {
      throw new Error([
        'Cannot add duplicate annotation to Prometheus alerting rule with the',
        `label value '${label}'.`,
      ].join(' '));
    }

    this._annotations[label] = template;
    return this;
  }

  /**
   * Sets a new label that will be added or overridden for each generated
   * alert.
   *
   * @param label The name of the label to add.
   * @param template The template that will be used to render the value of the
   * label.
   * @returns The alerting rule that the label was added to.
   */
  public addLabel(label: string, template: string): AlertingRule {
    if (label in this._labels) {
      throw new Error([
        'Cannot add duplicate label to Prometheus alerting rule with the',
        `label value '${label}'.`,
      ].join(' '));
    }

    this._labels[label] = template;
    return this;
  }

  /**
   * Associates the alerting rule with a construct that is configuring an APS
   * rule groups namespace.
   *
   * @param _scope The construct handling the configuration of the APS rule
   * groups namespace that will be consuming this rule.
   * @returns The rendered configuration for the rule as expected by an APS
   * rules config file.
   */
  public bind(_scope: IConstruct): { [key: string]: any } {
    return {
      alert: this.alert,
      annotations: Lazy.any({
        produce: () => {
          return Object.keys(this._annotations).length === 0 ? undefined : this._annotations;
        },
      }),
      expr: this.expression,
      for: this.period ? `${this.period.toSeconds()}s` : undefined,
      labels: Lazy.any({
        produce: () => {
          return Object.keys(this._labels).length === 0 ? undefined : this._labels;
        },
      }),
    };
  }
}