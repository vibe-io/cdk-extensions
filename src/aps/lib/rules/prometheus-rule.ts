import { IConstruct } from 'constructs';


/**
 * Represents a Prometheus rule that can be added to a rule group and used as
 * part of an APS rules configuration.
 */
export interface IPrometheusRule {
  /**
	 * Associates the rule with a construct that is configuring an APS rule
	 * groups namespace.
	 *
	 * @param scope The construct handling the configuration of the APS rule
   * groups namespace that will be consuming this rule.
	 */
  bind(scope: IConstruct): { [key: string]: any };
}