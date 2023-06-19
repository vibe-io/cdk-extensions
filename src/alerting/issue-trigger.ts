import { EventField, EventPattern, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct, IConstruct } from 'constructs';
import { IssueHandlerOverride } from './issue-handler-override';
import { IIssueParser } from './issue-manager';


export interface IssueTriggerProps {
  readonly eventPattern: EventPattern;
  readonly overrides?: IssueHandlerOverride[];
  readonly parser: IIssueParser;
}

export class IssueTrigger extends Construct {
  // Internal properties
  private readonly _overrides: IssueHandlerOverride[];

  // Input properties
  public readonly eventPattern: EventPattern;
  public readonly parser: IIssueParser;

  public get overrides(): IssueHandlerOverride[] {
    return [...this._overrides];
  }


  public constructor(scope: IConstruct, id: string, props: IssueTriggerProps) {
    super(scope, id);

    this._overrides = [];

    this.eventPattern = props.eventPattern;
    this.parser = props.parser;

    props.overrides?.forEach((x) => {
      this.addOverride(x);
    });
  }

  public addOverride(handlerOverrides: IssueHandlerOverride): void {
    this._overrides.push(handlerOverrides);
  }

  public bind(stateMachine: StateMachine): Rule {
    return new Rule(this, 'rule', {
      enabled: true,
      eventPattern: this.eventPattern,
      targets: [
        new SfnStateMachine(stateMachine, {
          input: RuleTargetInput.fromObject({
            ...this.renderOverrides(),
            Event: EventField.fromPath('$'),
            Type: this.parser.matchType,
          }),
        }),
      ],
    });
  }

  private renderOverrides(): any {
    if (this.overrides.length === 0) {
      return {};
    }

    return {
      Overrides: this._overrides.reduce((prev, cur) => {
        prev[cur.handler.name] = cur.overrides;
        return prev;
      }, {} as {[key: string]: any}),
    };
  }
}