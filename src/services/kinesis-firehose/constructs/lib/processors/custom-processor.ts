import { DeliveryStreamProcessor, ProcessorType } from './delivery-stream-processor';


export interface CustomProcessorOptions {
  readonly processorType: ProcessorType;
  readonly parameters?: {[name: string]: string};
}

export class CustomProcessor extends DeliveryStreamProcessor {
  public constructor(options: CustomProcessorOptions) {
    super({
      processorType: options.processorType,
      parameters: options.parameters,
    });
  }

  public addParameter(name: string, value: string): void {
    super.addProcessorParameter(name, value);
  }
}
