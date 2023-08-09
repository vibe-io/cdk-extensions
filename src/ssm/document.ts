import { ArnFormat } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { DocumentBase, DocumentBaseProps } from './document-base';


export interface DocumentProps extends DocumentBaseProps {}

export class Document extends DocumentBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;


  public constructor(scope: IConstruct, id: string, props: DocumentProps) {
    super(scope, id, props);
  }
}