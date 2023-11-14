import { ArnFormat, Duration } from 'aws-cdk-lib';
import { Chain, DefinitionBody, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { DescriptionBuilder } from './description-builder';
import { InspectorSeverity } from './inspector-finding';
import { IssueParserPluginBase, IssueParserPluginBaseProps } from './issue-parser-plugin-base';
import { SfnFn, StringReplace } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueParser } from '../issue-manager';
import { IssueTrigger } from '../issue-trigger';


export interface ConfigComplianceChangeRuleOptions {
  readonly includeSecurityHub?: boolean;
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: InspectorSeverity[];
}

export interface ConfigComplianceChangeProps extends IssueParserPluginBaseProps {}

export class ConfigComplianceChange extends IssueParserPluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'ConfigComplianceChange';

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public readonly handler: IStateMachine;

  public get triggers(): IssueTrigger[] {
    return this.node.children.filter((x) => {
      return x instanceof IssueTrigger;
    }) as IssueTrigger[];
  }


  public constructor(scope: IConstruct, id: string, props: ConfigComplianceChangeProps = {}) {
    super(scope, id, {
      ...props,
      matchType: props.matchType ?? ConfigComplianceChange.MATCH_TYPE,
    });

    const extractDetail = new Pass(this, 'extract-detail', {
      parameters: {
        'Detail.$': '$.detail',
      },
    });

    const getRule = new CallAwsService(this, 'get-rule', {
      action: 'describeConfigRules',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'config-rule',
          resourceName: '*',
          service: 'config',
        }),
      ],
      parameters: {
        'ConfigRuleNames.$': 'States.Array($.Detail.configRuleName)',
      },
      resultPath: '$.Rule',
      resultSelector: {
        'Info.$': '$.ConfigRules[0]',
      },
      service: 'config',
    });

    const getResource = new CallAwsService(this, 'get-resource', {
      action: 'batchGetResourceConfig',
      iamResources: [
        '*',
      ],
      parameters: {
        ResourceKeys: [{
          'ResourceId.$': '$.Detail.resourceId',
          'ResourceType.$': '$.Detail.resourceType',
        }],
      },
      resultPath: '$.Resource',
      resultSelector: {
        'Info.$': '$.BaseConfigurationItems[0]',
      },
      service: 'config',
    });

    const buildResourceUrl = this.buildResourceUrl();
    const buildDescription = this.buildDescription();

    const formatOutput = new Pass(this, 'format-output', {
      parameters: {
        'Alert': true,
        'Description.$': '$.Description.Builder',
        'Summary.$': SfnFn.format('AWS Config - {} - {}', [
          '$.Detail.resourceType',
          '$.Detail.resourceId',
        ]),
      },
    });

    const definition = extractDetail
      .next(getRule)
      .next(getResource)
      .next(buildResourceUrl)
      .next(buildDescription.render())
      .next(formatOutput);

    this.handler = new StateMachine(this, 'state-machine', {
      definitionBody: DefinitionBody.fromChainable(definition),
      logs: this.buildLogging(),
      stateMachineName: this.name,
      stateMachineType: StateMachineType.EXPRESS,
      timeout: this.timeout,
      tracingEnabled: true,
    });
  }

  protected addDefaultTrigger(): IssueTrigger {
    return this.registerIssueTrigger('default');
  }

  protected buildDescription(): DescriptionBuilder {
    const descriptionBuilder = new DescriptionBuilder(this, {
      initialDescription: [
        'AWS Config has detected a resource that does not conform to the',
        'configured standards or best practices. Please review the identified',
        'resource and make the changes needed to bring it into complaince.',
      ].join(' '),
    });

    this.buildRule(descriptionBuilder);
    this.buildResource(descriptionBuilder);

    return descriptionBuilder;
  }

  private buildResource(builder: DescriptionBuilder): void {
    const section = builder.addSection('resource', {
      title: 'Resource',
    });

    section.addReference('name', {
      label: 'Name',
      value: '$.Resource.Info.ResourceName',
    });

    section.addReference('id', {
      label: 'ID',
      value: '$.Detail.resourceId',
    });

    section.addReference('type', {
      label: 'Type',
      value: '$.Detail.resourceType',
    });

    section.addReference('issue', {
      label: 'Issue',
      value: '$.Detail.newEvaluationResult.annotation',
    });

    section.addReference('console', {
      label: 'Console',
      value: '$.ResourceUrl.Formatted',
    });
  }

  protected buildResourceUrl(): Chain {
    const url = [
      `https://${this.stack.region}.console.aws.amazon.com`,
      'config',
      `home?region=${this.stack.region}#`,
      'resources',
      'details?resourceId={}&resourceType={}',
    ].join('/');

    const replaceResourceIdColons = new StringReplace(this, 'replace-resource-id-colons', {
      inputString: '$.Detail.resourceId',
      outputKey: 'ResourceId',
      replace: '%3A',
      search: ':',
    });

    const replaceResourceIdSlashes = new StringReplace(this, 'replace-resource-id-slashes', {
      inputString: '$.ResourceId',
      outputKey: 'ResourceId',
      replace: '%2F',
      search: '/',
    });

    const replaceResourceTypeColons = new StringReplace(this, 'replace-resource-type-colons', {
      inputString: '$.Detail.resourceType',
      outputKey: 'ResourceType',
      replace: '%3A%3A',
      search: ':',
    });

    const buildUrl = new Pass(this, 'build-resource-url', {
      parameters: {
        'Formatted.$': SfnFn.format(url, [
          '$.ResourceId',
          '$.ResourceType',
        ]),
      },
      resultPath: '$.ResourceUrl',
    });

    return replaceResourceIdColons
      .next(replaceResourceIdSlashes)
      .next(replaceResourceTypeColons)
      .next(buildUrl);
  }

  private buildRule(builder: DescriptionBuilder): void {
    const url = [
      `https://${this.stack.region}.console.aws.amazon.com`,
      'config',
      `home?region=${this.stack.region}#`,
      'rules',
      'details?configRuleName={}',
    ].join('/');

    const section = builder.addSection('rule', {
      title: 'Rule',
    });

    section.addReference('name', {
      label: 'Name',
      value: '$.Detail.configRuleName',
    });

    section.addReference('description', {
      label: 'Description',
      value: '$.Rule.Info.Description',
    });

    section.write('console', {
      prefix: 'Console: ',
      value: SfnFn.format(url, [
        '$.Detail.configRuleName',
      ]),
    });
  }

  public registerIssueTrigger(id: string, options: ConfigComplianceChangeRuleOptions = {}): IssueTrigger {
    const includeSecurityHub = options.includeSecurityHub ?? false;

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          ...(includeSecurityHub ? {} : {
            configRuleName: [{
              'anything-but': {
                prefix: 'securityhub-',
              },
            }],
          }),
          messageType: [
            'ComplianceChangeNotification',
          ],
          newEvaluationResult: {
            complianceType: [
              'NON_COMPLIANT',
            ],
          },
        },
        detailType: [
          'Config Rules Compliance Change',
        ],
        source: [
          'aws.config',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}