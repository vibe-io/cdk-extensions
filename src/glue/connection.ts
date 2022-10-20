import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, IVpc, Port, SecurityGroup, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { CfnConnection } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../utils/formatting';


export enum ConnectionType {
  JDBC = 'JDBC',
  KAFKA = 'KAFKA',
  MONGODB = 'MONGODB',
  NETWORK = 'NETWORK'
}

/**
 * Configuration for the Glue Workflow resource.
 */
export interface ConnectionProps extends ResourceProps {
  /**
   * The type of the connection. Currently, these types are supported:
   *    JDBC - Designates a connection to a database through Java Database Connectivity (JDBC).
   *    KAFKA - Designates a connection to an Apache Kafka streaming platform.
   *    MONGODB - Designates a connection to a MongoDB document database.
   *    NETWORK - Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype)
   */
  readonly connectionType: ConnectionType;
  /**
   * cfn-glue-connection-connectioninput-connectiontype
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-description)
   */
  readonly description?: string;
  /**
   * The name of the connection. Connection will not function as expected without a name.
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-name)
   */
  readonly name?: string;
  /**
   * List of Key/Value pairs defining the properties of the Connection 
   * Available Properties:
   *    CatalogId - The ID of the data catalog to create the catalog object in. Currently, this should be the AWS account ID.
   *    ConnectionInput - The connection that you want to create.
   * 
   * @see [AWS::Glue::Connection Properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html#Properties)
   */
  readonly properties?: {[key: string]: string};
  /**
   * Existing Security Group to assign to the Connection. If none is provided a new Security Group will be created. 
   */
  readonly securityGroups?: ISecurityGroup[];
  /**
   * Options for selection of subnets from the VPC to attach to the Connection 
   * 
   * @see [CDK SubnetSelection](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetSelection.html)
   */
  readonly subnets?: SubnetSelection;
  /**
   * VPC to attach to the Connection 
   * 
   * @see [IVpc Interface](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html)
   */
  readonly vpc?: IVpc;
}

/**
 * Creates a resource specifying a Glue Connection to a data source.
 * 
 * @see [AWS::Glue::Connection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html)
 */
export class Connection extends Resource implements IConnectable {
  // Internal properties
  private readonly _matchCriteria: string[] = [];
  private readonly _properties: {[key: string]: string} = {};

  // Input properties
  public readonly connectionType: ConnectionType;
  public readonly description?: string;
  public readonly name?: string;
  public readonly securityGroups: ISecurityGroup[];
  public readonly subnets?: SubnetSelection;
  public readonly vpc?: IVpc;

  // Resource properties
  public readonly resource: CfnConnection;
  public readonly securityGroup?: SecurityGroup;

  // Standard properties
  public readonly connectionArn: string;
  public readonly connectionName: string;

  // IConnectable properties
  public readonly connections: Connections;

/**
 * Creates a new instance of the Connection class
 * 
 * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
 */
  constructor(scope: Construct, id: string, props: ConnectionProps) {
    super(scope, id, props);

    this.connectionType = props.connectionType;
    this.description = props.description;
    this.name = props.name;
    this.securityGroups = props.securityGroups ?? [];
    this.subnets = props.subnets ?? {
      onePerAz: true,
    };
    this.vpc = props.vpc;

    const properties = props?.properties ?? {};
    Object.keys(properties).forEach((x) => {
      this.addProperty(x, properties[x]);
    });

    const subnet = this.vpc?.selectSubnets(this.subnets).subnets[0];

    if (this.vpc && this.securityGroups.length === 0) {
      this.securityGroup = new SecurityGroup(this, 'security-group', {
        description: 'Provides connectivity for Glue Connection',
        vpc: this.vpc,
      });
      this.securityGroups.push(this.securityGroup);
    }

    this.connections = new Connections({
      securityGroups: this.securityGroups,
    });

    this.connections.allowFromAnyIpv4(Port.allTraffic(), 'Required by Glue Connections');

    this.resource = new CfnConnection(this, 'Resource', {
      catalogId: this.stack.account,
      connectionInput: {
        connectionProperties: Lazy.uncachedAny({
          produce: () => {
            return !!Object.keys(this._properties).length ? this._properties : undefined;
          },
        }),
        connectionType: this.connectionType,
        description: this.description,
        matchCriteria: Lazy.uncachedList(
          {
            produce: () => {
              return this._matchCriteria;
            },
          },
          {
            omitEmpty: true,
          },
        ),
        name: this.name,
        physicalConnectionRequirements: undefinedIfNoKeys({
          availabilityZone: subnet?.availabilityZone,
          securityGroupIdList: !!!this.vpc ? undefined : this.securityGroups.map((x) => {
            return x.securityGroupId;
          }),
          subnetId: subnet?.subnetId,
        }),
      },
    });

    this.connectionArn = this.stack.formatArn({
      resource: 'connection',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.connectionName = this.resource.ref;
  }

  public addMatchCriteria(value: string): void {
    this._matchCriteria.push(value);
  }

  public addProperty(key: string, value: string): void {
    this._properties[key] = value;
  }
}
