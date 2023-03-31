import { Arn, ArnFormat, Lazy, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGatewayPeeringAttachment } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ITransitGateway } from './transit-gateway';
import { ITransitGatewayAttachment, TransitGatewayAttachmentBase } from './transit-gateway-attachment-base';


/**
 * Represents a transit gateway route table in AWS.
 */
export interface ITransitGatewayPeeringAttachment extends ITransitGatewayAttachment {
  /**
   * The time the transit gateway peering attachment was created.
   */
  readonly transitGatewayAttachmentCreationTime: string;

  /**
   * The state of the transit gateway peering attachment.
   */
  readonly transitGatewayAttachmentState: string;

  /**
   * The status of the transit gateway peering attachment.
   */
  readonly transitGatewayAttachmentStatus: string;

  /**
   * The status code for the current status of the attachment.
   */
  readonly transitGatewayAttachmentStatusCode: string;

  /**
   * The status message for the current status of the attachment.
   */
  readonly transitGatewayAttachmentStatusMessage: string;
}

/**
 * A base class providing common functionality between created and imported
 * transit gateway route tables.
 */
abstract class TransitGatewayPeeringAttachmentBase extends TransitGatewayAttachmentBase implements ITransitGatewayPeeringAttachment {
  /**
   * The time the transit gateway peering attachment was created.
   */
  public abstract readonly transitGatewayAttachmentCreationTime: string;

  /**
    * The state of the transit gateway peering attachment.
    */
  public abstract readonly transitGatewayAttachmentState: string;

  /**
    * The status of the transit gateway peering attachment.
    */
  public abstract readonly transitGatewayAttachmentStatus: string;

  /**
    * The status code for the current status of the attachment.
    */
  public abstract readonly transitGatewayAttachmentStatusCode: string;

  /**
    * The status message for the current status of the attachment.
    */
  public abstract readonly transitGatewayAttachmentStatusMessage: string;
}

/**
 * Configuration options for importing a transit gateway peering attachment.
 */
export interface TransitGatewayPeeringAttachmentImportAttributes {
  /**
   * The ARN of this Transit Gateway Attachment.
   */
  readonly arn?: string;

  /**
   * The ID of this Transit Gateway Attachment.
   */
  readonly attachmentId?: string;

  /**
   * The time the transit gateway peering attachment was created.
   */
  readonly creationTime?: string;

  /**
   * The state of the transit gateway peering attachment.
   */
  readonly state?: string;

  /**
   * The status of the transit gateway peering attachment.
   */
  readonly status?: string;

  /**
   * The status code for the current status of the attachment.
   */
  readonly statusCode?: string;

  /**
   * The status message for the current status of the attachment.
   */
  readonly statusMessage?: string;
}

/**
 * Optional configuration for TransitGatewayPeeringAttachment resource.
 */
export interface TransitGatewayPeeringAttachmentOptions {
  /**
   * The name of the transit gateway peering attachment.
   *
   * Used to tag the attachment with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayPeeringAttachment Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-tags)
   */
  readonly name?: string;

  /**
   * The account that contains the transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerAccountId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peeraccountid)
   */
  readonly peerAccountId?: string;

  /**
   * The region that contains the transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerRegion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peerregion)
   */
  readonly peerRegion?: string;
}

/**
 * Configuration for TransitGatewayPeeringAttachment resource.
 */
export interface TransitGatewayPeeringAttachmentProps extends TransitGatewayPeeringAttachmentOptions, ResourceProps {
  /**
   * The local side of the transit gateway peering connection.
   *
   * @see [TransitGatewayPeeringAttachment TransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-transitgatewayid)
   */
  readonly localTransitGateway: ITransitGateway;

  /**
   * The remote transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerTransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peertransitgatewayid)
   */
  readonly peerTransitGateway: ITransitGateway;
}

/**
 * Requests a transit gateway peering attachment between the specified transit
 * gateway (requester) and a peer transit gateway (accepter). The peer transit
 * gateway can be in your account or a different AWS account.
 *
 * After you create the peering attachment, the owner of the accepter transit
 * gateway must accept the attachment request.
 *
 * @see [AWS::EC2::TransitGatewayPeeringAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html)
 */
export class TransitGatewayPeeringAttachment extends TransitGatewayPeeringAttachmentBase {
  /**
   * Imports an existing transit gateway peering attachment using its ARN.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param arn The Amazon Resource Name (ARN) of the resource being imported.
   * @returns An object representing the imported transit gateway peering
   * attachment.
   */
  public static fromTransitGatewayPeeringAttachmentArn(scope: IConstruct, id: string, arn: string): ITransitGatewayPeeringAttachment {
    return TransitGatewayPeeringAttachment.fromTransitGatewayPeeringAttachmentAttributes(scope, id, {
      arn: arn,
    });
  }

  /**
   * Imports an existing transit gateway peering attachment by defining its
   * components.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attrs An object describing the details of the resource being
   * imported.
   * @returns An object representing the imported transit gateway peering
   * attachment.
   */
  public static fromTransitGatewayPeeringAttachmentAttributes(
    scope: IConstruct,
    id: string,
    attrs: TransitGatewayPeeringAttachmentImportAttributes,
  ): ITransitGatewayPeeringAttachment {
    let attachmentArn = attrs.arn;
    let attachmentId = attrs.attachmentId;

    if (attachmentArn === undefined && attachmentId === undefined) {
      throw new Error([
        "Must specify at least one of 'arn' or 'attachmentId' when importing",
        'a transit peering attachment using attributes.',
      ].join(' '));
    }

    attachmentArn = attachmentArn ?? Stack.of(scope).formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      service: 'ec2',
      resource: 'transit-gateway-attachment',
      resourceName: attachmentId,
    });

    attachmentId = attachmentId ?? Arn.split(attachmentArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    class Import extends TransitGatewayPeeringAttachmentBase {
      public readonly transitGatewayAttachmentArn: string = attachmentArn!;

      public readonly transitGatewayAttachmentCreationTime: string = attrs.creationTime ?? Lazy.string({
        produce: () => {
          throw new Error([
            'Imported transit gateway peering attachment did not have a value',
            "'transitGatewayAttachmentCreationTime' specified.",
          ].join(' '));
        },
      });

      public readonly transitGatewayAttachmentId: string = attachmentId!;

      public readonly transitGatewayAttachmentState: string = attrs.state ?? Lazy.string({
        produce: () => {
          throw new Error([
            'Imported transit gateway peering attachment did not have a value',
            "'transitGatewayAttachmentState' specified.",
          ].join(' '));
        },
      });

      public readonly transitGatewayAttachmentStatus: string = attrs.status ?? Lazy.string({
        produce: () => {
          throw new Error([
            'Imported transit gateway peering attachment did not have a value',
            "'transitGatewayAttachmentStatus' specified.",
          ].join(' '));
        },
      });

      public readonly transitGatewayAttachmentStatusCode: string = attrs.statusCode ?? Lazy.string({
        produce: () => {
          throw new Error([
            'Imported transit gateway peering attachment did not have a value',
            "'transitGatewayAttachmentStatusCode' specified.",
          ].join(' '));
        },
      });

      public readonly transitGatewayAttachmentStatusMessage: string = attrs.statusMessage ?? Lazy.string({
        produce: () => {
          throw new Error([
            'Imported transit gateway peering attachment did not have a value',
            "'transitGatewayAttachmentStatusMessage' specified.",
          ].join(' '));
        },
      });
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing transit gateway peering attachment using its
   * attachment ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attachmentId The ID of the resource being imported.
   * @returns An object representing the imported transit gateway peering
   * attachment.
   */
  public static fromTransitGatewayPeeringAttachmentId(scope: IConstruct, id: string, attachmentId: string): ITransitGatewayPeeringAttachment {
    return TransitGatewayPeeringAttachment.fromTransitGatewayPeeringAttachmentAttributes(scope, id, {
      attachmentId: attachmentId,
    });
  }


  /**
   * The local side of the transit gateway peering connection.
   *
   * @see [TransitGatewayPeeringAttachment TransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-transitgatewayid)
   *
   * @group Inputs
   */
  public readonly localTransitGateway: ITransitGateway;

  /**
   * The name of the transit gateway peering attachment.
   *
   * Used to tag the attachment with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayPeeringAttachment Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-tags)
   *
   * @group Inputs
   */
  public readonly name?: string;

  /**
   * The account that contains the transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerAccountId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peeraccountid)
   *
   * @group Inputs
   */
  public readonly peerAccountId?: string;

  /**
   * The region that contains the transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerRegion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peerregion)
   *
   * @group Inputs
   */
  public readonly peerRegion?: string;

  /**
   * The remote transit gateway being peered with.
   *
   * @see [TransitGatewayPeeringAttachment PeerTransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewaypeeringattachment.html#cfn-ec2-transitgatewaypeeringattachment-peertransitgatewayid)
   *
   * @group Inputs
   */
  public readonly peerTransitGateway: ITransitGateway;

  /**
   * The underlying TransitGatewayRouteTable CloudFormation resource.
   *
   * @see [AWS::EC2::TransitGatewayRouteTable](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTransitGatewayPeeringAttachment;

  /**
   * The ARN of this transit gateway peering attachment.
   */
  public readonly transitGatewayAttachmentArn: string;

  /**
   * The time the transit gateway peering attachment was created.
   */
  public readonly transitGatewayAttachmentCreationTime: string;

  /**
   * The ID of this transit gateway peering attachment.
   */
  public readonly transitGatewayAttachmentId: string;

  /**
   * The state of the transit gateway peering attachment.
   */
  public readonly transitGatewayAttachmentState: string;

  /**
   * The status of the transit gateway peering attachment.
   */
  public readonly transitGatewayAttachmentStatus: string;

  /**
   * The status code for the current status of the attachment.
   */
  public readonly transitGatewayAttachmentStatusCode: string;

  /**
   * The status message for the current status of the attachment.
   */
  public readonly transitGatewayAttachmentStatusMessage: string;


  /**
   * Creates a new instance of the TransitGatewayPeeringAttachment class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the
   * construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayPeeringAttachmentProps) {
    super(scope, id, props);

    this.localTransitGateway = props.localTransitGateway;
    this.peerAccountId = props.account ?? Stack.of(props.peerTransitGateway).account;
    this.peerRegion = props.region ?? Stack.of(props.peerTransitGateway).region;
    this.peerTransitGateway = props.peerTransitGateway;

    Tags.of(this).add('Name', this.name ?? this.node.path);

    this.resource = new CfnTransitGatewayPeeringAttachment(this, 'Resource', {
      peerAccountId: this.peerAccountId,
      peerRegion: this.peerRegion,
      peerTransitGatewayId: this.peerTransitGateway.transitGatewayId,
      transitGatewayId: this.localTransitGateway.transitGatewayId,
    });

    this.transitGatewayAttachmentArn = this.stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      service: 'ec2',
      resource: 'transit-gateway-attachment',
      resourceName: this.resource.ref,
    });
    this.transitGatewayAttachmentCreationTime = this.resource.attrCreationTime;
    this.transitGatewayAttachmentId = this.resource.ref;
    this.transitGatewayAttachmentState = this.resource.attrState;
    this.transitGatewayAttachmentStatus = this.resource.getAtt('status').toString();
    this.transitGatewayAttachmentStatusCode = this.resource.attrStatusCode;
    this.transitGatewayAttachmentStatusMessage = this.resource.attrStatusMessage;
  }
}