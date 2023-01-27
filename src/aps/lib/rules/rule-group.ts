import { Duration, Lazy, Names } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlertingRule, AlertingRuleProps } from './alerting-rule';
import { IPrometheusRule } from './prometheus-rule';
import { RecordingRule, RecordingRuleProps } from './recording-rule';


/**
 * Options needed to configure a Prometheus rule group for use with an APS rule
 * groups namespace configuration.
 */
export interface RuleGroupProps {
  /**
   * How often rules in the group are evaluated.
   */
  readonly interval?: Duration;

  /**
   * Limit the number of alerts an alerting rule and series a recording rule
   * can produce. 0 is no limit.
   */
  readonly limit?: number;

  /**
   * The name of the group. Must be unique within the configuration.
   */
  readonly name?: string;

  /**
   * The rules to be evaluated per the rule group's configuration.
   */
  readonly rules?: IPrometheusRule[];
}

/**
 * A group of alerting and recording rules for use inside an APS rule groups
 * namespace configuration. Rules within a group are run sequentially at a
 * regular interval, with the same evaluation time. The names of recording
 * rules must be valid metric names. The names of alerting rules must be valid
 * label values.
 *
 * @see [Prometheus rule_group specification](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#rule_group)
 */
export class RuleGroup extends Construct {
  /**
   * Internal collection og rules to be evaluated as part of the rule group.
   */
  private readonly _rules: IPrometheusRule[];

  /**
   * How often rules in the group are evaluated.
   *
   * @group Inputs
   */
  public readonly interval?: Duration;

  /**
   * Limit the number of alerts an alerting rule and series a recording rule
   * can produce. 0 is no limit.
   *
   * @group Inputs
   */
  public readonly limit?: number;

  /**
   * The name of the group. Must be unique within the configuration.
   */
  public readonly name: string;


  /**
   * Creates a new instance of the RuleGroup class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the construct.
   */
  public constructor(scope: IConstruct, id: string, props: RuleGroupProps) {
    super(scope, id);

    this._rules = [];

    this.interval = props.interval;
    this.limit = props.limit;
    this.name = props.name ?? Names.uniqueId(this);

    props.rules?.forEach((x) => {
      this.addRule(x);
    });
  }

  /**
   * Adds an alerting rule to the rule group.
   *
   * @param options Options for configuring the alerting rule to be added.
   * @returns The alerting rule that was added.
   */
  public addAlertingRule(options: AlertingRuleProps): AlertingRule {
    const rule = new AlertingRule(options);
    this.addRule(rule);
    return rule;
  }

  /**
   * Adds a recording rule to the rule group.
   *
   * @param options Options for configuring the recording rule to be added.
   * @returns The recording rule that was added.
   */
  public addRecordingRule(options: RecordingRuleProps): RecordingRule {
    const rule = new RecordingRule(options);
    this.addRule(rule);
    return rule;
  }

  /**
   * Adds a Prometheus rule to the rule group.
   *
   * This method can be used to implement any rules that are created outside of
   * the the rule group that were created manually by calling their
   * constructors or for adding Prometheus rules that use their own custom
   * implementations.
   *
   * @param rule The rule to add to the rule group.
   * @returns The rule group that the rule was added to.
   */
  public addRule(rule: IPrometheusRule): RuleGroup {
    this._rules.push(rule);
    return this;
  }

  /**
   * Associates the rule group with a construct that is configuring an APS
   * rule groups namespace.
   *
   * @param scope The construct handling the configuration of the APS rule
   * groups namespace that will be consuming this rule group.
   * @returns The rendered configuration for the rule group as expected by an
   * APS rules config file.
   */
  public bind(scope: IConstruct): { [key: string]: any } {
    return {
      interval: this.interval ? `${this.interval.toSeconds()}s` : undefined,
      limit: this.limit,
      name: this.name,
      rules: Lazy.any(
        {
          produce: () => {
            return this._rules.map((x) => {
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