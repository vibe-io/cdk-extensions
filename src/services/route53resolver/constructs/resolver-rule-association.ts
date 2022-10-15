import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { CfnResolverRuleAssociation } from 'aws-cdk-lib/aws-route53resolver';
import { Construct } from 'constructs';
import { IResolverRule } from './resolver-rule';


/**
 * Generic configuration for a ResolverRuleAssociation resource
 */
export interface ResolverRuleAssociationProps extends ResourceProps {
  readonly name?: string;
  readonly resolverRule: IResolverRule;
  readonly vpc: IVpc;
}

export class ResolverRuleAssociation extends Resource {
  // Input properties
  public readonly name?: string;
  public readonly resolverRule: IResolverRule;
  public readonly vpc: IVpc;

  // Resource properties
  public readonly resource: CfnResolverRuleAssociation;

  // Standard properties
  public readonly resolverRuleAssociationId: string;
  public readonly resolverRuleAssociationName: string;
  public readonly resolverRuleAssociationResolverRuleId: string;
  public readonly resolverRuleAssociationVpcId: string;


  /**
     * Creates a new instance of the ResolverRule class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: ResolverRuleAssociationProps) {
    super(scope, id, props);

    this.name = props.name;
    this.resolverRule = props.resolverRule;
    this.vpc = props.vpc;

    this.resource = new CfnResolverRuleAssociation(this, 'Resource', {
      name: this.name,
      resolverRuleId: this.resolverRule.resolverRuleId,
      vpcId: this.vpc.vpcId,
    });

    this.resolverRuleAssociationId = this.resource.attrResolverRuleAssociationId;
    this.resolverRuleAssociationName = this.resource.attrName;
    this.resolverRuleAssociationResolverRuleId = this.resource.attrResolverRuleId;
    this.resolverRuleAssociationVpcId = this.resource.attrVpcId;
  }
}