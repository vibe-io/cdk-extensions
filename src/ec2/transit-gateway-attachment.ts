import { Stack } from 'aws-cdk-lib';
import { CfnTransitGatewayAttachment } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../utils/formatting';
import { ITransitGatewayAttachment, TransitGatewayAttachmentBase, TransitGatewayAttachmentResource, TransitGatewayAttachmentResourceProps } from './transit-gateway-attachment-base';


/**
 * Configuration for TransitGatewayAttachment resource.
 */
export interface TransitGatewayAttachmentProps extends TransitGatewayAttachmentResourceProps {}

/**
 * Attaches a VPC to a transit gateway.
 *
 * If you attach a VPC with a CIDR range that overlaps the CIDR range of a VPC
 * that is already attached, the new VPC CIDR range is not propagated to the
 * default propagation route table.
 */
export class TransitGatewayAttachment extends TransitGatewayAttachmentResource {
  /**
   * Imports an existing Transit Gateway Attachment using its attachment ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param transitGatewayAttachmentId The attachment ID of the Transit Gateway
   * attachment being imported.
   * @returns An object representing the imported transit gateway attachment.
   */
  public static fromTransitGatewayAttachmentId(scope: IConstruct, id: string, transitGatewayAttachmentId: string): ITransitGatewayAttachment {
    class Import extends TransitGatewayAttachmentBase {
      public readonly transitGatewayAttachmentArn = Stack.of(scope).formatArn({
        resource: 'transit-gateway-attachment',
        resourceName: transitGatewayAttachmentId,
        service: 'ec2',
      });
      public readonly transitGatewayAttachmentId = transitGatewayAttachmentId;
    }

    return new Import(scope, id);
  }

  /**
   * The underlying NamedQuery CloudFormation resource.
   *
   * @see [AWS::EC2::TransitGatewayVpcAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTransitGatewayAttachment;

  /**
   * The ARN of this Transit Gateway Attachment.
   */
  public readonly transitGatewayAttachmentArn: string;

  /**
   * The ID of this Transit Gateway Attachment.
   */
  public readonly transitGatewayAttachmentId: string;


  /**
   * Creates a new instance of the TransitGatewayAttachment class.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayAttachmentProps) {
    super(scope, id, props);

    this.resource = new CfnTransitGatewayAttachment(this, 'Resource', {
      options: definedFieldsOrUndefined({
        applianceModeSupport: this.translateBoolean(this.applianceModeSupport),
        dnsSupport: this.translateBoolean(this.dnsSupport),
        ipv6Support: this.translateBoolean(this.ipv6Support),
      }),
      subnetIds: this.vpc.selectSubnets(this.subnets).subnetIds,
      transitGatewayId: this.transitGateway.transitGatewayId,
      vpcId: this.vpc.vpcId,
    });

    this.transitGatewayAttachmentArn = this.stack.formatArn({
      resource: 'transit-gateway-attachment',
      resourceName: this.resource.ref,
      service: 'ec2',
    });
    this.transitGatewayAttachmentId = this.resource.ref;
  }
}