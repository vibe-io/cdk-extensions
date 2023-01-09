import { Annotations, IResolvable, Lazy, Resource, ResourceProps, Stack } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { CfnResolverRule } from 'aws-cdk-lib/aws-route53resolver';
import { Construct, IConstruct } from 'constructs';
import { OutboundResolver } from './outbound-resolver';
import { ResolverRuleAssociation } from './resolver-rule-association';

/**
 * @see [AWS::Route53Resolver::ResolverRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53resolver-resolverrule.html#cfn-route53resolver-resolverrule-ruletype)
 */
export enum ResolverRuleType {
  /**
   * When you want to forward DNS queries for specified domain name to resolvers on your network, specify FORWARD.
   */
  FORWARD = 'FORWARD',
  /**
   * Currently, only the Resolver can create rules that have a value of RECURSIVE for RuleType.
   */
  RECURSIVE = 'RECURSIVE',
  /**
   * When you have a forwarding rule to forward DNS queries for a domain to your network and you want Resolver to process queries for a subdomain of that domain, specify SYSTEM.
   */
  SYSTEM = 'SYSTEM'
}

export interface ResolverRuleTargetIp {
  /**
   * The IP address to target
   *
   * @see [AWS::Route53Resolver::ResolverRule TargetAddress](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53resolver-resolverrule-targetaddress.html#cfn-route53resolver-resolverrule-targetaddress-ip)
   */
  readonly address: string;
  /**
   * The port to target
   *
   * @see [AWS::Route53Resolver::ResolverRule TargetAddress](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53resolver-resolverrule-targetaddress.html#cfn-route53resolver-resolverrule-targetaddress-port)
   */
  readonly port?: number;
}

export interface VpcAssociationOptions {
  /**
   * Name to give the VPC Association
   */
  readonly name?: string;
}

export interface IResolverRule {
  /**
   * The Amazon Resource Name (ARN) of the resolver rule.
   */
  readonly resolverRuleArn: string;
  /**
   * DNS queries for this domain name are forwarded to the IP addresses that are specified in TargetIps.
   * If a query matches multiple Resolver rules (example.com and www.example.com), the query is routed
   * using the Resolver rule that contains the most specific domain name (www.example.com).
   *
   * @see [AWS::Route53Resolver::ResolverRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53resolver-resolverrule.html#cfn-route53resolver-resolverrule-domainname)
   */
  readonly resolverRuleDomainName: string;
  /**
   * The ID of the endpoint that the rule is associated with.
   *
   * @see [AWS::Route53Resolver::ResolverRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53resolver-resolverrule.html#cfn-route53resolver-resolverrule-resolverendpointid)
   */
  readonly resolverRuleEndpointId: string;
  /**
   * The ID associated with the Resolver Rule
   */
  readonly resolverRuleId: string;
  /**
   * The name for the Resolver rule.
   */
  readonly resolverRuleName: string;
  /**
   * An array that contains the IP addresses and ports that an outbound endpoint forwards DNS queries to.
   * Typically, these are the IP addresses of DNS resolvers on your network. Specify IPv4 addresses. IPv6 is not supported.
   */
  readonly resolverRuleTargetIps: IResolvable;
  associateVpc(vpc: IVpc, options?: VpcAssociationOptions): ResolverRuleAssociation;
}

abstract class ResolverRuleBase extends Resource implements IResolverRule {
  /**
     * The Amazon Resource Name (ARN) of the resolver rule.
     */
  public abstract readonly resolverRuleArn: string;

  /**
     * DNS queries for this domain name are forwarded to the IP addresses that
     * are specified in TargetIps. If a query matches multiple resolver rules
     * (example.com and www.example.com), the query is routed using the
     * resolver rule that contains the most specific domain name
     * (www.example.com).
     */
  public abstract readonly resolverRuleDomainName: string;

  /**
     * The ID of the outbound endpoint that the rule is associated with.
     */
  public abstract readonly resolverRuleEndpointId: string;

  /**
     * When the value of `RuleType` is `FORWARD,` the ID that Resolver assigned to
     * the resolver rule when you created it. This value isn't applicable when
     * `RuleType` is `SYSTEM`.
     */
  public abstract readonly resolverRuleId: string;

  /**
     * A friendly name that lets you easily find a rule in the Resolver
     * dashboard in the Route 53 console.
     */
  public abstract readonly resolverRuleName: string;

  /**
     * When the value of `RuleType` is `FORWARD`, the IP addresses that the
     * outbound endpoint forwards DNS queries to, typically the IP addresses
     * for DNS resolvers on your network. This value isn't applicable when
     * `RuleType` is `SYSTEM`.
     */
  public abstract readonly resolverRuleTargetIps: IResolvable;

  /**
     * Creates an association between a VPC and a resolver rule.
     *
     * A resolver rule that isn't associated with any VPC's will have no
     * effect, even in the VPC containing the rule's outbound resolver.
     *
     * VPC associations don't need to be in the same account as
     * the resolver rule for rules shared with [AWS RAM](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html).
     *
     * @param vpc The VPC you want to create the association for.
     * @param options Additional configuration for the association.
     * @returns The association that was created.
     */
  public associateVpc(vpc: IVpc, options?: VpcAssociationOptions): ResolverRuleAssociation {
    return new ResolverRuleAssociation(this, `association-${vpc.node.addr}`, {
      name: options?.name,
      resolverRule: this,
      vpc: vpc,
    });
  }
}

/**
 * Generic configuration for a ResolverRule resource
 */
export interface ResolverRuleProps extends ResourceProps {
  readonly domainName: string;
  readonly resolverEndpoint?: OutboundResolver;
  readonly ruleName?: string;
  readonly ruleType: ResolverRuleType;
  readonly targetIps?: ResolverRuleTargetIp[];
}

export class ResolverRule extends ResolverRuleBase {
  public static fromResolverRuleId(scope: IConstruct, id: string, resolverRuleId: string): IResolverRule {
    class Import extends ResolverRuleBase {
      public readonly resolverRuleArn = Stack.of(scope).formatArn({
        resource: 'resolver-rule',
        resourceName: resolverRuleId,
        service: 'route53resolver',
      });

      public readonly resolverRuleDomainName = Lazy.string({
        produce: () => {
          throw new Error('Cannot get domain name for resolver rules imported using only an ID.');
        },
      });

      public readonly resolverRuleEndpointId = Lazy.string({
        produce: () => {
          throw new Error('Cannot get endpoint ID for resolver rules imported using only an ID.');
        },
      });

      public readonly resolverRuleId = resolverRuleId;

      public readonly resolverRuleName = Lazy.string({
        produce: () => {
          throw new Error('Cannot get name for resolver rules imported using only an ID.');
        },
      });

      public readonly resolverRuleTargetIps = Lazy.any({
        produce: () => {
          throw new Error("Cannot get target IP's for resolver rules imported using only an ID.");
        },
      });
    }

    return new Import(scope, id);
  }

  // Internal properties
  private readonly _targetIps: ResolverRuleTargetIp[] = [];

  // Input properties
  public readonly domainName: string;
  public readonly resolverEndpoint?: OutboundResolver;
  public readonly ruleName?: string;
  public readonly ruleType: ResolverRuleType;

  // Resource properties
  public readonly resource: CfnResolverRule;

  // Standard properties
  public readonly resolverRuleArn: string;
  public readonly resolverRuleDomainName: string;
  public readonly resolverRuleEndpointId: string;
  public readonly resolverRuleId: string;
  public readonly resolverRuleName: string;
  public readonly resolverRuleTargetIps: IResolvable;


  /**
     * Creates a new instance of the ResolverRule class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: ResolverRuleProps) {
    super(scope, id, props);

    this.domainName = props.domainName;
    this.resolverEndpoint = props.resolverEndpoint;
    this.ruleName = props.ruleName;
    this.ruleType = props.ruleType;

    if (this.ruleType === ResolverRuleType.RECURSIVE) {
      Annotations.of(this).addError("Currently, only Resolver can create rules that have a value of 'RECURSIVE' for 'RuleType'.");
    }

    this.resource = new CfnResolverRule(this, 'Resource', {
      domainName: this.domainName,
      ruleType: this.ruleType,
      name: this.ruleName,
      resolverEndpointId: this.resolverEndpoint?.resolverEndpointId,
      targetIps: Lazy.any(
        {
          produce: () => {
            return this._targetIps.map((x): CfnResolverRule.TargetAddressProperty => {
              return {
                ip: x.address,
                port: x.port?.toString(),
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
    });

    this.resolverRuleArn = this.resource.attrArn;
    this.resolverRuleDomainName = this.resource.attrDomainName;
    this.resolverRuleEndpointId = this.resource.attrResolverEndpointId;
    this.resolverRuleId = this.resource.attrResolverRuleId;
    this.resolverRuleName = this.resource.attrName;
    this.resolverRuleTargetIps = this.resource.attrTargetIps;

    props.targetIps?.map((x) => {
      this.addTargetIp(x);
    });
  }

  public addTargetIp(target: ResolverRuleTargetIp): ResolverRule {
    const port = target.port ?? 53;

    if ((port < 0) || (port > 65535)) {
      Annotations.of(this).addError(`Specified resolver target port (${port}) is  invalid (must be between 0 and 65535).`);
    }

    if (this.ruleType === ResolverRuleType.SYSTEM) {
      Annotations.of(this).addError("Cannot add target IP's to rules of type 'SYSTEM'.");
    }

    this._targetIps.push(target);
    return this;
  }
}