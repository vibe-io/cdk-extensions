import { ArnFormat, IResource, Lazy, Resource, ResourceProps, Stack } from "aws-cdk-lib";
import { CfnStandard } from "aws-cdk-lib/aws-securityhub";
import { IConstruct } from "constructs";


export interface RuleSetProps {
  readonly default?: boolean;
  readonly description?: string;
  readonly global?: boolean;
  readonly id: string;
  readonly name?: string;
  readonly version: string;
}

export interface ScopedRuleSet {
  readonly arn: string;
  readonly default?: boolean;
  readonly description?: string;
  readonly id: string;
  readonly name?: string;
  readonly version: string;
}

export class RuleSet {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  public static readonly CIS_FOUNDATIONS_1_2_0: RuleSet = RuleSet.of({
    default: true,
    description: [
      'The Center for Internet Security (CIS) AWS Foundations Benchmark',
      'v1.2.0 is a set of security configuration best practices for AWS. This',
      'Security Hub standard automatically checks for your compliance',
      'readiness against a subset of CIS requirements.',
    ].join(' '),
    global: true,
    id: 'cis-aws-foundations-benchmark',
    name: 'CIS AWS Foundations Benchmark v1.2.0',
    version: '1.2.0',
  });
  public static readonly CIS_FOUNDATIONS_1_4_0: RuleSet = RuleSet.of({
    default: false,
    description: [
      'The Center for Internet Security (CIS) AWS Foundations Benchmark',
      'v1.4.0 is a set of security configuration best practices for AWS. This',
      'Security Hub standard automatically checks for your compliance',
      'readiness against a subset of CIS requirements.',
    ].join(' '),
    id: 'cis-aws-foundations-benchmark',
    name: 'CIS AWS Foundations Benchmark v1.4.0',
    version: '1.4.0',
  });
  public static readonly FOUNDATIONAL_BEST_PRACTICES_1_0_0: RuleSet = RuleSet.of({
    default: true,
    description: [
      'The AWS Foundational Security Best Practices standard is a set of',
      'automated security checks that detect when AWS accounts and deployed',
      'resources do not align to security best practices. The standard is',
      'defined by AWS security experts. This curated set of controls helps',
      "improve your security posture in AWS, and cover AWS's most popular and",
      'foundational services.',
    ].join(' '),
    id: 'aws-foundational-security-best-practices',
    name: 'AWS Foundational Security Best Practices v1.0.0',
    version: '1.0.0',
  });
  public static readonly NIST_800_53_5_0_0: RuleSet = RuleSet.of({
    default: false,
    description: [
      'NIST Special Publication 800-53 Revision 5 provides a catalog of',
      'security and privacy controls for information systems and',
      'organizations. This Security Hub standard automatically checks for',
      'your compliance readiness against a subset of NIST 800-53 R5',
      'requirements.',
    ].join(' '),
    id: 'nist-800-53',
    name: 'NIST Special Publication 800-53 Revision 5',
    version: '5.0.0',
  });
  public static readonly PCI_DSS_3_2_1: RuleSet = RuleSet.of({
    default: false,
    description: [
      'The Payment Card Industry Data Security Standard (PCI DSS) v3.2.1 is',
      'an information security standard for entities that store, process,',
      'and/or transmit cardholder data. This Security Hub standard',
      'automatically checks for your compliance readiness against a subset of',
      'PCI DSS requirements.',
    ].join(' '),
    id: 'pci-dss',
    name: 'PCI DSS v3.2.1',
    version: '3.2.1',
  });

  private static of(props: RuleSetProps): RuleSet {
    return new RuleSet(props);
  }


  private readonly _props;

  private constructor(props: RuleSetProps) {
    this._props = props;
  }

  public bind(scope: IConstruct): ScopedRuleSet {
    return {
      ...this._props,
      arn: Stack.of(scope).formatArn({
        arnFormat: RuleSet.ARN_FORMAT,
        account: '',
        region: (this._props.global ?? false) ? '' : undefined,
        resource: (this._props.global ?? false) ? 'ruleset' : 'standard',
        resourceName: `${this._props.id}/v/${this._props.version}`,
        service: 'securityhub',
      })
    };
  }
}

export interface IStandard extends IResource {
  readonly standardArn: string;
}

abstract class StandardBase extends Resource implements IStandard {
  public abstract readonly standardArn: string;
}

export interface StandardProps extends ResourceProps {
  readonly disabledControls?: string[];
  readonly ruleSet: RuleSet;
}

export interface DisableControlOptions {
  readonly reason: string;
}

export class Standard extends StandardBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  public static fromStandardArn(scope: IConstruct, id: string, arn: string): IStandard {
    class Import extends StandardBase {
      public readonly standardArn = arn;
    }
    
    return new Import(scope, id);
  }


  private readonly _disabledControls;
  private readonly _scopedRuleSet;

  public readonly resource: CfnStandard;
  public readonly standardArn: string;


  public constructor(scope: IConstruct, id: string, props: StandardProps) {
    super(scope, id, props);

    this._disabledControls = [];
    this._scopedRuleSet = props.ruleSet.bind(this);

    this.standardArn = this._scopedRuleSet.arn;

    this.resource = new CfnStandard(this, 'Resource', {
      disabledStandardsControls: Lazy.any(
        {
          produce: () => {
            return this._disabledControls;
          }
        },
        {
          omitEmptyArray: true,
        }
      ),
      standardsArn: this.standardArn,
    });
  }

  public disableControl(control: string, options: DisableControlOptions): void {
    this._disabledControls.push({
      reason: options.reason,
      standardsControlArn: this.stack.formatArn({
        resource: 'control',
        resourceName: `${this._scopedRuleSet.id}/v/${this._scopedRuleSet.version}/${control}`,
        service: 'securityhub',
      }),
    });
  }
}