import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { AddToPrincipalPolicyResult, IManagedPolicy, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnPermissionSet } from 'aws-cdk-lib/aws-sso';
import { Construct } from 'constructs';
import { IInstance } from './instance';
import { PermissionsBoundary } from './lib/permissions-boundary';
import { ReferencedManagedPolicy, ReferenceOptions } from './lib/referenced-managed-policy';


/**
 * Configuration for PermissionSet resource.
 */
export interface PermissionSetProps extends ResourceProps {
  /**
     * A user friendly description providing details about the permission set.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-description)
     */
  readonly description?: string;

  /**
     * Adds inline policy documents that will be embedded in the permission
     * set.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-inlinepolicy)
     */
  readonly inlinePolicies?: {[key: string]: PolicyDocument};

  /**
     * The ARN of the IAM Identity Center instance under which the operation
     * will be executed.
     */
  readonly instance: IInstance;

  /**
     * A list of the IAM managed policies that you want to attach to the
     * permission set. Managed policies specified here must be AWS managed.
     * To reference custom managed policies use the {@link PermissionSet.addCustomerManagedPolicy}
     * method.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-managedpolicies)
     */
  readonly managedPolicies?: IManagedPolicy[];

  /**
     * The name of the permission set.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-name)
     */
  readonly name?: string;

  /**
     * Specifies the configuration of the AWS managed or customer managed
     * policy that you want to set as a permissions boundary. Specify either
     * CustomerManagedPolicyReference to use the name and path of a customer
     * managed policy, or ManagedPolicyArn to use the ARN of an AWS managed
     * policy. A permissions boundary represents the maximum permissions that
     * any policy can grant your role. For more information, see [Permissions
     * boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for IAM entities in the AWS Identity and Access Management
     * User Guide.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-permissionsboundary)
     */
  readonly permissionsBoundary?: PermissionsBoundary;

  /**
     * Used to redirect users within the application during the federation
     * authentication process. For example, you can redirect users to a
     * specific page that is most applicable to their job after singing in to
     * an AWS account.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-relaystatetype)
     */
  readonly relayState?: string;

  /**
     * The length of time that the application user sessions are valid for.
     * 
     * @see [AWS::SSO::PermissionSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html#cfn-sso-permissionset-sessionduration)
     */
  readonly sessionDuration?: Duration;
}

/**
 * Represents an IAM Identity Center permission set resource.
 */
export interface IPermissionSet {
  readonly permissionSetArn: string;
}

abstract class PermissionSetBase extends Resource implements IPermissionSet {
  // Standard properties
  public abstract readonly permissionSetArn: string;


  public constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }
}

/**
 * Specifies a permission set within a specified IAM Identity Center instance.
 */
export class PermissionSet extends PermissionSetBase {
  public static fromArn(scope: Construct, id: string, arn: string): IPermissionSet {
    class Import extends PermissionSetBase {
      public readonly permissionSetArn: string = arn;

      public constructor() {
        super(scope, id);
      }
    }

    return new Import();
  }

  // Internal properties
  private readonly _customerManagedPolicies: {[path: string]: typeof ReferencedManagedPolicy} = {};
  private readonly _inlinePolicies: {[key: string]: PolicyDocument} = {};
  private readonly _managedPolicies: IManagedPolicy[] = [];

  // Input properties

  /**
     * A user friendly description providing details about the permission set.
     */
  public readonly description?: string;

  /**
     * The ARN of the IAM Identity Center instance under which the operation
     * will be executed.
     */
  public readonly instance: IInstance;

  /**
     * The name of the permission set.
     */
  public readonly name?: string;

  /**
     * Specifies the configuration of the AWS managed or customer managed
     * policy that you want to set as a permissions boundary. Specify either
     * CustomerManagedPolicyReference to use the name and path of a customer
     * managed policy, or ManagedPolicyArn to use the ARN of an AWS managed
     * policy. A permissions boundary represents the maximum permissions that
     * any policy can grant your role. For more information, see [Permissions
     * boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for IAM entities in the AWS Identity and Access Management
     * User Guide.
     */
  public readonly permissionsBoundary?: PermissionsBoundary;

  /**
     * Used to redirect users within the application during the federation
     * authentication process. For example, you can redirect users to a
     * specific page that is most applicable to their job after singing in to
     * an AWS account.
     */
  public readonly relayState?: string;

  /**
     * The length of time that the application user sessions are valid for.
     */
  public readonly sessionDuration?: Duration;

  // Resource properties

  /**
     * The underlying PermissionSet CloudFormation resource.
     */
  public readonly resource: CfnPermissionSet;

  // Standard properties

  /**
     * The permission set ARN of the permission set, such as
     * `arn:aws:sso:::permissionSet/ins-instanceid/ps-permissionsetid`.
     */
  public readonly permissionSetArn: string;


  /**
     * Creates a new instance of the PermissionSet class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: PermissionSetProps) {
    super(scope, id, props);

    this.description = props.description;
    this.instance = props.instance;
    this.name = props.name ?? Names.uniqueId(this);
    this.permissionsBoundary = props.permissionsBoundary;
    this.relayState = props.relayState;
    this.sessionDuration = props.sessionDuration;

    this._inlinePolicies = props.inlinePolicies ?? {};

    this.resource = new CfnPermissionSet(this, 'Resource', {
      customerManagedPolicyReferences: Lazy.any(
        {
          produce: () => {
            return this.stack.toJsonString(Object.keys(this._customerManagedPolicies).map((x) => {
              const item = this._customerManagedPolicies[x];

              return {
                name: item.policyName,
                path: item.policyPath,
              };
            }));
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
      description: this.description,
      instanceArn: this.instance.instanceArn,
      managedPolicies: Lazy.list(
        {
          produce: () => {
            return this._managedPolicies.map((x) => {
              return x.managedPolicyArn;
            });
          },
        },
        {
          omitEmpty: true,
        },
      ),
      inlinePolicy: Lazy.string({
        produce: () => {
          if (Object.keys(this._inlinePolicies).length === 0) {
            return undefined;
          }

          return this.stack.toJsonString(Object.keys(this._inlinePolicies).map((x) => {
            return {
              PolicyDocument: this._inlinePolicies[x].toJSON(),
              PolicyName: x,
            };
          }));
        },
      }),
      name: this.name,
      permissionsBoundary: this.permissionsBoundary?.bind(this),
      relayStateType: this.relayState,
      sessionDuration: this.sessionDuration ? this.sessionDuration.toIsoString() : undefined,
    });

    this.permissionSetArn = this.resource.attrPermissionSetArn;

    props.managedPolicies?.forEach((x) => {
      this.addManagedPolicy(x);
    });
  }

  /**
     * Adds a custom managed policy to the permission set. When using customer
     * managed policies it is required that a managed policy with a matching
     * name and path exist in any AWS account for which the permission set
     * will be assigned.
     *
     * @param options The configuration for the customer managed policy.
     * @returns A dynamically generated ManagedPolicy class that can be used
     * to create compatible managed policies in other accounts.
     */
  public addCustomerManagedPolicy(options: ReferenceOptions): typeof ReferencedManagedPolicy {
    const fullPath = `${options.path ?? ''}/${options.name}`;

    const result = this._customerManagedPolicies[fullPath] ?? ReferencedManagedPolicy.of(options);
    this._customerManagedPolicies[fullPath] = result;

    return result;
  }

  /**
     * Adds a new Managed Policy to the permission set. Only Managed Policies
     * created and maintained by AWS are supported. To add a custom Managed
     * Policy that you control use the {@link addCustomerManagedPolicy} method.
     *
     * @param policy The AWS Managed Policy to associate with the Permission
     * Set.
     * @returns The Permission Set resource the Managed Policy was added to.
     */
  public addManagedPolicy(policy: IManagedPolicy): PermissionSet {
    this._managedPolicies.push(policy);
    return this;
  }

  /**
     * Adds a permission to the permission set's default policy document.
     *
     * If there is no default policy attached to this permission set, it will be created.
     *
     * @param statement The permission statement to add to the policy document.
     * @returns An [AddToPrincipalPolicyResult](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.AddToPrincipalPolicyResult.html) object that provides details of
     * the result of the operation.
     */
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    const defaultPolicyName = `default-policy-${this.node.addr}`;
    const document = this._inlinePolicies[defaultPolicyName] ?? new PolicyDocument();

    this._inlinePolicies[defaultPolicyName] = document;
    document.addStatements(statement);

    return {
      statementAdded: true,
      policyDependable: document,
    };
  }
}