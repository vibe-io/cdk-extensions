import { ArnFormat, Resource, Stack } from "aws-cdk-lib";
import { DocumentBase, IDocument } from "./document-base";
import { IConstruct } from "constructs";


export enum AutomationSchemaVersion {
  VER_0_3 = '0.3',
}

export interface IAutomationDocument extends IDocument {
  readonly automationDefinitionArn: string;

  arnforAutomationDefinitionVersion(version: string): string;
}


export interface AutomationDocumentProps {
  readonly description?: string;
  readonly schemaVersion?: AutomationSchemaVersion;
}

export class AutomationDocument extends DocumentBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;
  public static readonly DEFAULT_SCHEMA_VERSION: AutomationSchemaVersion = AutomationSchemaVersion.VER_0_3;


  public static fromManaged(scope: IConstruct, id: string, managedDocumentName: string): IAutomationDocument {
    class Import extends Resource implements IAutomationDocument {
      readonly automationDefinitionArn: string = Stack.of(scope).formatArn({
        account: '',
        arnFormat: AutomationDocument.ARN_FORMAT,
        resource: 'automation-definition',
        resourceName: managedDocumentName,
        service: 'ssm',
      });
      readonly documentArn: string = Stack.of(scope).formatArn({
        account: '',
        arnFormat: AutomationDocument.ARN_FORMAT,
        resource: 'document',
        resourceName: managedDocumentName,
        service: 'ssm',
      });
      readonly documentName: string = managedDocumentName;

      public arnforAutomationDefinitionVersion(version: string): string {
        return `${this.automationDefinitionArn}:${version}`;
      }
    }

    return new Import(scope, id);
  }

  /*public readonly description?: string;
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
  }*/
}