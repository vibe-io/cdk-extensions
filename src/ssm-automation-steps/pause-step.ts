import { IConstruct } from "constructs";
import { StepBase, StepBaseProps } from "./step-base";


export interface PauseStepProps extends StepBaseProps {}

export class PauseStep extends StepBase {
  public constructor(scope: IConstruct, id: string, props: PauseStepProps) {
    super(scope, id, props);
  }
}