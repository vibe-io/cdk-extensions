import { Resource, ResourceProps, Stack, Tags } from 'aws-cdk-lib';
import { CfnTransitGatewayRouteTable } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { ITransitGateway } from './transit-gateway';
import { ITransitGatewayAttachment } from './transit-gateway-attachment-base';
import { TransitGatewayRoute } from './transit-gateway-route';


/**
 * Options for adding a route to a transit gateway route table.
 */
export interface TransitGatewayRouteOptions extends ResourceProps {
  /**
   * The transit gateway attachment where matched traffic should be routed.
   */
  readonly attachment?: ITransitGatewayAttachment;

  /**
   * Whether the traffic should be black holed (discarded) rather than being
   * routed to an attachment.
   */
  readonly blackhole?: boolean;

  /**
   * The CIDR range to match for the route.
   */
  readonly cidr: string;
}

/**
 * Represents a transit gateway route table in AWS.
 */
export interface ITransitGatewayRouteTable {
  /**
   * The ARN of the transit gateway route table.
   */
  readonly transitGatewayRouteTableArn: string;

  /**
   * The ID of the transit gateway route table.
   */
  readonly transitGatewayRouteTableId: string;

  /**
   * Adds a route to this transit gateway route table.
   *
   * @param options Configuration for the route being added.
   */
  addRoute(options: TransitGatewayRouteOptions): TransitGatewayRoute;
}

/**
 * A base class providing common functionality between created and imported
 * transit gateway route tables.
 */
abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable {
  /**
   * The ARN of this transit gateway route table.
   */
  public abstract readonly transitGatewayRouteTableArn: string;

  /**
   * The ID of this transit gateway route table.
   */
  public abstract readonly transitGatewayRouteTableId: string;

  /**
   * Adds a route to this transit gateway route table.
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
  /**
   * The name of the transit gateway route table.
   *
   * Used to tag the route table with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayRouteTable Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html#cfn-ec2-transitgatewayroutetable-tags)
   */
  readonly name?: string;

  /**
   * The transit gateway for which the route table should be created.
   *
   * @see [TransitGatewayRouteTable TransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html#cfn-ec2-transitgatewayroutetable-transitgatewayid)
   */
  readonly transitGateway: ITransitGateway;
}

/**
 * Creates a route table for traffic being processed by a transit gateway.
 *
 * When traffic is routed to a transit gateway via an attachment, the route
 * table associated with that attachment is used when evaluating how the
 * inbound traffic should be routed.
 *
 * @see [AWS::EC2::TransitGatewayRouteTable](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html)
 */
export class TransitGatewayRouteTable extends TransitGatewayRouteTableBase {
  /**
   * Imports an existing transit gateway route table using its route table ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param transitGatewayRouteTableId The attachment ID of the transit gateway
   * route table being imported.
   * @returns An object representing the imported transit gateway route table.
   */
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

  /**
   * The name of the transit gateway route table.
   *
   * Used to tag the route table with a name that will be displayed in the AWS
   * EC2 console.
   *
   * @see [TransitGatewayRouteTable Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html#cfn-ec2-transitgatewayroutetable-tags)
   *
   * @group Inputs
   */
  public readonly name?: string;

  /**
   * The transit gateway for which the route table should be created.
   *
   * @see [TransitGatewayRouteTable TransitGatewayId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html#cfn-ec2-transitgatewayroutetable-transitgatewayid)
   *
   * @group Inputs
   */
  public readonly transitGateway: ITransitGateway;

  /**
   * The underlying TransitGatewayRouteTable CloudFormation resource.
   *
   * @see [AWS::EC2::TransitGatewayRouteTable](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetable.html)
   *
   * @group Resources
   */
  public readonly resource: CfnTransitGatewayRouteTable;

  /**
   * The ARN of this transit gateway route table.
   */
  public readonly transitGatewayRouteTableArn: string;

  /**
   * The ID of this transit gateway route table.
   */
  public readonly transitGatewayRouteTableId: string;


  /**
   * Creates a new instance of the TransitGatewayRouteTable class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
   * @param id A name to be associated with the stack and used in resource naming. Must be unique
   * within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
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