import { ManagedRule, ManagedRuleIdentifiers, MaximumExecutionFrequency } from "aws-cdk-lib/aws-config";
import { IConstruct } from "constructs";


export enum SecurityhubEnabledRemediationType {
  FULL_ORGANIZATION,
  NONE,
  SINGLE_ACCOUNT,
}

export class SecurityhubEnabledProps {
  readonly description?: string;
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency;
  readonly name?: string;
  readonly remediationType?: SecurityhubEnabledRemediationType;
}

export class SecurityhubEnabled extends ManagedRule {
  public static readonly DEFAULT_DESCRIPTION: string = 'Checks that AWS Security Hub is enabled for an AWS Account. The rule is NON_COMPLIANT if AWS Security Hub is not enabled.';

  public readonly remediationType: SecurityhubEnabledRemediationType;

  public readonly remediationAction?: IAutomationDocument;


  public constructor(scope: IConstruct, id: string, props: SecurityhubEnabledProps = {}) {
    super(scope, id, {
      configRuleName: props.name,
      description: props.description ?? SecurityhubEnabled.DEFAULT_DESCRIPTION,
      identifier: ManagedRuleIdentifiers.SECURITYHUB_ENABLED,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
    });

    this.remediationType = props.remediationType ?? SecurityhubEnabledRemediationType.SINGLE_ACCOUNT;

    if (this.remediationType === SecurityhubEnabledRemediationType.SINGLE_ACCOUNT) {

    } else if (this.remediationType === SecurityhubEnabledRemediationType.FULL_ORGANIZATION) {

    }
  }
}