import { ResourceProps } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { ApplicationConfigurationSchemaDocument } from "../application-configuration-schema-document";
import { DocumentUpdateMethod } from "../document-base";
import { JsonSchema } from "./json-schema";


export interface PermissiveApplicationConfigurationSchemaProps extends ResourceProps {
  readonly name?: string;
  readonly updateMethod?: DocumentUpdateMethod;
  readonly versionName?: string;
}

export class PermissiveApplicationConfigurationSchema extends ApplicationConfigurationSchemaDocument {
  public constructor(scope: IConstruct, id: string, props: PermissiveApplicationConfigurationSchemaProps = {}) {
    super(scope, id, {
      name: props.name,
      schema: JsonSchema.PERMISSIVE,
      updateMethod: props.updateMethod,
      versionName: props.versionName,
    });
  }
}