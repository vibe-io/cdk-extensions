import { IConstruct } from 'constructs';
import { DocumentFormat } from './document-format';
import { Lazy, Stack } from 'aws-cdk-lib';


export interface DocumentContentResult {
  readonly content: string;
  readonly documentFormat: DocumentFormat;
}

export interface IDocumentContent {
  bind(scope: IConstruct): DocumentContentResult;
}

export interface ObjectContentProps {
  readonly input: {[key: string]: any};
}

export interface StringContentProps {
  readonly content: string;
  readonly documentFormat: DocumentFormat;
}

export class DocumentContent {
  public static fromObject(props: ObjectContentProps): IDocumentContent {
    return {
      bind: (scope) => {
        return {
          content: Lazy.string({
            produce: () => {
              return Stack.of(scope).toJsonString(props.input);
            }
          }),
          documentFormat: DocumentFormat.JSON,
        };
      }
    };
  }

  public static fromString(props: StringContentProps): IDocumentContent {
    return {
      bind: (_scope) => {
        return {
          content: props.content,
          documentFormat: props.documentFormat,
        };
      }
    };
  }
}