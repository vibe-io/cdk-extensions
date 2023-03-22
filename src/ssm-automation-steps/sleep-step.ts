import { Duration } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { DocumentReference } from "../ssm/lib/document-reference";
import { StepBase, StepBaseProps } from "./step-base";


export interface ISleepDelay {
  readonly inputKey: string;
  readonly inputValue: string;
}

export class SleepDelay {
  public static duration(value: Duration | DocumentReference): ISleepDelay {
    return {
      inputKey: 'Duration',
      inputValue: DocumentReference.isReference(value) ? value.valueAsString : `PT${value.toSeconds()}S`,
    };
  }

  public static timestamp(value: string): ISleepDelay {
    return {
      inputKey: 'Timestamp',
      inputValue: value,
    };
  }
}

export interface SleepStepProps extends StepBaseProps {
  readonly delay: ISleepDelay,
}

export class SleepStep extends StepBase {
  public constructor(scope: IConstruct, id: string, props: SleepStepProps) {
    super(scope, id, props);

    this.addInput(props.delay.inputKey, props.delay.inputValue);
  }
}