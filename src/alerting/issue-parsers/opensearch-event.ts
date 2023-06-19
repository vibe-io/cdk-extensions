import { Duration } from 'aws-cdk-lib';
import { Condition, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { DescriptionBuilder } from './description-builder';
import { IssueParserPluginBase, IssueParserPluginBaseProps } from './issue-parser-plugin-base';
import { SfnFn } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueParser } from '../issue-manager';
import { IssueTrigger } from '../issue-trigger';


export class OpenSearchEventSeverity {
  public static readonly INFORMATIONAL: OpenSearchEventSeverity = OpenSearchEventSeverity.of('INFO', 'Informational', 10);
  public static readonly LOW: OpenSearchEventSeverity = OpenSearchEventSeverity.of('LOW', 'Low', 20);
  public static readonly MEDIUM: OpenSearchEventSeverity = OpenSearchEventSeverity.of('HIGH', 'Medium', 30);
  public static readonly HIGH: OpenSearchEventSeverity = OpenSearchEventSeverity.of('CRITICAL', 'High', 40);

  public static of(standardized: string, original: string, priority: number): OpenSearchEventSeverity {
    return new OpenSearchEventSeverity(standardized, original, priority);
  }


  public static all(): OpenSearchEventSeverity[] {
    return [...OpenSearchEvent.SEVERITIES];
  }

  public static custom(...levels: OpenSearchEventSeverity[]): OpenSearchEventSeverity[] {
    return [...levels];
  }

  public static threshold(level: OpenSearchEventSeverity): OpenSearchEventSeverity[] {
    return OpenSearchEvent.SEVERITIES.filter((x) => {
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

export interface OpenSearchEventTypeProps {
  readonly detailType: string;
  readonly eventName: string;
}

/**
 * Collection of all OpenSearch event types. Gets expanded every time a new
 * event type is registered.
 *
 * Making this a variable instead of a private static property makes the linter
 * happy.
 */
const ALL_EVENT_TYPES: OpenSearchEventType[] = [];

/**
 * Represents a type of event that can be generated in response to
 * circumstances happening on an AWS OpenSearch service cluster.
 *
 * @see [Monitoring OpenSearch Service events with Amazon EventBridge](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring-events.html)
 */
export class OpenSearchEventType {
  public static readonly AUTO_TUNE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Auto-Tune Notification',
    eventName: 'Auto-Tune Event',
  });
  public static readonly CLUSTER_RECOVERY: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Cluster Status Notification',
    eventName: 'Automatic Snapshot Restore for Red Indices',
  });
  public static readonly CUSTOM_INDEX_ROUTING: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Custom Index Routing Warning',
  });
  public static readonly DISK_THROUGHPUT_THROTTLE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Disk Throughput Throttle',
  });
  public static readonly DOMAIN_UPDATE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Domain Update Notification',
    eventName: 'Domain Update Validation',
  });
  public static readonly EBS_BURST_BALANCE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'EBS Burst Balance',
  });
  public static readonly FAILED_SHARD_LOCK: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Failed Shard Lock',
  });
  public static readonly HIGH_JVM_USAGE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'High JVM Usage',
  });
  public static readonly HIGH_SHARED_COUNT: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'High Shard Count',
  });
  public static readonly INSUFFICIENT_GARBAGE_COLLECTION: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Insufficient GC',
  });
  public static readonly KMS_KEY_INACCESSIBLE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Domain Error Notification',
    eventName: 'KMS Key Inaccessible',
  });
  public static readonly LARGE_SHARD_SIZE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Large Shard Size',
  });
  public static readonly LOW_DISK_SPACE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Low Disk Space',
  });
  public static readonly LOW_DISK_WATERMARK_BREACH: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Low Disk Watermark Breach',
  });
  public static readonly NODE_RETIREMENT: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Notification',
    eventName: 'Node Retirement Notification',
  });
  public static readonly SERVICE_SOFTWARE_UPDATE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service Software Update Notification',
    eventName: 'Service Software Update',
  });
  public static readonly VPC_ENDPOINT_CREATE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service VPC Endpoint Notification',
    eventName: 'VPC Endpoint Create Validation',
  });
  public static readonly VPC_ENDPOINT_DELETE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service VPC Endpoint Notification',
    eventName: 'VPC Endpoint Delete Validation',
  });
  public static readonly VPC_ENDPOINT_UPDATE: OpenSearchEventType = OpenSearchEventType.of({
    detailType: 'Amazon OpenSearch Service VPC Endpoint Notification',
    eventName: 'VPC Endpoint Update Validation',
  });

  public static get ALL(): OpenSearchEventType[] {
    return [...ALL_EVENT_TYPES];
  }


  public static of(props: OpenSearchEventTypeProps): OpenSearchEventType {
    return new OpenSearchEventType(props);
  }

  public readonly detailType: string;
  public readonly eventName: string;

  private constructor(props: OpenSearchEventTypeProps) {
    this.detailType = props.detailType;
    this.eventName = props.eventName;

    ALL_EVENT_TYPES.push(this);
  }
}

export interface OpenSearchEventRuleOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: OpenSearchEventSeverity[];
  readonly types?: OpenSearchEventType[];
}

export interface OpenSearchEventProps extends IssueParserPluginBaseProps {}

export class OpenSearchEvent extends IssueParserPluginBase implements IIssueParser {
  public static readonly MATCH_TYPE: string = 'OpenSearchEvent';
  public static readonly SEVERITIES: OpenSearchEventSeverity[] = [
    OpenSearchEventSeverity.INFORMATIONAL,
    OpenSearchEventSeverity.LOW,
    OpenSearchEventSeverity.MEDIUM,
    OpenSearchEventSeverity.HIGH,
  ];

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public readonly handler: IStateMachine;


  public constructor(scope: IConstruct, id: string, props: OpenSearchEventProps = {}) {
    super(scope, id, {
      ...props,
      matchType: props.matchType ?? OpenSearchEvent.MATCH_TYPE,
    });

    const extractDetail = new Pass(this, 'extract-detail', {
      parameters: {
        'Domain': {
          'Account.$': '$.account',
          'Arn.$': '$.resources[0]',
          'Name.$': SfnFn.arrayGetItem(
            SfnFn.stringSplit('$.resources[0]', '/'), 1,
          ),
          'Region.$': '$.region',
        },
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
      'https://{}.console.aws.amazon.com',
      'aos',
      'home?region={}#opensearch',
      'domains',
      '{}',
    ].join('/');

    const section = builder.addSection('domain', {
      title: 'Domain Information',
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

  public registerIssueTrigger(id: string, options: OpenSearchEventRuleOptions = {}): IssueTrigger {
    const severityLevels = options.severity ?? OpenSearchEventSeverity.threshold(OpenSearchEventSeverity.MEDIUM);
    const detailTypes = (options.types ?? OpenSearchEventType.ALL).reduce((prev, cur) => {
      return prev.add(cur.detailType);
    }, new Set<string>());
    const events = options.types?.reduce((prev, cur) => {
      return prev.add(cur.eventName);
    }, new Set<string>());

    if (detailTypes.size === 0) {
      throw new Error([
        'At least one event type is required when creating an OpenSearch',
        'event rule.',
      ].join(' '));
    }

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          event: events ? Array.from(events) : undefined,
          severity: severityLevels.map((x) => {
            return x.original;
          }),
        },
        detailType: Array.from(detailTypes),
        source: [
          'aws.es',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}