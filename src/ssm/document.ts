import { IConstruct } from 'constructs';
import { DocumentBase, DocumentBaseProps } from './document-base';


export interface DocumentProps extends DocumentBaseProps {}

export class Document extends DocumentBase {
  public constructor(scope: IConstruct, id: string, props: DocumentProps) {
    super(scope, id, props);
  }
}