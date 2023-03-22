import { IConstruct } from "constructs";
import { IApplicationConfigurationSchemaDocument } from "./application-configuration-schema-document";
import { Document } from "./document";
import { DocumentType, DocumentUpdateMethod, IDocument } from "./document-base";
import { DocumentContent } from "./lib/document-content";
import { PermissiveApplicationConfigurationSchema } from "./open-application-configuration-schema";


export interface IApplicationConfigurationDocument extends IDocument {}

export interface ApplicationConfigurationDocumentProps {
  readonly content: {[key: string]: any};
  readonly name?: string;
  readonly schema?: IApplicationConfigurationSchemaDocument;
  readonly updateMethod?: DocumentUpdateMethod;
  readonly versionName?: string;
}

export class ApplicationConfigurationDocument extends Document implements IApplicationConfigurationDocument {
  public readonly schema: IApplicationConfigurationSchemaDocument;


  public constructor(scope: IConstruct, id: string, props: ApplicationConfigurationDocumentProps) {
    super(scope, id, {
      content: DocumentContent.fromObject({
        input: props.content,
      }),
      documentType: DocumentType.APPLICATION_CONFIGURATION,
      name: props.name,
      updateMethod: props.updateMethod,
      versionName: props.versionName,
    });

    this.schema = props.schema ?? new PermissiveApplicationConfigurationSchema(this, 'schema');
  }
}
