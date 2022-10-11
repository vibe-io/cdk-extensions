import { Duration, Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../../../utils/formatting';
import { DataFormat } from './lib/data-format';
import { Database } from './database';
import { Column } from './lib/column';


export enum TableType {
    EXTERNAL_TABLE = 'EXTERNAL_TABLE',
    VIRTUAL_VIEW = 'VIRTUAL_VIEW'
}

/**
 * Configuration for Table
 */
export interface TableProps extends ResourceProps {
    readonly columns?: Column[];
    readonly compressed?: boolean;
    readonly dataFormat?: DataFormat;
    readonly database: Database;
    readonly description?: string;
    readonly location?: string;
    readonly name?: string;
    readonly owner?: string;
    readonly parameters?: {[key: string]: string};
    readonly partitionKeys?: Column[];
    readonly retention?: Duration;
    readonly serdeName?: string;
    readonly serdeParameters?: {[key: string]: string};
    readonly storageParameters?: {[key: string]: string};
    readonly storedAsSubDirectories?: boolean;
    readonly tableType?: TableType;
    readonly targetTable?: Table;
    readonly viewExpandedText?: string;
    readonly viewOriginalText?: string;
}

export class Table extends Resource {
    // Internal properties
    private readonly _columns: Column[] = [];
    private readonly _parameters: {[key: string]: string} = {};
    private readonly _partitionKeys: Column[] = [];
    private readonly _serdeParameters: {[key: string]: string} = {};
    private readonly _storageParameters: {[key: string]: string} = {};

    // Input properties
    public readonly compressed?: boolean;
    public readonly dataFormat?: DataFormat;
    public readonly database: Database;
    public readonly description?: string;
    public readonly location?: string;
    public readonly name?: string;
    public readonly owner?: string;
    public readonly retention?: Duration;
    public readonly serdeName?: string;
    public readonly tableType?: TableType;
    public readonly targetTable?: Table;
    public readonly viewExpandedText?: string;
    public readonly viewOriginalText?: string;
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
                        }
                    },
                    {
                        omitEmptyArray: true
                    }
                ),
                partitionKeys: Lazy.any(
                    {
                        produce: () => {
                            return this._partitionKeys.map((x) => {
                                return x.bind(this);
                            });
                        }
                    },
                    {
                        omitEmptyArray: true
                    }
                ),
                retention: this.retention?.toSeconds(),
                storageDescriptor: Lazy.any({
                    produce: () => {
                        return this.renderStorageDescriptor();
                    }
                }),
                tableType: this.tableType,
                targetTable: !!!this.targetTable ? undefined : {
                    catalogId: this.targetTable!.database.catalogId,
                    databaseName: this.targetTable!.database.databaseName,
                    name: this.targetTable!.tableName
                },
                viewExpandedText: this.viewExpandedText,
                viewOriginalText: this.viewOriginalText
            }
        });

        this.tableArn = this.stack.formatArn({
            resource: 'table',
            resourceName: `${this.database.databaseName}/${this.resource.ref}`,
            service: 'glue'
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
                serializationLibrary: this.dataFormat?.serializationLibrary.className
            }),
            storedAsSubDirectories: this.storedAsSubDirectories
        });
    }
}
