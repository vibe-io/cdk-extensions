import { Annotations, IResolvable, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, IVpc, SecurityGroup, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { CfnDBProxyEndpoint, IDatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { isConnectable } from '../utils/types';


export class DatabaseProxyEndpointAccess {
  public static readonly READ_ONLY: DatabaseProxyEndpointAccess = DatabaseProxyEndpointAccess.of('READ_ONLY');
  public static readonly READ_WRITE: DatabaseProxyEndpointAccess = DatabaseProxyEndpointAccess.of('READ_WRITE');

  public static of(role: string): DatabaseProxyEndpointAccess {
    return new DatabaseProxyEndpointAccess(role);
  }

  private constructor(public readonly role: string) {}
}

export interface DatabaseProxyEndpointProps extends ResourceProps {
  readonly access?: DatabaseProxyEndpointAccess;
  readonly databaseProxy: IDatabaseProxy;
  readonly name?: string;
  readonly securityGroups?: ISecurityGroup[];
  readonly vpc: IVpc;
  readonly vpcSubnets?: SubnetSelection;
}


export class DatabaseProxyEndpoint extends Resource implements IConnectable {
  // Input properties
  public readonly access?: DatabaseProxyEndpointAccess;
  public readonly databaseProxy: IDatabaseProxy;
  public readonly name?: string;
  public readonly vpc: IVpc;
  public readonly vpcSubnets: SubnetSelection;

  // Resource properties
  public readonly resource: CfnDBProxyEndpoint;

  // Standard properties
  public readonly databaseProxyEndpointArn: string;
  public readonly databaseProxyEndpointHost: string;
  public readonly databaseProxyEndpointIsDefault: IResolvable;
  public readonly databaseProxyEndpointVpcId: string;

  // IConnectable properties
  public readonly connections: Connections;


  public constructor(scope: Construct, id: string, props: DatabaseProxyEndpointProps) {
    super(scope, id, props);

    this.access = props.access;
    this.databaseProxy = props.databaseProxy;
    this.name = props.name ?? Names.uniqueId(this);
    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets ?? {
      onePerAz: true,
    };

    if (this.access) {
      Annotations.of(this).addWarning([
        'CloudFormation removed support for setting DB endpoint access',
        'levels. As a result the access property is currently being ignored.',
      ].join(' '));
    }

    const securityGroups = props.securityGroups ?? [
      new SecurityGroup(this, 'security-group', {
        description: 'Controls access to RDS DB proxy endpoint.',
        vpc: this.vpc,
      }),
    ];

    this.connections = new Connections({
      defaultPort: isConnectable(this.databaseProxy) ? this.databaseProxy.connections.defaultPort : undefined,
      securityGroups: securityGroups,
    });

    this.resource = new CfnDBProxyEndpoint(this, 'Resource', {
      dbProxyEndpointName: this.name,
      dbProxyName: this.databaseProxy.dbProxyName,
      // CloudFormation mysteriously removed this one day
      //targetRole: this.access?.role,
      vpcSubnetIds: this.vpc.selectSubnets(this.vpcSubnets).subnetIds,
      vpcSecurityGroupIds: Lazy.list({
        produce: () => {
          return this.connections.securityGroups.map((x) => {
            return x.securityGroupId;
          });
        },
      }),
    });

    this.databaseProxyEndpointArn = this.resource.attrDbProxyEndpointArn;
    this.databaseProxyEndpointHost = this.resource.attrEndpoint;
    this.databaseProxyEndpointIsDefault = this.resource.attrIsDefault;
    this.databaseProxyEndpointVpcId = this.resource.attrVpcId;
  }
}
