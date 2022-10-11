import { MetaDataExtractionQuery } from "../metadata-extraction-query";
import { DeliveryStreamProcessor, ProcessorType } from "./delivery-stream-processor";


export enum JsonParsingEngine {
    JQ_1_6 = 'JQ-1.6'
}

export interface MetadataExtractionProcessorOptions {
    readonly engine?: JsonParsingEngine;
    readonly query: MetaDataExtractionQuery;
}

export class MetadataExtractionProcessor extends DeliveryStreamProcessor {
    readonly engine: JsonParsingEngine;
    readonly query: MetaDataExtractionQuery;


    public constructor(options: MetadataExtractionProcessorOptions) {
        super({
            processorType: ProcessorType.METADATA_EXTRACTION
        });

        this.engine = options.engine ?? JsonParsingEngine.JQ_1_6;
        this.query = options.query;

        this.addParameter('JsonParsingEngine', this.engine);
        this.addParameter('MetadataExtractionQuery', this.query.render());
    }
}
