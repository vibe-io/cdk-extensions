import { IConstruct } from 'constructs';
import { DeliveryStreamProcessor } from './processors/delivery-stream-processor';


export interface ProcessorConfigurationResult {
  readonly enabled?: boolean;
  readonly processors: DeliveryStreamProcessor[];
}

export interface ProcessorConfigurationOptions {
  readonly enabled?: boolean;
  readonly processors?: DeliveryStreamProcessor[];
}

export class ProcessorConfiguration {
  public readonly enabled?: boolean;
  public readonly processors?: DeliveryStreamProcessor[];

  public constructor(options: ProcessorConfigurationOptions) {
    this.processors = options.processors;
    this.enabled = options.enabled ?? ((options.processors?.length ?? 0) > 0);
  }

  public bind(_scope: IConstruct): ProcessorConfigurationResult {
    return {
      enabled: this.enabled,
      processors: this.processors ?? [],
    };
  }
}
