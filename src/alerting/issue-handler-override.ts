import { IIssueHandler } from './issue-manager';


export class IssueHandlerOverride {
  public readonly handler: IIssueHandler;
  public readonly overrides: {[key: string]: any};


  public constructor(handler: IIssueHandler, overrides: {[key: string]: any}) {
    this.handler = handler;
    this.overrides = overrides;
  }
}