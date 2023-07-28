/*import { Duration } from "aws-cdk-lib";
import { IIssueParser } from "../issue-manager";
import { IssueParserPluginBase, IssueParserPluginBaseProps } from "./issue-parser-plugin-base";
import { Condition, IStateMachine, Pass, StateMachine, StateMachineType } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { SfnFn } from "../../stepfunctions";
import { IssueTrigger } from "../issue-trigger";
import { DescriptionBuilder } from "./description-builder";
import { IssueHandlerOverride } from "../issue-handler-override";


export class TrustedAdvisorCheckSeverity {
  public static readonly OK: TrustedAdvisorCheckSeverity = TrustedAdvisorCheckSeverity.of('INFO', 'OK', 10);
  public static readonly INFO: TrustedAdvisorCheckSeverity = TrustedAdvisorCheckSeverity.of('LOW', 'INFO', 20);
  public static readonly WARN: TrustedAdvisorCheckSeverity = TrustedAdvisorCheckSeverity.of('MEDIUM', 'WARN', 30);
  public static readonly ERROR: TrustedAdvisorCheckSeverity = TrustedAdvisorCheckSeverity.of('HIGH', 'ERROR', 40);

  public static of(standardized: string, original: string, priority: number): TrustedAdvisorCheckSeverity {
    return new TrustedAdvisorCheckSeverity(standardized, original, priority);
  }


  public static all(): TrustedAdvisorCheckSeverity[] {
    return [...TrustedAdvisorCheck.SEVERITIES];
  }

  public static custom(...levels: TrustedAdvisorCheckSeverity[]): TrustedAdvisorCheckSeverity[] {
    return [...levels];
  }

  public static threshold(level: TrustedAdvisorCheckSeverity): TrustedAdvisorCheckSeverity[] {
    return TrustedAdvisorCheck.SEVERITIES.filter((x) => {
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

export interface TrustedAdvisorCheckRuleOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: TrustedAdvisorCheckSeverity[];
}

export interface TrustedAdvisorCheckProps extends IssueParserPluginBaseProps {}

export class TrustedAdvisorCheck extends IssueParserPluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'TrustedAdvisorCheck';
  public static readonly SEVERITIES: TrustedAdvisorCheckSeverity[] = [
    TrustedAdvisorCheckSeverity.OK,
    TrustedAdvisorCheckSeverity.INFO,
    TrustedAdvisorCheckSeverity.WARN,
    TrustedAdvisorCheckSeverity.ERROR,
  ];

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public readonly handler: IStateMachine;


  public constructor(scope: IConstruct, id: string, props: TrustedAdvisorCheckProps = {}) {
    super(scope, id, {
      ...props,
      matchType: props.matchType ?? TrustedAdvisorCheck.MATCH_TYPE,
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
        'Summary.$': SfnFn.format('OpenSearch - {} ({}) - {}', [
          '$.Detail.event',
          '$.Detail.status',
          '$.Domain.name',
        ]),
      },
    });

    const definition = extractDetail
      .next(buildDescription.render())
      .next(formatOutput);

    this.handler = new StateMachine(this, 'state-machine', {
      definition: definition,
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

  private addDomainDetails(builder: DescriptionBuilder): void {
    const url = [
      `https://{}.console.aws.amazon.com`,
      'aos',
      `home?region={}#opensearch`,
      'domains',
      '{}'
    ].join('/');

    const section = builder.addSection('domain', {
      title: 'Domain Information'
    });

    section.addReference('name', {
      label: 'Name',
      value: '$.Domain.Name',
    });

    section.addReference('arn', {
      label: 'ARN',
      value: '$.Domain.Arn',
    });

    section.addReference('console', {
      label: 'Console',
      value: SfnFn.format(url, [
        '$.Domain.Region',
        '$.Domain.Region',
        '$.Domain.Name',
      ]),
    });
  }

  protected buildDescription(): DescriptionBuilder {
    const builder = new DescriptionBuilder(this, {
      initialDescription: '$.Detail.description',
    });

    this.addDomainDetails(builder);

    return builder;
  }

  public registerIssueTrigger(id: string, options: TrustedAdvisorCheckRuleOptions = {}): IssueTrigger {
    const severityLevels = options.severity ?? TrustedAdvisorCheckSeverity.threshold(TrustedAdvisorCheckSeverity.WARN);

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          'status': severityLevels.map((x) => {
            return x.original;
          }),
        },
        detailType: [
          'Trusted Advisor Check Item Refresh Notification',
        ],
        source: [
          'aws.trustedadvisor',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}*/