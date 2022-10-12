import { Lazy } from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IConstruct } from 'constructs';


export interface HiveJsonInputSerDeOptions {
  readonly timestampFormats?: string[];
}

export interface OpenxJsonInputSerDeOptions {
  readonly caseInsensitive?: boolean;
  readonly columnKeyMappings?: {[key: string]: string};
  readonly convertDotsToUnderscores?: boolean;
}

export abstract class InputFormat {
  public static hiveJson(options: HiveJsonInputSerDeOptions): HiveJsonInputSerDe {
    return new HiveJsonInputSerDe(options);
  }

  public static openxJson(options: OpenxJsonInputSerDeOptions): OpenxJsonInputSerDe {
    return new OpenxJsonInputSerDe(options);
  }

  public abstract bind(scope: IConstruct): CfnDeliveryStream.InputFormatConfigurationProperty;
}

export class HiveJsonInputSerDe extends InputFormat {
  // Internal properties
  private readonly _timestampFormats: string[] = [];


  public constructor(options: HiveJsonInputSerDeOptions = {}) {
    super();

    options.timestampFormats?.forEach((x) => {
      this.addTimestampFormat(x);
    });
  }

  public addTimestampFormat(format: string): HiveJsonInputSerDe {
    this._timestampFormats.push(format);
    return this;
  }

  public bind(_scope: IConstruct): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        hiveJsonSerDe: {
          timestampFormats: Lazy.list(
            {
              produce: () => {
                return this._timestampFormats;
              },
            },
            {
              omitEmpty: true,
            },
          ),
        },
      },
    };
  }
}

export class OpenxJsonInputSerDe extends InputFormat {
  // Internal properties
  private readonly _columnKeyMappings: {[key: string]: string} = {};

  // Input properties
  public readonly caseInsensitive?: boolean;
  public readonly convertDotsToUnderscores?: boolean;


  public constructor(options: OpenxJsonInputSerDeOptions = {}) {
    super();

    this.caseInsensitive = options.caseInsensitive;
    this.convertDotsToUnderscores = options.convertDotsToUnderscores;

    if (options.columnKeyMappings) {
      const mapping = options.columnKeyMappings;
      Object.keys(mapping).forEach((x) => {
        this.addColumnKeyMapping(x, mapping[x]);
      });
    }
  }

  public addColumnKeyMapping(columnName: string, jsonKey: string): OpenxJsonInputSerDe {
    this._columnKeyMappings[columnName] = jsonKey;
    return this;
  }

  public bind(_scope: IConstruct): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        openXJsonSerDe: {
          caseInsensitive: this.caseInsensitive,
          columnToJsonKeyMappings: Lazy.any({
            produce: () => {
              return !!Object.keys(this._columnKeyMappings).length ? this._columnKeyMappings : undefined;
            },
          }),
          convertDotsInJsonKeysToUnderscores: this.convertDotsToUnderscores,
        },
      },
    };
  }
}
