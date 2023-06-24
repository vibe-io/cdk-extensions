import { IConstruct } from 'constructs';
import { Discord, DiscordProps } from './discord-handler';
import { JiraTicket, JiraTicketProps } from './jira-ticket';


export class IssueHander {
  public static discord(scope: IConstruct, id: string, props: DiscordProps): Discord {
    return new Discord(scope, id, props);
  }

  public static jiraTicket(scope: IConstruct, id: string, props: JiraTicketProps): JiraTicket {
    return new JiraTicket(scope, id, props);
  }
}
