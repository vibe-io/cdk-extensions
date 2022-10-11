import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnNamedQuery } from 'aws-cdk-lib/aws-athena';
import { Construct } from 'constructs';
import { Database } from '../../glue/constructs/database';


/**
 * Configuration for Database
 */
export interface NamedQueryProps extends ResourceProps {
    readonly database: Database;
    readonly description?: string;
    readonly name?: string;
    readonly queryString: string;
}

export class NamedQuery extends Resource {
    // Input properties
    public readonly database: Database;
    public readonly description?: string;
    public readonly name?: string;
    public readonly queryString: string;

    // Resource properties
    public readonly resource: CfnNamedQuery;

    // Standard properties
    public readonly namedQueryId: string;
    public readonly namedQueryName: string;


    /**
     * Creates a new instance of the NamedQuery class.
     * 
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique 
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
    constructor(scope: Construct, id: string, props: NamedQueryProps) {
        super(scope, id, props);

        this.database = props.database;
        this.description = props.description;
        this.name = props.name ?? Names.nodeUniqueId(this.node);
        this.queryString = props.queryString;

        this.resource = new CfnNamedQuery(this, 'Resource', {
            database: this.database.databaseName,
            description: this.description,
            name: this.name,
            queryString: this.queryString
        });

        this.namedQueryId = this.resource.attrNamedQueryId;
        this.namedQueryName = this.resource.ref;
    }
}
