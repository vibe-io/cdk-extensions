# AWS IAM Identity Center (successor to AWS Single Sign-On)

The `@cdk-extensions/sso` package contains advanced constructs and patterns for
setting up IAM Identity Center. The constructs presented here are intended
to be replacements for equivalent AWS constructs in the CDK EC2 module, but with
additional features included.

[AWS CDK EC2 API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html)

To import and use this module within your CDK project:

```ts nofixture
import * as sso from '@cdk-extensions/sso';
```
## Objective

AWS IAM Identity Center (successor to AWS Single Sign-On) expands the capabilities of AWS Identity and Access Management (IAM) to provide a central place that brings together administration of users and their access to AWS accounts and cloud applications.

[See offical IAM Identity Center documentation](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)

### Assignment

Assigns access to a Principal for a specified AWS account using a specified permission set.  This contructs extends AWS class [Resource](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Resource.html) by adding the following properties:

| Property Name | Description |
| ------------- | ----------- |
| Instance      | The IAM Identity Center instance under which the operation will be executed |
| PermissionSet | The permission set which governs the access being assigned.  The permission set grants the principal permissions on the target |
| Principal     | The IAM Identity Center principal you wish to grant permissions to |
| Resource      | The underlying Assignment CloudFormation resource, in this case AWS::SSO::Assignment |
| Target        | The resource you wish to grant the principal entity access to using the permissions defined in the the permissionSet.  For example, an AWS account |

#### Usage

You can create an Assignment like this:

```ts
// SAMPLE CODE
```

### Instance Access Control Attribute Configuration

Enables the attribute-based access control (ABAC) feature for the specified IAM Identity Center instance. You can also specify new attributes to add to your ABAC configuration during the enabling process. For more information about ABAC, see [Attribute-Based Access Control](https://docs.aws.amazon.com/singlesignon/latest/userguide/abac.html) in the IAM Identity Center User Guide. This contructs extends AWS class [Resource](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Resource.html) by adding the following properties:

| Property Name | Description |
| ------------- | ----------- |
| Attributes    | Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance. This array is readonly. Changes made to the array will not be reflected in this resource. To add new attributes usethe addAttribute method |
| Instance      | The ARN of the IAM Identity Center instance under which the operation will be executed |
| Resource      | The underlying InstanceAccessControlAttributeConfiguration CloudFormation resource, in this case AWS::SSO::InstanceAccessControlAttributeConfiguration |

#### Usage

You can create an InstanceAccessControlAttributeConfiguration like this:

```ts
// SAMPLE CODE
```

### Permission Set

Specifies a permission set within a specified IAM Identity Center instance. This contructs extends AWS class [Resource](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Resource.html) by adding the following properties:

| Property Name | Description |
| ------------- | ----------- |
| Description | A user friendly description providing details about the permission set |
| Instance    | The ARN of the IAM Identity Center instance under which the operation will be executed |
| Name        | The name of the permission set |
| PermissionBoundary | Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary. Specify either CustomerManagedPolicyReference to use the name and path of a customer managed policy, or ManagedPolicyArn to use the ARN of an AWS managed policy. A permissions boundary represents the maximum permissions that any policy can grant your role. For more information, see [Permissions Boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for IAM entities in the AWS Identity and Access Management User Guide. |

#### Usage

You can create an PermissionSet like this:

```ts
// SAMPLE CODE
```
