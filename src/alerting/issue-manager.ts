import { Annotations, Aspects, Duration, IResource, Resource, ResourceProps } from 'aws-cdk-lib';
import { Choice, Condition, DefinitionBody, Fail, IChainable, IStateMachine, IntegrationPattern, Parallel, Pass, StateMachine, StateMachineType, Succeed, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';
import { IssueTrigger } from './issue-trigger';
import { SfnFn } from '../stepfunctions';


export interface IIssueHandler extends IResource {
  readonly handler: IStateMachine;
  readonly name: string;
}

export interface IIssueParser extends IResource {
  readonly handler: IStateMachine;
  readonly matchType: string;

  bind(node: IConstruct): IssueTrigger[];
}

export interface IssueManagerProps extends ResourceProps {
  readonly handlers?: IIssueHandler[];
  readonly name?: string;
  readonly parsers?: IIssueParser[];
  readonly timeout?: Duration;
}

export class IssueManager extends Resource {
  // Internal properties
  private readonly _handlers: IIssueHandler[];
  private readonly _parsers: IIssueParser[];

  private readonly determineIssueType: Choice;
  private readonly executeIssueHandlers: Parallel;
  private readonly handleIssue: IChainable;

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;


  public constructor(scope: IConstruct, id: string, props: IssueManagerProps = {}) {
    super(scope, id, props);

    this._handlers = [];
    this._parsers = [];

    this.name = props.name;
    this.timeout = props.timeout;

    const addMetadata = new Pass(this, 'add-metadata', {
      parameters: {
        'AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$': '$$.Execution.Id',
      },
      resultPath: '$.Metadata',
    });

    this.determineIssueType = new Choice(this, 'determine-issue-type');

    const unknownIssueType = new Fail(this, 'unknown-issue-type', {
      cause: 'The type of issue reported is not recognized and is not supported by any registered issue handlers.',
      error: 'UnknownIssueTypeError',
    });

    const checkAlert = new Choice(this, 'check-alert');

    this.executeIssueHandlers = new Parallel(this, 'execute-issue-handlers');

    const noAlert = new Succeed(this, 'no-alert');

    const identifyIssue = addMetadata
      .next(this.determineIssueType
        .otherwise(unknownIssueType));

    this.handleIssue = checkAlert
      .when(Condition.and(
        Condition.isPresent('$.Issue.Output.Alert'),
        Condition.booleanEquals('$.Issue.Output.Alert', true),
      ), this.executeIssueHandlers)
      .otherwise(noAlert);

    props.parsers?.forEach((x) => {
      this.addIssueParser(x);
    });

    props.handlers?.forEach((x) => {
      this.addHandler(x);
    });

    Aspects.of(this).add({
      visit: (node: IConstruct) => {
        if (node === this) {
          if (this._handlers.length === 0 || this._parsers.length === 0) {
            Annotations.of(this).addWarning([
              `Issue manager at '${this.node.path}' needs at least 1 issue`,
              'parser and 1 issue handler. Creation will be skipped.',
            ].join(' '));
          }

          const stateMachine = new StateMachine(this, 'state-machine', {
            definitionBody: DefinitionBody.fromChainable(identifyIssue),
            stateMachineName: this.name,
            stateMachineType: StateMachineType.STANDARD,
            timeout: this.timeout,
            tracingEnabled: true,
          });

          this.addEventRules(stateMachine);
        }
      },
    });
  }

  /**
   * Adds a destination that handles issues that get passed to the issue
   * manager.
   *
   * @param handler The destination that will handle issues that have been
   * raised.
   */
  public addHandler(handler: IIssueHandler): void {
    this._handlers.push(handler);

    const defaultOverrides = new Pass(this, `default-overrides-${handler.name}`, {
      parameters: {
        Overrides: {},
      },
      resultPath: '$.Handler',
    });

    const eventOverrides = new Pass(this, `event-overrides-${handler.name}`, {
      parameters: {
        'Overrides.$': `$.Overrides.${handler.name}`,
      },
      resultPath: '$.Handler',
    });

    const checkOverrides = new Choice(this, `check-overrides-${handler.name}`)
      .when(Condition.isPresent(`$.Overrides.${handler.name}`), eventOverrides)
      .otherwise(defaultOverrides)
      .afterwards();

    const execute = new StepFunctionsStartExecution(this, `execute-issue-handler-${handler.name}`, {
      input: TaskInput.fromJsonPathAt(SfnFn.jsonMerge(
        '$.Handler.Overrides',
        '$.Issue.Output',
      )),
      integrationPattern: IntegrationPattern.RUN_JOB,
      stateMachine: handler.handler,
    });

    this.executeIssueHandlers.branch(checkOverrides.next(execute));
  }

  /**
   * Adds a parser that is used to transform incoming issues into a known
   * format that can be passed to the destinations where they will be consumed
   * by users.
   *
   * @param parser A parser that handles a specific type of event that should
   * trigger an issue to be raised.
   */
  public addIssueParser(parser: IIssueParser): void {
    this._parsers.push(parser);

    const execution = new StepFunctionsStartExecution(this, `parse-${parser.matchType}`, {
      input: TaskInput.fromJsonPathAt('$.Event'),
      integrationPattern: IntegrationPattern.RUN_JOB,
      resultPath: '$.Issue',
      stateMachine: parser.handler,
    });

    this.determineIssueType
      .when(Condition.stringEquals('$.Type', parser.matchType), execution
        .next(this.handleIssue));
  }

  protected addEventRules(stateMachine: StateMachine): void {
    this._parsers.forEach((parser) => {
      parser.bind(this).forEach((trigger) => {
        trigger.bind(stateMachine);
      });
    });
  }
}