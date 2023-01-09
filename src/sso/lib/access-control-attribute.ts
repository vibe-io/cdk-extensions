import { Annotations, Lazy } from 'aws-cdk-lib';
import { CfnInstanceAccessControlAttributeConfiguration } from 'aws-cdk-lib/aws-sso';
import { IConstruct } from 'constructs';


/**
 * Configuration options for adding an ABAC attribute to IAM Identity Center.
 */
export interface AccessControlAttributeOptions {
  /**
     * The name of the attribute associated with your identities in your
     * identity source. This is used to map a specified attribute in your
     * identity source with an attribute in IAM Identity Center.
     */
  readonly name: string;

  /**
     * A list of identity sources to use when mapping a specified attribute to
     * IAM Identity Center.
     *
     * @see [AWS::SSO::InstanceAccessControlAttributeConfiguration AccessControlAttributeValue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributevalue.html#cfn-sso-instanceaccesscontrolattributeconfiguration-accesscontrolattributevalue-source)
     */
  readonly sources?: string[];
}

/**
 * Represents and ABAC attribute in IAM Identity Center.
 *
 * These are IAM Identity Center identity store attributes that you can
 * configure for use in attributes-based access control (ABAC). You can create
 * permissions policies that determine who can access your AWS resources based
 * upon the configured attribute values. When you enable ABAC and specify
 * `AccessControlAttributes`, IAM Identity Center passes the attribute values
 * of the authenticated user into IAM for use in policy evaluation.
 */
export class AccessControlAttribute {
  // Internal properties
  private readonly _sources: string[] = [];

  // Standard properties

  /**
     * The name of the attribute associated with your identities in your
     * identity source. This is used to map a specified attribute in your
     * identity source with an attribute in IAM Identity Center.
     */
  public readonly name: string;

  // Standard accessors

  /**
     * A list of identity sources to use when mapping a specified attribute to
     * IAM Identity Center. Note that the array is readonly and changes made
     * to it will not be reflected when generating ABAC attribute
     * configuration. To add a source to the attribute use the {@link addSource}
     * method.
     */
  public get sources(): string[] {
    return [...this._sources];
  }


  /**
     * Creates a new instance of the AccessControlAttribute class.
     *
     * @param options The configuration settings to use when configuring the
     * attribute.
     */
  public constructor(options: AccessControlAttributeOptions) {
    this.name = options.name;
  }

  /**
     * Adds an identity source to use when mapping the attribute to IAM
     * Identity Center.
     *
     * @param source The source to add.
     * @returns The ABAC attribute the source was associated with.
     */
  public addSource(source: string): AccessControlAttribute {
    this._sources.push(source);
    return this;
  }

  /**
     * Generates the raw CloudFormation configuration that this attribute
     * represents within the context of a given scope.
     *
     * @param scope The construct managing the access control attribute
     * configuration that will consume details of this attribute.
     * @returns The raw CloudFormation configuration that this attribute
     * represents.
     */
  public bind(scope: IConstruct): CfnInstanceAccessControlAttributeConfiguration.AccessControlAttributeProperty {
    return {
      key: this.name,
      value: {
        source: Lazy.list({
          produce: () => {
            if (this._sources.length === 0) {
              Annotations.of(scope).addError([
                `AccessControlAttribute for ${this.name} has no sources.`,
                'At least one source is required.',
              ].join(' '));
            }

            return this._sources;
          },
        }),
      },
    };
  }
}