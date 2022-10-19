import { ResourceProps } from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { BasicColumn, Database, InputFormat, OutputFormat, SerializationLibrary, Table, TableType } from '../glue';


/**
 * Configuration for CloudfrontAccessLogsTable
 */
export interface CloudfrontLogsTableProps extends ResourceProps {
  readonly bucket: IBucket;
  readonly createQueries?: boolean;
  readonly database: Database;
  readonly friendlyQueryNames?: boolean;
  readonly name?: string;
  readonly s3Prefix?: string;
}

export class CloudfrontLogsTable extends Table {
  // Input properties
  public readonly createQueries: boolean;
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly distributionStatisticsNamedQuery?: NamedQuery;
  public readonly requestErrorsNamedQuery?: NamedQuery;
  public readonly topIpsNamedQuery?: NamedQuery;
  public readonly topObjectsNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the CloudfrontAccessLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: CloudfrontLogsTableProps) {
    super(scope, id, {
      columns: [
        new BasicColumn({
          name: 'date',
          type: 'date',
        }),
        new BasicColumn({
          name: 'time',
          type: 'string',
        }),
        new BasicColumn({
          name: 'location',
          type: 'string',
        }),
        new BasicColumn({
          name: 'response_bytes',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'request_ip',
          type: 'string',
        }),
        new BasicColumn({
          name: 'method',
          type: 'string',
        }),
        new BasicColumn({
          name: 'distribution',
          type: 'string',
        }),
        new BasicColumn({
          name: 'uri',
          type: 'string',
        }),
        new BasicColumn({
          name: 'status_code',
          type: 'int',
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
          name: 'query_string',
          type: 'string',
        }),
        new BasicColumn({
          name: 'cookie',
          type: 'string',
        }),
        new BasicColumn({
          name: 'final_result_type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_id',
          type: 'string',
        }),
        new BasicColumn({
          name: 'host_header',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_protocol',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_bytes',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'time_taken',
          type: 'float',
        }),
        new BasicColumn({
          name: 'x_forwarded_for',
          type: 'string',
        }),
        new BasicColumn({
          name: 'ssl_protocol',
          type: 'string',
        }),
        new BasicColumn({
          name: 'ssl_cipher',
          type: 'string',
        }),
        new BasicColumn({
          name: 'initial_result_type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'http_version',
          type: 'string',
        }),
        new BasicColumn({
          name: 'fle_status',
          type: 'string',
        }),
        new BasicColumn({
          name: 'fle_encrypted_fields',
          type: 'int',
        }),
        new BasicColumn({
          name: 'client_port',
          type: 'int',
        }),
        new BasicColumn({
          name: 'time_to_first_byte',
          type: 'float',
        }),
        new BasicColumn({
          name: 'detailed_result_type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'content_type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'content_length',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'content_range_start',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'content_range_end',
          type: 'bigint',
        }),
      ],
      compressed: false,
      dataFormat: {
        inputFormat: InputFormat.TEXT,
        outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
        serializationLibrary: SerializationLibrary.LAZY_SIMPLE,
      },
      database: props.database,
      description: 'Table used for querying CloudFront access logs.',
      location: `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}`,
      name: props.name,
      owner: 'hadoop',
      parameters: {
        'EXTERNAL': 'TRUE',
        'skip.header.line.count': '2',
      },
      serdeParameters: {
        'field.delim': '\t',
        'serialization.format': '\t',
      },
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;

    if (this.createQueries) {
      this.distributionStatisticsNamedQuery = new NamedQuery(this, 'distribution-statistics-named-query', {
        database: this.database,
        description: 'Gets statistics for CloudFront distributions for the last day.',
        name: this.friendlyQueryNames ? 'cloudfront-distribution-statistics' : undefined,
        queryString: [
          'SELECT distribution,',
          '    COUNT(*) as requests,',
          '    SUM(request_bytes) AS bytes_in,',
          '    SUM(response_bytes) AS bytes_out,',
          "    (COUNT_IF(initial_result_type = 'Hit') / CAST(COUNT(*) AS double)) * 100 AS hit_rate,",
          "    (COUNT_IF(final_result_type = 'Error') / CAST(COUNT(*) AS double)) * 100 AS error_rate,",
          '    COUNT(DISTINCT uri) AS distinct_objects',
          `FROM ${this.tableName}`,
          'WHERE FROM_ISO8601_TIMESTAMP(CONCAT(CAST("date" AS varchar), \'T\', time, \'Z\')) >= NOW() - PARSE_DURATION(\'1d\')',
          'GROUP BY distribution',
          'ORDER BY distribution ASC LIMIT 100;',
        ].join('\n'),
      });

      this.requestErrorsNamedQuery = new NamedQuery(this, 'request-errors-named-query', {
        database: this.database,
        description: 'Gets the 100 most recent requests that resulted in an error from CloudFront.',
        name: this.friendlyQueryNames ? 'cloudfront-request-errors' : undefined,
        queryString: [
          'SELECT FROM_ISO8601_TIMESTAMP(CONCAT(CAST("date" AS varchar), \'T\', time, \'Z\')) AT TIME ZONE \'UTC\' AS "time",',
          '    request_ip,',
          '    status_code,',
          '    initial_result_type,',
          '    final_result_type,',
          '    detailed_result_type AS reason,',
          '    method,',
          "    CONCAT(request_protocol, '://', host_header, uri) AS url",
          `FROM ${this.tableName}`,
          'WHERE FROM_ISO8601_TIMESTAMP(CONCAT(CAST("date" AS varchar), \'T\', time, \'Z\')) >= NOW() - PARSE_DURATION(\'1d\')',
          '    AND (',
          "        initial_result_type IN ('Error', 'LimitExceeded', 'CapacityExceeded')",
          "        OR final_result_type IN ('Error', 'LimitExceeded', 'CapacityExceeded')",
          '    )',
          'ORDER BY "date", time DESC LIMIT 100;',
        ].join('\n'),
      });

      this.topIpsNamedQuery = new NamedQuery(this, 'top-ips-named-query', {
        database: this.database,
        description: 'Gets the 100 most active IP addresses by request count.',
        name: this.friendlyQueryNames ? 'cloudfront-top-ips' : undefined,
        queryString: [
          'SELECT request_ip,',
          '    COUNT(*) as requests,',
          "    COUNT_IF(final_result_type = 'Error') AS errors,",
          "    COUNT_IF(initial_result_type = 'Hit') AS hits,",
          "    COUNT_IF(initial_result_type = 'Miss') AS misses,",
          "    COUNT_IF(initial_result_type = 'RefreshHit') AS refreshes,",
          "    (COUNT_IF(initial_result_type = 'Hit') / CAST(COUNT(*) AS double)) * 100 AS hit_rate,",
          '    SUM(request_bytes) AS bytes_in,',
          '    SUM(response_bytes) AS bytes_out,',
          '    ARBITRARY(user_agent) as user_agent',
          `FROM ${this.tableName}`,
          'WHERE FROM_ISO8601_TIMESTAMP(CONCAT(CAST("date" AS varchar), \'T\', time, \'Z\')) >= NOW() - PARSE_DURATION(\'1d\')',
          'GROUP BY request_ip',
          'ORDER BY requests DESC LIMIT 100;',
        ].join('\n'),
      });

      this.topObjectsNamedQuery = new NamedQuery(this, 'top-objects-named-query', {
        database: this.database,
        description: 'Gets the 100 most requested CloudFront objects.',
        name: this.friendlyQueryNames ? 'cloudfront-top-objects' : undefined,
        queryString: [
          "SELECT CONCAT(request_protocol, '://', distribution, uri) AS object,",
          '    COUNT(*) as requests,',
          "    COUNT_IF(final_result_type = 'Error') AS errors,",
          "    COUNT_IF(initial_result_type = 'Hit') AS hits,",
          "    COUNT_IF(initial_result_type = 'Miss') AS misses,",
          "    COUNT_IF(initial_result_type = 'RefreshHit') AS refreshes,",
          "    (COUNT_IF(initial_result_type = 'Hit') / CAST(COUNT(*) AS double)) * 100 AS hit_rate,",
          '    SUM(request_bytes) AS request_bytes,',
          '    SUM(response_bytes) AS response_bytes,',
          '    COUNT(DISTINCT request_ip) AS distinct_ips',
          `FROM ${this.tableName}`,
          'WHERE FROM_ISO8601_TIMESTAMP(CONCAT(CAST("date" AS varchar), \'T\', time, \'Z\')) >= NOW() - PARSE_DURATION(\'1d\')',
          "GROUP BY CONCAT(request_protocol, '://', distribution, uri)",
          'ORDER BY requests DESC LIMIT 100;',
        ].join('\n'),
      });
    }
  }
}
