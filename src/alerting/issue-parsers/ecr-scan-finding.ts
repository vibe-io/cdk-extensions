import { ArnFormat, Duration, Lazy } from 'aws-cdk-lib';
import { Chain, Choice, Condition, IStateMachine, Pass, Result, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { SfnFn } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueParser } from '../issue-manager';
import { IssuePluginBase, IssuePluginBaseProps } from '../issue-plugin-base';
import { IssueTrigger } from '../issue-trigger';


export class EcrImageScanSeverity {
  public static readonly UNDEFINED: EcrImageScanSeverity = EcrImageScanSeverity.of('UNDEFINED', 10, 'INFO');
  public static readonly LOW: EcrImageScanSeverity = EcrImageScanSeverity.of('LOW', 20, 'LOW');
  public static readonly MEDIUM: EcrImageScanSeverity = EcrImageScanSeverity.of('MEDIUM', 30, 'MEDIUM');
  public static readonly HIGH: EcrImageScanSeverity = EcrImageScanSeverity.of('HIGH', 40, 'HIGH');
  public static readonly CRITICAL: EcrImageScanSeverity = EcrImageScanSeverity.of('CRITICAL', 50, 'CRITICAL');

  public static of(name: string, priority: number, standardized: string): EcrImageScanSeverity {
    return new EcrImageScanSeverity(name, priority, standardized);
  }


  public readonly name: string;
  public readonly priority: number;
  public readonly standardized: string;

  private constructor(name: string, priority: number, standardized: string) {
    this.name = name;
    this.priority = priority;
    this.standardized = standardized;
  }
}

export interface IEcrImageScanSeverityConfiguration {
  readonly levels: EcrImageScanSeverity[];
}

export class EcrImageScanSeverityConfiguration {
  public static all(): IEcrImageScanSeverityConfiguration {
    return {
      levels: [...EcrScanFinding.SEVERITIES],
    };
  }

  public static custom(...levels: EcrImageScanSeverity[]): IEcrImageScanSeverityConfiguration {
    return {
      levels: levels,
    };
  }

  public static threshold(level: EcrImageScanSeverity): IEcrImageScanSeverityConfiguration {
    return {
      levels: EcrScanFinding.SEVERITIES.filter((x) => {
        return x.priority >= level.priority;
      }),
    };
  }
}

export interface EcrScanFindingEventOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: IEcrImageScanSeverityConfiguration;
}

export interface EcrScanFindingProps extends IssuePluginBaseProps {
  readonly matchType?: string;
  readonly name?: string;
  readonly timeout?: Duration;
}

export class EcrScanFinding extends IssuePluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'EcrScanFinding';
  public static readonly SEVERITIES: EcrImageScanSeverity[] = [
    EcrImageScanSeverity.UNDEFINED,
    EcrImageScanSeverity.LOW,
    EcrImageScanSeverity.MEDIUM,
    EcrImageScanSeverity.HIGH,
    EcrImageScanSeverity.CRITICAL,
  ];

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public readonly handler: IStateMachine;

  // IIssueParser properties
  public readonly matchType: string;

  public get triggers(): IssueTrigger[] {
    return this.node.children.filter((x) => {
      return x instanceof IssueTrigger;
    }) as IssueTrigger[];
  }


  public constructor(scope: IConstruct, id: string, props: EcrScanFindingProps = {}) {
    super(scope, id, props);

    this.matchType = props.matchType ?? EcrScanFinding.MATCH_TYPE;
    this.name = props.name;
    this.timeout = props.timeout;

    const describeImage = new CallAwsService(this, 'describe-image', {
      action: 'describeImages',
      iamResources: [
        this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          service: 'ecr',
          region: '*',
          resource: 'repository',
          resourceName: '*',
        }),
      ],
      parameters: {
        'ImageIds': [{
          'ImageDigest.$': '$.detail.image-digest',
        }],
        'RepositoryName.$': '$.detail.repository-name',
      },
      resultPath: '$.Image',
      resultSelector: {
        'Details.$': '$.ImageDetails[0]',
      },
      service: 'ecr',
    });

    const checkTags = new Choice(this, 'check-tags');

    const initializeTagIterator = new Pass(this, 'initialize-tag-iterator', {
      parameters: {
        'Count.$': SfnFn.arrayLength('$.Image.Details.ImageTags'),
        'Index': 0,
        'Value': '\n \nImage tags:',
      },
      resultPath: '$.TagIterator',
    });

    const evaluateTagIterator = new Choice(this, 'evaluate-tag-iterator');

    const iterateTag = new Pass(this, 'iterate-tag', {
      parameters: {
        'Count.$': SfnFn.arrayLength('$.Image.Details.ImageTags'),
        'Index.$': SfnFn.mathAdd('$.TagIterator.Index', 1),
        'Value.$': SfnFn.format('{}\n{}', [
          '$.TagIterator.Value',
          SfnFn.arrayGetItem(
            '$.Image.Details.ImageTags',
            '$.TagIterator.Index',
          ),
        ]),
      },
      resultPath: '$.TagIterator',
    });

    const useTagDefaults = new Pass(this, 'use-tag-defaults', {
      result: Result.fromObject({
        Count: 0,
        Formatted: '',
        List: [],
      }),
      resultPath: '$.ImageTags',
    });

    const formatTags = new Pass(this, 'format-tags', {
      parameters: {
        'Count.$': SfnFn.arrayLength('$.Image.Details.ImageTags'),
        'Formatted.$': '$.TagIterator.Value',
        'List.$': '$.Image.Details.ImageTags',
      },
      resultPath: '$.ImageTags',
    });

    const initializeFindingSummary = new Pass(this, 'initialize-finding-summary', {
      parameters: {
        Formatted: '',
        MaxSeverity: 'NONE',
        MaxSeverityTotal: 0,
        Total: 0,
      },
      resultPath: '$.Findings',
    });

    const severityChain = this.buildSeverityChain();
    if (!severityChain) {
      throw new Error([
        'Failed to build chain for handling various severities of ECR image',
        'scan event.',
      ].join(' '));
    }

    const checkResultSeverity = new Choice(this, 'check-result-severity');

    const formatEmptyResult = new Pass(this, 'format-empty-result', {
      parameters: {
        Alert: false,
      },
    });

    const formatResult = new Pass(this, 'format-result', {
      parameters: {
        'Alert': true,
        'Description.$': this.buildDescription(),
        'Severity.$': '$.Findings.MaxSeverityStandardized',
        'Summary.$': this.buildSummary(),
      },
    });

    const definition = describeImage
      .next(checkTags
        .when(Condition.isPresent('$.Image.Details.ImageTags'), initializeTagIterator
          .next(evaluateTagIterator
            .when(Condition.numberLessThanJsonPath('$.TagIterator.Index', '$.TagIterator.Count'), iterateTag
              .next(evaluateTagIterator))
            .otherwise(formatTags)
            .afterwards()))
        .otherwise(useTagDefaults)
        .afterwards())
      .next(initializeFindingSummary)
      .next(severityChain)
      .next(checkResultSeverity
        .when(Condition.or(
          Condition.stringEquals('$.Findings.MaxSeverity', 'NONE'),
          Condition.numberEquals('$.Findings.Total', 0),
        ), formatEmptyResult)
        .otherwise(formatResult)
        .afterwards());

    this.handler = new StateMachine(this, 'state-machine', {
      definition: definition,
      logs: this.buildLogging(),
      stateMachineName: this.name,
      stateMachineType: StateMachineType.EXPRESS,
      timeout: this.timeout,
      tracingEnabled: true,
    });
  }

  protected buildDescription(): string {
    const region = this.stack.region;
    const description = [
      'One or more {} vulnerabilities were identified for Docker image in the {} ECR repository.',
      ' ',
      'Image digest:',
      '{}{}',
      ' ',
      'ECR console:',
      `https://${region}.console.aws.amazon.com/ecr/repositories/private/{}/{}/_/image/{}/details?region=${region}`,
      ' ',
      'Finding summary:',
      '{} ',
      'Scan findings:',
      `https://${region}.console.aws.amazon.com/ecr/repositories/private/{}/{}/_/image/{}/scan-results?region=${region}`,
    ].join('\n');

    return SfnFn.format(description, [
      '$.Findings.MaxSeverity',
      '$.Image.Details.RepositoryName',
      '$.Image.Details.ImageDigest',
      '$.ImageTags.Formatted',
      '$.Image.Details.RegistryId',
      '$.Image.Details.RepositoryName',
      '$.Image.Details.ImageDigest',
      '$.Findings.Formatted',
      '$.Image.Details.RegistryId',
      '$.Image.Details.RepositoryName',
      '$.Image.Details.ImageDigest',
    ]);
  };

  private buildSeverityChain(prev?: Chain, iterator?: IterableIterator<[number, EcrImageScanSeverity]>): Chain | undefined {
    const resolvedIterator = iterator ?? EcrScanFinding.SEVERITIES.entries();

    const iteration = resolvedIterator.next();
    if (iteration.done) {
      return prev;
    }

    const severity: EcrImageScanSeverity = iteration.value[1];

    const lowerSeverity = severity.name.toLowerCase();
    const upperSeverity = severity.name.toUpperCase();
    const severityCountPath = `$.Image.Details.ImageScanFindingsSummary.FindingSeverityCounts.${upperSeverity}`;

    const checkFindings = new Choice(this, `check-${lowerSeverity}-findings`);

    const setFindings = new Pass(this, `set-${lowerSeverity}`, {
      parameters: {
        'Formatted.$': SfnFn.format(`${upperSeverity}: {}\n{}`, [
          severityCountPath,
          '$.Findings.Formatted',
        ]),
        'MaxSeverity': upperSeverity,
        'MaxSeverityStandardized': severity.standardized.toUpperCase(),
        'MaxSeverityTotal.$': severityCountPath,
        'Total.$': SfnFn.mathAdd(
          '$.Findings.Total',
          severityCountPath,
        ),
      },
      resultPath: '$.Findings',
    });

    const chain = checkFindings.when(Condition.and(
      Condition.isPresent(severityCountPath),
      Condition.numberGreaterThan(severityCountPath, 0),
    ), setFindings).afterwards({
      includeOtherwise: true,
    });

    return this.buildSeverityChain(
      prev?.next(chain) ?? chain,
      resolvedIterator,
    );
  }

  public bind(_scope: IConstruct): IssueTrigger[] {
    if (this.triggers.length === 0) {
      this.registerIssueTrigger('default');
    }

    return this.triggers;
  }

  protected buildSummary(): string {
    const summary = 'ECR image scan for {} returned {} {} findings ({} TOTAL)';

    return SfnFn.format(summary, [
      '$.Image.Details.RepositoryName',
      '$.Findings.MaxSeverityTotal',
      '$.Findings.MaxSeverity',
      '$.Findings.Total',
    ]);
  }

  public registerIssueTrigger(id: string, options: EcrScanFindingEventOptions = {}): IssueTrigger {
    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          'finding-severity-counts': Lazy.any({
            produce: () => {
              const config = options.severity ?? EcrImageScanSeverityConfiguration.threshold(EcrImageScanSeverity.HIGH);
              const levels = config.levels;
              const matchers = levels.map((x) => {
                return {
                  [x.name]: [{
                    exists: true,
                  }],
                };
              });

              if (matchers.length === 0) {
                return undefined;
              } else if (matchers.length === 1) {
                return matchers[0];
              } else {
                return {
                  $or: matchers,
                };
              }
            },
          }),
        },
        detailType: [
          'ECR Image Scan',
        ],
        source: [
          'aws.ecr',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}