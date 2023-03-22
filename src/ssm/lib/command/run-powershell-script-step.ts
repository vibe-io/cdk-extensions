import { Duration } from "aws-cdk-lib";
import { IRunScriptStepCommand, RunScriptStep } from "./run-script-step";


export interface RunPowershellScriptStepProps {
  readonly command: IRunScriptStepCommand;
  readonly stepName: string;
  readonly timeout?: Duration;
  readonly workingDirectory?: string;
}

export class RunPowershellScriptStep extends RunScriptStep {
  public constructor(props: RunPowershellScriptStepProps) {
    super({
      ...props,
      actionName: 'aws:runPowerShellScript'
    });
  }
}