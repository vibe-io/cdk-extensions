import { Lazy } from "aws-cdk-lib";
import { IManagedPolicy, IRole, Role } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";
import { DocumentBase, DocumentType, IDocument } from "./document-base";
import { DocumentContent } from "./lib/document-content";
import { DocumentFormat } from "./lib/document-format";


export enum AutomationSchemaVersion {
  VER_0_3 = '0.3',
}

export interface IAutomationDocument extends IDocument {}



export interface AutomationDocumentProps {
  readonly description?: string;
  readonly schemaVersion?: AutomationSchemaVersion;
}

export class AutomationDocument extends DocumentBase {
  public static readonly DEFAULT_SCHEMA_VERSION: AutomationSchemaVersion = AutomationSchemaVersion.VER_0_3;

  public readonly description?: string;
  public readonly role: Role;
  public readonly schemaVersion: AutomationSchemaVersion;
  

  public constructor(scope: IConstruct, id: string, props: AutomationDocumentProps) {
    super(scope, id, {
      content: DocumentContent.fromString({
        content: Lazy.string({
          produce: () => {
            return this.renderContent();
          }
        }),
        documentFormat: DocumentFormat.JSON,
      }),
      documentType: DocumentType.AUTOMATION,
    });

    this.description = props.description;
    this.schemaVersion = props.schemaVersion ?? AutomationDocument.DEFAULT_SCHEMA_VERSION;
  }

  protected renderContent(): string {
    return this.stack.toJsonString({
      assumeRole: ,
      description: this.description,
      mainSteps: ,
      outputs: ,
      parameters: ,
      schemaVersion: this.schemaVersion
    });
  }
}