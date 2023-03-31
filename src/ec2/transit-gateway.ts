import { Annotations, Lazy, Resource, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGateway, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { VpnConnectionLocalEndpoint } from './lib/local-vpn-endpoint/local-endpoint';
import { IRemoteVpnEndpoint } from './lib/remote-vpn-endpoint/remote-endpoint-base';
import { TransitGatewayAttachment } from './transit-gateway-attachment';
import { TransitGatewayPeeringAttachment, TransitGatewayPeeringAttachmentOptions } from './transit-gateway-peering-attachment';
import { ITransitGatewayRouteTable, TransitGatewayRouteTable } from './transit-gateway-route-table';
import { TunnelOptions, VpnConnection, VpnConnectionType } from './vpn-connection';
import { SecretReference } from '../core';
import { ISharedPrincipal, ResourceShare } from '../ram';
import { SharedResource } from '../ram-resources';


export interface SharingOptions {
  readonly allowExternalPrincipals?: boolean;
  readonly autoDiscoverAccounts?: boolean;
  readonly principals?: ISharedPrincipal[];
}

export interface TransitGatewayRouteTableOptions {
  readonly name?: string;
}

export interface VpcAttachmentOptions {
  readonly name?: string;
  readonly subnets?: SubnetSelection;
}

export interface VpnAttachmentOptions {
  readonly connectionType?: VpnConnectionType;
  readonly remoteEndpoint: IRemoteVpnEndpoint;
  readonly staticRoutesOnly?: boolean;
  readonly tunnelConfigurations?: TunnelOptions[];
}

/**
 * Represents a transit gateway in AWS.
 */
export interface ITransitGateway extends IConstruct {
  readonly transitGatewayArn: string;
  readonly transitGatewayId: string;
  addRouteTable(options?: TransitGatewayRouteTableOptions): TransitGatewayRouteTable;
  addVpn(id: string, options: VpnAttachmentOptions): VpnConnection;
  attachVpc(vpc: IVpc, options?: VpcAttachmentOptions): TransitGatewayAttachment;
}

/**
 * A base class providing common functionality between created and imported
 * transit gateways.
 */
abstract class TransitGatewayBase extends Resource implements ITransitGateway {
  /**
   * The ARN of this Transit Gateway.
   */
  public abstract readonly transitGatewayArn: string;

  /**
   * The ID of this Transit Gateway.
   */
  public abstract readonly transitGatewayId: string;

  /**
   * Creates a new Transit Gateway Route Table for this Transit Gateway.
   *
   * @param options Options used for configuring the Transit Gateway Route Table.
   * @returns The newly created Transit Gateway Route Table.
   */
  public addRouteTable(options?: TransitGatewayRouteTableOptions): TransitGatewayRouteTable {
    const index = this.node.children.filter((x) => {
      return x instanceof TransitGatewayRouteTable;
    }).length.toString().padStart(3, '0');

    return new TransitGatewayRouteTable(this, `transit-gateway-route-table-${index}`, {
      name: options?.name,
      transitGateway: this,
    });
  }

  /**
   * Creates a new VPN connection that terminates on the AWS side at this
   * Transit Gateway.
   *
   * @param id A unique identifier for this VPN connection. Must be unique
   * within the context of scope.
   * @param options The options for configuring the VPN connection.
   * @returns The VPN connection that was created.
   */
  public addVpn(id: string, options: VpnAttachmentOptions): VpnConnection {
    return new VpnConnection(this, `vpn-${id}`, {
      localEndpoint: VpnConnectionLocalEndpoint.fromTransitGateway(this),
      ...options,
    });
  }

  /**
   * Creates a new transit gateway peering attachment for this transit gateway.
   *
   * @param peer The remote transit gateway to create the peering connection
   * with.
   * @param options Options used to configure the peering connection.
   * @returns The newly created TransitGatewayPeeringAttachment.
   */
  public attachPeer(peer: ITransitGateway, options?: TransitGatewayPeeringAttachmentOptions): TransitGatewayPeeringAttachment {
    return new TransitGatewayPeeringAttachment(this, `attachment-peering-${peer.node.addr}`, {
      ...options,
      localTransitGateway: this,
      peerTransitGateway: peer,
    });
  }

  /**
   * Creates a new VPC transit gateway attachment for this transit gateway.
   *
   * @param vpc The VPC to connect to this Transit Gateway.
   * @param options Options used for configuring the Transit Gateway Attachment.
   * @returns The newly created TransitGatewayAttachment.
   */
  public attachVpc(vpc: IVpc, options?: VpcAttachmentOptions): TransitGatewayAttachment {
    return new TransitGatewayAttachment(vpc, `transit-gateway-attachment-${this.node.addr}`, {
      ...options,
      transitGateway: this,
      vpc: vpc,
    });
  }
}

/**
 * Configuration for TransitGateway resource.
 */
export interface TransitGatewayProps extends ResourceProps {
  readonly amazonSideAsn?: number;
  readonly autoAcceptSharedAttachments?: boolean;
  readonly cidrBlocks?: string[];
  readonly defaultRouteTableAssociation?: boolean;
  readonly defaultRouteTableId?: string;
  readonly defaultRouteTablePropagation?: boolean;
  readonly description?: string;
  readonly dnsSupport?: boolean;
  readonly multicastSupport?: boolean;
  readonly name?: string;
  readonly vpnEcmpSupport?: boolean;
}

export class TransitGateway extends TransitGatewayBase {
  public static fromTransitGatewayId(scope: IConstruct, id: string, transitGatewayId: string): ITransitGateway {
    class Import extends TransitGatewayBase {
      public readonly transitGatewayArn = Stack.of(scope).formatArn({
        resource: 'transit-gateway',
        resourceName: transitGatewayId,
        service: 'ec2',
      });
      public readonly transitGatewayId = transitGatewayId;
    }

    return new Import(scope, id);
  }

  // Internal properties
  private readonly _cidrBlocks: string[] = [];

  /**
   * Internal modifiable resource that can be used for tracking the RAM
   * resource share that is used to share this transit gateway.
   */
  private _resourceShare?: ResourceShare;

  /**
   * A private Autonomous System Number (ASN) for the Amazon side of a BGP
   * session. The range is 64512 to 65534 for 16-bit ASNs.
   *
   * @see [TransitGateway.AmazonSideAsn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-amazonsideasn)
   *
   * @group Inputs
   */
  public readonly amazonSideAsn?: number;

  /**
   * Enable or disable automatic acceptance of attachment requests.
   *
   * When enabled any new transit gateway attachments that are created in other
   * accounts via a resource share will be accepted automatically. Otherwise,
   * manual intervention will be required to approve all new attachments.
   *
   * This is disabled by default to maintain the highest levels of security,
   * however enabling should be strongly considered as without this full
   * automation of infrastructure will not be possible for cross account
   * setups.
   *
   * @see [TransitGateway.AutoAcceptSharedAttachments](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-autoacceptsharedattachments)
   * @see [Accept a shared attachment](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html#tgw-accept-shared-attachment)
   *
   * @group Inputs
   */
  public readonly autoAcceptSharedAttachments: boolean;

  /**
   * Enable or disable automatic association with the default association route
   * table.
   *
   * When enabled, all new attachments that are accepted will be automatically
   * associated with the default association route table. By default this is
   * the route table that is created automatically when the transit gateway is
   * created.
   *
   * @see [TransitGateway.DefaultRouteTableAssociation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-defaultroutetableassociation)
   *
   * @group Inputs
   */
  public readonly defaultRouteTableAssociation: boolean;

  /**
   * The ID of the default route table that was created with the transit
   * gateway.
   *
   * This route table is critical to some transit gateway architectures and is
   * not exposed by CloudFormation.
   *
   * Passing in the ID of the default route table will make an object available
   * that represents it and can be used for further operations.
   *
   * @group Inputs
   */
  public readonly defaultRouteTableId?: string;

  /**
   * Enable or disable automatic propagation of routes to the default
   * propagation route table.
   *
   * When a new attachment is accepted, the routes associated with that
   * attachment will automatically be added to the default propagation route
   * table. By default this is the route table that is created automatically
   * when the transit gateway is created.
   *
   * @see [TransitGateway.DefaultRouteTablePropagation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-defaultroutetablepropagation)
   * @see [Route propagation](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-route-propagation-overview)
   *
   * @group Inputs
   */
  public readonly defaultRouteTablePropagation: boolean;

  /**
   * The description of the transit gateway.
   *
   * @see [TransitGateway.Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-description)
   *
   * @group Inputs
   */
  public readonly description?: string;

  /**
   * Enable or disable DNS support.
   *
   * When DNS support is enabled on a transit gateway, VPC DNS resolution in
   * attached VPC's will automatically resolve public IP addresses from other
   * VPC's to their provate IP address equivalent.
   *
   * @see [TransitGateway.DnsSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-dnssupport)
   * @see [Create a transit gateway](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html#create-tgw)
   *
   * @group Inputs
   */
  public readonly dnsSupport: boolean;

  /**
   * Indicates whether multicast is enabled on the transit gateway.
   *
   * @see [TransitGateway.MulticastSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-multicastsupport)
   * @see [Multicast on transit gateways](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-multicast-overview.html)
   * @see [Multicast reference architectures](https://d1.awsstatic.com/architecture-diagrams/ArchitectureDiagrams/transitgateway_multicast_ra.pdf?did=wp_card&trk=wp_card)
   *
   * @group Inputs
   */
  public readonly multicastSupport: boolean;

  /**
   * The name of the transit gateway.
   *
   * Used to tag the transit gateway with a name that will be displayed in the
   * AWS VPC console.
   *
   * @see [TransitGateway.Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-tags)
   *
   * @group Inputs
   */
  public readonly name?: string;

  /**
   * Enable or disable Equal Cost Multipath Protocol support.
   *
   * @see [TransitGateway.VpnEcmpSupport](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html#cfn-ec2-transitgateway-vpnecmpsupport)
   * @see [Achieve ECMP with multiple VPN tunnels](https://aws.amazon.com/premiumsupport/knowledge-center/transit-gateway-ecmp-multiple-tunnels/)
   *
   * @group Inputs
   *
   */
  public readonly vpnEcmpSupport?: boolean;

  /**
   * The default route table that got created along with the Transit Gateway.
   *
   * This information is not exposed by CloudFormation. As such, this resource
   * will only be available if the default reoute table ID is passed in.
   *
   * @group Resources
   */
  public readonly defaultRouteTable?: ITransitGatewayRouteTable;

  /**
   * The underlying TransitGateway CloudFormation resource.
   *
   * @see [AWS::EC2::TransitGateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgateway.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTransitGateway;

  /**
   * The RAM resource share that is used for sharing the transit gateway with
   * other accounts.
   *
   * @group Resources
   */
  public get resourceShare(): ResourceShare | undefined {
    return this._resourceShare;
  }

  /**
   * The ARN of this Transit Gateway.
   */
  public readonly transitGatewayArn: string;

  /**
   * The ID of this Transit Gateway.
   */
  public readonly transitGatewayId: string;


  /**
   * Creates a new instance of the Database class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayProps = {}) {
    super(scope, id, props);

    this.amazonSideAsn = props.amazonSideAsn;
    this.autoAcceptSharedAttachments = props.autoAcceptSharedAttachments ?? false;
    this.defaultRouteTableAssociation = props.defaultRouteTableAssociation ?? true;
    this.defaultRouteTableId = props.defaultRouteTableId;
    this.defaultRouteTablePropagation = props.defaultRouteTablePropagation ?? true;
    this.description = props.description;
    this.dnsSupport = props.dnsSupport ?? true;
    this.multicastSupport = props.multicastSupport ?? false;
    this.name = props.name;
    this.vpnEcmpSupport = props.vpnEcmpSupport;

    props.cidrBlocks?.forEach((x) => {
      this.addCidrBlock(x);
    });

    if (!this.defaultRouteTableId) {
      Annotations.of(this).addWarning([
        `No transit gateway default route table ID provided for ${this.node.path}. If this is your first time deploying this is expected.`,
        'CloudFormation provides no means of getting the route table ID so it must be manually specified after the fact.',
        'Once the first deploy is finished you should provide the default route table ID and do an update.',
        `You can find the default route table ID in the AWS console, selecting the ${this.stack.region} region region, and going to: Services > VPC > Transit Gateway Route Tables.`,
        'Routing may not work properly until the default route table has been provided and another update has been ran.',
      ].join(' '));
    } else {
      this.defaultRouteTable = TransitGatewayRouteTable.fromTransitGatewayRouteTableId(this, 'default-route-table', this.defaultRouteTableId);
    }

    Tags.of(this).add('Name', this.name ?? this.node.path);

    this.resource = new CfnTransitGateway(this, 'Resource', {
      amazonSideAsn: this.amazonSideAsn,
      autoAcceptSharedAttachments: this.autoAcceptSharedAttachments ? 'enable' : 'disable',
      defaultRouteTableAssociation: this.defaultRouteTableAssociation ? 'enable' : 'disable',
      defaultRouteTablePropagation: this.defaultRouteTablePropagation ? 'enable' : 'disable',
      description: this.description,
      dnsSupport: this.dnsSupport ? 'enable' : 'disable',
      multicastSupport: this.multicastSupport ? 'enable' : 'disable',
      transitGatewayCidrBlocks: Lazy.uncachedList(
        {
          produce: () => {
            return this._cidrBlocks;
          },
        },
        {
          omitEmpty: true,
        },
      ),
      vpnEcmpSupport: !!this.vpnEcmpSupport ? 'enable' : 'disable',
    });

    this.transitGatewayArn = SecretReference.string(this, 'transit-gateway-arn', this.stack.formatArn({
      resource: 'transit-gateway',
      resourceName: this.resource.ref,
      service: 'ec2',
    }));
    this.transitGatewayId = SecretReference.string(this, 'transit-gateway-id', this.resource.ref);

    /*this.stack.formatArn({
      resource: 'transit-gateway',
      resourceName: this.resource.ref,
      service: 'ec2',
    });
    this.transitGatewayId = this.resource.ref;*/
  }

  public addCidrBlock(cidr: string): void {
    this._cidrBlocks.push(cidr);
  }

  public enableSharing(options?: SharingOptions): ResourceShare {
    if (this.resourceShare) {
      Annotations.of(this).addWarning([
        'Attempted to enable Transit Gateway Resource Share when an',
        'existing resource share already exists. Sharing options',
        'during subsequent calls will be ignored.',
      ].join(' '));
      return this.resourceShare;
    } else {
      this._resourceShare = new ResourceShare(this, 'resource-share', {
        allowExternalPrincipals: options?.allowExternalPrincipals,
        autoDiscoverAccounts: options?.autoDiscoverAccounts,
        principals: options?.principals,
        resources: [
          SharedResource.fromTransitGateway(this),
        ],
      });
      return this._resourceShare;
    }
  }
}