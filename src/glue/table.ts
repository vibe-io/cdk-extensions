import { Duration, Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../utils/formatting';
import { Database } from './database';
import { Column } from './lib/column';
import { DataFormat } from './lib/data-format';


export enum TableType {
  EXTERNAL_TABLE = 'EXTERNAL_TABLE',
  VIRTUAL_VIEW = 'VIRTUAL_VIEW'
}

/**
 * Configuration for Table
 */
export interface TableProps extends ResourceProps {
  /**
   * A list of the Columns in the table. 
   * 
   * @see [AWS::Glue::Table StorageDescriptor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-columns)
   */
  readonly columns?: Column[];
  /**
   *  True if the data in the table is compressed, or False if not.
   * 
   * @see [AWS::Glue::Table StorageDescriptor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-compressed)
   */
  readonly compressed?: boolean;
  /**
   * DataFormat object indicating the expected input/output format 
   */
  readonly dataFormat?: DataFormat;
  /**
   * Database object to add Table to
   */
  readonly database: Database;
  /**
   * A description for the Table 
   */
  readonly description?: string;
  /**
   * The physical location of the table. By default, this takes the form of the warehouse location, followed by the database location in the warehouse, followed by the table name. 
   * 
   * @see [AWS::Glue::Table StorageDescriptor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-location)
   */
  readonly location?: string;
  /**
   * A name for the Table 
   */
  readonly name?: string;
  /**
   * The table owner. Included for Apache Hive compatibility. Not used in the normal course of AWS Glue operations.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-owner)
   */
  readonly owner?: string;
  /**
   * These key-value pairs define properties associated with the table.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-parameters)
   */
  readonly parameters?: {[key: string]: string};
  /**
   * A list of columns by which the table is partitioned. Only primitive types are supported as partition keys.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-parameterskeys)
   */
  readonly partitionKeys?: Column[];
  /**
   * The retention time for this table.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-retention)
   */
  readonly retention?: Duration;
  /**
   * Name of the SerDe.
   * 
   * @see [AWS::Glue::Table SerdeInfo](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-name)
   */
  readonly serdeName?: string;
  /**
   * These key-value pairs define initialization parameters for the SerDe.
   * 
   * @see [AWS::Glue::Table SerdeInfo](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-parameters)
   */
  readonly serdeParameters?: {[key: string]: string};
  /**
   * The user-supplied properties in key-value form.
   * 
   * @see [AWS::Glue::Table StorageDescriptor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-parameters)
   */
  readonly storageParameters?: {[key: string]: string};
  /**
   *  True if the table data is stored in subdirectories, or False if not.
   * 
   * @see [AWS::Glue::Table StorageDescriptor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-storedassubdirectories)
   */
  readonly storedAsSubDirectories?: boolean;
  /**
   * The type of this table. AWS Glue will create tables with the EXTERNAL_TABLE type. Other services, such as Athena, may create tables with additional table types. 
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-tabletype)
   */
  readonly tableType?: TableType;
  /**
   * A TableIdentifier structure that describes a target table for resource linking.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-targettable)
   */
  readonly targetTable?: Table;
  /**
   * Included for Apache Hive compatibility. Not used in the normal course of AWS Glue operations.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-viewexpandedtext)
   */
  readonly viewExpandedText?: string;
  /**
   * Included for Apache Hive compatibility. Not used in the normal course of AWS Glue operations. If the table is a VIRTUAL_VIEW, certain Athena configuration encoded in base64.
   * 
   * @see [AWS::Glue::Table TableInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-vieworiginaltext)
   */
  readonly viewOriginalText?: string;
}

/**
 * Creates a Table resource specifying tabular data in the Glue Database
 * 
 * @see [AWS::Glue::Table](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html)
 */
export class Table extends Resource {
  // Internal properties
  private readonly _columns: Column[] = [];
  private readonly _parameters: {[key: string]: string} = {};
  private readonly _partitionKeys: Column[] = [];
  private readonly _serdeParameters: {[key: string]: string} = {};
  private readonly _storageParameters: {[key: string]: string} = {};

  // Input properties
  /**
		* {@link TableProps.compressed}
		*/
	public readonly compressed?: boolean;
  /**
		* {@link TableProps.dataFormat}
		*/
	public readonly dataFormat?: DataFormat;
  /**
		* {@link TableProps.database:}
		*/
	public readonly database: Database;
  /**
		* {@link TableProps.description}
		*/
	public readonly description?: string;
  /**
		* {@link TableProps.location}
		*/
	public readonly location?: string;
  /**
		* {@link TableProps.name}
		*/
	public readonly name?: string;
  /**
		* {@link TableProps.owner}
		*/
	public readonly owner?: string;
  /**
		* {@link TableProps.retention}
		*/
	public readonly retention?: Duration;
  /**
		* {@link TableProps.serdeName}
		*/
	public readonly serdeName?: string;
  /**
		* {@link TableProps.tableType}
		*/
	public readonly tableType?: TableType;
  /**
		* {@link TableProps.targetTable}
		*/
	public readonly targetTable?: Table;
  /**
		* {@link TableProps.viewExpandedText}
		*/
	public readonly viewExpandedText?: string;
  /**
		* {@link TableProps.viewOriginalText}
		*/
	public readonly viewOriginalText?: string;
  /**
		* {@link TableProps.storedAsSubDirectories}
		*/
	public readonly storedAsSubDirectories?: boolean;

  // Resource properties
  public readonly resource: CfnTable;

  // Standard properties
  public readonly tableArn: string;
  public readonly tableName: string;


  /**
     * Creates a new instance of the Table class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, props);

    this.compressed = props.compressed;
    this.database = props.database;
    this.dataFormat = props.dataFormat;
    this.description = props.description;
    this.location = props.location;
    this.name = props.name;
    this.owner = props.owner;
    this.retention = props.retention;
    this.serdeName = props.serdeName;
    this.tableType = props.tableType;
    this.viewExpandedText = props.viewExpandedText;
    this.viewOriginalText = props.viewOriginalText;
    this.storedAsSubDirectories = props.storedAsSubDirectories;

    Object.keys(props.parameters ?? {}).forEach((x) => {
      this.addParameter(x, props.parameters![x]);
    });

    Object.keys(props.serdeParameters ?? {}).forEach((x) => {
      this.addSerdeParameter(x, props.serdeParameters![x]);
    });

    Object.keys(props.storageParameters ?? {}).forEach((x) => {
      this.addStorageParameter(x, props.storageParameters![x]);
    });

    props.columns?.forEach((x) => {
      this.addColumn(x);
    });

    props.partitionKeys?.forEach((x) => {
      this.addPartitionKey(x);
    });

    this.resource = new CfnTable(this, 'Resource', {
      catalogId: this.stack.account,
      databaseName: this.database.databaseName,
      tableInput: {
        description: this.description,
        name: this.name,
        owner: this.owner,
        parameters: Lazy.any(
          {
            produce: () => {
              return !!Object.keys(this._parameters).length ? this._parameters : [];
            },
          },
          {
            omitEmptyArray: true,
          },
        ),
        partitionKeys: Lazy.any(
          {
            produce: () => {
              return this._partitionKeys.map((x) => {
                return x.bind(this);
              });
            },
          },
          {
            omitEmptyArray: true,
          },
        ),
        retention: this.retention?.toSeconds(),
        storageDescriptor: Lazy.any({
          produce: () => {
            return this.renderStorageDescriptor();
          },
        }),
        tableType: this.tableType,
        targetTable: !!!this.targetTable ? undefined : {
          catalogId: this.targetTable!.database.catalogId,
          databaseName: this.targetTable!.database.databaseName,
          name: this.targetTable!.tableName,
        },
        viewExpandedText: this.viewExpandedText,
        viewOriginalText: this.viewOriginalText,
      },
    });

    this.tableArn = this.stack.formatArn({
      resource: 'table',
      resourceName: `${this.database.databaseName}/${this.resource.ref}`,
      service: 'glue',
    });
    this.tableName = this.resource.ref;
  }

  public addColumn(column: Column): void {
    this._columns.push(column);
  }

  public addParameter(key: string, value: string): void {
    this._parameters[key] = value;
  }

  public addPartitionKey(column: Column): void {
    this._partitionKeys.push(column);
  }

  public addSerdeParameter(key: string, value: string): void {
    this._serdeParameters[key] = value;
  }

  public addStorageParameter(key: string, value: string): void {
    this._storageParameters[key] = value;
  }

  protected renderStorageDescriptor(): CfnTable.StorageDescriptorProperty | undefined {
    return undefinedIfNoKeys({
      columns: !!!this._columns.length ? undefined : this._columns.map((x) => {
        return x.bind(this);
      }),
      compressed: this.compressed,
      inputFormat: this.dataFormat?.inputFormat.className,
      location: this.location,
      outputFormat: this.dataFormat?.outputFormat.className,
      parameters: !!!Object.keys(this._storageParameters).length ? undefined : this._storageParameters,
      serdeInfo: undefinedIfNoKeys({
        name: this.serdeName,
        parameters: undefinedIfNoKeys(this._serdeParameters),
        serializationLibrary: this.dataFormat?.serializationLibrary.className,
      }),
      storedAsSubDirectories: this.storedAsSubDirectories,
    });
  }
}
