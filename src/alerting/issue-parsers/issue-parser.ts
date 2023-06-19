import { IConstruct } from 'constructs';
import { EcrScanFinding, EcrScanFindingProps } from './ecr-scan-finding';
import { GuardDutyFinding, GuardDutyFindingProps } from './guard-duty-finding';
import { InspectorFinding, InspectorFindingProps } from './inspector-finding';
import { OpenSearchEvent, OpenSearchEventProps } from './opensearch-event';
import { SecurityHubFinding, SecurityHubFindingProps } from './security-hub-finding';


export class IssueParser {
  public static ecrScanFinding(scope: IConstruct, id: string, props: EcrScanFindingProps = {}): EcrScanFinding {
    return new EcrScanFinding(scope, id, props);
  }

  public static guardDutyFinding(scope: IConstruct, id: string, props: GuardDutyFindingProps = {}): GuardDutyFinding {
    return new GuardDutyFinding(scope, id, props);
  }

  public static inspectorFinding(scope: IConstruct, id: string, props: InspectorFindingProps = {}): InspectorFinding {
    return new InspectorFinding(scope, id, props);
  }

  public static openSearchEvent(scope: IConstruct, id: string, props: OpenSearchEventProps = {}): OpenSearchEvent {
    return new OpenSearchEvent(scope, id, props);
  }

  public static securityHubFinding(scope: IConstruct, id: string, props: SecurityHubFindingProps = {}): SecurityHubFinding {
    return new SecurityHubFinding(scope, id, props);
  }
}
