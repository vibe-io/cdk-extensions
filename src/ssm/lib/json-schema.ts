import { IConstruct } from "constructs";
import { DocumentContent, IDocumentContent } from "./document-content";
import { DocumentFormat } from "./document-format";


export interface IJsonSchema extends IDocumentContent {}

export interface JsonSchemaFromObjectProps {
  readonly input: {[key: string]: any};
}

export interface JsonSchemaFromStringProps {
  readonly input: string;
}

export class JsonSchema {
  public static readonly PERMISSIVE: IJsonSchema = JsonSchema.fromObject({
    input: {
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'additionalProperties': false,
      'description': 'Allow all content',
      'minProperties': 0,
      'patternProperties': {
        '^.+$': {
          'type': [
            'array',
            'boolean',
            'null',
            'number',
            'object',
            'string',
          ]
        }
      },
      'title': '$id$',
      'type': 'object',
    }
  });

  public static fromObject(props: JsonSchemaFromObjectProps): IJsonSchema {
    return {
      bind: (scope: IConstruct) => {
        return DocumentContent.fromObject({
          input: props.input,
        }).bind(scope);
      }
    };
  }

  public static fromString(props: JsonSchemaFromStringProps): IJsonSchema {
    return {
      bind: (scope: IConstruct) => {
        return DocumentContent.fromString({
          content: props.input,
          documentFormat: DocumentFormat.JSON,
        }).bind(scope);
      }
    };
  }
}