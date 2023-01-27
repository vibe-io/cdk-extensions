import { Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnRuleGroupsNamespace } from 'aws-cdk-lib/aws-aps';
import { IConstruct } from 'constructs';
import { IWorkspace } from '.';
import { RuleGroup, RuleGroupProps } from './lib/rules/rule-group';
import { IRuleGroupConfiguration, RuleGroupConfiguration } from './lib/rules/rule-group-configuration';


/**
 * Represents an APS rule groups namespace in AWS.
 */
export interface IRuleGroupsNamespace {
  /**
   * The Amazon Resource Name (ARN) of the APS rule groups namespace.
   */
  readonly rulesGroupsNamespaceArn: string;
}

/**
 * A base class providing common functionality between created and imported APS
 * rule groups namespaces.
 */
abstract class RuleGroupsNamespaceBase extends Resource implements IRuleGroupsNamespace {
  /**
   * The Amazon Resource Name (ARN) of the APS rule groups namespace.
   */
  public abstract readonly rulesGroupsNamespaceArn: string;
}

/**
 * Configuration for the RuleGroupsNamespace resource.
 */
export interface RuleGroupsNamespaceProps extends ResourceProps {
  /**
   * The rules definition file for this namespace.
   *
   * @see [RuleGroupsNamespace Data](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data)
   */
  readonly configuration?: IRuleGroupConfiguration;

  /**
   * The name of the rule groups namespace.
   *
   * @see [RuleGroupsNamespace Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name)
   */
  readonly name?: string;

  /**
   * The APS workspace that contains this rule groups namespace.
   *
   * @see [RuleGroupsNamespace Workspace](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace)
   */
  readonly workspace: IWorkspace;
}

/**
 * Amazon Managed Service for Prometheus allows for the configuration of rules
 * that configure alerting and precomputation of frequently needed expressions.
 *
 * These rules are added to a workspace using configurations that define one or
 * more resource groups. Eache group can contain one or more rules and
 * configures the frequency that its rules should be evaluated.
 *
 * You can have multiple configurations per workspace. Each configuration is
 * contained in a separate _namespace_. Having multiple configuration lets you
 * import existing Prometheus rules files to a workspace without having to
 * change or combine them. Different rule group namespaces can also have
 * different tags.
 *
 * @see [AWS::APS::RuleGroupsNamespace](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html)
 * @see [Recording rules and alerting rules](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html)
 */
export class RuleGroupsNamespace extends RuleGroupsNamespaceBase {
  /**
   * Imports an existing APS rule groups namespace by specifying its Amazon
   * Resource Name (ARN).
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param arn The ARN of the existing APS rule groups namespace. to be
   * imported.
   * @returns An object representing the imported APS rule groups namespace.
   */
  public static fromRuleGroupsNamespaceArn(scope: IConstruct, id: string, arn: string): IRuleGroupsNamespace {
    class Import extends RuleGroupsNamespaceBase {
      public readonly rulesGroupsNamespaceArn: string = arn;
    }

    return new Import(scope, id);
  }

  /**
   * The rules definition file for this namespace.
   *
   * @see [RuleGroupsNamespace Data](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data)
   *
   * @group Inputs
   */
  public readonly configuration: IRuleGroupConfiguration;

  /**
   * The name of the rule groups namespace.
   *
   * @see [RuleGroupsNamespace Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name)
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * The APS workspace that contains this rule groups namespace.
   *
   * @see [RuleGroupsNamespace Workspace](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace)
   *
   * @group Inputs
   */
  public readonly workspace: IWorkspace;

  /**
   * The underlying RuleGroupsNamespace CloudFormation resource.
   *
   * @see [AWS::APS::RuleGroupsNamespace](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html)
   *
   * @group Resources
   */
  public readonly resource: CfnRuleGroupsNamespace;

  /**
   * The Amazon Resource Name (ARN) of the APS rule groups namespace.
   */
  public readonly rulesGroupsNamespaceArn: string;


  /**
   * Creates a new instance of the RuleGroupsNamespace class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: IConstruct, id: string, props: RuleGroupsNamespaceProps) {
    super(scope, id, props);

    this.name = props.name ?? Names.uniqueId(this);
    this.workspace = props.workspace;

    this.configuration = props.configuration ?? new RuleGroupConfiguration(this, 'configuration');

    this.resource = new CfnRuleGroupsNamespace(this, 'Resource', {
      data: Lazy.string({
        produce: () => {
          const bound = this.configuration.bind(this);
          return bound.content;
        },
      }),
      name: this.name,
      workspace: this.workspace.workspaceArn,
    });

    this.rulesGroupsNamespaceArn = this.resource.attrArn;
  }

  /**
   * Adds a new rule group to the configuration.
   *
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param options Configuration options for the new rule group being added.
   * @returns The rule group that was added.
   */
  public addRuleGroup(id: string, options: RuleGroupProps): RuleGroup {
    if (this.configuration instanceof RuleGroupConfiguration) {
      return this.configuration.addRuleGroup(id, options);
    } else {
      throw new Error([
        'Cannot add rule groups to namespaces that are using an imported or',
        'custom rule group configuration.',
      ].join(' '));
    }
  }
}