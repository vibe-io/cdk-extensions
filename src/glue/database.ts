import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnDatabase } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';


/**
 * Configuration for Database
 */
export interface DatabaseProps extends ResourceProps {
  /**
   * A description of the database. 
   */
  readonly description?: string;
  /**
   * The location of the database (for example, an HDFS path). 
   * 
   * @see [AWS::Glue::Database DatabaseInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-locationuri)
   */
  readonly locationUri?: string;
  /**
   * The name of the database. For Hive compatibility, this is folded to lowercase when it is stored. 
   */
  readonly name?: string;
}

/**
 * Creates a Glue Database resource to contain a collection of metadata Tables
 * 
 * @see [AWS::Glue::Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html
 */
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
        name: this.name,
      },
    });

    this.catalogArn = this.stack.formatArn({
      resource: 'catalog',
      service: 'glue',
    });
    this.catalogId = this.stack.account;
    this.databaseArn = this.stack.formatArn({
      resource: 'database',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.databaseName = this.resource.ref;
  }
}
