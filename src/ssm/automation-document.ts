import { Resource, ResourceProps, Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { DocumentBase, DocumentType, DocumentUpdateMethod, IDocument } from './document-base';
import { DocumentContent, DocumentContentResult, DocumentFormat, IDocumentContent } from './lib';
import { renderDocumentContentObject } from './lib/utils';


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

export interface IAutomationDocumentContent extends IDocumentContent {}

export interface AutomationDocumentObjectContentProps {
  readonly input: {[key: string]: any};
  readonly documentFormat?: DocumentFormat;
  readonly version?: AutomationSchemaVersion;
}

export interface AutomationDocumentStringContentProps {
  readonly content: string;
  readonly documentFormat: DocumentFormat;
}

export abstract class AutomationDocumentContent {
  public static fromObject(props: AutomationDocumentObjectContentProps): IAutomationDocumentContent {
    class ConcreteDocumentBody extends AutomationDocumentContent {
      public bind(scope: IConstruct): DocumentContentResult {
        const content = {...props.input};
        const format = props.documentFormat ?? DocumentFormat.JSON;

        if (content['schemaVersion'] === undefined) {
          const version = props.version ?? AutomationSchemaVersion.VER_0_3;
          content['schemaVersion'] = version.version;
        } else if (props.version && content !== props.version) {
          throw new Error([
            'Version specified for Systems Manager automation document',
            `(${props.version.version}) does not match the version`,
            `specified in the document body (${content['schemaVersion']}).`,
            'Either ensure the versions match or leave the version undefined',
            'in either the document body or the automation document resource',
            'properties.',
          ].join());
        }

        return {
          content: renderDocumentContentObject(scope, {
            input: content,
            documentFormat: format,
          }),
          documentFormat: format,
        }
      }
    }

    return new ConcreteDocumentBody();
  }

  public static fromString(props: AutomationDocumentStringContentProps): IAutomationDocumentContent {
    return DocumentContent.fromString({
      content: props.content,
      documentFormat: props.documentFormat,
    });
  }
}

export interface AutomationDocumentProps extends ResourceProps {
  readonly content: IAutomationDocumentContent;
  readonly name?: string;
  readonly updateMethod?: DocumentUpdateMethod;
  readonly versionName?: string;
}

export class AutomationDocument extends DocumentBase implements IAutomationDocument {
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


  public constructor(scope: IConstruct, id: string, props: AutomationDocumentProps) {
    super(scope, id, {
      content: props.content,
      documentType: DocumentType.AUTOMATION,
      name: props.name,
      updateMethod: props.updateMethod,
      versionName: props.versionName,
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