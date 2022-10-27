import { Annotations, Lazy, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-glue';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { FlowLogDataType, FlowLogField, FlowLogFormat } from '../ec2';
import { BasicColumn, Database, InputFormat, OutputFormat, SerializationLibrary, Table, TableType } from '../glue';
import { includesAll } from '../utils/formatting';


/**
 * Configuration for FlowLogsTable
 */
export interface FlowLogsTableProps extends ResourceProps {
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
   * A cdk-extentions/ec2 {@link aws-ec2!FlowLogFormat } object defining the desired formatting for Flow Logs
   */
  readonly format?: FlowLogFormat;
  /**
   * Boolean for adding "friendly names" for the created Athena queries.
   */
  readonly friendlyQueryNames?: boolean;
  /**
   * Name for Flow Logs Table
   */
  readonly name?: string;
  /**
   * Set a custom prefix for the S3 Bucket
   */
  readonly s3Prefix?: string;
}

export class FlowLogsTable extends Table {
  // Input properties
  /**
   * Boolean indicating whether to create Athena default Athena queries for the ALB Logs
   * 
   * @see [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html)
   */
  public readonly createQueries: boolean;
  /**
   * A cdk-extentions/ec2 {@link aws-ec2!FlowLogFormat } object defining the desired formatting for Flow Logs
   */
  public readonly format: FlowLogFormat;
  /**
   * Boolean for adding "friendly names" for the created Athena queries.
   */
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly internalRejectedNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the FlowLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: FlowLogsTableProps) {
    const projectionYear = new Date().getFullYear() - 1;

    super(scope, id, {
      compressed: false,
      dataFormat: {
        inputFormat: InputFormat.TEXT,
        outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
        serializationLibrary: SerializationLibrary.LAZY_SIMPLE,
      },
      database: props.database,
      description: 'Table used for querying network traffic flow.',
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
        'projection.logname.values': 'vpcflowlogs',
        'projection.regionname.type': 'enum',
        'projection.regionname.values': RegionInfo.regions.map((x) => {
          return x.name;
        }).join(','),
        'projection.source.type': 'enum',
        'projection.source.values': Lazy.string({
          produce: () => {
            if (Token.isUnresolved(this.stack.account)) {
              Annotations.of(this).addWarning([
                `Flow logs table stack for ${this.node.path} is environment agnostic.`,
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
        'skip.header.line.count': '1',
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
        'field.delim': ' ',
        'serialization.format': ' ',
      },
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.format = props.format ?? FlowLogFormat.V2;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;

    const internalRejectedFields = [
      FlowLogField.ACTION,
      FlowLogField.DSTADDR,
      FlowLogField.DSTPORT,
      FlowLogField.PROTOCOL,
      FlowLogField.SRCADDR,
      FlowLogField.SRCPORT,
      FlowLogField.START,
    ];

    if (this.createQueries) {
      if (includesAll(this.format.fields, internalRejectedFields)) {
        this.internalRejectedNamedQuery = new NamedQuery(this, 'internal-rejected-named-query', {
          database: this.database,
          description: 'Gets the 100 most recent rejected packets that stayed within the private network ranges.',
          name: this.friendlyQueryNames ? 'flow-logs-internal-rejected' : undefined,
          queryString: [
            'SELECT FROM_UNIXTIME("start", \'UTC\') AS "timestamp",',
            '    CASE',
            "        WHEN protocol = 1 THEN 'ICMP'",
            "        WHEN protocol = 6 THEN 'TCP'",
            "        WHEN protocol = 17 THEN 'UDP'",
            '        ELSE CAST(protocol AS varchar)',
            '    END AS proto,',
            "    IF(protocol IN (6, 17), CONCAT(srcaddr, ':', CAST(srcport AS varchar)), srcaddr) AS source,",
            "    IF(protocol IN (6, 17), CONCAT(dstaddr, ':', CAST(dstport AS varchar)), dstaddr) AS destination,",
            '    action',
            `FROM ${this.tableName}`,
            "WHERE REGEXP_LIKE(srcaddr, '^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.).*')",
            "    AND REGEXP_LIKE(dstaddr, '^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.).*')",
            "    AND day >= DATE_FORMAT(NOW() - PARSE_DURATION('1d'), '%Y/%m/%d')",
            "    AND start >= TO_UNIXTIME(NOW() - PARSE_DURATION('1d'))",
            "    AND action = 'REJECT'",
            'ORDER BY start DESC LIMIT 100;',
          ].join('\n'),
        });
      }
    }
  }

  protected renderStorageDescriptor(): CfnTable.StorageDescriptorProperty | undefined {
    this.format.fields.forEach((x) => {
      this.addColumn(new BasicColumn({
        name: x.name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
        type: x.type === FlowLogDataType.STRING ? 'string' : 'int',
      }));
    });

    return super.renderStorageDescriptor();
  }
}
