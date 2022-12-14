import { ResourceProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ResolverRule, ResolverRuleType } from './resolver-rule';


/**
 * Generic configuration for a SystemResolverRule resource
 */
export interface SystemResolverRuleProps extends ResourceProps {
  /**
   * The domain name that the rule is applied to.
   */
  readonly domainName: string;
  /**
   * The name of the system resolver rule
   */
  readonly ruleName?: string;
}

export class SystemResolverRule extends ResolverRule {
  /**
     * Creates a new instance of the SystemResolverRule class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: SystemResolverRuleProps) {
    super(scope, id, {
      /**
       * {@link SystemResolverRuleProps.domainName}
       */
      domainName: props.domainName,
      /**
       * {@link SystemResolverRuleProps.ruleName}
       */
      ruleName: props.ruleName,
      /**
       * {@link aws-route53resolver.ResolverRuleType.SYSTEM}
       */
      ruleType: ResolverRuleType.SYSTEM,
    });
  }
}