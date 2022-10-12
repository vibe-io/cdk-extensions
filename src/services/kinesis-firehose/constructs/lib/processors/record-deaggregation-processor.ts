import { DeliveryStreamProcessor, ProcessorType } from './delivery-stream-processor';


export class SubRecordType {
  public static readonly DELIMITED = SubRecordType.of('DELIMITED');
  public static readonly JSON = SubRecordType.of('JSON');

  public static of(name: string) {
    return new SubRecordType(name);
  }

  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

export interface DelimitedDeaggregationOptions {
  readonly delimiter: string;
}

export interface RecordDeaggregationProcessorOptions {
  readonly delimiter?: string;
  readonly subRecordType: SubRecordType;
}

export class RecordDeaggregationProcessor extends DeliveryStreamProcessor {
  public static delimited(options: DelimitedDeaggregationOptions): RecordDeaggregationProcessor {
    return new RecordDeaggregationProcessor({
      subRecordType: SubRecordType.DELIMITED,
      ...options,
    });
  }

  public static json(): RecordDeaggregationProcessor {
    return new RecordDeaggregationProcessor({
      subRecordType: SubRecordType.JSON,
    });
  }


  // Input properties
  public readonly delimiter?: string;
  public readonly subRecordType: SubRecordType;


  public constructor(options: RecordDeaggregationProcessorOptions) {
    super({
      processorType: ProcessorType.RECORD_DEAGGREGATION,
    });

    this.delimiter = options.delimiter;
    this.subRecordType = options.subRecordType;

    this.addProcessorParameter('SubRecordType', this.subRecordType.name);
    if (this.delimiter) {
      this.addProcessorParameter('Delimiter', this.delimiter);
    }
  }
}
