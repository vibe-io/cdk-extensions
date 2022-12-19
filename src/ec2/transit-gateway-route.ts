import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnTransitGatewayRoute } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGatewayAttachment, ITransitGatewayRouteTable } from '.';


/**
 * Represents a Transit Gateway Route in AWS.
 */
export interface ITransitGatewayRoute {
  /**
   * The ID of the Transit Gateway Route.
   */
  readonly transitGatewayRouteId: string;
}

/**
 * A base class providing common functionality between created and imported
 * Transit Gateway routes.
 */
abstract class TransitGatewayRouteBase extends Resource implements ITransitGatewayRoute {
  /**
   * The ID of the Transit Gateway Route.
   */
  public abstract transitGatewayRouteId: string;
}

/**
 * Configuration for TransitGatewayRoute resource.
 */
export interface TransitGatewayRouteProps extends ResourceProps {
  readonly attachment?: ITransitGatewayAttachment;
  readonly blackhole?: boolean;
  readonly cidr: string;
  readonly routeTable: ITransitGatewayRouteTable;
}

export class TransitGatewayRoute extends Resource {
  // Input properties
  public readonly attachment?: ITransitGatewayAttachment;
  public readonly blackhole?: boolean;
  public readonly cidr: string;
  public readonly routeTable: ITransitGatewayRouteTable;

  // Resource properties
  public readonly resource: CfnTransitGatewayRoute;

  // Standard properties
  public readonly transitGatewayRouteId: string;


  /**
     * Creates a new instance of the TransitGatewayAttachment class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TransitGatewayRouteProps) {
    super(scope, id, props);

    this.attachment = props.attachment;
    this.blackhole = props.blackhole;
    this.cidr = props.cidr;
    this.routeTable = props.routeTable;

    this.resource = new CfnTransitGatewayRoute(this, 'Resource', {
      blackhole: this.blackhole,
      destinationCidrBlock: this.cidr,
      transitGatewayRouteTableId: this.routeTable.transitGatewayRouteTableId,
      transitGatewayAttachmentId: this.attachment?.transitGatewayAttachmentId,
    });

    this.transitGatewayRouteId = this.resource.ref;
  }
}