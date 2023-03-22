import { CfnDocument } from "aws-cdk-lib/aws-ssm";
import { IConstruct, IDependable } from "constructs";


export interface IDocumentAttachmentResult {
  readonly attachmentAvailable?: IDependable;
  readonly configuration: CfnDocument.AttachmentsSourceProperty;
}

export interface IDocumentAttachment {
  bind(scope: IConstruct): IDocumentAttachmentResult;
}