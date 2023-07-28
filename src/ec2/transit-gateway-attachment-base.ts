import { Resource, ResourceProps, Tags } from 'aws-cdk-lib';
import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGateway } from './transit-gateway';
import { ITransitGatewayRoute } from './transit-gateway-route';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';


/**
 * Represents a Transit Gateway Attachment in AWS.
 */
export interface ITransitGatewayAttachment {
  /**
   * The ARN of the transit gateway attachment.
   */
  readonly transitGatewayAttachmentArn: string;

  /**
   * The ID of the transit gateway attachment.
   */
  readonly transitGatewayAttachmentId: string;

  /**
   * Adds a route that directs traffic to this transit gateway attachment.
   *
   * @param id Unique identifier for the route being added. Must be unique for
   * each call to `addRoute`.
   * @param cidr CIDR range that should be routed to this attachment.
   * @param routeTable The transit gateway route table where the route should
   * be added.
   * @returns The TransitGatewayRoute that was added.
   */
  addRoute(id: string, cidr: string, routeTable: ITransitGatewayRouteTable): ITransitGatewayRoute;
}

/**
 * A base class providing common functionality between created and imported
 * Transit Gateway Attachments.
 */
export abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  /**
   * The ARN of this Transit Gateway Attachment.
   */
  public abstract readonly transitGatewayAttachmentArn: string;

  /**
   * The name of this Transit Gateway Attachment.
   */
  public abstract readonly transitGatewayAttachmentId: string;

  /**
   * Adds a route that directs traffic to this transit gateway attachment.
   *
   * @param cidr CIDR range that should be routed to this attachment.
   * @param routeTable The transit gateway route table where the route should
   * be added.
   * @returns The TransitGatewayRoute that was added.
   */
  public addRoute(id: string, cidr: string, routeTable: ITransitGatewayRouteTable): ITransitGatewayRoute {
    return routeTable.addRoute(id, {
      cidr: cidr,
      attachment: this,
    });
  }
}

/**
 * Configuration for TransitGatewayAttachmentResource resource.
 */
export interface TransitGatewayAttachmentResourceProps extends ResourceProps {
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

/**
 * Attaches a VPC to a transit gateway.
 *
 * If you attach a VPC with a CIDR range that overlaps the CIDR range of a VPC
 * that is already attached, the new VPC CIDR range is not propagated to the
 * default propagation route table.
 */
export abstract class TransitGatewayAttachmentResource extends TransitGatewayAttachmentBase {
  /**
   * Enables appliance mode on the attachment.
   *
   * When appliance mode is enabled, all traffic flowing between attachments is
   * forwarded to an appliance in a shared VPC to be inspected and processed.
   *
   * @see [TransitGatewayVpcAttachment ApplianceModeSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-appliancemodesupport)
   * @see [Appliance in a shared services VPC](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-scenario.html)
   *
   * @group Inputs
   */
  public readonly applianceModeSupport?: boolean;

  /**
   * Enables DNS support for the attachment.
   *
   * With DNS Support enabled public DNS names that resolve to a connected VPC
   * will be translated to private IP addresses when resolved in a connected VPC.
   *
   * @see [TransitGatewayVpcAttachment DnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-transitgatewayvpcattachment-options.html#cfn-ec2-transitgatewayvpcattachment-options-dnssupport)
   *
   * @group Inputs
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
   *
   * @group Inputs
   */
  public readonly ipv6Support?: boolean;

  /**
   * The name of the Transit Gateway Attachment.
   *
   * Used to tag the attachment with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayVpcAttachment Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-tags)
   *
   * @group Inputs
   */
  public readonly name?: string;

  /**
   * The subnets where the attachment should be created.
   *
   * Can select up to one subnet per Availability Zone.
   *
   * @see [TransitGatewayVpcAttachment SubnetIds](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-subnetids)
   *
   * @group Inputs
   */
  public readonly subnets: SubnetSelection;

  /**
   * The transit gateway for which the attachment should be created.
   *
   * @group Inputs
   */
  public readonly transitGateway: ITransitGateway;

  /**
   * The VPC where the attachment should be created.
   *
   * @see [TransitGatewayVpcAttachment VpcId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayvpcattachment.html#cfn-ec2-transitgatewayvpcattachment-vpcid)
   *
   * @group Inputs
   */
  public readonly vpc: IVpc;

  /**
   * The ARN of this Transit Gateway Attachment.
   */
  public abstract readonly transitGatewayAttachmentArn: string;

  /**
   * The ID of this Transit Gateway Attachment.
   */
  public abstract readonly transitGatewayAttachmentId: string;


  /**
   * Creates a new instance of the TransitGatewayAttachment class.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayAttachmentResourceProps) {
    super(scope, id, props);

    this.applianceModeSupport = props.applianceModeSupport;
    this.dnsSupport = props.dnsSupport;
    this.ipv6Support = props.ipv6Support;
    this.name = props.name;
    this.subnets = props.subnets ?? {
      onePerAz: true,
    };
    this.transitGateway = props.transitGateway;
    this.vpc = props.vpc;

    Tags.of(this).add('Name', this.name ?? this.node.path);
  }

  /**
   * Translates a boolean input into the strings used by the transit gateway
   * attachment resource to implement boolean values.
   *
   * @param val The input value to translate.
   * @returns The string used to reprersent the input boolean or undefined if
   * the input boolean is undefined.
   */
  protected translateBoolean(val?: boolean): string | undefined {
    if (val === undefined) {
      return undefined;
    }

    return val ? 'enable' : 'disable';
  }
}