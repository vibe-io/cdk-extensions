import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnAssignment } from 'aws-cdk-lib/aws-sso';
import { Construct } from 'constructs';
import { IInstance } from './instance';
import { AssignmentTarget } from './lib/assignment-target';
import { IIdentityCenterPrincipal } from './lib/identity-center-principal';
import { IPermissionSet } from './permission-set';


/**
 * Configuration for Assignment resource.
 */
export interface AssignmentProps extends ResourceProps {
  /**
     * The IAM Identity Center instance under which the operation will be
     * executed.
     */
  readonly instance: IInstance;

  /**
     * The permission set which governs the access being assigned. The
     * permission set grants the {@link principal} permissions on
     * {@link target}.
     */
  readonly permissionSet: IPermissionSet;

  /**
     * The IAM Identity Center principal you wish to grant permissions to.
     */
  readonly principal: IIdentityCenterPrincipal;

  /**
     * The resource you wish to grant the {@link principal} entity access to
     * using the permissions defined in the {@link permissionSet}. For example,
     * an AWS account.
     */
  readonly target: AssignmentTarget;
}

/**
 * Assigns access to a Principal for a specified AWS account using a specified
 * permission set.
 */
export class Assignment extends Resource {
  // Input properties

  /**
     * The IAM Identity Center instance under which the operation will be
     * executed.
     */
  public readonly instance: IInstance;

  /**
     * The permission set which governs the access being assigned. The
     * permission set grants the {@link principal} permissions on
     * {@link target}.
     */
  public readonly permissionSet: IPermissionSet;

  /**
     * The IAM Identity Center principal you wish to grant permissions to.
     */
  public readonly principal: IIdentityCenterPrincipal;

  /**
     * The resource you wish to grant the {@link principal} entity access to
     * using the permissions defined in the {@link permissionSet}. For example,
     * an AWS account.
     */
  public readonly target: AssignmentTarget;

  // Resource properties

  /**
     * The underlying Assignment CloudFormation resource.
     */
  public readonly resource: CfnAssignment;


  /**
     * Creates a new instance of the Assignment class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: AssignmentProps) {
    super(scope, id, props);

    this.instance = props.instance;
    this.permissionSet = props.permissionSet;
    this.principal = props.principal;
    this.target = props.target;

    this.resource = new CfnAssignment(this, 'Resource', {
      instanceArn: this.instance.instanceArn,
      permissionSetArn: this.permissionSet.permissionSetArn,
      principalId: this.principal.principalId,
      principalType: this.principal.principalType.name,
      targetId: this.target.targetId,
      targetType: this.target.targetType.name,
    });
  }
}
