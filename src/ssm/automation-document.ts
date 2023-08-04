import { ArnFormat, Resource, Stack } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { DocumentBase, DocumentType, IDocument } from "./document-base";
import { DocumentContent, DocumentFormat } from "./lib";


export class AutomationSchemaVersion {
  public static readonly VER_0_3: AutomationSchemaVersion= AutomationSchemaVersion.of('0.3');

  public static of(version: string): AutomationSchemaVersion {
    return new AutomationSchemaVersion(version);
  }


  public readonly version: string;

  private constructor(version: string) {
    this.version = version;
  }
}

export interface IAutomationDocument extends IDocument {
  readonly automationDefinitionArn: string;
  arnForAutomationDefinitionVersion(version: string): string;
}

export class AutomationDocument extends DocumentBase implements IAutomationDocument {
    public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;
    public static readonly DEFAULT_SCHEMA_VERSION: AutomationSchemaVersion = AutomationSchemaVersion.VER_0_3;
    
    public static fromManaged(scope: IConstruct, id: string, managedDocumentName: string): IAutomationDocument {
      class Import extends Resource {
        public readonly automationDefinitionArn = Stack.of(scope).formatArn({
          account: '',
          arnFormat: AutomationDocument.ARN_FORMAT,
          resource: 'automation-definition',
          resourceName: managedDocumentName,
          service: 'ssm',
        });
        public readonly documentArn = Stack.of(scope).formatArn({
          account: '',
          arnFormat: AutomationDocument.ARN_FORMAT,
          resource: 'document',
          resourceName: managedDocumentName,
          service: 'ssm',
        });
        public readonly documentName = managedDocumentName;

        public arnForAutomationDefinitionVersion(version: string): string {
          return `${this.automationDefinitionArn}:${version}`;
        }
      }

      return new Import(scope, id);
    }
    
    public readonly automationDefinitionArn: string;
    
    
    private constructor(scope: IConstruct, id: string) {
      super(scope, id, {
        documentType: DocumentType.AUTOMATION,
        content: DocumentContent.fromString({
          content: '{}',
          documentFormat: DocumentFormat.JSON,
        }),
      });

      this.automationDefinitionArn = this.stack.formatArn({
        arnFormat: AutomationDocument.ARN_FORMAT,
        resource: 'automation-definition',
        resourceName: this.documentName,
        service: 'ssm',
      });
    }
    
    public arnForAutomationDefinitionVersion(version: string): string {
      return `${this.automationDefinitionArn}:${version}`;
    }
}