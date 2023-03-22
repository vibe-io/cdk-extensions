import { ArnFormat } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { DocumentBase, DocumentBaseProps, DocumentRequirement, IDocument } from "./document-base";
import { IDocumentAttachment } from "./lib/document-attachment-ref";


export interface DocumentProps extends DocumentBaseProps {}

export class Document extends DocumentBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;


  public constructor(scope: IConstruct, id: string, props: DocumentProps) {
    super(scope, id, props);
  }

  public addAttachment(attachment: IDocumentAttachment): IDocument {
    return this._addAttachment(attachment);
  }

  public addRequirement(requirement: DocumentRequirement): IDocument {
    return this._addRequirement(requirement);
  }
}