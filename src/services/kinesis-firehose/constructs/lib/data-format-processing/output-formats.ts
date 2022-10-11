import { Lazy } from "aws-cdk-lib";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { IConstruct } from "constructs";


export enum OrcCompressionFormat {
    NONE = 'NONE',
    SNAPPY = 'SNAPPY',
    ZLIB = 'ZLIB'
}

export enum OrcFormatVersion {
    V0_11 = 'V0_11',
    V0_12 = 'V0_12'
}

export enum ParquetCompressionFormat {
    GZIP = 'GZIP',
    SNAPPY = 'SNAPPY',
    UNCOMPRESSED = 'UNCOMPRESSED'
}

export enum ParquetWriterVersion {
    V1 = 'V1',
    V2 = 'V2'
}

export interface OrcOutputSerDeOptions {
    readonly blockSizeBytes?: number;
    readonly bloomFilterColumns?: string[];
    readonly bloomFilterFalsePositiveProbability?: number;
    readonly compression?: OrcCompressionFormat;
    readonly dictionaryKeyThreshold?: number;
    readonly enablePadding?: boolean;
    readonly formatVersion?: OrcFormatVersion;
    readonly paddingTolerance?: number;
    readonly rowIndexStride?: number;
    readonly stripeSizeBytes?: number;
}

export interface ParquetOutputSerDeOptions {
    readonly blockSizeBytes?: number;
    readonly compression?: ParquetCompressionFormat;
    readonly enableDictionaryCompression?: boolean;
    readonly maxPaddingBytes?: number;
    readonly pageSizeBytes?: number;
    readonly writerVersion?: ParquetWriterVersion;
}

export abstract class OutputFormat {
    public static orc(options: OrcOutputSerDeOptions): OrcOutputSerDe {
        return new OrcOutputSerDe(options);
    }

    public static parquet(options: ParquetOutputSerDeOptions): ParquetOutputSerDe {
        return new ParquetOutputSerDe(options);
    }

    public abstract bind(scope: IConstruct): CfnDeliveryStream.OutputFormatConfigurationProperty;
}

export class OrcOutputSerDe extends OutputFormat {
    // Internal properties
    private readonly _bloomFilterColumns: string[] = [];

    // Input properties
    public readonly blockSizeBytes?: number;
    public readonly bloomFilterColumns?: string[];
    public readonly bloomFilterFalsePositiveProbability?: number;
    public readonly compression?: OrcCompressionFormat;
    public readonly dictionaryKeyThreshold?: number;
    public readonly enablePadding?: boolean;
    public readonly formatVersion?: OrcFormatVersion;
    public readonly paddingTolerance?: number;
    public readonly rowIndexStride?: number;
    public readonly stripeSizeBytes?: number;


    public constructor(options: OrcOutputSerDeOptions = {}) {
        super();

        this.blockSizeBytes = options.blockSizeBytes;
        this.bloomFilterFalsePositiveProbability = options.bloomFilterFalsePositiveProbability;
        this.compression = options.compression;
        this.dictionaryKeyThreshold = options.dictionaryKeyThreshold;
        this.enablePadding = options.enablePadding;
        this.formatVersion = options.formatVersion;
        this.paddingTolerance = options.paddingTolerance;
        this.rowIndexStride = options.rowIndexStride;
        this.stripeSizeBytes = options.stripeSizeBytes;
    }

    public addBloomFilterColumn(column: string): OrcOutputSerDe {
        this._bloomFilterColumns.push(column);
        return this;
    }

    public bind(_scope: IConstruct): CfnDeliveryStream.OutputFormatConfigurationProperty {
        return {
            serializer: {
                orcSerDe: {
                    blockSizeBytes: this.blockSizeBytes,
                    bloomFilterColumns: Lazy.list(
                        {
                            produce: () => {
                                return this._bloomFilterColumns;
                            }
                        },
                        {
                            omitEmpty: true
                        }
                    ),
                    bloomFilterFalsePositiveProbability: this.bloomFilterFalsePositiveProbability,
                    compression: this.compression,
                    dictionaryKeyThreshold: this.dictionaryKeyThreshold,
                    enablePadding: this.enablePadding,
                    formatVersion: this.formatVersion,
                    paddingTolerance: this.paddingTolerance,
                    rowIndexStride: this.rowIndexStride,
                    stripeSizeBytes: this.stripeSizeBytes
                }
            }
        }
    }
}

export class ParquetOutputSerDe extends OutputFormat {
    // Input properties
    public readonly blockSizeBytes?: number;
    public readonly compression?: ParquetCompressionFormat;
    public readonly enableDictionaryCompression?: boolean;
    public readonly maxPaddingBytes?: number;
    public readonly pageSizeBytes?: number;
    public readonly writerVersion?: ParquetWriterVersion;


    public constructor(options: ParquetOutputSerDeOptions = {}) {
        super();

        this.blockSizeBytes = options.blockSizeBytes;
        this.compression = options.compression;
        this.enableDictionaryCompression = options.enableDictionaryCompression;
        this.maxPaddingBytes = options.maxPaddingBytes;
        this.pageSizeBytes = options.pageSizeBytes;
        this.writerVersion = options.writerVersion;
    }

    public bind(_scope: IConstruct): CfnDeliveryStream.OutputFormatConfigurationProperty {
        return {
            serializer: {
                parquetSerDe: {
                    blockSizeBytes: this.blockSizeBytes,
                    compression: this.compression,
                    enableDictionaryCompression: this.enableDictionaryCompression,
                    maxPaddingBytes: this.maxPaddingBytes,
                    pageSizeBytes: this.pageSizeBytes,
                    writerVersion: this.writerVersion
                }
            }
        }
    }
}
