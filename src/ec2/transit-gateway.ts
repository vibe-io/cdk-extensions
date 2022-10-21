import { Annotations, Lazy, Resource, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGateway, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ISharedPrincipal, ResourceShare, SharedResource } from '../ram';
import { TransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable, TransitGatewayRouteTable } from './transit-gateway-route-table';


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

export interface ITransitGateway {
  readonly transitGatewayArn: string;
  readonly transitGatewayId: string;
  addRouteTable(options?: TransitGatewayRouteTableOptions): TransitGatewayRouteTable;
  attachVpc(vpc: IVpc, options?: VpcAttachmentOptions): TransitGatewayAttachment;
}

abstract class TransitGatewayBase extends Resource implements ITransitGateway {
  /**
     * The ARN of this Transit Gateway.
     */
  public abstract readonly transitGatewayArn: string;

  /**
     * The name of this Transit Gateway.
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
     * Creates a new VPC Transit Gateway Attachment for this Transit Gateway.
     *
     * @param vpc The VPC to connect to this Transit Gateway.
     * @param options Options used for configuring the Transit Gateway Attachment.
     * @returns The newly created Transit Gateway Attachment.
     */
  public attachVpc(vpc: IVpc, options?: VpcAttachmentOptions): TransitGatewayAttachment {
    return new TransitGatewayAttachment(this, `attachment-vpc-${vpc.node.addr}`, {
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
  readonly defaultRouteTableId?: string;
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
  private _resourceShare?: ResourceShare;

  // Input properties
  public readonly amazonSideAsn?: number;
  public readonly autoAcceptSharedAttachments?: boolean;
  public readonly defaultRouteTableId?: string;
  public readonly description?: string;
  public readonly dnsSupport?: boolean;
  public readonly multicastSupport?: boolean;
  public readonly name?: string;
  public readonly vpnEcmpSupport?: boolean;

  // Resource properties
  public readonly defaultRouteTable?: ITransitGatewayRouteTable;
  public readonly resource: CfnTransitGateway;

  public get resourceShare(): ResourceShare | undefined {
    return this._resourceShare;
  }

  // Standard properties
  public readonly transitGatewayArn: string;
  public readonly transitGatewayId: string;


  /**
     * Creates a new instance of the Database class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TransitGatewayProps = {}) {
    super(scope, id, props);

    this.amazonSideAsn = props.amazonSideAsn;
    this.autoAcceptSharedAttachments = props.autoAcceptSharedAttachments;
    this.defaultRouteTableId = props.defaultRouteTableId;
    this.description = props.description;
    this.dnsSupport = props.dnsSupport;
    this.multicastSupport = props.multicastSupport;
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
      autoAcceptSharedAttachments: !!this.amazonSideAsn ? 'enable' : 'disable',
      description: this.description,
      dnsSupport: !!this.dnsSupport ? 'enable' : 'disable',
      multicastSupport: !!this.multicastSupport ? 'enable' : 'disable',
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

    this.transitGatewayArn = this.stack.formatArn({
      resource: 'transit-gateway',
      resourceName: this.resource.ref,
      service: 'ec2',
    });
    this.transitGatewayId = this.resource.ref;
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