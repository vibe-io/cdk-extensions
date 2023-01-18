import { IConstruct } from "constructs";
import { IAlertManagerDestination } from "./destination-base";


export interface AlertManagerReceiverProps {
  readonly destinations?: IAlertManagerDestination[];
  readonly name: string;
}

/**
 * Represents a notification integration within alert manager.
 * 
 * @see [Receiver configuration](https://prometheus.io/docs/alerting/latest/configuration/#receiver)
 */
export class AlertManagerReceiver {
  // Internal properties
  private readonly _destinations: IAlertManagerDestination[];

  // Input properties
  public readonly name: string;

  public get destinations(): IAlertManagerDestination[] {
    return [...this.destinations];
  }



  public constructor(options: AlertManagerReceiverProps) {
    this._destinations = [];

    this.name = options.name;

    options.destinations?.forEach((x) => {
      this.addDestination(x);
    });
  }


  public addDestination(destination: IAlertManagerDestination): AlertManagerReceiver {
    this._destinations.push(destination);
    return this;
  }

  public addSnsTopic(): AlertManagerReceiver {
    return this;
  }

  public bind(scope: IConstruct): { [key: string]: any } {
    const destination_configs: { [key: string]: { [key: string]: any }[] } = {};
    this._destinations.forEach((x) => {
      const config_group = destination_configs[x.category.name] ?? [];
      const resolved_config = x.bind(scope);
      config_group.push(resolved_config);
      destination_configs[x.category.name] = config_group;
    });

    return {
      ...destination_configs,
      name: this.name
    }
  }
}