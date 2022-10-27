import { ResourceProps, SecretValue } from 'aws-cdk-lib';
import { ISecurityGroup, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Connection, ConnectionType } from '.';


/**
 * Configuration for the Glue Workflow resource.
 */
export interface JdbcConnectionProps extends ResourceProps {
  /**
   * A description of the Connection 
   */
  readonly description?: string;
  /**
   * Boolean value on whether to require encryption on the Connection 
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype)
   */
  readonly enforceSsl?: boolean;
  /**
   * A name for the Connection 
   */
  readonly name?: string;
  /**
   * A SecretValue providing the password for the Connection to authenticate to the source with. 
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype)
   */
  readonly password: SecretValue;
  /**
   * A list of Security Groups to apply to the Connection 
   */
  readonly securityGroups?: ISecurityGroup[];
    /**
   * Options for selection of subnets from the VPC to attach to the Connection
   * 
   * @see [CDK SubnetSelection](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetSelection.html)
   */
  readonly subnets?: SubnetSelection;
  /**
   * The URL to the source for the Connection
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype)
   */
  readonly url: string;
  /**
   * The username for the Connection to authenticate to the source with.
   * 
   * @see [AWS::Glue::Connection ConnectionInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype)
   */
  readonly username: string;
  /**
   * VPC to attach to the Connection 
   * 
   * @see [IVpc Interface](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html)
   */
  readonly vpc: IVpc;
}

/**
 * Creates a Connection resource to a Java Database
 * 
 * @see [AWS::Glue::Connection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html)
 */
export class JdbcConnection extends Connection {
  // Input properties
  /**
		* {@link JdbcConnectionProps.password:}
		*/
	public readonly password: SecretValue;
  /**
		* {@link JdbcConnectionProps.url:}
		*/
	public readonly url: string;
  /**
		* {@link JdbcConnectionProps.username:}
		*/
	public readonly username: string;

/**
 * Creates a new instance of the JdbcConnection class
 * 
 * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
 */
  constructor(scope: Construct, id: string, props: JdbcConnectionProps) {
    super(scope, id, {
      ...props,
      connectionType: ConnectionType.JDBC,
      properties: {
        JDBC_CONNECTION_URL: props.url,
        JDBC_ENFORCE_SSL: `${props.enforceSsl ?? false}`,
        PASSWORD: props.password.toString(),
        USERNAME: props.username,
      },
    });

    this.password = props.password;
    this.url = props.url;
    this.username = props.username;
  }
}
