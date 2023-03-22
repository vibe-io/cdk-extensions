import { IConstruct } from "constructs";
import { ApproveStep, ApproveStepProps } from "./approve-step";
import { AssertAwsResourcePropertyStep, AssertAwsResourcePropertyStepProps } from "./assert-aws-resource-property-step";
import { CopyImageStep, CopyImageStepProps } from "./copy-image-step";
import { DeleteImageStep, DeleteImageStepProps } from "./delete-image-step";
import { ExecuteAwsApiCallStep, ExecuteAwsApiCallStepProps } from "./execute-aws-api-call";
import { ExecuteStateMachineStep, ExecuteStateMachineStepProps } from "./execute-state-machine-step";
import { PauseStep, PauseStepProps } from "./pause-step";
import { SleepStep, SleepStepProps } from "./sleep-step";
import { WaitForAwsResourcePropertyStep, WaitForAwsResourcePropertyStepProps } from "./wait-for-aws-resource-property-step";


export class Step {
  public static approve(
    scope: IConstruct,
    id: string,
    props: ApproveStepProps
  ): ApproveStep {
    return new ApproveStep(scope, id, props);
  }

  public static assertAwsResourceProperty(
    scope: IConstruct,
    id: string,
    props: AssertAwsResourcePropertyStepProps
  ): AssertAwsResourcePropertyStep {
    return new AssertAwsResourcePropertyStep(scope, id, props);
  }

  public static copyImage(
    scope: IConstruct,
    id: string,
    props: CopyImageStepProps
  ): CopyImageStep {
    return new CopyImageStep(scope, id, props);
  }

  public static deleteImage(
    scope: IConstruct,
    id: string,
    props: DeleteImageStepProps
  ): DeleteImageStep {
    return new DeleteImageStep(scope, id, props);
  }

  public static executeAwsApiCall(
    scope: IConstruct,
    id: string,
    props: ExecuteAwsApiCallStepProps
  ): ExecuteAwsApiCallStep {
    return new ExecuteAwsApiCallStep(scope, id, props);
  }

  public static executeStateMachine(
    scope: IConstruct,
    id: string,
    props: ExecuteStateMachineStepProps
  ): ExecuteStateMachineStep {
    return new ExecuteStateMachineStep(scope, id, props);
  }

  public static pause(
    scope: IConstruct,
    id: string,
    props: PauseStepProps
  ): PauseStep {
    return new PauseStep(scope, id, props);
  }

  public static sleep(
    scope: IConstruct,
    id: string,
    props: SleepStepProps
  ): SleepStep {
    return new SleepStep(scope, id, props);
  }

  public static waitForAwsResourceProperty(
    scope: IConstruct,
    id: string,
    props: WaitForAwsResourcePropertyStepProps
  ): WaitForAwsResourcePropertyStep {
    return new WaitForAwsResourcePropertyStep(scope, id, props);
  }
}