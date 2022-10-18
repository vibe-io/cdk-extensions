import { Lazy } from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../../../../../utils/formatting';
import { BackupConfiguration } from '../backup-configuration';
import { DataFormatConversion } from '../data-format-processing/data-format-conversion';
import { DynamicPartitioning } from '../dynamic-partitioning';
import { ProcessorConfiguration } from '../processor-configuration';
import { DeliveryStreamProcessor } from '../processors/delivery-stream-processor';
import { DeliveryStreamDestinationConfiguration } from './delivery-stream-destination';
import { S3Destination, S3DestinationOptions } from './s3-destination';


export interface ExtendedS3DestinationOptions extends S3DestinationOptions {
  readonly backupConfiguration?: BackupConfiguration;
  readonly dataFormatConversion?: DataFormatConversion;
  readonly dynamicPartitioning?: DynamicPartitioning;
  readonly processorConfiguration?: ProcessorConfiguration;
}

export class ExtendedS3Destination extends S3Destination {
  // Internal properties
  private _processingEnabled?: boolean;
  private _processors: DeliveryStreamProcessor[] = [];

  // Input properties
  public readonly backupConfiguration?: BackupConfiguration;
  public readonly dataFormatConversion?: DataFormatConversion;
  public readonly dynamicPartitioning?: DynamicPartitioning;
  public readonly processorConfiguration?: ProcessorConfiguration;

  // Internal accessors
  public get processingEnabled(): boolean {
    return this._processingEnabled ?? !!this._processors?.length;
  }

  public get processors(): DeliveryStreamProcessor[] {
    return [...this._processors];
  }


  public constructor(bucket: IBucket, options: ExtendedS3DestinationOptions = {}) {
    super(bucket, options);

    this.backupConfiguration = options.backupConfiguration;
    this.dataFormatConversion = options.dataFormatConversion;
    this.dynamicPartitioning = options.dynamicPartitioning;
    this.processorConfiguration = options.processorConfiguration;
  }

  public addProcessor(processor: DeliveryStreamProcessor): ExtendedS3Destination {
    this._processors.push(processor);
    return this;
  }

  public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration {
    const processorConfiguration = this.processorConfiguration?.bind(scope);

    this._processingEnabled = processorConfiguration?.enabled;
    processorConfiguration?.processors.forEach((x) => {
      this.addProcessor(x);
    });

    const dynamicPartitioningConfiguration = this.dynamicPartitioning?.bind(scope);
    const dataFormatConversion = this.dataFormatConversion?.bind(scope);

    dynamicPartitioningConfiguration?.processors?.forEach((x) => {
      this.addProcessor(x);
    });

    if (dynamicPartitioningConfiguration?.partitioningConfiguration.enabled && (this.buffering?.sizeInMb ?? 64) < 64) {
      throw new Error('When dynamic partitioning is enabled buffer size must be at least 64MB.');
    }

    return {
      extendedS3DestinationConfiguration: {
        ...this.buildConfiguration(scope),
        ...(this.backupConfiguration?.bind(scope) ?? {}),
        dataFormatConversionConfiguration: dataFormatConversion,
        dynamicPartitioningConfiguration: dynamicPartitioningConfiguration?.partitioningConfiguration,
        processingConfiguration: Lazy.any({
          produce: () => {
            return this.renderProcessorConfiguration(scope);
          },
        }),
      },
    };
  }

  protected renderProcessorConfiguration(scope: IConstruct): CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
    return definedFieldsOrUndefined({
      enabled: this.processingEnabled,
      processors: this._processors.map((x) => {
        return x.bind(scope);
      }),
    });
  }
}