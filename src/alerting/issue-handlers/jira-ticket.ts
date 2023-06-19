import { ArnFormat, Duration } from 'aws-cdk-lib';
import { ApiDestination, Authorization, Connection, HttpMethod, HttpParameter, IEventBus, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { ApiDestination as EventsApiDestination } from 'aws-cdk-lib/aws-events-targets';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Chain, Choice, Condition, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { SfnFn } from '../../stepfunctions';
import { definedFields } from '../../utils/formatting';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IIssueHandler } from '../issue-manager';
import { IssuePluginBase, IssuePluginBaseProps } from '../issue-plugin-base';


export interface JiraTicketPriorityMap {
  readonly critical?: string;
  readonly default?: string;
  readonly high?: string;
  readonly info?: string;
  readonly low?: string;
  readonly medium?: string;
}

export interface JiraTicketOverrideOptions {
  readonly assignee?: string;
  readonly issuePriority?: string;
  readonly issueType?: string;
  readonly project?: string;
}

/**
 * Configuration controlling how Jira tickets should be created in response
 * to events.
 */
export interface JiraTicketProps extends IssuePluginBaseProps {
  readonly assignee?: string;
  readonly credentials: ISecret;
  readonly eventBus?: IEventBus;
  readonly issueType: string;
  readonly jiraUrl: string;
  readonly name?: string;
  readonly project: string;
  readonly priorityMap: JiraTicketPriorityMap;
  readonly timeout?: Duration;
}

/**
 * A standardized implementation that allows Jira tickets to be created in
 * response to events detected in AWS.
 *
 * Intended for use with the `IssueManager` state machine which allows
 * arbitrary types of events to be processed into standard values and then
 * output or one of more issue tracking services.
 *
 * @see [AWS-CreateJiraIssue](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createjiraissue.html)
 */
export class JiraTicket extends IssuePluginBase implements IIssueHandler {
  public static readonly DEFAULT_NAME: string = 'JiraTicket';

  private static buildSeverityCondition(severity: string): Condition {
    return Condition.and(
      Condition.isPresent('$.Severity'),
      Condition.stringEquals('$.Severity', severity),
    );
  }

  /**
   * The default assignee that issues should be created with if no other
   * assignee is specified by the event that triggered the issue creation.
   *
   * @group Inputs
   */
  public readonly assignee?: string;

  /**
   * The credentials to be used for connecting to Jira. The secret should be in
   * JSON format and contain the key:
   *
   * username: The name of the user issues should be created as.
   * password: A password or API key for the user specified in `username`.
   *
   * @group Inputs
   */
  public readonly credentials: ISecret;

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
   * The default issue type that issues should be created as if no other type
   * is specified by the event that triggered the issue creation.
   *
   * @group Inputs
   */
  public readonly issueType: string;

  /**
   * The URL of the Jira instance where tickets should be created.
   *
   * @group Inputs
   */
  public readonly jiraUrl: string;

  /**
   * The human friendly name that can be used to identify the plugin.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * A mapping of the standard severities supported by issue manager to
   * priority levels supported by the destination Jira instance.
   *
   * @group Inputs
   */
  public readonly priorityMap: JiraTicketPriorityMap;

  /**
   * The name of the default project to use for creating issues if no other
   * project is specified by the event that triggered the issue creation.
   *
   * @group Inputs
   */
  public readonly project: string;

  /**
   * The length of time that the State Machine that handles creation of Jira
   * tickets is allowed to run before timing out.
   *
   * @group Inputs
   */
  public readonly timeout?: Duration;

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
  public constructor(scope: IConstruct, id: string, props: JiraTicketProps) {
    super(scope, id, props);

    this.assignee = props.assignee;
    this.credentials = props.credentials;
    this.eventBus = props.eventBus;
    this.issueType = props.issueType;
    this.jiraUrl = props.jiraUrl;
    this.name = props.name ?? JiraTicket.DEFAULT_NAME;
    this.project = props.project;
    this.priorityMap = props.priorityMap;
    this.timeout = props.timeout;

    this.connection = new Connection(this, 'connection', {
      authorization: Authorization.basic(
        this.credentials.secretValueFromJson('username').toString(),
        this.credentials.secretValueFromJson('password'),
      ),
      description: 'Allows events to be sent to Jira to create tickets.',
      headerParameters: {
        'Content-Type': HttpParameter.fromString('application/json'),
      },
    });

    this.apiDestination = new ApiDestination(this, 'api-destination', {
      connection: this.connection,
      description: 'Allows events to be sent to Jira to create tickets.',
      endpoint: `${this.jiraUrl.replace(/\/$/, '')}/rest/api/2/issue/`,
      httpMethod: HttpMethod.POST,
    });

    const nestInput = new Pass(this, 'nest-input', {
      parameters: {
        'Input.$': '$',
      },
    });

    const addDefaults = new Pass(this, 'add-defaults', {
      parameters: definedFields({
        Assignee: this.assignee,
        JiraUrl: this.jiraUrl,
        Project: this.project,
        Type: this.issueType,
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

    const checkSeverity = this.buildSeverityMap();

    const buildFields = new Pass(this, 'build-fields', {
      parameters: {
        /*'description': {
          'content': [{
            'content': [{
              'text.$': '$.Description',
              'type': 'text',
            }],
            'type': 'paragraph',
          }],
          'type': 'doc',
          'version': 1,
        },*/
        'description.$': '$.Description',
        'issuetype': {
          'name.$': '$.Type',
        },
        'project': {
          'key.$': '$.Project',
        },
        'summary.$': '$.Summary',
      },
      resultPath: '$.Output.Fields',
    });

    const checkAssignee = new Choice(this, 'check-assignee');

    const buildAssignee = new Pass(this, 'build-assignee', {
      parameters: {
        assignee: {
          'id.$': '$.Assignee',
        },
      },
      resultPath: '$.Optional.Assignee',
    });

    const mergeAssignee = new Pass(this, 'merge-assignee', {
      parameters: {
        'Fields.$': SfnFn.jsonMerge('$.Output.Fields', '$.Optional.Assignee'),
      },
      resultPath: '$.Output',
    });

    const addAssignee = checkAssignee
      .when(Condition.isPresent('$.Assignee'), buildAssignee
        .next(mergeAssignee))
      .afterwards({ includeOtherwise: true });

    const checkDueDate = new Choice(this, 'check-due-date');

    const buildDueDate = new Pass(this, 'build-due-date', {
      parameters: {
        'duedate.$': '$.DueDate',
      },
      resultPath: '$.Optional.DueDate',
    });

    const mergeDueDate = new Pass(this, 'merge-due-date', {
      parameters: {
        'Fields.$': SfnFn.jsonMerge('$.Output.Fields', '$.Optional.DueDate'),
      },
      resultPath: '$.Output',
    });

    const addDueDate = checkDueDate
      .when(Condition.isPresent('$.DueDate'), buildDueDate
        .next(mergeDueDate))
      .afterwards({ includeOtherwise: true });

    const checkPriority = new Choice(this, 'check-priority');

    const buildPriority = new Pass(this, 'build-priority', {
      parameters: {
        priority: {
          'name.$': '$.Resolved.Priority',
        },
      },
      resultPath: '$.Optional.Priority',
    });

    const mergePriority = new Pass(this, 'merge-priority', {
      parameters: {
        'Fields.$': SfnFn.jsonMerge('$.Output.Fields', '$.Optional.Priority'),
      },
      resultPath: '$.Output',
    });

    const addPriority = checkPriority
      .when(Condition.and(
        Condition.isPresent('$.Resolved.Priority'),
        Condition.isNotNull('$.Resolved.Priority'),
      ), buildPriority
        .next(mergePriority))
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
            'fields.$': '$.Output.Fields',
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
      .next(checkSeverity)
      .next(buildFields)
      .next(addAssignee)
      .next(addDueDate)
      .next(addPriority)
      .next(putEvent);

    this.handler = new StateMachine(this, 'state-machine', {
      definition: definition,
      logs: this.buildLogging(),
      stateMachineType: StateMachineType.EXPRESS,
      timeout: this.timeout,
      tracingEnabled: true,
    });

    new Rule(this, 'rule', {
      description: 'Triggers a ticket to be created in Jira in response to an event.',
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
          event: RuleTargetInput.fromEventPath('$.detail'),
        }),
      ],
    });
  }

  public buildSeverityMap(): Chain {
    const registerSeverity = (choice: Choice, name: string, value: string): Choice => {
      const step = new Pass(this, `map-${name.toLowerCase()}`, {
        parameters: {
          'Priority': value,
          'Severity.$': '$.Severity',
        },
        resultPath: '$.Resolved',
      });

      const condition = JiraTicket.buildSeverityCondition(name.toUpperCase());
      return choice.when(condition, step);
    };

    const overrideAssignment = new Pass(this, 'map-override', {
      parameters: {
        'Priority.$': '$.Priority',
        'Severity': 'OVERRIDE',
      },
      resultPath: '$.Resolved',
    });

    let checkSeverity = new Choice(this, 'check-severity')
      .when(Condition.isPresent('$.Priority'), overrideAssignment);

    if (this.priorityMap.critical) {
      checkSeverity = registerSeverity(checkSeverity, 'critical', this.priorityMap.critical);
    }

    if (this.priorityMap.high) {
      checkSeverity = registerSeverity(checkSeverity, 'high', this.priorityMap.high);
    }

    if (this.priorityMap.medium) {
      checkSeverity = registerSeverity(checkSeverity, 'medium', this.priorityMap.medium);
    }

    if (this.priorityMap.low) {
      checkSeverity = registerSeverity(checkSeverity, 'low', this.priorityMap.low);
    }

    if (this.priorityMap.info) {
      checkSeverity = registerSeverity(checkSeverity, 'info', this.priorityMap.info);
    }

    const defaultAssignment = new Pass(this, 'map-default', {
      parameters: {
        Priority: this.priorityMap.default,
        Severity: 'DEFAULT',
      },
      resultPath: '$.Resolved',
    });

    return checkSeverity
      .otherwise(defaultAssignment)
      .afterwards();
  }

  public buildEventOverrides(options: JiraTicketOverrideOptions): IssueHandlerOverride {
    return new IssueHandlerOverride(this, {
      Assignee: options.assignee,
      Priority: options.issuePriority,
      Project: options.project,
      Type: options.issueType,
    });
  }
}
