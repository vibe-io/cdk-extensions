import { IConstruct } from "constructs";
import { DocumentFormat } from "./document-format";
import { Stack } from "aws-cdk-lib";


export interface DocumentContentObjectProps {
  readonly input: {[key: string]: any};
  readonly documentFormat?: DocumentFormat;
}

export function renderDocumentContentObject(scope: IConstruct, props: DocumentContentObjectProps): string {
  const format = props.documentFormat ?? DocumentFormat.JSON;
  if (format === DocumentFormat.JSON) {
    return Stack.of(scope).toJsonString(props.input);
  } else if (format === DocumentFormat.YAML) {
    return Stack.of(scope).toYamlString(props.input);
  } else {
    throw new Error([
      'Encountered unsupported document type when trying to render',
      'Systems Manager automation document. Expected one of: JSON, YAML.',
      `Got: ${format.value}.`,
    ].join(' '));
  }
}