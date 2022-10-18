import { Duration } from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../../../utils/formatting';
import { JsonQuery } from './metadata-extraction-query';
import { DeliveryStreamProcessor } from './processors/delivery-stream-processor';
import { LambdaProcessor } from './processors/lambda-processor';
import { JsonParsingEngine, MetadataExtractionProcessor } from './processors/metadata-extraction-processor';


export interface CommonPartitioningOptions {
  readonly enabled?: boolean;
  readonly retryInterval?: Duration;
}

export interface JsonPartitioningOptions extends CommonPartitioningOptions {
  readonly partitions: {[name: string]: string};
}

export interface LambdaPartitioningOptions extends CommonPartitioningOptions {
  readonly lambdaFunction: IFunction;
}

export interface DynamicPartitioningConfiguration {
  readonly partitioningConfiguration: CfnDeliveryStream.DynamicPartitioningConfigurationProperty;
  readonly processors?: DeliveryStreamProcessor[];
}

export class DynamicPartitioning {
  // Static methods
  public static fromJson(options: JsonPartitioningOptions): JsonPartitioningSource {
    return new JsonPartitioningSource(options);
  }

  public static fromLambda(options: LambdaPartitioningOptions): LambdaPartitioningSource {
    return new LambdaPartitioningSource(options);
  }

  // Input properties
  public readonly enabled: boolean;
  public readonly retryInterval?: Duration;

  protected constructor(options: CommonPartitioningOptions) {
    this.enabled = options.enabled ?? true;
    this.retryInterval = options.retryInterval;
  }

  public bind(_scope: IConstruct): DynamicPartitioningConfiguration {
    return {
      partitioningConfiguration: {
        enabled: this.enabled,
        retryOptions: definedFieldsOrUndefined({
          durationInSeconds: this.retryInterval?.toSeconds(),
        }),
      },
    };
  }
}

export class JsonPartitioningSource extends DynamicPartitioning {
  // Internal properties
  private readonly _partitions: {[name: string]: string} = {};
  private readonly _query: JsonQuery;


  public constructor(options: JsonPartitioningOptions) {
    super(options);

    this._query = new JsonQuery();

    Object.keys(options.partitions).forEach((x) => {
      this.addPartition(x, options.partitions[x]);
    });
  }

  public addPartition(name: string, query: string): void {
    this._partitions[name] = query;
    this._query.addField(name, query);
  }

  public bind(scope: IConstruct): DynamicPartitioningConfiguration {
    const innerConfiguration = super.bind(scope);

    return {
      ...innerConfiguration,
      processors: [
        ...(innerConfiguration.processors ?? []),
        new MetadataExtractionProcessor({
          engine: JsonParsingEngine.JQ_1_6,
          query: this._query,
        }),
      ],
    };
  }
}

export class LambdaPartitioningSource extends DynamicPartitioning {
  // Input properties
  public readonly lambdaFunction: IFunction;


  public constructor(options: LambdaPartitioningOptions) {
    super(options);

    this.lambdaFunction = options.lambdaFunction;
  }

  public bind(scope: IConstruct): DynamicPartitioningConfiguration {
    const innerConfiguration = super.bind(scope);

    return {
      ...innerConfiguration,
      processors: [
        ...(innerConfiguration.processors ?? []),
        new LambdaProcessor({
          lambdaFunction: this.lambdaFunction,
        }),
      ],
    };
  }
}
