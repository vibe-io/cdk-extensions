import { ArnFormat } from "aws-cdk-lib";
import { DocumentBase, DocumentBaseProps } from "./document-base";
import { IConstruct } from "constructs";


export interface DocumentProps extends DocumentBaseProps {}

export class Document extends DocumentBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;


  public constructor(scope: IConstruct, id: string, props: DocumentProps) {
    super(scope, id, props);
  }
}