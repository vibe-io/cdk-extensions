import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { IConstruct } from "constructs";
import { nextAvailableId } from "../../../utils/tree";
import { CommandActionBase } from "./plugin-base";
import { AssetHashType } from "aws-cdk-lib";

import path = require("path");


export class CommandApplicationsAction {
  public static readonly INSTALL: CommandApplicationsAction = CommandApplicationsAction.of('Install');
  public static readonly REPAIR: CommandApplicationsAction = CommandApplicationsAction.of('Repair');
  public static readonly UNINSTALL: CommandApplicationsAction = CommandApplicationsAction.of('Uninstall');

  public static of(value: string): CommandApplicationsAction {
    return new CommandApplicationsAction(value);
  }


  private constructor(public readonly value: string) {}
}

export interface CommandApplicationsSourceResult {
  readonly hash?: string;
  readonly url: string;
}

export interface ICommandApplicationsSource {
  bind(scope: IConstruct): CommandApplicationsSourceResult;
}

export interface CommandApplicationsSourceAssetProps {
  readonly path: string;
}

export class CommandApplicationsSource {
  public static fromAsset(props: CommandApplicationsSourceAssetProps): ICommandApplicationsSource {
    return {
      bind: (scope: IConstruct) => {
        const assetId = nextAvailableId(scope, 'command-applications-asset');

        const asset = new Asset(scope, assetId, {
          assetHashType: AssetHashType.SOURCE,
          path: path.join(__dirname, props.path),
        });

        return {
          hash: asset.assetHash,
          url: asset.httpUrl,
        };
      }
    };
  }

  public static fromUrl(url: string, hash?: string): ICommandApplicationsSource {
    return {
      bind: (_scope: IConstruct) => {
        return {
          hash: hash,
          url: url,
        };
      }
    };
  }
}

export interface CommandApplicationsStepProps {
  readonly action: CommandApplicationsAction;
  readonly parameters?: string;
  readonly source: ICommandApplicationsSource;
  readonly stepName: string;
}

export class CommandApplicationsStep extends CommandActionBase {
  public readonly action: CommandApplicationsAction;
  public readonly parameters?: string;
  public readonly source: ICommandApplicationsSource;


  public constructor(props: CommandApplicationsStepProps) {
    super({
      actionName: 'aws:applications',
      stepName: props.stepName,
      inputs: {
        'action': props.action.value,
      }
    });

    this.action = props.action;
    this.parameters = props.parameters;
    this.source = props.source;

    if (this.parameters) {
      this.addInput('parameters', this.parameters);
    }
  }

  public bind(scope: IConstruct): {[key: string]: any} {
    const source = this.source.bind(scope);
    this.addInput('source', source.url);
    if (source.hash) {
      this.addInput('sourceHash', source.hash);
    }

    return super.bind(scope);
  }
}