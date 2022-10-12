import { Lazy } from 'aws-cdk-lib';
import { IGroup, IRole, IUser, ManagedPolicy, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


/**
 * Configuration options for creating a referenced customer managed policy.
 */
export interface ReferenceOptions {
  /**
     * The name of the customer managed policy.
     */
  readonly name: string;

  /**
     * The path for the policy.
     *
     * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
     * Guide.
     *
     * This parameter is optional. If it is not included, it defaults to a slash (/).
     *
     * This parameter allows a string of characters consisting of either a
     * forward slash (/) by itself or a string that must begin and end with
     * forward slashes. In addition, it can contain any ASCII character from
     * the ! (`\u0021`) through the DEL character (`\u007F`), including most
     * punctuation characters, digits, and upper and lowercased letters.
     *
     * @default '/''
     */
  readonly path?: string;
}

/**
 * Represents configuration options when creating a managed policy from a
 * class generated when adding a custom policy reference.
 */
export interface ReferencedManagedPolicyProps {
  /**
     * A friendly description of the policy.
     *
     * Typically used to store information about the permissions defined in the
     * policy. For example, "Grants access to production DynamoDB tables."
     *
     * The policy description is immutable. After a value is assigned, it
     * cannot be changed.
     */
  readonly description?: string;

  /**
     * The policy document that you want to use as the content for the new
     * policy.
     */
  readonly document?: PolicyDocument;

  /**
     * The groups to attach the policy to.
     *
     * When creating managed policies that will be referenced by IAM identity
     * center it is possible to associate them with other resources such as
     * users, groups, and roles. However, this is typically not done as IAM
     * Identity Center will handle configuring associations in the background.
     */
  readonly groups?: IGroup[];

  /**
     * The roles to attach the policy to.
     *
     * When creating managed policies that will be referenced by IAM identity
     * center it is possible to associate them with other resources such as
     * users, groups, and roles. However, this is typically not done as IAM
     * Identity Center will handle configuring associations in the background.
     */
  readonly roles?: IRole[];

  /**
     * Initial set of permissions to add to this policy document.
     */
  readonly statements?: PolicyStatement[];

  /**
     * The users to attach the policy to.
     *
     * When creating managed policies that will be referenced by IAM identity
     * center it is possible to associate them with other resources such as
     * users, groups, and roles. However, this is typically not done as IAM
     * Identity Center will handle configuring associations in the background.
     */
  readonly users?: IUser[];
}

/**
 * A managed policy that is referenced via IAM Identity Center.
 */
export abstract class ReferencedManagedPolicy extends ManagedPolicy {

  // Static properties

  /**
       * The name of the managed policy.
       */
  public static readonly policyName: string = '<not-set>';

  /**
       * The path for the managed policy.
       *
       * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
       * Guide.
       */
  public static readonly policyPath?: string = undefined;


  /**
     * Dynamically generates a new class that can be used to create a managed
     * policy that matches a reference in IAM Identity Center.
     *
     * @param options The reference configuration used when registering a
     * customer managed policy with a permission set in IAM Identity Center.
     * @returns A dynamically generated class that will match the provided
     * reference configuration.
     */
  public static of(options: ReferenceOptions): typeof ReferencedManagedPolicy {
    class SsoReferencedManagedPolicy extends ReferencedManagedPolicy {
      public static readonly policyName: string = options.name;
      public static readonly policyPath?: string = options.path;

      public readonly referencedName: string = options.name;
      public readonly referencedPath?: string = options.path;
    }

    return SsoReferencedManagedPolicy;
  }


  // Standard properties

  /**
     * The name of the managed policy.
     */
  public abstract readonly referencedName: string;

  /**
     * The path for the managed policy.
     *
     * For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
     * Guide.
     */
  public abstract readonly referencedPath?: string;


  /**
     * Creates a new instance of the ReferencedManagedPolicy class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  public constructor(scope: Construct, id: string, props: ReferencedManagedPolicyProps = {}) {
    super(scope, id, {
      ...props,
      managedPolicyName: Lazy.string({
        produce: () => {
          return this.referencedName;
        },
      }),
      path: Lazy.string({
        produce: () => {
          return this.referencedPath;
        },
      }),
    });
  }
}
