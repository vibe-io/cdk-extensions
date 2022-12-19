import { Resource, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGatewayRouteTable } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ITransitGatewayAttachment } from '.';
import { ITransitGateway } from './transit-gateway';
import { TransitGatewayRoute } from './transit-gateway-route';


export interface TransitGatewayRouteOptions extends ResourceProps {
  readonly attachment?: ITransitGatewayAttachment;
  readonly blackhole?: boolean;
  readonly cidr: string;
}

export interface ITransitGatewayRouteTable {
  readonly transitGatewayRouteTableArn: string;
  readonly transitGatewayRouteTableId: string;
  addRoute(options: TransitGatewayRouteOptions): TransitGatewayRoute;
}

abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable {
  /**
   * The ARN of this Transit Gateway Route Table.
   */
  public abstract readonly transitGatewayRouteTableArn: string;

  /**
   * The name of this Transit Gateway Route Table.
   */
  public abstract readonly transitGatewayRouteTableId: string;

  /**
   * Adds a route to this Transit Gateway Route Table.
   *
   * @param options Configuration for the route being added.
   * @returns The TransitGatewayRoute that was added.
   */
  public addRoute(options: TransitGatewayRouteOptions): TransitGatewayRoute {
    return new TransitGatewayRoute(this, `transit-gateway-route-${options.cidr}`, {
      attachment: options.attachment,
      blackhole: options.blackhole,
      cidr: options.cidr,
      routeTable: this,
    });
  }
}

/**
 * Configuration for TransitGatewayRouteTable resource.
 */
export interface TransitGatewayRouteTableProps extends ResourceProps {
  readonly name?: string;
  readonly transitGateway: ITransitGateway;
}

export class TransitGatewayRouteTable extends TransitGatewayRouteTableBase {
  public static fromTransitGatewayRouteTableId(scope: IConstruct, id: string, transitGatewayRouteTableId: string): ITransitGatewayRouteTable {
    class Import extends TransitGatewayRouteTableBase {
      public readonly transitGatewayRouteTableArn = Stack.of(scope).formatArn({
        resource: 'transit-gateway-route-table',
        resourceName: transitGatewayRouteTableId,
        service: 'ec2',
      });
      public readonly transitGatewayRouteTableId = transitGatewayRouteTableId;
    }

    return new Import(scope, id);
  }


  // Input properties
  public readonly name?: string;
  public readonly transitGateway: ITransitGateway;

  // Resource properties
  public readonly resource: CfnTransitGatewayRouteTable;

  // Standard properties
  public readonly transitGatewayRouteTableArn: string;
  public readonly transitGatewayRouteTableId: string;


  /**
     * Creates a new instance of the TransitGatewayRouteTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
    super(scope, id, props);

    this.name = props.name;
    this.transitGateway = props.transitGateway;

    Tags.of(this).add('Name', this.name ?? this.node.path);

    this.resource = new CfnTransitGatewayRouteTable(this, 'Resource', {
      transitGatewayId: this.transitGateway.transitGatewayId,
    });

    this.transitGatewayRouteTableArn = this.stack.formatArn({
      resource: 'transit-gateway-route-table',
      resourceName: this.resource.ref,
      service: 'ec2',
    });
    this.transitGatewayRouteTableId = this.resource.ref;
  }
}