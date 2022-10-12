/**
 * Provides a wrapper around the accepted values for the IAM Identity Center
 * [Assignment.PrincipalType attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-principaltype).
 *
 * Accepted values are provided as static properties that can be used when
 * configuring an assignment.
 */
export class IdentityCenterPrincipalType {
  /**
     * An IAM Identity Center group.
     */
  public static readonly GROUP: IdentityCenterPrincipalType = IdentityCenterPrincipalType.of('GROUP');

  /**
     * An IAM Identity Center user.
     */
  public static readonly USER: IdentityCenterPrincipalType = IdentityCenterPrincipalType.of('USER');

  /**
     * An escape hatch method that allows specifying a custom principal types in
     * the even more options are added and the provided static types are yet to
     * catch up.
     *
     * It is recommended that the provided static types be used when possible
     * instead of calling `of`.
     *
     * @param name The name for a type of IAM Identity Center Principal.
     */
  public static of(name: string): IdentityCenterPrincipalType {
    return new IdentityCenterPrincipalType(name);
  }


  /**
     * The name for a type of IAM Identity Center Principal.
     */
  public readonly name: string;

  /**
     * Creates a new instance of the IdentityCenterPrincipalType class.
     *
     * @param name The name for a type of IAM Identity Center Principal.
     */
  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * Represents an entity that can be granted permissions via IAM Identity
 * Center.
 */
export interface IIdentityCenterPrincipal {
  /**
     * The unique ID that identifies the entity withing IAM Identity Center.
     */
  readonly principalId: string;

  /**
     * The type of entity being represented.
     */
  readonly principalType: IdentityCenterPrincipalType;
}
