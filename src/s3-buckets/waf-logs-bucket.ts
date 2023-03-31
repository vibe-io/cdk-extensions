import { Annotations, Lazy, Names, ResourceProps, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RawBucket } from './private/raw-bucket';
import { Database } from '../glue';
import { WafLogsTable } from '../glue-tables';


/**
 * Configuration for objects bucket
 */
export interface WafLogsBucketProps extends ResourceProps {
  readonly bucketName?: string;
  readonly createQueries?: boolean;
  readonly database?: Database;
  readonly friendlyQueryNames?: boolean;
  readonly tableName?: string;
}

export class WafLogsBucket extends RawBucket {
  // Resource properties
  public readonly database: Database;
  public readonly table: WafLogsTable;

  // Input properties
  public readonly createQueries?: boolean;
  public readonly friendlyQueryNames?: boolean;


  /**
     * Creates a new instance of the WafLogsBucket class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: WafLogsBucketProps = {}) {
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
      bucketName: props.bucketName ?? Lazy.string({
        produce: () => {
          return `aws-waf-logs-${Names.uniqueId(this)}`;
        },
      }),
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

    if (props.bucketName && !Token.isUnresolved(props.bucketName) && !props.bucketName.startsWith('aws-waf-logs-')) {
      Annotations.of(scope).addError("Buckets configured for WAF logs must start with 'aws-waf-logs-'.");
    }

    this.database = props.database ?? new Database(this, 'database', {
      description: 'Database for storing AWS WAF logs',
    });

    this.table = new WafLogsTable(this, 'table', {
      bucket: this,
      createQueries: this.createQueries,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      name: props.tableName,
    });
  }
}
