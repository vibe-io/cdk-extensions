import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnDatabase } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';


/**
 * Configuration for Database
 */
export interface DatabaseProps extends ResourceProps {
    readonly description?: string;
    readonly locationUri?: string;
    readonly name?: string;
}

export class Database extends Resource {
    // Input properties
    public readonly description?: string;
    public readonly locationUri?: string;
    public readonly name: string;

    // Resource properties
    public readonly resource: CfnDatabase;

    // Standard properties
    public readonly catalogArn: string;
    public readonly catalogId: string;
    public readonly databaseArn: string;
    public readonly databaseName: string;


    /**
     * Creates a new instance of the Database class.
     * 
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique 
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
    constructor(scope: Construct, id: string, props: DatabaseProps = {}) {
        super(scope, id, props);

        this.description = props?.description;
        this.locationUri = props?.locationUri;
        this.name = props?.name ?? Names.nodeUniqueId(this.node).toLowerCase();

        this.resource = new CfnDatabase(this, 'Resource', {
            catalogId: this.stack.account,
            databaseInput: {
                description: this.description,
                locationUri: this.locationUri,
                name: this.name
            }
        });

        this.catalogArn = this.stack.formatArn({
            resource: 'catalog',
            service: 'glue'
        });
        this.catalogId = this.stack.account;
        this.databaseArn = this.stack.formatArn({
            resource: 'database',
            resourceName: this.resource.ref,
            service: 'glue'
        });
        this.databaseName = this.resource.ref;
    }
}
