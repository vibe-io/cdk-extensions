import { Annotations, Lazy } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-glue';
import { IConstruct } from 'constructs';

export interface ColumnProps {
  readonly comment?: string;
  readonly name?: string;
}

export abstract class Column {
  public readonly comment?: string;
  public readonly name?: string;

  public abstract readonly typeString: string;

  public constructor(props: ColumnProps) {
    this.comment = props.comment;
    this.name = props.name;
  }

  public bind(scope: IConstruct): CfnTable.ColumnProperty {
    if (!this.name) {
      Annotations.of(scope).addError([
        'Names are required for all Glue Table columns that are not',
        'immediately inside an array',
      ].join(' '));
    }

    return {
      comment: this.comment,
      name: this.name ?? '<unknown>',
      type: this.typeString,
    };
  }
}

export interface ArrayColumnProps extends ColumnProps {
  readonly data: Column;
}

export class ArrayColumn extends Column {
  public readonly typeString: string;

  constructor(props: ArrayColumnProps) {
    super(props);
    this.typeString = `array<${props.data.typeString}>`;
  }
}

export interface BasicColumnProps extends ColumnProps {
  readonly type: string;
}

export class BasicColumn extends Column {
  public readonly typeString: string;

  constructor(props: BasicColumnProps) {
    super(props);
    this.typeString = props.type;
  }
}

export interface StructColumnProps extends ColumnProps {
  readonly data?: Column[];
}

export class StructColumn extends Column {
  private readonly _inner: Column[] = [];

  public readonly typeString: string;

  constructor(props: StructColumnProps) {
    super(props);

    this.typeString = Lazy.string({
      produce: () => {
        const innerTypes = this._inner.map((x) => {
          if (!x.name) {
            throw new Error([
              'Names are required for all Glue Table columns',
              'that are not immediately inside an array',
            ].join(' '));
          }

          return `${x.name}:${x.typeString}`;
        }).join(',');
        return `struct<${innerTypes}>`;
      },
    });

    props.data?.forEach((x) => {
      this.addColumn(x);
    });
  }

  public addColumn(column: Column): void {
    this._inner.push(column);
  }
}
