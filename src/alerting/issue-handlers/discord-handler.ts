import { ArnFormat, Duration, Lazy } from 'aws-cdk-lib';
import { ApiDestination, Authorization, Connection, HttpMethod, HttpParameter, IEventBus, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { ApiDestination as EventsApiDestination } from 'aws-cdk-lib/aws-events-targets';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Choice, Condition, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { SfnFn } from '../../stepfunctions';
import { definedFields } from '../../utils/formatting';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueHandler } from '../issue-manager';
import { IssuePluginBase, IssuePluginBaseProps } from '../issue-plugin-base';


export interface DiscordOverrideOptions {
  readonly channel?: string;
  readonly mentions?: string[];
}

/**
 * Configuration controlling how Discord messages should be sent in response
 * to events.
 */
export interface DiscordProps extends IssuePluginBaseProps {
  readonly channel: string;
  readonly eventBus?: IEventBus;
  readonly mentions?: string[];
  readonly name?: string;
  readonly timeout?: Duration;
  readonly token: ISecret;
}

/**
 * A standardized implementation that allows Discord messages to be sent in
 * response to events detected in AWS.
 *
 * Intended for use with the `IssueManager` state machine which allows
 * arbitrary types of events to be processed into standard values and then
 * output or one of more issue tracking services.
 */
export class Discord extends IssuePluginBase implements IIssueHandler {
  public static readonly DEFAULT_NAME: string = 'Discord';
  public static readonly MESSAGES_ENDPOINT: string = 'https://discord.com/api/v10/channels/*/messages';

  /**
   * Internal collection of users or roles who should be mentioned by default
   * when sending a message to Discord.
   */
  private readonly _mentions: string[];

  /**
   * The default Discord channel where messages processed by the handler should
   * be sent if no override is given.
   *
   * @group Inputs
   */
  public readonly channel: string;

  /**
   * The event bus to use to trigger writes to the Jira instance.
   *
   * This integration formats a Jira API response and then sends it to a Jira
   * instance by means of an EventBridge Destination API and a specially
   * crafted event pattern. This is the event bus where the rule to trigger the
   * API will be added and the trigger event will be sent.
   */
  public readonly eventBus?: IEventBus;

  /**
   * The human friendly name that can be used to identify the plugin.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * The length of time that the State Machine that handles creation of Jira
   * tickets is allowed to run before timing out.
   *
   * @group Inputs
   */
  public readonly timeout?: Duration;

  /**
   * The token for a Discord bot that has permissions to post in the
   * destination channels. The secret should be in JSON format and contain the
   * key:
   *
   * token: The token for the bot that has permissions to post in the
   * destination Discord channels.
   *
   * @group Inputs
   */
  public readonly token: ISecret;

  /**
   * Collection of users or roles who should be mentioned by default when
   * sending a message to Discord.
   */
  public get mentions(): string[] {
    return [...this._mentions];
  }

  /**
   * Destination pointing to a Jira instance where tickets are to be created.
   */
  public readonly apiDestination: ApiDestination;

  /**
   * API connection providing details of how to communicate with the configured
   * Jira instance.
   */
  public readonly connection: Connection;

  /**
   * The State Machine that handles creating a Jira ticket for a passed issue.
   *
   * Internally this state machine uses the AWS managed `AWS-CreateJiraIssue`
   * SSM Automation document.
   *
   * @group Resources
   */
  public readonly handler: IStateMachine;


  /**
   * Creates a new instance of the JiraTicket class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: IConstruct, id: string, props: DiscordProps) {
    super(scope, id, props);

    this._mentions = [];

    this.channel = props.channel;
    this.eventBus = props.eventBus;
    this.name = props.name ?? Discord.DEFAULT_NAME;
    this.timeout = props.timeout;
    this.token = props.token;

    this.connection = new Connection(this, 'connection', {
      authorization: Authorization.apiKey(
        'Authorization',
        this.token.secretValueFromJson('token'),
      ),
      description: 'Allows events to be sent to Discord.',
      headerParameters: {
        'Content-Type': HttpParameter.fromString('application/json'),
      },
    });

    this.apiDestination = new ApiDestination(this, 'api-destination', {
      connection: this.connection,
      description: 'Allows events to be sent to Discord.',
      endpoint: Discord.MESSAGES_ENDPOINT,
      httpMethod: HttpMethod.POST,
    });

    const nestInput = new Pass(this, 'nest-input', {
      parameters: {
        'Input.$': '$',
      },
    });

    const addDefaults = new Pass(this, 'add-defaults', {
      parameters: definedFields({
        Channel: this.channel,
        Mentions: Lazy.list({
          produce: () => {
            return this.mentions;
          },
        }),
      }),
      resultPath: '$.Defaults',
    });

    const mergeInputWithDefaults = new Pass(this, 'merge-input-with-defaults', {
      parameters: {
        'Merged.$': SfnFn.jsonMerge(
          '$.Defaults',
          '$.Input',
        ),
      },
      outputPath: '$.Merged',
    });

    const buildRequest = new Pass(this, 'build-request', {
      parameters: {
        'content.$': SfnFn.format('**{}**\n{}', [
          '$.Summary',
          '$.Description',
        ]),
      },
      resultPath: '$.Output',
    });

    const checkMentions = new Choice(this, 'check-mentions');

    const initializeMentionsBuilder = new Pass(this, 'initialize-mentions-builder', {
      parameters: {
        'Builder': '',
        'Delimiter': '',
        'Index': 0,
        'Length.$': '$.Mentions.Length',
        'List.$': '$.Merged.Mentions',
      },
      resultPath: '$.Mentions',
    });

    const iterateMentions = new Choice(this, 'iterate-mentions');

    const addMention = new Pass(this, 'add-mentions', {
      parameters: {
        'Builder': SfnFn.format('{}{}@{}', [
          '$.Mentions.Builder',
          '$.Mentions.Delimiter',
          SfnFn.arrayGetItem('$.Mentions.List', '$.Mentions.Index'),
        ]),
        'Delimiter': ' ',
        'Index': SfnFn.mathAdd('$.Mantions.Index', 1),
        'Length.$': '$.Mentions.Length',
        'List.$': '$.Merged.Mentions',
      },
      resultPath: '$.Mentions',
    });

    const addMentionsToRequest = new Pass(this, 'add-mentions-to-request', {
      parameters: {
        'content.$': SfnFn.format('{}\n{}', [
          '$.Mentions.Builder',
          '$.Output.content',
        ]),
      },
      resultPath: '$.Output',
    });

    const handleMentions = checkMentions
      .when(Condition.isPresent('$.Merged.Mentions'), initializeMentionsBuilder
        .next(iterateMentions
          .when(Condition.numberLessThanJsonPath('$.Mentions.Index', '$.Mentions.Length'), addMention
            .next(iterateMentions))
          .afterwards({ includeOtherwise: true })
          .next(addMentionsToRequest)))
      .afterwards({ includeOtherwise: true });


    const putEvent = new CallAwsService(this, 'put-event', {
      action: 'putEvents',
      iamAction: 'events:PutEvents',
      iamResources: [
        this.eventBus?.eventBusArn ?? this.stack.formatArn({
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          resource: 'event-bus',
          resourceName: 'default',
          service: 'events',
        }),
      ],
      parameters: {
        Entries: [{
          'Detail': {
            'channel.$': '$.Channel',
            'payload.$': '$.Output',
          },
          'EventBusName': this.eventBus?.eventBusName ?? 'default',
          'DetailType': this.name,
          'Resources.$': SfnFn.array('$$.StateMachine.Id'),
          'Source': 'cdke.issues',
        }],
      },
      resultPath: '$.PutEvent',
      service: 'eventbridge',
    });

    const definition = nestInput
      .next(addDefaults)
      .next(mergeInputWithDefaults)
      .next(buildRequest)
      .next(handleMentions)
      .next(putEvent);

    this.handler = new StateMachine(this, 'state-machine', {
      definition: definition,
      logs: this.buildLogging(),
      stateMachineType: StateMachineType.EXPRESS,
      timeout: this.timeout,
      tracingEnabled: true,
    });

    new Rule(this, 'rule', {
      description: 'Triggers a Discord alert in response to an event.',
      enabled: true,
      eventBus: this.eventBus,
      eventPattern: {
        detailType: [
          this.name,
        ],
        resources: [
          this.handler.stateMachineArn,
        ],
        source: [
          'cdke.issues',
        ],
      },
      targets: [
        new EventsApiDestination(this.apiDestination, {
          deadLetterQueue: new Queue(this, 'dead-letter-queue'),
          event: RuleTargetInput.fromEventPath('$.detail.payload'),
          pathParameterValues: [
            '$.detail.channel',
          ],
        }),
      ],
    });
  }

  public buildEventOverrides(options: DiscordOverrideOptions): IssueHandlerOverride {
    return new IssueHandlerOverride(this, {
      Channel: options.channel,
      Mentions: options.mentions,
    });
  }
}
