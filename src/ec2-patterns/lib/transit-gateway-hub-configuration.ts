import { ISharedPrincipal } from '../../ram';

export interface TransitGatewayHubConfiguration {
  /**
     * Allows Transit Gateway sharing with resources outside of the Transit Gateway owner
     * account's AWS Organization.
     *
     * By default, resources cannot be shared with accounts outside of the organization.
     */
  readonly allowExternal?: boolean;

  /**
     * Enable or disable automatic acceptance of attachment requests.
     *
     * When this is enabled, any transit gateway attachments created in other accounts where this
     * transit gateway has been shared will be automatically created without manual intervention
     * being needed in the account that did created the share.
     */
  readonly autoAcceptSharedAttachments?: boolean;

  /**
     * Enables auto-discovery of AWS accounts via CDK resources. Account discovery uses stages
     * and stacks to find all accounts that the CDK has resources for.
     *
     * Environment agnostic stages and stacks cannot be used for auto-discovery.
     *
     * With auto-discovery enabled, the stack containing the Transit Gateway will need to be
     * updated before it will become available in newly added accounts. Because of this it is
     * inferior to using grouping principals such as organizations or organizational units.
     *
     * If access to sharing via AWS OIrganizations is available, that should be preferred over
     * auto-discovery.
     *
     * Transit gateway sharing will be anabled if either auto-discovery is enabled or principals
     * are specified.
     */
  readonly autoDiscovery?: boolean;

  /**
     * The ID of the default Transit Gateway Route Table that got created for the Transit Gateway
     * associated with this VPC.
     *
     * This is needed because the default route table is used for handling routing of all traffic within
     * the organization but not exposed directly via CloudFormation.
     *
     * See [feature request](https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/180)
     * related to this in the AWS CloudFormation roadmap.
     *
     * This is only needed if the VPC is being configured to act as a hub for network traffic. Won't be
     * available until after this stack has been deployed for the first time.
     */
  readonly defaultRouteTableId?: string;

  /**
     * A list of principals which allow other accounts access to the Transit Gateway. With shared
     * access, other accounts can create Attachments to facilitate cross account networking.
     *
     * Principals provided should not overlap with CDK resources if auto-discovery is enabled.
     *
     * Transit gateway sharing will be anabled if either auto-discovery is enabled or principals
     * are specified.
     */
  readonly principals?: ISharedPrincipal[];
}