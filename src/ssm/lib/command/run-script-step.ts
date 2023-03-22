import { IConstruct } from "constructs";
import { CommandActionBase } from "./plugin-base";
import { readFileSync } from "fs";
import { Duration } from "aws-cdk-lib";


export interface RunScriptStepCommandResult {
  readonly content: string[];
}

export interface IRunScriptStepCommand {
  bind(scope: IConstruct): RunScriptStepCommandResult;
}

export interface RunScriptCommandFileProps {
  readonly path: string;
}

export interface RunScriptCommandInlineListProps {
  readonly content: string[];
}

export interface RunScriptCommandInlineStringProps {
  readonly content: string;
}

export class RunScriptStepCommand {
  public static fromFile(props: RunScriptCommandFileProps): IRunScriptStepCommand {
    return {
      bind: (_scope: IConstruct) => {
        const contents = readFileSync(props.path, {
          encoding: 'utf8',
          flag: 'r',
        });

        return {
          content: [
            contents,
          ],
        };
      }
    };
  }

  public static fromInlineList(props: RunScriptCommandInlineListProps): IRunScriptStepCommand {
    return {
      bind: (_scope: IConstruct) => {
        return {
          content: props.content,
        };
      }
    };
  }

  public static fromInlineString(props: RunScriptCommandInlineStringProps): IRunScriptStepCommand {
    return {
      bind: (_scope: IConstruct) => {
        return {
          content: [
            props.content
          ],
        };
      }
    };
  }
}

export interface RunScriptStepProps {
  readonly actionName: string;
  readonly command: IRunScriptStepCommand;
  readonly stepName: string;
  readonly timeout?: Duration;
  readonly workingDirectory?: string;
}

export class RunScriptStep extends CommandActionBase {
  public readonly command: IRunScriptStepCommand;
  public readonly timeout?: Duration;
  public readonly workingDirectory?: string;


  public constructor(props: RunScriptStepProps) {
    super({
      actionName: props.actionName,
      stepName: props.stepName,
    });

    this.command = props.command;
    this.timeout = props.timeout;
    this.workingDirectory = props.workingDirectory;

    if (this.timeout) {
      this.addInput('timeoutSeconds', this.timeout.toSeconds());
    }

    if (this.workingDirectory) {
      this.addInput('workingDirectory', this.workingDirectory);
    }
  }

  public bind(scope: IConstruct): {[key: string]: any} {
    this.addInput('runCommand', this.command.bind(scope).content);

    return super.bind(scope);
  }
}