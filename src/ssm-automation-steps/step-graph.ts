import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StepBase } from "./step-base";


export interface StepGraphProps {
  readonly startStep: StepBase;
}

export class StepGraph {
  public readonly allSteps: Set<StepBase>;
  public readonly policyStatements: PolicyStatement[];

  public readonly startStep: StepBase;


  public constructor(props: StepGraphProps) {
    this.allSteps = new Set<StepBase>();
    this.policyStatements = [];

    this.startStep = props.startStep;
    this.startStep.bindToGraph(this);
  }
}