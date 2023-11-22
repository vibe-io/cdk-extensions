import { IConstruct } from 'constructs';
import { DocumentFormat } from './document-format';
import { renderDocumentContentObject } from './utils';


export interface DocumentContentResult {
  readonly content: string;
  readonly documentFormat: DocumentFormat;
}

export interface DocumentContentBindOptions {
  readonly format?: DocumentFormat;
}

export interface IDocumentContent {
  bind(scope: IConstruct): DocumentContentResult;
}

export interface ObjectContentProps {
  readonly input: {[key: string]: any};
  readonly documentFormat?: DocumentFormat;
}

export interface StringContentProps {
  readonly content: string;
  readonly documentFormat: DocumentFormat;
}

export class DocumentContent {
  public static fromObject(props: ObjectContentProps): IDocumentContent {
    return {
      bind: (scope) => {
        const format = props.documentFormat ?? DocumentFormat.JSON;
        return {
          content: renderDocumentContentObject(scope, {
            input: props.input,
            documentFormat: format,
          }),
          documentFormat: format,
        }
      },
    };
  }

  public static fromString(props: StringContentProps): IDocumentContent {
    return {
      bind: (_scope) => {
        return {
          content: props.content,
          documentFormat: props.documentFormat,
        };
      },
    };
  }
}