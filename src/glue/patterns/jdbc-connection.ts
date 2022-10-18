import { ResourceProps, SecretValue } from 'aws-cdk-lib';
import { ISecurityGroup, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Connection, ConnectionType } from '../constructs/connection';


/**
 * Configuration for the Glue Workflow resource.
 */
export interface JdbcConnectionProps extends ResourceProps {
  readonly description?: string;
  readonly enforceSsl?: boolean;
  readonly name?: string;
  readonly password: SecretValue;
  readonly securityGroups?: ISecurityGroup[];
  readonly subnets?: SubnetSelection;
  readonly url: string;
  readonly username: string;
  readonly vpc: IVpc;
}

export class JdbcConnection extends Connection {
  // Input properties
  public readonly password: SecretValue;
  public readonly url: string;
  public readonly username: string;


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
