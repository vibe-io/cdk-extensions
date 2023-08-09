import { ArnFormat, ResourceProps } from 'aws-cdk-lib';
import { ManagedRule, MaximumExecutionFrequency, ResourceType, RuleScope } from 'aws-cdk-lib/aws-config';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { RemediationTarget } from '../config/lib';
import { RemediationConfiguration } from '../config/remediation-configuration';
import { AutomationDocument } from '../ssm';


export interface VpcDefaultSecurityGroupClosedProps extends ResourceProps {
  readonly autoRemediation?: boolean;
  readonly configRuleName?: string;
  readonly description?: string;
  readonly maximumExecutionFrequency?: MaximumExecutionFrequency;
}

export class VpcDefaultSecurityGroupClosed extends ManagedRule {
  public static readonly DEFAULT_DESCRIPTION: string = [
    'Checks if the default security group of any Amazon Virtual Private Cloud',
    '(Amazon VPC) does not allow inbound or outbound traffic. The rule is',
    'NON_COMPLIANT if the default security group has one or more inbound or',
    'outbound traffic rules.',
  ].join(' ');
  public static readonly MANAGED_RULE_NAME: string = 'VPC_DEFAULT_SECURITY_GROUP_CLOSED';
  public static readonly REMEDIATION_DOCUMENT_NAME: string = 'AWSConfigRemediation-RemoveVPCDefaultSecurityGroupRules';

  public readonly remediationConfiguration: RemediationConfiguration;
  public readonly remediationPolicy: ManagedPolicy;
  public readonly remediationRole: Role;


  public constructor(scope: IConstruct, id: string, props: VpcDefaultSecurityGroupClosedProps) {
    const managedRuleName = VpcDefaultSecurityGroupClosed.MANAGED_RULE_NAME;

    super(scope, id, {
      configRuleName: props.configRuleName,
      description: props.description ?? VpcDefaultSecurityGroupClosed.DEFAULT_DESCRIPTION,
      identifier: managedRuleName,
      maximumExecutionFrequency: props.maximumExecutionFrequency,
      ruleScope: RuleScope.fromResource(ResourceType.EC2_SECURITY_GROUP),
    });

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
            'ec2:DescribeSecurityGroups',
          ],
          effect: Effect.ALLOW,
          resources: [
            '*',
          ],
        }),
        new PolicyStatement({
          actions: [
            'ec2:RevokeSecurityGroupEgress',
            'ec2:RevokeSecurityGroupIngress',
          ],
          effect: Effect.ALLOW,
          resources: [
            this.stack.formatArn({
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
              resource: 'security-group',
              resourceName: '*',
              service: 'ec2',
            }),
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
      resourceParameter: 'GroupId',
      staticParameters: {
        AutomationAssumeRole: [
          this.remediationRole.roleArn,
        ],
      },
      target: RemediationTarget.automationDocument({
        document: AutomationDocument.fromManaged(this, 'remediation-document', VpcDefaultSecurityGroupClosed.REMEDIATION_DOCUMENT_NAME),
      }),
    });
  }
}