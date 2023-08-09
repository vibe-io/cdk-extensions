import { CfnRemediationConfiguration } from 'aws-cdk-lib/aws-config';
import { IConstruct } from 'constructs';
import { IAutomationDocument } from '../../ssm';
import { definedFieldsOrUndefined } from '../../utils/formatting';


export class RemediationTargetType {
  static readonly SSM_DOCUMENT: RemediationTargetType = RemediationTargetType.of('SSM_DOCUMENT');

  static of(value: string): RemediationTargetType {
    return new RemediationTargetType(value);
  }


  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

export interface RemediationTargetConfiguration {
  readonly controls?: CfnRemediationConfiguration.ExecutionControlsProperty;
  readonly targetId: string;
  readonly targetType: RemediationTargetType;
  readonly targetVersion?: string;
}

export interface IRemediationTarget {
  bind(scope: IConstruct): RemediationTargetConfiguration;
}

export interface AutomationDocumentRemediationProps {
  readonly concurrencyPercentage?: number;
  readonly document: IAutomationDocument;
  readonly errorPercentage?: number;
  readonly version?: string;
}

export class RemediationTarget {
  static automationDocument(props: AutomationDocumentRemediationProps): IRemediationTarget {
    return {
      bind: (_scope) => {
        return {
          controls: definedFieldsOrUndefined({
            ssmControls: definedFieldsOrUndefined({
              concurrentExecutionRatePercentage: props.concurrencyPercentage,
              errorPercentage: props.errorPercentage,
            }),
          }),
          targetId: props.document.documentName,
          targetType: RemediationTargetType.SSM_DOCUMENT,
          targetVersion: props.version,
        };
      },
    };
  }
}