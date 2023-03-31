import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnTransitGatewayRoute } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ITransitGatewayRouteTable } from '.';
import { ITransitGatewayAttachment } from './transit-gateway-attachment-base';


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

/**
 * Adds a routing rule for a transit gateway route table.
 */
export class TransitGatewayRoute extends Resource {
  /**
   * Imports an existing Transit Gateway Route using its route ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param transitGatewayRouteId The ID of the Transit Gateway route being
   * imported.
   * @returns An object representing the imported Transit Gateway route.
   */
  public static fromTransitGatewayRouteId(scope: IConstruct, id: string, transitGatewayRouteId: string): ITransitGatewayRoute {
    class Import extends TransitGatewayRouteBase {
      public readonly transitGatewayRouteId = transitGatewayRouteId;
    }

    return new Import(scope, id);
  }

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