import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IConstruct } from 'constructs';
import { ISecretReference, SecretFieldReference, SecretReferenceConfiguration } from '../external-secret';


/**
 * Configuration options for referencing a Secrets Manager secret as a
 * Kubernetes secret.
 */
export interface SecretsManagerReferenceOptions {
  /**
     * Defines a mapping of how JSON keys in the Secrets Manager secret should
     * appear in the imported Kubernetes secret.
     */
  readonly fields?: SecretFieldReference[];
}

/**
 * Defines a reference for importing and synchronizing a Secrets Manager secret
 * to a Kubernetes secret.
 */
export class SecretsManagerReference implements ISecretReference {
  /**
     * Internal array for tracking secret field mappings.
     */
  private readonly _fields: SecretFieldReference[];

  /**
     * An array of field mappings which will be applied to this secret
     * reference when mapping keys from SecretsManager JSON objects to keys in
     * the imported secret.
     */
  public get fields(): SecretFieldReference[] {
    return [...this._fields];
  }

  /**
     * The secret being referenced to import into Kubernetes.
     */
  public readonly secret: ISecret;

  /**
     * Creates a new instance of the SecretsManagerReference class.
     *
     * @param secret The secret being referenced to import into Kubernetes.
     * @param options Configuration options for the Secrets Manager reference.
     */
  public constructor(secret: ISecret, options: SecretsManagerReferenceOptions = {}) {
    this._fields = [];

    this.secret = secret;

    options.fields?.forEach((x) => {
      this.addFieldMapping(x);
    });
  }

  /**
     * Adds a field mapping that specifies how a field from a Secrets Manager
     * JSON secret should be mapped into the imported Kubernetes secret.
     *
     * @param field The configuration for how to map the field from Secrets
     * Manager to the Kubernetes secret.
     * @returns The `SecretsManagerReference` where the mapping was added.
     */
  public addFieldMapping(field: SecretFieldReference): SecretsManagerReference {
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
      remoteRef: this.secret.secretArn,
    };
  }
}