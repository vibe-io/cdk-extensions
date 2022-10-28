import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { IConstruct } from 'constructs';
import { ISecretReference, SecretFieldReference, SecretReferenceConfiguration } from '../external-secret';

/**
 * Configuration options for referencing an SSM parameter as a Kubernetes
 * secret.
 */
export interface SsmParameterReferenceOptions {
  /**
     * Defines a mapping of how JSON keys in the SSM parameter should appear in
     * the imported Kubernetes secret.
     */
  readonly fields?: SecretFieldReference[];
}

/**
 * Defines a reference for importing and synchronizing an SSM parameter to a
 * Kubernetes secret.
 */
export class SsmParameterReference implements ISecretReference {
  /**
     * Internal array for tracking secret field mappings.
     */
  private readonly _fields: SecretFieldReference[];

  /**
     * An array of field mappings which will be applied to this secret
     * reference when mapping keys from SSM parameter JSON objects to keys in
     * the imported secret.
     */
  public get fields(): SecretFieldReference[] {
    return [...this._fields];
  }

  /**
     * The SSM parameter being referenced to import into Kubernetes.
     */
  public readonly parameter: IParameter;

  /**
     * Creates a new instance of the SsmParameterReference class.
     *
     * @param parameter The SSM parameter being referenced to import into
     * Kubernetes.
     */
  public constructor(parameter: IParameter, options: SsmParameterReferenceOptions) {
    this._fields = [];

    this.parameter = parameter;

    options.fields?.forEach((x) => {
      this.addFieldMapping(x);
    });
  }

  /**
     * Adds a field mapping that specifies how a field from an SSM JSON
     * parameter should be mapped into the imported Kubernetes secret.
     *
     * @param field The configuration for how to map the field from the SSM
     * parameter to the Kubernetes secret.
     * @returns The `SsmParameterReference` where the mapping was added.
     */
  public addFieldMapping(field: SecretFieldReference): SsmParameterReference {
    this._fields.push(field);
    return this;
  }

  /**
     * Binds the reference to an object that is in charge of generating the
     * manifest for the external secret.
     *
     * @param _scope The construct that will consume the generated
     * configuration.
     * @returns A configuration object providing the details needed to build
     * the external secret Kubernetes resource.
     */
  bind(_scope: IConstruct): SecretReferenceConfiguration {
    return {
      fields: !this._fields.length ? undefined : this._fields.map((x) => {
        return {
          kubernetesKey: x.kubernetesKey,
          remoteKey: x.remoteKey ?? x.kubernetesKey,
        };
      }),
      remoteRef: this.parameter.parameterArn,
    };
  }
}