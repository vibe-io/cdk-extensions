import { CommandApplicationsStep, CommandApplicationsStepProps } from "./applications-step";
import { RunPowershellScriptStep, RunPowershellScriptStepProps } from "./run-powershell-script-step";
import { RunShellScriptStep, RunShellScriptStepProps } from "./run-shell-script-step";


export class CommandStep {
  public static applications(props: CommandApplicationsStepProps): CommandApplicationsStep {
    return new CommandApplicationsStep(props);
  }

  public static runPowershellScript(props: RunPowershellScriptStepProps): RunPowershellScriptStep {
    return new RunPowershellScriptStep(props);
  }

  public static runShellScript(props: RunShellScriptStepProps): RunShellScriptStep {
    return new RunShellScriptStep(props);
  }
}