import { Duration } from "aws-cdk-lib";
import { IRunScriptStepCommand, RunScriptStep } from "./run-script-step";


export interface RunShellScriptStepProps {
  readonly command: IRunScriptStepCommand;
  readonly stepName: string;
  readonly timeout?: Duration;
  readonly workingDirectory?: string;
}

export class RunShellScriptStep extends RunScriptStep {
  public constructor(props: RunShellScriptStepProps) {
    super({
      ...props,
      actionName: 'aws:runShellScript'
    });
  }
}