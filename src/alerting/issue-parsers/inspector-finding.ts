import { Duration } from 'aws-cdk-lib';
import { Condition, DefinitionBody, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { AppendDelimiter, DescriptionBuilder } from './description-builder';
import { IssueParserPluginBase, IssueParserPluginBaseProps } from './issue-parser-plugin-base';
import { SfnFn } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueParser } from '../issue-manager';
import { IssueTrigger } from '../issue-trigger';


export class InspectorSeverity {
  public static readonly UNTRIAGED: InspectorSeverity = InspectorSeverity.of('UNCATEGORIZED', 'UNTRIAGED', 0);
  public static readonly INFORMATIONAL: InspectorSeverity = InspectorSeverity.of('INFO', 'INFORMATIONAL', 10);
  public static readonly LOW: InspectorSeverity = InspectorSeverity.of('LOW', 'LOW', 20);
  public static readonly MEDIUM: InspectorSeverity = InspectorSeverity.of('MEDIUM', 'MEDIUM', 30);
  public static readonly HIGH: InspectorSeverity = InspectorSeverity.of('HIGH', 'HIGH', 40);
  public static readonly CRITICAL: InspectorSeverity = InspectorSeverity.of('CRITICAL', 'CRITICAL', 50);

  public static of(standardized: string, original: string, priority: number): InspectorSeverity {
    return new InspectorSeverity(standardized, original, priority);
  }


  public static all(): InspectorSeverity[] {
    return [...InspectorFinding.SEVERITIES];
  }

  public static custom(...levels: InspectorSeverity[]): InspectorSeverity[] {
    return [...levels];
  }

  public static threshold(level: InspectorSeverity): InspectorSeverity[] {
    return InspectorFinding.SEVERITIES.filter((x) => {
      return x.priority >= level.priority;
    });
  }


  public readonly original: string;
  public readonly priority: number;
  public readonly standardized: string;

  private constructor(standardized: string, original: string, priority: number) {
    this.original = original;
    this.priority = priority;
    this.standardized = standardized;
  }

  public buildCondition(path: string): Condition {
    return Condition.and(
      Condition.isPresent(path),
      Condition.stringEquals(path, this.original),
    );
  }
}

export interface InspectorFindingEventOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: InspectorSeverity[];
}

export interface InspectorFindingProps extends IssueParserPluginBaseProps {}

export class InspectorFinding extends IssueParserPluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'InspectorFinding';
  public static readonly SEVERITIES: InspectorSeverity[] = [
    InspectorSeverity.UNTRIAGED,
    InspectorSeverity.INFORMATIONAL,
    InspectorSeverity.LOW,
    InspectorSeverity.MEDIUM,
    InspectorSeverity.HIGH,
    InspectorSeverity.CRITICAL,
  ];

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


  public constructor(scope: IConstruct, id: string, props: InspectorFindingProps = {}) {
    super(scope, id, {
      ...props,
      matchType: props.matchType ?? InspectorFinding.MATCH_TYPE,
    });

    const extractDetail = new Pass(this, 'extract-detail', {
      parameters: {
        'Detail.$': '$.detail',
      },
    });

    const buildDescription = this.buildDescription();

    const formatOutput = new Pass(this, 'format-output', {
      parameters: {
        'Alert': true,
        'Description.$': '$.Description.Builder',
        'Summary.$': SfnFn.format('Inspector - {} - {}', [
          '$.Detail.type',
          '$.Detail.title',
        ]),
      },
    });

    const definition = extractDetail
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
        'AWS Inspector has identified a security vulnerability in one of your',
        'AWS resources. A security specialist should review the finding to',
        'determine if additional action is necessary.',
      ].join(' '),
    });

    descriptionBuilder.addReference('description', {
      delimiter: AppendDelimiter.PARAGRAPH,
      value: '$.Detail.description',
    });

    this.buildRemediation(descriptionBuilder);
    this.buildPackageVulnerabilityDetails(descriptionBuilder);
    this.buildResources(descriptionBuilder);

    return descriptionBuilder;
  }

  private buildPackageVulnerabilityDetails(builder: DescriptionBuilder): void {
    const section = builder.addSection('package-vulnerability-details', {
      title: 'Package Vulnerability Details',
    });

    section.addReference('vulnerability-id', {
      label: 'Vulnerability ID',
      value: '$.Detail.packageVulnerabilityDetails.vulnerabilityId',
    });

    section.addReference('source', {
      label: 'Source',
      value: '$.Detail.packageVulnerabilityDetails.source',
    });

    section.addReference('source-url', {
      label: 'Source URL',
      value: '$.Detail.packageVulnerabilityDetails.sourceUrl',
    });
  }

  private buildRemediation(builder: DescriptionBuilder): void {
    const remediation = builder.addSection('remediation', {
      referenceChecks: [
        '$.Detail.remediation.recommendation.text',
        '$.Detail.remediation.recommendation.Url',
      ],
      title: 'Remediation Guidance',
    });

    remediation.addReference('text', {
      value: '$.Detail.remediation.recommendation.text',
    });

    remediation.addReference('url', {
      value: '$.Detail.remediation.recommendation.Url',
    });
  }

  private buildResources(builder: DescriptionBuilder): void {
    const iterator = builder.addIterator('iterator', {
      arrayRef: '$.Detail.resources',
      resultPath: '$.Resources',
      title: 'Resources',
    });

    iterator.addReference('type', {
      label: 'Type',
      value: '$.Item.type',
    });

    iterator.addReference('id', {
      label: 'ID',
      value: '$.Item.id',
    });

    iterator.addReference('region', {
      label: 'Region',
      value: '$.Item.region',
    });
  }

  public registerIssueTrigger(id: string, options: InspectorFindingEventOptions = {}): IssueTrigger {
    const severityLevels = options.severity ?? InspectorSeverity.threshold(InspectorSeverity.HIGH);

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          severity: severityLevels.map((x) => {
            return x.original;
          }),
        },
        detailType: [
          'Inspector2 Finding',
        ],
        source: [
          'aws.inspector2',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}