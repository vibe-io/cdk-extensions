import { PhysicalName, ResourceProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudtrailTable, Database } from '../../glue';
import { RawBucket } from './private/raw-bucket';


/**
 * Configuration for objects bucket
 */
export interface CloudtrailBucketProps extends ResourceProps {
  readonly bucketName?: string;
  readonly createQueries?: boolean;
  readonly database?: Database;
  readonly friendlyQueryNames?: boolean;
  readonly tableName?: string;
}

export class CloudtrailBucket extends RawBucket {
  // Resource properties
  public readonly database: Database;
  public readonly table: CloudtrailTable;

  // Input properties
  public readonly createQueries?: boolean;
  public readonly friendlyQueryNames?: boolean;


  /**
     * Creates a new instance of the CloudtrailBucket class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: CloudtrailBucketProps = {}) {
    super(scope, id, {
      ...props,
      bucketEncryption: {
        serverSideEncryptionConfiguration: [
          {
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'AES256',
            },
          },
        ],
      },
      bucketName: props.bucketName ?? PhysicalName.GENERATE_IF_NEEDED,
      publicAccessBlockConfiguration: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      versioningConfiguration: {
        status: 'Enabled',
      },
    });

    this.createQueries = props.createQueries;
    this.friendlyQueryNames = props.friendlyQueryNames;

    this.database = props.database ?? new Database(this, 'database', {
      description: 'Database for storing CloudTrail information',
    });

    this.table = new CloudtrailTable(this, 'table', {
      bucket: this,
      createQueries: this.createQueries,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      name: props.tableName,
    });
  }
}
