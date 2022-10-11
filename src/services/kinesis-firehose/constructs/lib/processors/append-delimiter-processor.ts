import { DeliveryStreamProcessor, ProcessorType } from "./delivery-stream-processor";


export interface AppendDelimiterProcessorOptions {
    readonly delimiter: string;
}

export class AppendDelimiterProcessor extends DeliveryStreamProcessor {
    // Input properties
    readonly delimiter: string;
    

    public constructor(options: AppendDelimiterProcessorOptions) {
        super({
            processorType: ProcessorType.APPEND_DELIMITER_TO_RECORD,
            parameters: {
                Delimiter: options.delimiter
            }
        });

        this.delimiter = options.delimiter;
    }
}