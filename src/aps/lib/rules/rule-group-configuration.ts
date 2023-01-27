import { readFileSync } from 'fs';
import { Lazy, Stack } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { RuleGroup, RuleGroupProps } from './rule-group';


/**
 * The details that are needed to configure an APS rule groups namespace that
 * will consume a rule group configuration.
 */
export interface RuleGroupConfigurationDetails {
  /**
   * The content of the rules configuration definition, in the format of an APS
   * rules configuration file.
   *
   * @see [Creating a rules file](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-ruler-rulesfile.html)
   */
  readonly content: string;
}

/**
 * Represents a rules configuration that can be consumed by Amazon Managed
 * Service for Prometheus when creating a rule groups namespace.
 */
export interface IRuleGroupConfiguration extends IConstruct {
  /**
   * Associates the configuration with a resource that is handling the creation
   * of an APS rule groups namespace.
   *
   * @param scope The construct handling the configuration of an APS rule
   * groups namespace that will be consuming this configuration.
   * @returns Rule group configuration details.
   */
  bind(scope: IConstruct): RuleGroupConfigurationDetails;
}

/**
 * Generic base class for Prometheus rules configurations that provides common
 * functionality shared by both constructed and imported configurations.
 */
abstract class RuleGroupConfigurationBase extends Construct implements IRuleGroupConfiguration {
  /**
   * Associates the configuration with a resource that is handling the creation
   * of an APS rule groups namespace.
   *
   * @param scope The construct handling the configuration of an APS rule
   * groups namespace that will be consuming this configuration.
   * @returns Rule group configuration details.
   */
  public abstract bind(scope: IConstruct): RuleGroupConfigurationDetails;
}

/**
 * Configuration options for a Prometheus rule group configuration.
 */
export interface RuleGroupConfigurationProps {}

/**
 * Represents a rules file definition that can be consumed by Amazon Managed
 * Service for Prometheus.
 *
 * @see [RuleGroupsNamespace Data](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data)
 * @see [Creating a rules file](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-ruler-rulesfile.html)
 */
export class RuleGroupConfiguration extends RuleGroupConfigurationBase {
  /**
   * Imports an APS rules configuration using a raw string.
   *
   * The string should be in YAML format and follow the specification expected
   * by the `aps:CreateRuleGroupsNamespace` API call.
   *
   * @see [Rules file specification](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-ruler-rulesfile.html)
   *
   * @param scope The construct handling the configuration of a rule groups
   * namespace that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param content The raw string content of a rule groups configuration.
   * @returns An object that can be used to configure a rule groups namespace
   * for APS.
   */
  public static fromContent(scope: IConstruct, id: string, content: string): IRuleGroupConfiguration {
    class Import extends RuleGroupConfigurationBase {
      bind(_scope: IConstruct): RuleGroupConfigurationDetails {
        return {
          content: content,
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Imports an APS rules file from the local filesystem.
   *
   * The file should be in YAML format and follow the specification expected by
   * the `aps:CreateRuleGroupsNamespace` API call.
   *
   * @see [Rules file specification](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-ruler-rulesfile.html)
   *
   * @param scope The construct handling the configuration of a rule groups
   * namespace that will consume the rendered configuration.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param path The path to the file containing the rule group definitions.
   * @returns An object that can be used to configure a rule groups namespace
   * for APS.
   */
  public static fromRulesFile(scope: IConstruct, id: string, path: string): IRuleGroupConfiguration {
    const data = readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    });

    return RuleGroupConfiguration.fromContent(scope, id, data);
  }


  /**
   * Internal collection of rule groups that are part of this configuration.
   */
  private _ruleGroups: RuleGroup[];

  /**
   * Collection of rule groups that are part of this configuration.
   */
  public get ruleGroups(): RuleGroup[] {
    return [...this._ruleGroups];
  }


  /**
   * Creates a new instance of the RuleGroupConfiguration class.
   *
   * @param scope A CDK Construct that will serve as this construct's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param _props Arguments related to the configuration of the construct.
   */
  public constructor(scope: IConstruct, id: string, _props: RuleGroupConfigurationProps = {}) {
    super(scope, id);

    this._ruleGroups = [];

    this.node.addValidation({
      validate: () => {
        const errors = [];

        if (this._ruleGroups.length === 0) {
          errors.push([
            'A rule group configuration must contain at least one rule group.',
            'To add rule groups to a rule group configuration call the',
            '`addRuleGroup` method.',
          ].join(' '));
        }

        return errors;
      },
    });
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
    const output = new RuleGroup(this, `rule-group-${id}`, options);
    this._ruleGroups.push(output);
    return output;
  }

  /**
   * Associates the configuration with a resource that is handling the creation
   * of an APS rule groups namespace.
   *
   * @param scope The construct handling the configuration of an APS rule
   * groups namespace that will be consuming this configuration.
   * @returns Rule group configuration details.
   */
  public bind(scope: IConstruct): RuleGroupConfigurationDetails {
    return {
      content: Lazy.string({
        produce: () => {
          return Stack.of(scope).toJsonString({
            groups: this._ruleGroups.map((x) => {
              return x.bind(scope);
            }),
          });
        },
      }),
    };
  }
}