import { Lazy } from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IConstruct } from 'constructs';


export class ProcessorType {
  public static readonly APPEND_DELIMITER_TO_RECORD = ProcessorType.of('AppendDelimiterToRecord');
  public static readonly LAMBDA = ProcessorType.of('Lambda');
  public static readonly METADATA_EXTRACTION = ProcessorType.of('MetadataExtraction');
  public static readonly RECORD_DEAGGREGATION = ProcessorType.of('RecordDeAggregation');

  public static of(name: string): ProcessorType {
    return new ProcessorType(name);
  }


  /**
     * The name of the processor to apply to the delivery stream.
     */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

export interface DeliveryStreamProcessorOptions {
  readonly processorType: ProcessorType;
  readonly parameters?: {[name: string]: string};
}

export class DeliveryStreamProcessor {
  // Internal properties
  private readonly _parameters: {[name: string]: string} = {};

  // Input properties
  public readonly processorType: ProcessorType;

  protected constructor(options: DeliveryStreamProcessorOptions) {
    this.processorType = options.processorType;

    if (options.parameters) {
      const params = options.parameters;
      Object.keys(params).forEach((x) => {
        this.addProcessorParameter(x, params[x]);
      });
    }
  }

  protected addProcessorParameter(name: string, value: string): void {
    this._parameters[name] = value;
  }

  public bind(_scope: IConstruct): CfnDeliveryStream.ProcessorProperty {
    return {
      type: this.processorType.name,
      parameters: Lazy.any({
        produce: () => {
          return Object.keys(this._parameters).map((x) => {
            return {
              parameterName: x,
              parameterValue: this._parameters[x],
            };
          });
        },
      }),
    };
  }
}