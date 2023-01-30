import { Lazy } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlertManagerConfiguration } from './configuration';
import { AlertManagerMatcher } from './matcher';


/**
 * Configuration options for the alert manager inhibit rule.
 */
export class AlertManagerInhibitRuleProps {
  /**
   * Labels that must have an equal value in the source and target alert for
   * the inhibition to take effect.
   */
  readonly equalLabels?: string[];

  /**
   * A list of matchers for which one or more alerts have to exist for the
   * inhibition to take effect.
   */
  readonly sourceMatchers?: AlertManagerMatcher[];

  /**
   * A list of matchers that have to be fulfilled by the target alerts to be
   * muted.
   */
  readonly targetMatchers?: AlertManagerMatcher[];
}

/**
 * An inhibition rule mutes an alert (target) matching a set of matchers when
 * an alert (source) exists that matches another set of matchers. Both target
 * and source alerts can optionally be required to have the same label values
 * for a specified list of label names.
 *
 * Semantically, a missing label and a label with an empty value are the same
 * thing. Therefore, if all the label names given for `equalLabels` are missing
 * from both the source and target alerts, the inhibition rule will apply.
 *
 * To prevent an alert from inhibiting itself, an alert that matches both the
 * target and the source side of a rule cannot be inhibited by alerts for which
 * the same is true (including itself). However, we recommend to choose target
 * and source matchers in a way that alerts never match both sides. It is much
 * easier to reason about and does not trigger this special case.
 *
 * @see [Inhibit Rule Official Documentation](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule)
 */
export class AlertManagerInhibitRule extends Construct {
  /**
   * Internal collection of labels that must be equal for both matched source
   * and target alerts in order for the inhibition to take effect.
   */
  private readonly _equalLabels: string[];

  /**
   * Internal collection of matchers for which one or more alerts have to exist
   * for the inhibition to take effect.
   */
  private readonly _sourceMatchers: AlertManagerMatcher[];

  /**
   * Internal collection of matchers that have to be fulfilled by the target
   * alerts to be muted.
   */
  private readonly _targetMatchers: AlertManagerMatcher[];

  /**
   * Collection of labels that must be equal for both matched source and
   * target alerts in order for the inhibition to take effect.
   */
  public get equalLabels(): string[] {
    return [...this._equalLabels];
  }

  /**
   * Collection of matchers for which one or more alerts have to exist for the
   * inhibition to take effect.
   */
  public get sourceMatchers(): AlertManagerMatcher[] {
    return [...this._sourceMatchers];
  }

  /**
   * Collection of matchers that have to be fulfilled by the target alerts to
   * be muted.
   */
  public get targetMatchers(): AlertManagerMatcher[] {
    return [...this._targetMatchers];
  }

  /**
   * Creates a new instance of the AlertManagerInhibitRule class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param options Arguments related to the configuration of this construct.
   */
  public constructor(scope: AlertManagerConfiguration, id: string, options: AlertManagerInhibitRuleProps) {
    super(scope, id);

    this._equalLabels = [];
    this._sourceMatchers = [];
    this._targetMatchers = [];

    options.equalLabels?.forEach((x) => {
      this.addEqualLabel(x);
    });

    options.sourceMatchers?.forEach((x) => {
      this.addSourceMatcher(x);
    });

    options.targetMatchers?.forEach((x) => {
      this.addTargetMatcher(x);
    });
  }

  /**
   * Adds a label that must be equal for both matched source and target alerts
   * in order for the inhibition to take effect.
   *
   * @param label The label to add.
   * @returns The inhibit rule to which the label was added.
   */
  public addEqualLabel(label: string): AlertManagerInhibitRule {
    this._equalLabels.push(label);
    return this;
  }

  /**
   * Adds a matcher for which one or more alerts have to exist in order for
   * inhibition to take effect.
   *
   * @param matcher The source matcher to add.
   * @returns The inhibit rule to which the matcher was added.
   */
  public addSourceMatcher(matcher: AlertManagerMatcher): AlertManagerInhibitRule {
    this._sourceMatchers.push(matcher);
    return this;
  }

  /**
   * Adds a matcher that has to be fulfilled by a target alert in order to be
   * muted.
   *
   * @param matcher The target matcher to add.
   * @returns The inhibit rule to which the matcher was added.
   */
  public addTargetMatcher(matcher: AlertManagerMatcher): AlertManagerInhibitRule {
    this._targetMatchers.push(matcher);
    return this;
  }

  /**
   * Associates the inhibit rule with a construct that is handling the
   * configuration of alert manager.
   *
   * @param _scope The construct handling the configuration of alert manager
   * that will consume the rendered configuration.
   * @returns An alert manager _inhibit_rule` object.
   */
  public bind(_scope: IConstruct): { [key: string]: any } {
    return {
      equal: Lazy.list(
        {
          produce: () => {
            return this._equalLabels;
          },
        },
        {
          omitEmpty: true,
        },
      ),
      source_matchers: Lazy.list({
        produce: () => {
          if (this._sourceMatchers.length === 0) {
            throw new Error([
              'When creating an alert manager inhibit rule at least one',
              'source matcher is required.',
            ].join(' '));
          }

          return this._sourceMatchers.map((x) => {
            return x.expression;
          });
        },
      }),
      target_matchers: Lazy.list({
        produce: () => {
          if (this._targetMatchers.length === 0) {
            throw new Error([
              'When creating an alert manager inhibit rule at least one',
              'target matcher is required.',
            ].join(' '));
          }

          return this._targetMatchers.map((x) => {
            return x.expression;
          });
        },
      }),
    };
  }
}