import { IStateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { DocumentReference } from "../ssm/lib/document-reference";
import { StepBase, StepBaseProps } from "./step-base";


export interface ExecuteStateMachineStepProps extends StepBaseProps {
  readonly input?: string;
  readonly name?: string;
  readonly stateMachine: IStateMachine | DocumentReference;
}

export class ExecuteStateMachineStep extends StepBase {
  public readonly input?: string;
  public readonly name?: string;

  //public readonly executionArn: string;
  //public readonly executionInput: string;
  //public readonly executionName: string;
  //public readonly executionOutput: string;
  //public readonly executionStartDate: string;
  //public readonly executionStateMachineArn: string;
  //public readonly executionStatus: string;
  //public readonly executionStopDate: string;


  public constructor(scope: IConstruct, id: string, props: ExecuteStateMachineStepProps) {
    super(scope, id, props);

    this.input = props.input;
    this.name = props.name;

    this.addInput('stateMachineArn', DocumentReference.resolveUnion(props.stateMachine, (x) => {
      return x.stateMachineArn;
    }));

    if (this.input) {
      this.addInput('input', this.input);
    }
    if (this.name) {
      this.addInput('name', this.name);
    }
  }
}