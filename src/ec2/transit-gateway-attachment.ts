import { Resource, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGatewayAttachment, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ITransitGateway } from './transit-gateway';
import { TransitGatewayRoute } from './transit-gateway-route';
import { TransitGatewayRouteTable } from './transit-gateway-route-table';


export interface ITransitGatewayAttachment {
  readonly transitGatewayAttachmentArn: string;
  readonly transitGatewayAttachmentId: string;
  addRoute(cidr: string, routeTable: TransitGatewayRouteTable): TransitGatewayRoute;
}

abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  /**
     * The ARN of this Transit Gateway Attachment.
     */
  public abstract readonly transitGatewayAttachmentArn: string;

  /**
     * The name of this Transit Gateway Attachment.
     */
  public abstract readonly transitGatewayAttachmentId: string;

  /**
     * Adds a route to this Transit Gateway Route Table.
     *
     * @param options Configuration for the route being added.
     * @returns The TransitGatewayRoute that was added.
     */
  public addRoute(cidr: string, routeTable: TransitGatewayRouteTable): TransitGatewayRoute {
    return routeTable.addRoute({
      cidr: cidr,
      attachment: this,
    });
  }
}

/**
 * Configuration for TransitGatewayAttachment resource.
 */
export interface TransitGatewayAttachmentProps extends ResourceProps {
  readonly name?: string;
  readonly subnets?: SubnetSelection;
  readonly transitGateway: ITransitGateway;
  readonly vpc: IVpc;
}

export class TransitGatewayAttachment extends TransitGatewayAttachmentBase {
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

  // Input properties
  public readonly name?: string;
  public readonly subnets: SubnetSelection;
  public readonly transitGateway: ITransitGateway;
  public readonly vpc: IVpc;

  // Resource properties
  public readonly resource: CfnTransitGatewayAttachment;

  // Standard properties
  public readonly transitGatewayAttachmentArn: string;
  public readonly transitGatewayAttachmentId: string;


  /**
     * Creates a new instance of the TransitGatewayAttachment class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TransitGatewayAttachmentProps) {
    super(scope, id, props);

    this.name = props.name;
    this.subnets = props.subnets ?? {
      onePerAz: true,
    };
    this.transitGateway = props.transitGateway;
    this.vpc = props.vpc;

    Tags.of(this).add('Name', this.name ?? this.node.path);

    this.resource = new CfnTransitGatewayAttachment(this, 'Resource', {
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