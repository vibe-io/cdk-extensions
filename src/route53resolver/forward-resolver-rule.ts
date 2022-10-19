import { ResourceProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OutboundResolver } from './outbound-resolver';
import { ResolverRule, ResolverRuleTargetIp, ResolverRuleType } from './resolver-rule';


/**
 * Generic configuration for a SystemResolverRule resource
 */
export interface ForwardResolverRuleProps extends ResourceProps {
  readonly domainName: string;
  readonly resolverEndpoint: OutboundResolver;
  readonly ruleName?: string;
  readonly targetIps?: ResolverRuleTargetIp[];
}

export class ForwardResolverRule extends ResolverRule {
  /**
     * Creates a new instance of the SystemResolverRule class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: ForwardResolverRuleProps) {
    super(scope, id, {
      domainName: props.domainName,
      resolverEndpoint: props.resolverEndpoint,
      ruleName: props.ruleName,
      ruleType: ResolverRuleType.FORWARD,
      targetIps: props.targetIps,
    });
  }
}