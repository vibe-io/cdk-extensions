import { Lazy, Names } from "aws-cdk-lib";
import { IDocument } from "../document-base";
import { DocumentReference, DocumentReferenceType } from "./document-reference";


export class DocumentParameterDisplayType {
  public static readonly TEXT_AREA: DocumentParameterDisplayType = DocumentParameterDisplayType.of('textarea');
  public static readonly TEXT_FIELD: DocumentParameterDisplayType = DocumentParameterDisplayType.of('textfield');

  public static of(name: string): DocumentParameterDisplayType {
    return new DocumentParameterDisplayType(name);
  }


  private constructor(public readonly name: string) {}
}

export interface DocumentParameterProps {
  readonly allowedPattern?: string;
  readonly allowedValues?: any[];
  readonly default?: any;
  readonly description?: string;
  readonly displayType?: DocumentParameterDisplayType;
  readonly maxChars?: number;
  readonly maxItems?: number;
  readonly minChars?: number;
  readonly minItems?: number;
  readonly name?: string;
  readonly type: DocumentReferenceType;
}

export class DocumentParameter extends DocumentReference {
  private readonly _allowedValues: any[];

  public readonly allowedPattern?: string;
  public readonly default?: any;
  public readonly description?: string;
  public readonly displayType?: DocumentParameterDisplayType;
  public readonly maxChars?: number;
  public readonly maxItems?: number;
  public readonly minChars?: number;
  public readonly minItems?: number;
  public readonly name: string;

  public get allowedValues(): any {
    return [...this._allowedValues];
  }


  public constructor(scope: IDocument, id: string, props: DocumentParameterProps) {
    const name = props.name ?? Lazy.string({
      produce: () => {
        return Names.uniqueId(this);
      }
    });

    super(scope, id, {
      reference: name,
      type: props.type,
    });

    this._allowedValues = [];

    this.allowedPattern = props.allowedPattern;
    this.default = props.default;
    this.description = props.description;
    this.displayType = props.displayType;
    this.maxChars = props.maxChars;
    this.maxItems = props.maxItems;
    this.minChars = props.minChars;
    this.minItems = props.minItems;
    this.name = name;

    props.allowedValues?.forEach((x) => {
      this.addAllowedValue(x);
    });
  }

  public addAllowedValue(value: any): DocumentParameter {
    this._allowedValues.push(value);
    return this;
  }

  public renderJson(): { [key: string]: any; } {
    throw new Error("Method not implemented.");
  }
}