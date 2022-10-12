import { ArnFormat, Stack } from 'aws-cdk-lib';
import { Effect, IRole, PolicyStatement, PrincipalWithConditions, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IConstruct } from 'constructs';
import { Database } from '../../../../glue/constructs/database';
import { Table } from '../../../../glue/constructs/table';
import { InputFormat } from './input-formats';
import { OutputFormat } from './output-formats';


export class TableVersion {
  public static readonly LATEST = new TableVersion('LATEST');

  public static fixed(version: number): TableVersion {
    if (version < 1 || version > 1024) {
      throw new Error(`Table version  must be between 1 and 1024. Got ${version}`);
    }

    return new TableVersion(version.toString());
  }

  public readonly version: string;

  private constructor(version: string) {
    this.version = version;
  }
}

export interface DataFormatConversionOptions {
  readonly catalogId?: string;
  readonly database: Database;
  readonly enabled?: boolean;
  readonly inputFormat: InputFormat;
  readonly outputFormat: OutputFormat;
  readonly region?: string;
  readonly role?: IRole;
  readonly table: Table;
  readonly version?: TableVersion;
}

export class DataFormatConversion {
  // Internal properties
  private _role?: IRole;

  // Input properties
  public readonly catalogId?: string;
  public readonly database: Database;
  public readonly enabled: boolean;
  public readonly inputFormat: InputFormat;
  public readonly outputFormat: OutputFormat;
  public readonly region?: string;
  public readonly table: Table;
  public readonly version?: TableVersion;

  // Internal accessors
  public get role(): IRole | undefined {
    return this._role;
  }


  public constructor(options: DataFormatConversionOptions) {
    this.catalogId = options.catalogId;
    this.database = options.database;
    this.enabled = options.enabled ?? true;
    this.inputFormat = options.inputFormat;
    this.outputFormat = options.outputFormat;
    this.region = options.region;
    this._role = options.role;
    this.table = options.table;
    this.version = options.version;
  }

  public bind(scope: IConstruct): CfnDeliveryStream.DataFormatConversionConfigurationProperty {
    const role = this.role ?? new Role(scope, 'delivery-stream-data-format-conversion-role', {
      assumedBy: new PrincipalWithConditions(
        new ServicePrincipal('firehose.amazonaws.com'),
        {
          StringEquals: {
            'sts:ExternalId': Stack.of(scope).account,
          },
        },
      ),
      description: 'Grants permissions to Kinesis Firehose to access Glue.',
    });

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'glue:GetTableVersions',
      ],
      effect: Effect.ALLOW,
      resources: [
        Stack.of(this.database).formatArn({
          arnFormat: ArnFormat.NO_RESOURCE_NAME,
          resource: 'catalog',
          service: 'glue',
        }),
        this.database.databaseArn,
        this.table.tableArn,
      ],
    }));

    this._role = role;

    return {
      enabled: this.enabled,
      inputFormatConfiguration: this.inputFormat.bind(scope),
      outputFormatConfiguration: this.outputFormat.bind(scope),
      schemaConfiguration: {
        catalogId: this.catalogId ?? Stack.of(scope).account,
        databaseName: this.database.databaseName,
        region: this.region,
        roleArn: role.roleArn,
        tableName: this.table.tableName,
        versionId: this.version?.version,
      },
    };
  }
}