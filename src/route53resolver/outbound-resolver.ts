import { ArnComponents, Lazy, Names, ResourceProps } from 'aws-cdk-lib';
import { IVpc, Peer, Port, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { CfnResourceShare } from 'aws-cdk-lib/aws-ram';
import { Construct } from 'constructs';
import { ForwardResolverRule } from './forward-resolver-rule';
import { ResolverEndpointBase } from './resolver-endpoint-base';
import { ResolverRuleTargetIp } from './resolver-rule';


/**
 * Configuration for the Outbound Resolver resource.
 */
export interface OutboundResolverProps extends ResourceProps {
  /**
     * The Amazon Resource Name (ARN) of the AWS organization. If this is provided then any resolver
     * rules that get added will be automatically shared with the rest of the organization using AWS RAM.
     */
  readonly organizationArn?: ArnComponents;

  /**
     * A list of CIDR ranges that the Outbound Resolver should be able to connect to to make queries.
     *
     * @default OutboundResolver.DEFAULT_OUTBOUND_CIDRS
     */
  readonly outboundCidrs?: string[];

  /**
     * The selection criteria to use to determine which subnets in a VPC resolver endpoints should be
     * created in. As a matter of best practice, at least 3 subnets in different availablity zones should
     * be used.
     */
  readonly subnets: SubnetSelection;

  /**
     * The VPC where the resolver endpoints should be created.
     */
  readonly vpc: IVpc;
}

export class OutboundResolver extends ResolverEndpointBase {
  // Static properties
  public static readonly DEFAULT_OUTBOUND_CIDRS: string[] = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
  ];
  public static readonly DIRECTION: string = 'OUTBOUND';
  public static readonly SUBNET_OFFSET: number = 5;

  // Input properties
  public readonly organizationArn?: ArnComponents;
  public readonly outboundCidrs: string[];

  // Resource properties
  public readonly resolverRules: ForwardResolverRule[] = [];
  public resourceShare?: CfnResourceShare;


  /**
     * Creates a new instance of the OutboundResolver class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: OutboundResolverProps) {
    super(scope, id, {
      ...props,
      direction: OutboundResolver.DIRECTION,
      subnetOffset: OutboundResolver.SUBNET_OFFSET,
    });

    this.organizationArn = props.organizationArn;

    this.outboundCidrs = props.outboundCidrs ?? OutboundResolver.DEFAULT_OUTBOUND_CIDRS;

    for (let cidr of this.outboundCidrs) {
      this.securityGroup.addEgressRule(Peer.ipv4(cidr), Port.tcp(53), `TCP DNS to ${cidr}`);
      this.securityGroup.addEgressRule(Peer.ipv4(cidr), Port.udp(53), `UDP DNS to ${cidr}`);
    }
  }

  /**
     * Adds a new Resolver Rule for a given domain to the Outbound Resolver. Also adds the created
     * rule to a RAM Resource Share if an organization ARN was specified when the Outbound Resolver
     * was created.
     *
     * @param domain The domain you would like to add the rule for.
     * @param targets The IP addresses of the external resolver that should be used to resolve the
     * domain.
     */
  public addRule(domain: string, targets: ResolverRuleTargetIp[]): ForwardResolverRule {
    // Create the resolver rule, forwarding requests for the domain (and all subdomains) to the
    // specified IP addressed (on port 53).
    const rule = new ForwardResolverRule(this, `resolver-rule-${domain}`, {
      domainName: domain,
      resolverEndpoint: this,
      targetIps: targets,
    });

    this.resolverRules.push(rule);

    // If this is the first rule that was added and an organization ARN was given, create a Resource
    // Share to share the created rules with the organization. The list of rules in the resource share is
    // Lazy evaluated so any subsequent rules that get added will be automatically included without
    // and further action needing to be taken.
    if (this.organizationArn && !this.resourceShare) {
      this.resourceShare = new CfnResourceShare(this, 'resource-share', {
        allowExternalPrincipals: false,
        name: Lazy.uncachedString({
          produce: (_) => {
            return Names.uniqueId(this.resourceShare!);
          },
        }),
        principals: [
          this.stack.formatArn(this.organizationArn),
        ],
        resourceArns: Lazy.uncachedList({
          produce: () => {
            return this.resolverRules.map((x) => {
              return x.resolverRuleArn;
            });
          },
        }),
      });
    }

    return rule;
  }
}