import { ResourceProps } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { Document } from "./document";
import { DocumentType, DocumentUpdateMethod, IDocument } from "./document-base";
import { IJsonSchema } from "./lib/json-schema";


export interface IApplicationConfigurationSchemaDocument extends IDocument {}

export interface ApplicationConfigurationSchemaDocumentProps extends ResourceProps {
  readonly name?: string;
  readonly schema: IJsonSchema;
  readonly updateMethod?: DocumentUpdateMethod;
  readonly versionName?: string;
}

export class ApplicationConfigurationSchemaDocument extends Document implements IApplicationConfigurationSchemaDocument {
  public constructor(scope: IConstruct, id: string, props: ApplicationConfigurationSchemaDocumentProps) {
    super(scope, id, {
      content: props.schema,
      documentType: DocumentType.APPLICATION_CONFIGURATION_SCHEMA,
      name: props.name,
      updateMethod: props.updateMethod,
      versionName: props.versionName,
    });
  }
}
