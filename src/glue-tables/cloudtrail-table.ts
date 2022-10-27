import { Annotations, Lazy, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { ArrayColumn, BasicColumn, Database, InputFormat, OutputFormat, SerializationLibrary, StructColumn, Table, TableType } from '../glue';


/**
 * Configuration for FlowLogsTable
 */
export interface CloudtrailTableProps extends ResourceProps {
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
    * Name for Cloudtrail Logs Table
    */
   readonly name?: string;
   /**
    * Set a custom prefix for the S3 Bucket
    */
  readonly s3Prefix?: string;
}

export class CloudtrailTable extends Table {
  // Input properties
  /**
    * A cdk-extensions/glue Database object that the table should be created in.
    * 
    * @see [AWS::Glue::Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html)
    */
  public readonly createQueries: boolean;
  /**
    * Boolean for adding "friendly names" for the created Athena queries.
    */
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly unauthorizedNamedQuery?: NamedQuery;
  public readonly userLoginsNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the FlowLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: CloudtrailTableProps) {
    const projectionYear = new Date().getFullYear() - 1;

    super(scope, id, {
      columns: [
        new BasicColumn({
          name: 'eventVersion',
          type: 'string',
        }),
        new StructColumn({
          name: 'userIdentity',
          data: [
            new BasicColumn({
              name: 'type',
              type: 'string',
            }),
            new BasicColumn({
              name: 'principalId',
              type: 'string',
            }),
            new BasicColumn({
              name: 'arn',
              type: 'string',
            }),
            new BasicColumn({
              name: 'accountId',
              type: 'string',
            }),
            new BasicColumn({
              name: 'invokedBy',
              type: 'string',
            }),
            new BasicColumn({
              name: 'accessKeyId',
              type: 'string',
            }),
            new BasicColumn({
              name: 'userName',
              type: 'string',
            }),
            new StructColumn({
              name: 'sessionContext',
              data: [
                new StructColumn({
                  name: 'attributes',
                  data: [
                    new BasicColumn({
                      name: 'mfaAuthenticated',
                      type: 'string',
                    }),
                    new BasicColumn({
                      name: 'creationDate',
                      type: 'string',
                    }),
                  ],
                }),
                new StructColumn({
                  name: 'sessionIssuer',
                  data: [
                    new BasicColumn({
                      name: 'type',
                      type: 'string',
                    }),
                    new BasicColumn({
                      name: 'principalId',
                      type: 'string',
                    }),
                    new BasicColumn({
                      name: 'arn',
                      type: 'string',
                    }),
                    new BasicColumn({
                      name: 'accountId',
                      type: 'string',
                    }),
                    new BasicColumn({
                      name: 'userName',
                      type: 'string',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new BasicColumn({
          name: 'eventTime',
          type: 'string',
        }),
        new BasicColumn({
          name: 'eventSource',
          type: 'string',
        }),
        new BasicColumn({
          name: 'eventName',
          type: 'string',
        }),
        new BasicColumn({
          name: 'awsRegion',
          type: 'string',
        }),
        new BasicColumn({
          name: 'sourceIpAddress',
          type: 'string',
        }),
        new BasicColumn({
          name: 'userAgent',
          type: 'string',
        }),
        new BasicColumn({
          name: 'errorCode',
          type: 'string',
        }),
        new BasicColumn({
          name: 'errorMessage',
          type: 'string',
        }),
        new BasicColumn({
          name: 'requestParameters',
          type: 'string',
        }),
        new BasicColumn({
          name: 'responseElements',
          type: 'string',
        }),
        new BasicColumn({
          name: 'additionalEventData',
          type: 'string',
        }),
        new BasicColumn({
          name: 'requestId',
          type: 'string',
        }),
        new BasicColumn({
          name: 'eventId',
          type: 'string',
        }),
        new BasicColumn({
          name: 'readOnly',
          type: 'string',
        }),
        new ArrayColumn({
          name: 'resources',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'arn',
                type: 'string',
              }),
              new BasicColumn({
                name: 'accountId',
                type: 'string',
              }),
              new BasicColumn({
                name: 'type',
                type: 'string',
              }),
            ],
          }),
        }),
        new BasicColumn({
          name: 'eventType',
          type: 'string',
        }),
        new BasicColumn({
          name: 'apiVersion',
          type: 'string',
        }),
        new BasicColumn({
          name: 'recipientAccountId',
          type: 'string',
        }),
        new BasicColumn({
          name: 'serviceEventDetails',
          type: 'string',
        }),
        new BasicColumn({
          name: 'sharedEventID',
          type: 'string',
        }),
        new BasicColumn({
          name: 'vpcendpointid',
          type: 'string',
        }),
      ],
      compressed: false,
      dataFormat: {
        inputFormat: InputFormat.CLOUDTRAIL,
        outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
        serializationLibrary: SerializationLibrary.CLOUDTRAIL,
      },
      database: props.database,
      description: 'Table used for querying AWS API history.',
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
        'projection.logname.values': 'CloudTrail',
        'projection.regionname.type': 'enum',
        'projection.regionname.values': RegionInfo.regions.map((x) => {
          return x.name;
        }).join(','),
        'projection.source.type': 'enum',
        'projection.source.values': Lazy.string({
          produce: () => {
            if (Token.isUnresolved(this.stack.account)) {
              Annotations.of(this).addWarning([
                `CloudTrail table stack for ${this.node.path} is environment agnostic.`,
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
        'serialization.format': '1',
      },
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;

    if (this.createQueries) {
      this.unauthorizedNamedQuery = new NamedQuery(this, 'unauthorized-named-query', {
        database: this.database,
        description: 'Gets the 100 most recent unauthorized AWS API calls.',
        name: this.friendlyQueryNames ? 'cloudtrail-unauthorized-errors' : undefined,
        queryString: [
          "SELECT FROM_ISO8601_TIMESTAMP(eventtime) AT TIME ZONE 'UTC' AS time,",
          "    CONCAT(SPLIT(eventsource, '.')[1], ':', eventname) AS event,",
          '    useridentity.arn as entity,',
          '    useridentity.accountid as srcaccount,',
          '    recipientaccountid as dstaccount,',
          '    awsregion,',
          '    errormessage,',
          '    requestparameters as params',
          `FROM ${this.tableName}`,
          "WHERE (errorcode LIKE 'AccessDenied%' OR errorcode LIKE '%UnauthorizedOperation')",
          "    AND day >= DATE_FORMAT(NOW() - PARSE_DURATION('1d'), '%Y/%m/%d')",
          "    AND FROM_ISO8601_TIMESTAMP(eventtime) >= NOW() - PARSE_DURATION('1d')",
          'ORDER BY eventtime DESC LIMIT 100;',
        ].join('\n'),
      });

      this.userLoginsNamedQuery = new NamedQuery(this, 'user-logins-named-query', {
        database: this.database,
        description: 'Gets the 100 most recent AWS user logins.',
        name: this.friendlyQueryNames ? 'cloudtrail-user-logins' : undefined,
        queryString: [
          "SELECT FROM_ISO8601_TIMESTAMP(eventtime) AT TIME ZONE 'UTC' AS time,",
          "    CONCAT(SPLIT(eventsource, '.')[1], ':', eventname) AS event,",
          '    useridentity.username as username,',
          '    useridentity.accountid as account,',
          '    awsregion',
          `FROM ${this.tableName}`,
          "WHERE eventname = 'ConsoleLogin'",
          "    AND day >= DATE_FORMAT(NOW() - PARSE_DURATION('30d'), '%Y/%m/%d')",
          "    AND FROM_ISO8601_TIMESTAMP(eventtime) >= NOW() - PARSE_DURATION('30d')",
          'ORDER BY eventtime DESC LIMIT 100;',
        ].join('\n'),
      });
    }
  }
}
