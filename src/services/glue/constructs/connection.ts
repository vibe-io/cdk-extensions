import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, IVpc, Port, SecurityGroup, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { CfnConnection } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../../../utils/formatting';


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
    readonly connectionType: ConnectionType;
    readonly description?: string;
    readonly name?: string;
    readonly properties?: {[key: string]: string};
    readonly securityGroups?: ISecurityGroup[];
    readonly subnets?: SubnetSelection;
    readonly vpc?: IVpc;
}

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


    constructor(scope: Construct, id: string, props: ConnectionProps) {
        super(scope, id, props);

        this.connectionType = props.connectionType;
        this.description = props.description;
        this.name = props.name;
        this.securityGroups = props.securityGroups ?? [];
        this.subnets = props.subnets ?? {
            onePerAz: true
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
                vpc: this.vpc
            });
            this.securityGroups.push(this.securityGroup);
        }

        this.connections = new Connections({
            securityGroups: this.securityGroups
        });

        this.connections.allowFromAnyIpv4(Port.allTraffic(), 'Required by Glue Connections');

        this.resource = new CfnConnection(this, 'Resource', {
            catalogId: this.stack.account,
            connectionInput: {
                connectionProperties: Lazy.uncachedAny({
                    produce: () => {
                        return !!Object.keys(this._properties).length ? this._properties : undefined;
                    }
                }),
                connectionType: this.connectionType,
                description: this.description,
                matchCriteria: Lazy.uncachedList(
                    {
                        produce: () => {
                            return this._matchCriteria;
                        }
                    },
                    {
                        omitEmpty: true
                    }
                ),
                name: this.name,
                physicalConnectionRequirements: undefinedIfNoKeys({
                    availabilityZone: subnet?.availabilityZone,
                    securityGroupIdList: !!!this.vpc ? undefined : this.securityGroups.map((x) => {
                        return x.securityGroupId;
                    }),
                    subnetId: subnet?.subnetId
                })
            }
        });

        this.connectionArn = this.stack.formatArn({
            resource: 'connection',
            resourceName: this.resource.ref,
            service: 'glue'
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
