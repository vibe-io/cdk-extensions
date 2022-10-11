/**
 * Provides a wrapper around the accepted values for the IAM Identity Center
 * [Assignment.TargetType attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-targettype).
 * 
 * Accepted values are provided as static properties that can be used when
 * configuring an assignment.
 */
export class AssignmentTargetType {
    /**
     * An AWS account.
     */
    public static readonly AWS_ACCOUNT: AssignmentTargetType = AssignmentTargetType.of('AWS_ACCOUNT');

    /**
     * An escape hatch method that allows specifying a custom target type in
     * the even more options are added and the provided static types are yet to
     * catch up.
     * 
     * It is recommended that the provided static types be used when possible
     * instead of calling `of`.
     * 
     * @param name The name of the assignment target type.
     * @returns An {@link AssignmentTargetType} object representing the specified type.
     */
    public static of(name: string): AssignmentTargetType {
        return new AssignmentTargetType(name);
    }


    /**
     * The name describing the type of target.
     */
    public readonly name: string;

    /**
     * Creates a new instance of the AssignmentTargetType class.
     * 
     * @param name The name of the target type.
     */
    private constructor(name: string) {
        this.name = name;
    }
}

/**
 * Represents a resource that can have permissions granted for using IAM
 * Identity Center such as an AWS account.
 */
export class AssignmentTarget {
    /**
     * Creates an assignment target that represents an AWS account.
     * 
     * @param accountId The ID of the AWS account for which permissions should
     * be granted.
     * @returns An AssignmentTarget representing the AWS account.
     */
    public static awsAccount(accountId: string): AssignmentTarget {
        return AssignmentTarget.of(AssignmentTargetType.AWS_ACCOUNT, accountId);
    }

    /**
     * An escape hatch method that allows specifying a custom target for an
     * assignment in the event new target options are added and the provided
     * methods for configuring targets are yet to catch up.
     * 
     * It is recommended that the provided static methods be used whenever 
     * possible for configuring assignment targets instead of calling `of`.
     * 
     * @param targetType The entity type for which permissions will be granted.
     * @param targetId The unique identifier specifying the entity for which
     * permissions will be granted.
     * @returns 
     */
    public static of(targetType: AssignmentTargetType, targetId: string): AssignmentTarget {
        return new AssignmentTarget(targetType, targetId);
    }


    /**
     * The unique identifier for the resource for which permissions will be
     * granted.
     */
    public readonly targetId: string;

    /**
     * The type of resource for which permissions will be granted.
     */
    public readonly targetType: AssignmentTargetType;

    /**
     * Creates a new instance of the AssignmentTarget class.
     * 
     * @param targetType The entity type for which permissions will be granted.
     * @param targetId The unique identifier specifying the entity for which
     * permissions will be granted.
     */
    private constructor(targetType: AssignmentTargetType, targetId: string) {
        this.targetId = targetId;
        this.targetType = targetType;
    }
}