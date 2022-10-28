import { Annotations, Lazy, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { BasicColumn, Database, Table, TableType } from '../glue';
import { InputFormat, OutputFormat, SerializationLibrary } from '../glue/lib/data-format';


/**
 * Configuration for AlbLogsTable
 */
export interface AlbLogsTableProps extends ResourceProps {
  /**
   * A bucket where logs will be stored
   * 
   * @see [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
   */
  readonly bucket: IBucket;
  /**
   * Boolean indicating whether to create default Athena queries for the ALB Logs
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
   * Name for Alb Logs Table
   */
  readonly name?: string;
  /**
   * Set a custom prefix for the S3 Bucket
   */
  readonly s3Prefix?: string;
}

export class AlbLogsTable extends Table {
  // Input properties
  /**
   * Boolean indicating whether to create default Athena queries for the ALB Logs
   * 
   * @see [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html)
   */
  public readonly createQueries: boolean;
  /**
   * Boolean for adding "friendly names" for the created Athena queries.
   */
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly status5xxNamedQuery?: NamedQuery;
  public readonly topIpsNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the AlbLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: AlbLogsTableProps) {
    const projectionYear = new Date().getFullYear() - 1;

    super(scope, id, {
      columns: [
        new BasicColumn({
          name: 'type',
          type: 'string',
        }),
        new BasicColumn({
          name: 'time',
          type: 'string',
        }),
        new BasicColumn({
          name: 'elb',
          type: 'string',
        }),
        new BasicColumn({
          name: 'client_ip',
          type: 'string',
        }),
        new BasicColumn({
          name: 'client_port',
          type: 'int',
        }),
        new BasicColumn({
          name: 'target_ip',
          type: 'string',
        }),
        new BasicColumn({
          name: 'target_port',
          type: 'int',
        }),
        new BasicColumn({
          name: 'request_processing_time',
          type: 'double',
        }),
        new BasicColumn({
          name: 'target_processing_time',
          type: 'double',
        }),
        new BasicColumn({
          name: 'response_processing_time',
          type: 'double',
        }),
        new BasicColumn({
          name: 'elb_status_code',
          type: 'int',
        }),
        new BasicColumn({
          name: 'target_status_code',
          type: 'string',
        }),
        new BasicColumn({
          name: 'received_bytes',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'sent_bytes',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'request_verb',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_url',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_proto',
          type: 'string',
        }),
        new BasicColumn({
          name: 'user_agent',
          type: 'string',
        }),
        new BasicColumn({
          name: 'ssl_cipher',
          type: 'string',
        }),
        new BasicColumn({
          name: 'ssl_protocol',
          type: 'string',
        }),
        new BasicColumn({
          name: 'target_group_arn',
          type: 'string',
        }),
        new BasicColumn({
          name: 'trace_id',
          type: 'string',
        }),
        new BasicColumn({
          name: 'domain_name',
          type: 'string',
        }),
        new BasicColumn({
          name: 'chosen_cert_arn',
          type: 'string',
        }),
        new BasicColumn({
          name: 'matched_rule_priority',
          type: 'string',
        }),
        new BasicColumn({
          name: 'request_creation_time',
          type: 'string',
        }),
        new BasicColumn({
          name: 'actions_executed',
          type: 'string',
        }),
        new BasicColumn({
          name: 'redirect_url',
          type: 'string',
        }),
        new BasicColumn({
          name: 'lambda_error_reason',
          type: 'string',
        }),
        new BasicColumn({
          name: 'target_port_list',
          type: 'string',
        }),
        new BasicColumn({
          name: 'target_status_code_list',
          type: 'string',
        }),
        new BasicColumn({
          name: 'classification',
          type: 'string',
        }),
        new BasicColumn({
          name: 'classification_reason',
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
      description: 'Table used for querying ALB access logs.',
      location: `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}AWSLogs/`,
      name: props.name,
      owner: 'hadoop',
      parameters: {
        'EXTERNAL': 'TRUE',
        'projection.day.format': 'yyyy/MM/dd',
        'projection.day.interval': '1',
        'projection.day.range': `${projectionYear}/01/01,NOW`,
        'projection.day.type': 'date',
        'projection.day.interval.unit': 'DAYS',
        'projection.logname.type': 'enum',
        'projection.logname.values': 'elasticloadbalancing',
        'projection.regionname.type': 'enum',
        'projection.regionname.values': RegionInfo.regions.map((x) => {
          return x.name;
        }).join(','),
        'projection.source.type': 'enum',
        'projection.source.values': Lazy.string({
          produce: () => {
            if (Token.isUnresolved(this.stack.account)) {
              Annotations.of(this).addWarning([
                `ALB logs table stack for ${this.node.path} is environment agnostic.`,
                'Cross account partition projection cannot be configured on environment',
                'agnostic stacks. To enable partition projection please specify an account',
                `for the ${this.stack.node.path} stack.`,
              ].join(' '));
              return this.stack.account;
            } else {
              return [...new Set(this.node.root.node.findAll().reduce((prev, cur) => {
                if ((cur instanceof Stage || cur instanceof Stack) && cur.account && !Token.isUnresolved(cur.account)) {
                  prev.push(cur.account);
                }

                return prev;
              }, [] as string[]))].join(',');
            }
          },
        }),
        'projection.enabled': 'true',
        'storage.location.template': `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}AWSLogs/\${source}/\${logname}/\${regionname}/\${day}`,
      },
      partitionKeys: [
        new BasicColumn({
          name: 'source',
          type: 'string',
        }),
        new BasicColumn({
          name: 'logname',
          type: 'string',
        }),
        new BasicColumn({
          name: 'regionname',
          type: 'string',
        }),
        new BasicColumn({
          name: 'day',
          type: 'string',
        }),
      ],
      serdeParameters: {
        'input.regex': '([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*):([0-9]*) ([^ ]*)[:-]([0-9]*) ([-.0-9]*) ([-.0-9]*) ([-.0-9]*) (|[-0-9]*) (-|[-0-9]*) ([-0-9]*) ([-0-9]*) \"([^ ]*) (.*) (- |[^ ]*)\" \"([^\"]*)\" ([A-Z0-9-_]+) ([A-Za-z0-9.-]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" ([-.0-9]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^ ]*)\" \"([^\s]+?)\" \"([^\s]+)\" \"([^ ]*)\" \"([^ ]*)\"',
        'serialization.format': '1',
      },
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;

    if (this.createQueries) {
      this.topIpsNamedQuery = new NamedQuery(this, 'top-ips-named-query', {
        database: this.database,
        description: 'Gets the 100 most actvie IP addresses by request count.',
        name: this.friendlyQueryNames ? 'alb-top-ips' : undefined,
        queryString: [
          'SELECT client_ip,',
          '    COUNT(*) AS requests,',
          '    COUNT_IF(elb_status_code BETWEEN 400 AND 499) AS errors_4xx,',
          '    COUNT_IF(elb_status_code BETWEEN 500 AND 599) AS errors_5xx,',
          '    SUM(sent_bytes) AS sent,',
          '    SUM(received_bytes) AS received,',
          '    SUM(sent_bytes + received_bytes) AS total,',
          '    ARBITRARY(user_agent) as user_agent',
          `FROM ${this.tableName}`,
          "WHERE day >= DATE_FORMAT(NOW() - PARSE_DURATION('1d'), '%Y/%m/%d')",
          "    AND FROM_ISO8601_TIMESTAMP(time) >= NOW() - PARSE_DURATION('1d')",
          'GROUP BY client_ip',
          'ORDER by total DESC LIMIT 100;',
        ].join('\n'),
      });

      this.status5xxNamedQuery = new NamedQuery(this, 'status-5xx-named-query', {
        database: this.database,
        description: 'Gets the 100 most recent ELB 5XX responses.',
        name: this.friendlyQueryNames ? 'alb-5xx-errors' : undefined,
        queryString: [
          "SELECT FROM_ISO8601_TIMESTAMP(time) AT TIME ZONE 'UTC' AS time,",
          "    CONCAT(client_ip, ':', CAST(client_port AS varchar)) AS client,",
          "    CONCAT(target_ip, ':', CAST(target_port AS varchar)) AS target,",
          '    CASE',
          "        WHEN CAST(elb_status_code AS varchar) != target_status_code THEN CONCAT(CAST(elb_status_code AS varchar), ' (', target_status_code, ')')",
          '        ELSE CAST(elb_status_code AS varchar)',
          '    END as status,',
          '    request_verb AS verb,',
          '    request_url AS url,',
          '    source AS account,',
          '    elb',
          `FROM ${this.tableName}`,
          'WHERE elb_status_code BETWEEN 500 AND 599',
          "    AND day >= DATE_FORMAT(NOW() - PARSE_DURATION('1d'), '%Y/%m/%d')",
          "    AND FROM_ISO8601_TIMESTAMP(time) >= NOW() - PARSE_DURATION('1d')",
          'ORDER BY time DESC LIMIT 100;',
        ].join('\n'),
      });
    }
  }
}
