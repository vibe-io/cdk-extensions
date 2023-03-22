import { IAutomationStepChain } from "./automation-step-chain-ref";


export interface IAutomationStep extends IAutomationStepChain {
  next(step: IAutomationStep): IAutomationStep;
  onFailure(step: IAutomationStep): IAutomationStep;
}