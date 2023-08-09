import { ResourceProps } from 'aws-cdk-lib';
import { ManagedRule, MaximumExecutionFrequency } from 'aws-cdk-lib/aws-config';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { RemediationTarget } from '../config/lib';
import { RemediationConfiguration } from '../config/remediation-configuration';
import { AutomationDocument } from '../ssm';


export interface IamPasswordPolicyProps extends ResourceProps {
  readonly autoRemediation?: boolean;
  readonly configRuleName?: string;
  readonly description?: string;
  readonly maxPasswordAge?: number;
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency;
  readonly minimumPasswordLength?: number;
  readonly passwordReusePrevention?: number;
  readonly requireLowercaseCharacters?: boolean;
  readonly requireNumbers?: boolean;
  readonly requireSymbols?: boolean;
  readonly requireUppercaseCharacters?: boolean;
}

export class IamPasswordPolicy extends ManagedRule {
  static readonly DEFAULT_DESCRIPTION: string = [
    'Checks if the account password policy for AWS Identity and Access',
    'Management (IAM) users meets the specified requirements indicated in the',
    'parameters. The rule is NON_COMPLIANT if the account password policy',
    'does not meet the specified requirements.',
  ].join(' ');
  static readonly DEFAULT_MAX_PASSWORD_AGE: number = 90;
  static readonly DEFAULT_MINIMUM_PASSWORD_LENGTH: number = 14;
  static readonly DEFAULT_PASSWORD_REUSE_PREVENTION: number = 24;
  static readonly DEFAULT_REQUIRE_LOWERCASE_CHARACTERS: boolean = true;
  static readonly DEFAULT_REQUIRE_NUMBERS: boolean = true;
  static readonly DEFAULT_REQUIRE_SYMBOLS: boolean = true;
  static readonly DEFAULT_REQUIRE_UPPERCASE_CHARACTERS: boolean = true;
  static readonly MANAGED_RULE_NAME: string = 'IAM_PASSWORD_POLICY';
  static readonly REMEDIATION_DOCUMENT_NAME: string = 'AWSConfigRemediation-SetIAMPasswordPolicy';


  readonly maxPasswordAge: number;
  readonly minimumPasswordLength: number;
  readonly passwordReusePrevention: number;
  readonly requireLowercaseCharacters: boolean;
  readonly requireNumbers: boolean;
  readonly requireSymbols: boolean;
  readonly requireUppercaseCharacters: boolean;
  readonly remediationConfiguration: RemediationConfiguration;
  readonly remediationPolicy: ManagedPolicy;
  readonly remediationRole: Role;


  public constructor(scope: IConstruct, id: string, props: IamPasswordPolicyProps) {
    const managedRuleName = IamPasswordPolicy.MANAGED_RULE_NAME;
    const maxPasswordAge = props.maxPasswordAge ?? IamPasswordPolicy.DEFAULT_MAX_PASSWORD_AGE;
    const minimumPasswordLength = props.minimumPasswordLength ?? IamPasswordPolicy.DEFAULT_MINIMUM_PASSWORD_LENGTH;
    const passwordReusePrevention = props.passwordReusePrevention ?? IamPasswordPolicy.DEFAULT_PASSWORD_REUSE_PREVENTION;
    const requireLowercaseCharacters = props.requireLowercaseCharacters ?? IamPasswordPolicy.DEFAULT_REQUIRE_UPPERCASE_CHARACTERS;
    const requireNumbers = props.requireNumbers ?? IamPasswordPolicy.DEFAULT_REQUIRE_NUMBERS;
    const requireSymbols = props.requireSymbols ?? IamPasswordPolicy.DEFAULT_REQUIRE_SYMBOLS;
    const requireUppercaseCharacters = props.requireUppercaseCharacters ?? IamPasswordPolicy.DEFAULT_REQUIRE_UPPERCASE_CHARACTERS;

    super(scope, id, {
      configRuleName: props.configRuleName,
      description: props.description ?? IamPasswordPolicy.DEFAULT_DESCRIPTION,
      identifier: managedRuleName,
      inputParameters: {
        MaxPasswordAge: maxPasswordAge,
        MinimumPasswordLength: minimumPasswordLength,
        PasswordReusePrevention: passwordReusePrevention,
        RequireLowercaseCharacters: requireLowercaseCharacters,
        RequireNumbers: requireNumbers,
        RequireSymbols: requireSymbols,
        RequireUppercaseCharacters: requireUppercaseCharacters,
      },
      maximumExecutionFrequency: props.maximumExecutionFrequency,
    });

    this.maxPasswordAge = maxPasswordAge;
    this.minimumPasswordLength = minimumPasswordLength;
    this.passwordReusePrevention = passwordReusePrevention;
    this.requireLowercaseCharacters = requireLowercaseCharacters;
    this.requireNumbers = requireNumbers;
    this.requireSymbols = requireSymbols;
    this.requireUppercaseCharacters = requireUppercaseCharacters;

    const description = [
      `Allows remdiation of of a non-compliant '${managedRuleName}' AWS`,
      'Config rule finding.',
    ].join(' ');

    this.remediationPolicy = new ManagedPolicy(this, 'remediation-policy', {
      description: description,
      path: '/config/',
      statements: [
        new PolicyStatement({
          actions: [
            'iam:GetAccountPasswordPolicy',
            'iam:UpdateAccountPasswordPolicy',
          ],
          effect: Effect.ALLOW,
          resources: [
            '*',
          ],
        }),
      ],
    });

    this.remediationRole = new Role(this, 'remediation-role', {
      assumedBy: new ServicePrincipal('ssm.amazonaws.com'),
      description: description,
      managedPolicies: [
        this.remediationPolicy,
      ],
    });

    this.remediationConfiguration = new RemediationConfiguration(this, 'remediation-configuration', {
      configRule: this,
      staticParameters: {
        AutomationAssumeRole: [
          this.remediationRole.roleArn,
        ],
        MaxPasswordAge: [
          maxPasswordAge,
        ],
        MinimumPasswordLength: [
          minimumPasswordLength,
        ],
        PasswordReusePrevention: [
          passwordReusePrevention,
        ],
        RequireLowercaseCharacters: [
          requireLowercaseCharacters,
        ],
        RequireNumbers: [
          requireNumbers,
        ],
        RequireSymbols: [
          requireSymbols,
        ],
        RequireUppercaseCharacters: [
          requireUppercaseCharacters,
        ],
      },
      target: RemediationTarget.automationDocument({
        document: AutomationDocument.fromManaged(this, 'remediation-document', IamPasswordPolicy.REMEDIATION_DOCUMENT_NAME),
      }),
    });
  }
}