import { ArnFormat, Duration } from 'aws-cdk-lib';
import { Chain, Choice, Condition, DefinitionBody, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { SfnFn } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueParser } from '../issue-manager';
import { IssuePluginBase, IssuePluginBaseProps } from '../issue-plugin-base';
import { IssueTrigger } from '../issue-trigger';


export class SecurityHubSeverity {
  public static readonly INFORMATIONAL: SecurityHubSeverity = SecurityHubSeverity.of('INFORMATIONAL', 0, 0, 'INFO');
  public static readonly LOW: SecurityHubSeverity = SecurityHubSeverity.of('LOW', 1, 39, 'LOW');
  public static readonly MEDIUM: SecurityHubSeverity = SecurityHubSeverity.of('MEDIUM', 40, 69, 'MEDIUM');
  public static readonly HIGH: SecurityHubSeverity = SecurityHubSeverity.of('HIGH', 70, 89, 'HIGH');
  public static readonly CRITICAL: SecurityHubSeverity = SecurityHubSeverity.of('CRITICAL', 90, 100, 'CRITICAL');

  public static of(name: string, lowerBound: number, upperBound: number, standardized: string): SecurityHubSeverity {
    return new SecurityHubSeverity(name, lowerBound, upperBound, standardized);
  }


  public readonly name: string;
  public readonly lowerBound: number;
  public readonly standardized: string;
  public readonly upperBound: number;

  private constructor(name: string, lowerBound: number, upperBound: number, standardized: string) {
    this.name = name;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.standardized = standardized;
  }
}

export interface ISecurityHubSeverityConfiguration {
  readonly levels: SecurityHubSeverity[];
}

export class SecurityHubSeverityConfiguration {
  public static all(): ISecurityHubSeverityConfiguration {
    return {
      levels: [...SecurityHubFinding.SEVERITIES],
    };
  }

  public static custom(...levels: SecurityHubSeverity[]): ISecurityHubSeverityConfiguration {
    return {
      levels: levels,
    };
  }

  public static threshold(level: SecurityHubSeverity): ISecurityHubSeverityConfiguration {
    return {
      levels: SecurityHubFinding.SEVERITIES.filter((x) => {
        return x.lowerBound >= level.lowerBound;
      }),
    };
  }
}

export interface SecurityHubFindingEventOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: ISecurityHubSeverityConfiguration;
}

export interface SecurityHubFindingProps extends IssuePluginBaseProps {
  readonly matchType?: string;
  readonly name?: string;
  readonly timeout?: Duration;
}

export class SecurityHubFinding extends IssuePluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'SecurityHubFinding';
  public static readonly SEVERITIES: SecurityHubSeverity[] = [
    SecurityHubSeverity.INFORMATIONAL,
    SecurityHubSeverity.LOW,
    SecurityHubSeverity.MEDIUM,
    SecurityHubSeverity.HIGH,
    SecurityHubSeverity.CRITICAL,
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


  public constructor(scope: IConstruct, id: string, props: SecurityHubFindingProps = {}) {
    super(scope, id, props);

    this.matchType = props.matchType ?? SecurityHubFinding.MATCH_TYPE;
    this.name = props.name;
    this.timeout = props.timeout;

    const extractFinding = new Pass(this, 'extract-finding', {
      parameters: {
        'Finding.$': '$.detail.findings[0]',
      },
    });

    const buildDescription = this.buildDescription();

    const mapSeverity = this.buildSeverityMap();

    const setFindingNotified = new CallAwsService(this, 'set-finding-notified', {
      action: 'batchUpdateFindings',
      iamResources: [this.stack.formatArn({
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        resource: 'hub',
        resourceName: '*',
        service: 'securityhub',
      })],
      parameters: {
        FindingIdentifiers: [{
          'Id.$': '$.Finding.Id',
          'ProductArn.$': '$.Finding.ProductArn',
        }],
        Workflow: {
          Status: 'NOTIFIED',
        },
      },
      resultPath: '$.Update',
      service: 'securityhub',
    });

    const formatOutput = new Pass(this, 'format-output', {
      parameters: {
        'Alert': true,
        'Description.$': '$.Description.Builder',
        'Severity.$': '$.Resolved.Severity',
        'Summary.$': '$.Finding.Title',
      },
    });

    const definition = extractFinding
      .next(buildDescription)
      .next(mapSeverity)
      .next(setFindingNotified)
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

  public bind(_scope: IConstruct): IssueTrigger[] {
    if (this.triggers.length === 0) {
      this.registerIssueTrigger('default');
    }

    return this.triggers;
  }

  protected buildDescription(): Chain {
    const initializeDescriptionBuilder = new Pass(this, 'initialize-description-builder', {
      parameters: {
        'Builder.$': '$.Finding.Description',
      },
      resultPath: '$.Description',
    });

    const addAwsAccount = new Pass(this, 'add-aws-account', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n\nAWS account:\n{}', [
          '$.Description.Builder',
          '$.Finding.AwsAccountId',
        ]),
      },
      resultPath: '$.Description',
    });

    const addUrl = this.buildUrl();

    const addRemediation = this.buildRemediation();

    const addResources = this.buildResources();

    return initializeDescriptionBuilder
      .next(addAwsAccount)
      .next(addUrl)
      .next(addRemediation)
      .next(addResources);
  }

  protected buildRemediation(): Chain {
    const checkRemediation = new Choice(this, 'check-remediation');

    const addHeader = new Pass(this, 'add-remediation-header', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n\nRemediation:', [
          '$.Description.Builder',
        ]),
      },
      resultPath: '$.Description',
    });

    const checkText = new Choice(this, 'check-remediation-text');

    const addText = new Pass(this, 'add-remediation-text', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n{}', [
          '$.Description.Builder',
          '$.Finding.Remediation.Recommendation.Text',
        ]),
      },
      resultPath: '$.Description',
    });

    const checkUrl = new Choice(this, 'check-remediation-url');

    const addUrl = new Pass(this, 'add-remediation-url', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n{}', [
          '$.Description.Builder',
          '$.Finding.Remediation.Recommendation.Url',
        ]),
      },
      resultPath: '$.Description',
    });

    return checkRemediation
      .when(Condition.or(
        Condition.isPresent('$.Finding.Remediation.Recommendation.Text'),
        Condition.isPresent('$.Finding.Remediation.Recommendation.Url'),
      ), addHeader
        .next(checkText
          .when(Condition.isPresent('$.Finding.Remediation.Recommendation.Text'), addText)
          .afterwards({ includeOtherwise: true }))
        .next(checkUrl
          .when(Condition.isPresent('$.Finding.Remediation.Recommendation.Url'), addUrl)
          .afterwards({ includeOtherwise: true })))
      .afterwards({ includeOtherwise: true });
  }

  protected buildResources(): Chain {
    const checkResources = new Choice(this, 'check-resources');

    const addHeader = new Pass(this, 'add-resources-header', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n\nResources:', [
          '$.Description.Builder',
        ]),
      },
      resultPath: '$.Description',
    });

    const initializeIterator = new Pass(this, 'initialize-resource-iterator', {
      parameters: {
        'Index': 0,
        'Length.$': SfnFn.arrayLength('$.Finding.Resources'),
      },
      resultPath: '$.ResourceIterator',
    });

    const iterateResource = new Choice(this, 'iterate-resource');

    const getResource = new Pass(this, 'get-resource', {
      parameters: {
        'Details.$': SfnFn.arrayGetItem(
          '$.Finding.Resources',
          '$.ResourceIterator.Index',
        ),
      },
      resultPath: '$.Resource',
    });

    const addResource = new Pass(this, 'add-resource', {
      parameters: {
        'Builder.$': SfnFn.format('{}\n{}', [
          '$.Description.Builder',
          '$.Resource.Details.Id',
        ]),
      },
      resultPath: '$.Description',
    });

    const step = new Pass(this, 'step-resource-iterator', {
      parameters: {
        'Index.$': SfnFn.mathAdd('$.ResourceIterator.Index', 1),
        'Length.$': '$.ResourceIterator.Length',
      },
      resultPath: '$.ResourceIterator',
    });

    // An ugly workaround for:
    // https://github.com/aws/aws-cdk/issues/16218
    const finalize = new Pass(this, 'finalize-resources');

    return checkResources
      .when(Condition.isPresent('$.Finding.Resources'), addHeader
        .next(initializeIterator)
        .next(iterateResource
          .when(Condition.numberLessThanJsonPath(
            '$.ResourceIterator.Index',
            '$.ResourceIterator.Length',
          ), getResource
            .next(addResource)
            .next(step)
            .next(iterateResource))
          .otherwise(finalize)
          .afterwards()))
      .otherwise(finalize)
      .afterwards();
  }

  protected buildSeverityMap(): Chain {
    const checkSeverity = new Choice(this, 'check-severity');

    SecurityHubFinding.SEVERITIES.reverse().forEach((x) => {
      const setSeverity = new Pass(this, `set-${x.name.toLowerCase()}`, {
        parameters: {
          Severity: x.standardized.toUpperCase(),
        },
        resultPath: '$.Resolved',
      });

      const normalizedRef = '$.Finding.Severity.Normalized';
      const normalizedConditions = x.lowerBound === x.upperBound ? [
        Condition.numberEquals(normalizedRef, x.lowerBound),
      ] : [
        Condition.numberGreaterThanEquals(normalizedRef, x.lowerBound),
        Condition.numberLessThanEquals(normalizedRef, x.upperBound),
      ];

      checkSeverity.when(Condition.or(
        Condition.and(
          Condition.isPresent('$.Finding.Severity.Label'),
          Condition.stringEquals('$.Finding.Severity.Label', x.name.toUpperCase()),
        ),
        Condition.and(
          Condition.isPresent(normalizedRef),
          ...normalizedConditions,
        ),
      ), setSeverity);
    });

    return checkSeverity.afterwards({ includeOtherwise: true });
  }

  protected buildUrl(): Chain {
    const findingUrl = [
      `https://${this.stack.region}.console.aws.amazon.com`,
      'securityhub',
      `home?region=${this.stack.region}#`,
      'findings?search=Id%3D%255Coperator%255C%253AEQUALS%255C%253A{}',
    ].join('/');

    const replace = [
      {
        Join: '%253A',
        Split: ':',
      },
      {
        Join: '%252F',
        Split: '/',
      },
    ];

    const setOperations = new Pass(this, 'set-url-builder-operations', {
      parameters: {
        Replace: replace,
      },
      resultPath: '$.UrlBuilder.Operations',
    });

    const initialize = new Pass(this, 'initialize-url-builder', {
      parameters: {
        'Index': 0,
        'Length.$': SfnFn.arrayLength('$.UrlBuilder.Operations.Replace'),
        'Requirements.$': '$.UrlBuilder.Operations.Replace',
        'Text.$': '$.Finding.Id',
      },
      resultPath: '$.UrlBuilder.Iterator',
    });

    const iterate = new Choice(this, 'iterate-url-builder');

    const getCurrentOperation = new Pass(this, 'get-current-url-builder-operation', {
      parameters: {
        'Item.$': SfnFn.arrayGetItem(
          '$.UrlBuilder.Operations.Replace',
          '$.UrlBuilder.Iterator.Index',
        ),
      },
      resultPath: '$.UrlBuilder.Iteration',
    });

    const initializeIteration = new Pass(this, 'initialize-url-builder-iteration', {
      parameters: {
        'Builder': '',
        'List.$': SfnFn.stringSplit(
          '$.UrlBuilder.Iterator.Text',
          '$.UrlBuilder.Iteration.Item.Split',
        ),
        'Delimiter': '',
        'Index': 0,
        'Join.$': '$.UrlBuilder.Iteration.Item.Join',
        'Length.$': SfnFn.arrayLength(
          SfnFn.stringSplit(
            '$.UrlBuilder.Iterator.Text',
            '$.UrlBuilder.Iteration.Item.Split',
          ),
        ),
      },
      resultPath: '$.UrlBuilder.Iteration.Iterator',
    });

    const iterateOperation = new Choice(this, 'iterate-url-builder-operation');

    const buildUrl = new Pass(this, 'build-url', {
      parameters: {
        'Builder.$': SfnFn.format('{}{}{}', [
          '$.UrlBuilder.Iteration.Iterator.Builder',
          '$.UrlBuilder.Iteration.Iterator.Delimiter',
          SfnFn.arrayGetItem(
            '$.UrlBuilder.Iteration.Iterator.List',
            '$.UrlBuilder.Iteration.Iterator.Index',
          ),
        ]),
        'Delimiter.$': '$.UrlBuilder.Iteration.Iterator.Join',
        'Index.$': SfnFn.mathAdd(
          '$.UrlBuilder.Iteration.Iterator.Index', 1,
        ),
        'Join.$': '$.UrlBuilder.Iteration.Iterator.Join',
        'Length.$': '$.UrlBuilder.Iteration.Iterator.Length',
        'List.$': '$.UrlBuilder.Iteration.Iterator.List',
      },
      resultPath: '$.UrlBuilder.Iteration.Iterator',
    });

    const step = new Pass(this, 'step-url-builder', {
      parameters: {
        'Index.$': SfnFn.mathAdd(
          '$.UrlBuilder.Iterator.Index', 1,
        ),
        'Length.$': '$.UrlBuilder.Iterator.Length',
        'Requirements.$': '$.UrlBuilder.Iterator.Requirements',
        'Text.$': '$.UrlBuilder.Iteration.Iterator.Builder',
      },
      resultPath: '$.UrlBuilder.Iterator',
    });

    const addFindingUrl = new Pass(this, 'add-finding-url', {
      parameters: {
        'Builder.$': SfnFn.format(
          `{}\n\nFinding details:\n${findingUrl}`, [
            '$.Description.Builder',
            '$.UrlBuilder.Iterator.Text',
          ],
        ),
      },
      resultPath: '$.Description',
    });

    return setOperations
      .next(initialize)
      .next(iterate
        .when(Condition.numberLessThanJsonPath(
          '$.UrlBuilder.Iterator.Index',
          '$.UrlBuilder.Iterator.Length',
        ), getCurrentOperation
          .next(initializeIteration)
          .next(iterateOperation
            .when(Condition.numberLessThanJsonPath(
              '$.UrlBuilder.Iteration.Iterator.Index',
              '$.UrlBuilder.Iteration.Iterator.Length',
            ), buildUrl
              .next(iterateOperation))
            .afterwards({ includeOtherwise: true })
            .next(step)))
        .afterwards({ includeOtherwise: true }))
      .next(addFindingUrl);
  }

  public registerIssueTrigger(id: string, options: SecurityHubFindingEventOptions = {}): IssueTrigger {
    const labels: string[] = [];
    const normalized: any[] = [];

    const severity = options.severity ?? SecurityHubSeverityConfiguration.threshold(SecurityHubSeverity.HIGH);
    severity.levels.forEach((x) => {
      labels.push(x.name.toUpperCase());
      normalized.push(x.lowerBound === x.upperBound ? {
        numeric: ['=', x.lowerBound],
      } : {
        numeric: ['>=', x.lowerBound, '<=', x.upperBound],
      });
    });

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          findings: {
            Severity: {
              $or: [
                {
                  Label: labels,
                },
                {
                  Normalized: normalized,
                },
              ],
            },
            Workflow: {
              Status: [
                'NEW',
              ],
            },
          },
        },
        detailType: [
          'Security Hub Findings - Imported',
        ],
        source: [
          'aws.securityhub',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}