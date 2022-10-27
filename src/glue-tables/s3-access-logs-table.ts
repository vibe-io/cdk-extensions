import { ResourceProps } from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { BasicColumn, Database, InputFormat, OutputFormat, SerializationLibrary, Table, TableType } from '../glue';


/**
 * Configuration for S3AccessLogsTable
 */
export interface S3AccessLogsTableProps extends ResourceProps {
  /**
   * A bucket where logs will be stored
   * 
   * @see [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
   */
   readonly bucket: IBucket;
   /**
    * Boolean indicating whether to create Athena default Athena queries for the ALB Logs
    * 
    * @see [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html)
    */
   readonly createQueries?: boolean;
   /**
   * A cdk-extensions/glue {@link aws-glue!Database } object that the table should be created in.
   * 
   * @see [AWS::Glue::Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html)
   */
   readonly database: Database;
   /**
    * Boolean for adding "friendly names" for the created Athena queries.
    */
   readonly friendlyQueryNames?: boolean;
   /**
    * Name for S3 Access Logs Table
    */
   readonly name?: string;
   /**
    * Set a custom prefix for the S3 Bucket
    */
  readonly s3Prefix?: string;
}

export class S3AccessLogsTable extends Table {
  // Input properties
  public readonly createQueries: boolean;
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly requestErrorsNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the S3AccessLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: S3AccessLogsTableProps) {
    super(scope, id, {
      columns: [
        new BasicColumn({
          name: 'bucket_owner',
          type: 'string',
        }),
        new BasicColumn({
          name: 'bucket_name',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_datetime',
          type: 'string',
        }),
        new BasicColumn({
          name: 'remote_ip',
          type: 'string',
        }),
        new BasicColumn({
          name: 'requester',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_id',
          type: 'string',
        }),
        new BasicColumn({
          name: 'operation',
          type: 'string',
        }),
        new BasicColumn({
          name: 'key',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_uri',
          type: 'string',
        }),
        new BasicColumn({
          name: 'http_status',
          type: 'string',
        }),
        new BasicColumn({
          name: 'error_code',
          type: 'string',
        }),
        new BasicColumn({
          name: 'bytes_sent',
          type: 'string',
        }),
        new BasicColumn({
          name: 'object_size',
          type: 'string',
        }),
        new BasicColumn({
          name: 'total_time',
          type: 'string',
        }),
        new BasicColumn({
          name: 'turnaround_time',
          type: 'string',
        }),
        new BasicColumn({
          name: 'referrer',
          type: 'string',
        }),
        new BasicColumn({
          name: 'user_agent',
          type: 'string',
        }),
        new BasicColumn({
          name: 'version_id',
          type: 'string',
        }),
        new BasicColumn({
          name: 'host_id',
          type: 'string',
        }),
        new BasicColumn({
          name: 'sigv',
          type: 'string',
        }),
        new BasicColumn({
          name: 'cipher_suite',
          type: 'string',
        }),
        new BasicColumn({
          name: 'auth_type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'endpoint',
          type: 'string',
        }),
        new BasicColumn({
          name: 'tls_version',
          type: 'string',
        }),
      ],
      compressed: false,
      dataFormat: {
        inputFormat: InputFormat.TEXT,
        outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
        serializationLibrary: SerializationLibrary.REGEXP,
      },
      database: props.database,
      description: 'Table used for querying S3 access logs.',
      location: `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}`,
      name: props.name,
      owner: 'hadoop',
      parameters: {
        EXTERNAL: 'TRUE',
      },
      serdeParameters: {
        'input.regex': '([^ ]*) ([^ ]*) \\[(.*?)\\] ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) (\"[^\"]*\"|-) (-|[0-9]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) (\"[^\"]*\"|-) ([^ ]*)(?: ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*))?.*$',
      },
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;

    if (this.createQueries) {
      this.requestErrorsNamedQuery = new NamedQuery(this, 'reqest-errors-named-query', {
        database: this.database,
        description: 'Gets the 100 most recent failed S3 access requests.',
        name: this.friendlyQueryNames ? 's3-request-errors' : undefined,
        queryString: [
          'SELECT PARSE_DATETIME(request_datetime, \'d/MMM/y:H:m:s Z\') AT TIME ZONE \'UTC\' AS "timestamp",',
          '    remote_ip AS client_ip,',
          '    http_status AS status_code,',
          '    error_code,',
          '    operation,',
          '    request_id,',
          '    CASE',
          "        WHEN key = '-' THEN CONCAT('s3://', bucket_name, '/')",
          "        ELSE CONCAT('s3://', bucket_name, '/', key)",
          '    END AS object',
          `FROM ${this.tableName}`,
          'WHERE CAST(http_status AS integer) BETWEEN 400 AND 599',
          "    AND PARSE_DATETIME(request_datetime, 'd/MMM/y:H:m:s Z') >= NOW() - PARSE_DURATION('1d')",
          'ORDER BY "timestamp" DESC LIMIT 100;',
        ].join('\n'),
      });
    }
  }
}
