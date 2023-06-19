import { Duration, Names } from 'aws-cdk-lib';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { IIssueParser } from '../issue-manager';
import { IssuePluginBase, IssuePluginBaseProps } from '../issue-plugin-base';
import { IssueTrigger } from '../issue-trigger';


export interface IssueParserPluginBaseProps extends IssuePluginBaseProps {
  readonly matchType?: string;
  readonly name?: string;
  readonly timeout?: Duration;
}

export abstract class IssueParserPluginBase extends IssuePluginBase implements IIssueParser {
  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public abstract readonly handler: IStateMachine;

  // IIssueParser properties
  public readonly matchType: string;

  public get triggers(): IssueTrigger[] {
    return this.node.children.filter((x) => {
      return x instanceof IssueTrigger;
    }) as IssueTrigger[];
  }


  public constructor(scope: IConstruct, id: string, props: IssueParserPluginBaseProps = {}) {
    super(scope, id, props);

    this.matchType = props.matchType ?? Names.uniqueId(this);
    this.name = props.name;
    this.timeout = props.timeout;
  }

  protected abstract addDefaultTrigger(): IssueTrigger;

  public bind(_node: IConstruct): IssueTrigger[] {
    return this.triggers.length > 0 ? this.triggers : [
      this.addDefaultTrigger(),
    ];
  }
}