import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IHub } from '../securityhub/hub';
import { ManagedRule, ResourceType, RuleScope } from 'aws-cdk-lib/aws-config';
import { RemediationConfiguration, RemediationTarget } from '../config';
import { AutomationDocument, AutomationDocumentContent } from '../ssm/automation-document';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DocumentFormat } from '../ssm/lib';


export interface SecurityHubOptions {
  readonly enabled?: boolean;
  readonly hub?: IHub;
}

export interface InventoryEnforcerProps extends ResourceProps {
  readonly autoRemediate?: boolean;
  readonly securityHub?: SecurityHubOptions;
}

export class InventoryEnforcer extends Resource {
  public static readonly DEFAULT_POLICIES: string[] = [
    'AmazonSSMManagedEC2InstanceDefaultPolicy',
  ];

  public readonly configRule: ManagedRule;
  public readonly defaultInstanceRole: Role;
  public readonly remediationConfiguration: RemediationConfiguration;
  public readonly remediationDocument: AutomationDocument;


  public constructor(scope: IConstruct, id: string, props: InventoryEnforcerProps) {
    super(scope, id, props);

    this.configRule = new ManagedRule(this, 'config-rule', {
      identifier: 'EC2_INSTANCE_MANAGED_BY_SSM',
      ruleScope: RuleScope.fromResources([
        ResourceType.EC2_INSTANCE,
        ResourceType.SYSTEMS_MANAGER_MANAGED_INSTANCE_INVENTORY,
      ]),
    });

    this.defaultInstanceRole = new Role(this, 'default-instance-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      description: [
        'A generic role that will be automatically be associated with all EC2',
        'instances to allow for access and inventory management via Systems',
        'Manager.'
      ].join(' '),
      managedPolicies: InventoryEnforcer.DEFAULT_POLICIES.map((x) => {
        return ManagedPolicy.fromAwsManagedPolicyName(x);
      }),
      path: '/service-role/',
    });

    this.remediationDocument = new AutomationDocument(this, 'remediation-document', {
      content: AutomationDocumentContent.fromObject({
        input: {
          assumeRole: '{{AutomationAssumeRole}}',
          parameters: {
            AutomationAssumeRole: {
              default: '',
              description: '(Optional) The ARN of the role that allows Automation to perform actions on your behalf.',
              type: 'String',
            },
            InstanceId: {
              description: '(Required) ID of the instance to configure for SSM.',
              type: 'String',
            },
          },
          mainSteps: [
            {
              action: 'aws:executeAwsApi',
              inputs: {
                Api: 'DescribeInstances',
                InstanceIds: [
                  '{{InstanceId}}',
                ],
                Service: 'ec2',
              },
              outputs: [
                {
                  Name: 'Role',
                  Selector: '$.Reservations[0].Instances[0].IamInstanceProfile',
                  Type: 'String',
                }
              ]
            }
          ]
        },
        documentFormat: DocumentFormat.YAML,
      }),
    });

    this.remediationConfiguration = new RemediationConfiguration(this, 'remediation-configuration', {
      configRule: this.configRule,
      staticParameters: ,
      target: RemediationTarget.automationDocument({
        document: ,
      })
    });
  }
}