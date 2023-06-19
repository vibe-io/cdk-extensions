import { IConstruct } from 'constructs';
import { JiraTicket, JiraTicketProps } from './jira-ticket';


export class IssueHander {
  public static jiraTicket(scope: IConstruct, id: string, props: JiraTicketProps): JiraTicket {
    return new JiraTicket(scope, id, props);
  }
}
