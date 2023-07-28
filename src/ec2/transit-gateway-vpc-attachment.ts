import { CfnTransitGatewayVpcAttachment } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGatewayAttachmentResource, TransitGatewayAttachmentResourceProps } from './transit-gateway-attachment-base';
import { definedFieldsOrUndefined } from '../utils/formatting';


/**
 * Configuration for TransitGatewayVpcAttachment resource.
 */
export interface TransitGatewayVpcAttachmentProps extends TransitGatewayAttachmentResourceProps {}

/**
 * Attaches a VPC to a transit gateway.
 *
 * If you attach a VPC with a CIDR range that overlaps the CIDR range of a VPC
 * that is already attached, the new VPC CIDR range is not propagated to the
 * default propagation route table.
 */
export class TransitGatewayVpcAttachment extends TransitGatewayAttachmentResource {
  /**
   * The underlying TransitGatewayVpcAttachment CloudFormation resource.
   *
   * @see [AWS::EC2::TransitGatewayVpcAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTransitGatewayVpcAttachment;

  /**
   * The ARN of this Transit Gateway Attachment.
   */
  public readonly transitGatewayAttachmentArn: string;

  /**
   * The ID of this Transit Gateway Attachment.
   */
  public readonly transitGatewayAttachmentId: string;


  /**
   * Creates a new instance of the TransitGatewayVpcAttachment class.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayVpcAttachmentProps) {
    super(scope, id, props);

    this.resource = new CfnTransitGatewayVpcAttachment(this, 'Resource', {
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