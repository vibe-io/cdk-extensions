import { Annotations, Lazy } from "aws-cdk-lib";
import { CfnTable } from "aws-cdk-lib/aws-glue";
import { IConstruct } from "constructs";

export interface ColumnProps {
    readonly comment?: string;
    readonly name?: string;
}

export abstract class Column {
    public readonly comment?: string;
    public readonly name?: string;

    public abstract getTypeString(): string;

    public bind(scope: IConstruct): CfnTable.ColumnProperty {
        if (!this.name) {
            Annotations.of(scope).addError([
                'Names are required for all Glue Table columns that are not',
                'immediately inside an array'
            ].join(' '));
        }

        return {
            comment: this.comment,
            name: this.name ?? '<unknown>',
            type: this.getTypeString()
        };
    }

    constructor(props: ColumnProps) {
        this.comment = props.comment;
        this.name = props.name;
    }
}

export interface ArrayColumnProps extends ColumnProps {
    readonly data: Column;
}

export class ArrayColumn extends Column {
    private readonly inner: Column;

    public getTypeString(): string {
        return `array<${this.inner.getTypeString()}>`;
    }

    constructor(props: ArrayColumnProps) {
        super(props);
        this.inner = props.data;
    }
}

export interface BasicColumnProps extends ColumnProps {
    readonly type: string;
}

export class BasicColumn extends Column {
    private readonly type: string;

    public getTypeString(): string {
        return this.type;
    }

    constructor(props: BasicColumnProps) {
        super(props);
        this.type = props.type;
    }
}

export interface StructColumnProps extends ColumnProps {
    readonly data?: Column[];
}

export class StructColumn extends Column {
    private readonly inner: Column[] = [];

    public getTypeString(): string {
        return Lazy.string({
            produce: () => {
                const innerTypes = this.inner.map((x) => {
                    if (!x.name) {
                        throw new Error([
                            'Names are required for all Glue Table columns',
                            'that are not immediately inside an array'
                        ].join(' '));
                    }

                    return `${x.name}:${x.getTypeString()}`
                }).join(',');
                return `struct<${innerTypes}>`;
            }
        });
    }

    constructor(props: StructColumnProps) {
        super(props);
        props.data?.forEach((x) => {
            this.addColumn(x);
        });
    }

    public addColumn(column: Column): void {
        this.inner.push(column);
    }
}
