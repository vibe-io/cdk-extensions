import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";


export interface AutomationStepChainDetails {
  permissions?: PolicyStatement[];
  steps: any[];
}

export interface IAutomationStepChain {
  bind(scope: IConstruct): AutomationStepChainDetails;
}