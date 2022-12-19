import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { ITransitGateway } from '../../transit-gateway';
import { ITgwDestination, TgwDestinationConfiguration } from './tgw-destination-base';


export interface TgwVpcDestinationBaseProps {
  /**
   * Enables appliance mode on the attachment.
   *
   * When appliance mode is enabled, all traffic flowing between attachments is
   * forwarded to an appliance in a shared VPC to be inspected and processed.
   *
   * @see [TransitGatewayVpcAttachment ApplianceModeSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-appliancemodesupport)
   * @see [Appliance in a shared services VPC](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-scenario.html)
   */
  readonly applianceModeSupport?: boolean;

  /**
   * Enables DNS support for the attachment.
   *
   * With DNS Support enabled public DNS names that resolve to a connected VPC
   * will be translated to private IP addresses when resolved in a connected VPC.
   *
   * @see [TransitGatewayVpcAttachment DnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-dnssupport)
   */
  readonly dnsSupport?: boolean;

  /**
   * Enables DNS support for the attachment.
   *
   * With DNS Support enabled public DNS names that resolve to a connected VPC
   * will be translated to private IP addresses when resolved in a connected VPC.
   *
   * @see [TransitGatewayVpcAttachment Ipv6Support](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-ipv6support)
   * @see [IPv6 connectivity with TransitGateway](https://docs.aws.amazon.com/whitepapers/latest/ipv6-on-aws/amazon-vpc-connectivity-options-for-ipv6.html#ipv6-connectivity-with-transit-gateway)
   */
  readonly ipv6Support?: boolean;

  /**
   * The name of the Transit Gateway Attachment.
   *
   * Used to tag the attachment with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayVpcAttachment Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-tags)
   */
  readonly name?: string;

  /**
   * The subnets where the attachment should be created.
   *
   * Can select up to one subnet per Availability Zone.
   *
   * @see [TransitGatewayVpcAttachment SubnetIds](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-subnetids)
   */
  readonly subnets?: SubnetSelection;

  /**
   * The transit gateway for which the attachment should be created.
   *
   * @see [TransitGatewayVpcAttachment TransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-transitgatewayid)
   */
  readonly transitGateway: ITransitGateway;

  /**
   * The VPC where the attachment should be created.
   *
   * @see [TransitGatewayVpcAttachment VpcId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-vpcid)
   */
  readonly vpc: IVpc;
}

export abstract class TgwVpcDestinationBase implements ITgwDestination {
  /**
   * Enables appliance mode on the attachment.
   *
   * When appliance mode is enabled, all traffic flowing between attachments is
   * forwarded to an appliance in a shared VPC to be inspected and processed.
   *
   * @see [TransitGatewayVpcAttachment ApplianceModeSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-appliancemodesupport)
   * @see [Appliance in a shared services VPC](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-scenario.html)
   */
  public readonly applianceModeSupport?: boolean;

  /**
   * Enables DNS support for the attachment.
   *
   * With DNS Support enabled public DNS names that resolve to a connected VPC
   * will be translated to private IP addresses when resolved in a connected VPC.
   *
   * @see [TransitGatewayVpcAttachment DnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-dnssupport)
   */
  public readonly dnsSupport?: boolean;

  /**
   * Enables DNS support for the attachment.
   *
   * With DNS Support enabled public DNS names that resolve to a connected VPC
   * will be translated to private IP addresses when resolved in a connected VPC.
   *
   * @see [TransitGatewayVpcAttachment Ipv6Support](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-ipv6support)
   * @see [IPv6 connectivity with TransitGateway](https://docs.aws.amazon.com/whitepapers/latest/ipv6-on-aws/amazon-vpc-connectivity-options-for-ipv6.html#ipv6-connectivity-with-transit-gateway)
   */
  public readonly ipv6Support?: boolean;

  /**
   * The name of the Transit Gateway Attachment.
   *
   * Used to tag the attachment with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayVpcAttachment Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-tags)
   */
  public readonly name?: string;

  /**
   * The subnets where the attachment should be created.
   *
   * Can select up to one subnet per Availability Zone.
   *
   * @see [TransitGatewayVpcAttachment SubnetIds](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-subnetids)
   */
  public readonly subnets?: SubnetSelection;

  /**
   * The VPC where the attachment should be created.
   *
   * @see [TransitGatewayVpcAttachment VpcId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-vpcid)
   */
  public readonly vpc: IVpc;


  /**
   * Creates a new instance of the VpcDestinationBase class.
   *
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(props: TgwVpcDestinationBaseProps) {
    this.applianceModeSupport = props.applianceModeSupport;
    this.dnsSupport = props.dnsSupport;
    this.ipv6Support = props.dnsSupport;
    this.name = props.name;
    this.subnets = props.subnets;
    this.vpc = props.vpc;
  }

  /**
   * Creates a new transit gateway attachment within the scope of the specified
   * resource.
   *
   * @param scope A CDK Construct that will serve as the parent for child
   * resources being created.
   * @param transitGateway The transit gateway where the attachment should be
   * created.
   */
  public abstract bind(scope: IConstruct, transitGateway: ITransitGateway): TgwDestinationConfiguration;


}