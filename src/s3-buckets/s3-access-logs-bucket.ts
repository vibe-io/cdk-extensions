import { Aspects, Lazy, PhysicalName, ResourceProps, Token } from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct, IConstruct } from 'constructs';
import { RawBucket } from './private/raw-bucket';
import { IWorkGroup } from '../athena';
import { Database } from '../glue';
import { S3AccessLogsTable } from '../glue-tables';


export interface LoggingAspectOptions {
  readonly exclusions?: IConstruct[];
  readonly force?: boolean;
  readonly prefix?: string;
}

/**
 * Configuration for objects bucket
 */
export interface S3AccessLogsBucketProps extends ResourceProps {
  readonly bucketName?: string;
  readonly createQueries?: boolean;
  readonly database?: Database;
  readonly friendlyQueryNames?: boolean;
  readonly tableName?: string;
  readonly workGroup?: IWorkGroup;
}

export class S3AccessLogsBucket extends RawBucket {
  // Input properties
  public readonly createQueries?: boolean;
  public readonly friendlyQueryNames?: boolean;
  public readonly workGroup?: IWorkGroup;

  // Resource properties
  public readonly database: Database;
  public readonly table: S3AccessLogsTable;


  /**
   * Creates a new instance of the S3AccessLogsBucket class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the
   * construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: S3AccessLogsBucketProps = {}) {
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
    this.workGroup = props.workGroup;

    this.database = props.database ?? new Database(this, 'database', {
      description: 'Database for storing S3 access logs',
    });

    this.table = new S3AccessLogsTable(this, 'table', {
      bucket: this,
      createQueries: this.createQueries,
      database: this.database,
      friendlyQueryNames: this.friendlyQueryNames,
      name: props.tableName,
      workGroup: this.workGroup,
    });
  }

  public addLoggingAspect(scope: IConstruct, options?: LoggingAspectOptions): void {
    const aspectAccounts = new Set<string>();

    Aspects.of(scope).add({
      visit: (node: IConstruct) => {
        if (node instanceof CfnBucket && node !== this.resource && !options?.exclusions?.includes(node)) {
          if (!node.loggingConfiguration || options?.force) {
            node.loggingConfiguration = {
              destinationBucketName: this.bucketName,
              logFilePrefix: options?.prefix,
            };

            const account = Token.isUnresolved(node.stack.account) ? this.stack.account : node.stack.account;
            const addStatement = aspectAccounts.size === 0;

            aspectAccounts.add(account);
            if (addStatement) {
              this.addToResourcePolicy(new PolicyStatement({
                actions: [
                  's3:PutObject',
                ],
                conditions: {
                  StringEquals: {
                    'aws:SourceAccount': Lazy.list({
                      produce: () => {
                        return [...aspectAccounts];
                      },
                    }),
                  },
                },
                effect: Effect.ALLOW,
                principals: [
                  new ServicePrincipal('logging.s3.amazonaws.com'),
                ],
                resources: [
                  this.arnForObjects(`${options?.prefix ?? ''}*`),
                ],
              }));
            }
          }
        }
      },
    });
  }
}
