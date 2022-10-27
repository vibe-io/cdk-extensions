import { Annotations, Lazy, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { RegionInfo } from 'aws-cdk-lib/region-info';
import { Construct } from 'constructs';
import { NamedQuery } from '../athena';
import { ArrayColumn, BasicColumn, Database, InputFormat, OutputFormat, SerializationLibrary, StructColumn, Table, TableType } from '../glue';


/**
 * Configuration for S3AccessLogsTable
 */
export interface WafLogsTableProps extends ResourceProps {
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
    * Name for WAF Logs Table
    */
   readonly name?: string;
   /**
    * Set a custom prefix for the S3 Bucket
    */
  readonly s3Prefix?: string;
}

export class WafLogsTable extends Table {
  // Input properties
  public readonly createQueries: boolean;
  public readonly friendlyQueryNames: boolean;

  // Resource properties
  public readonly status5xxNamedQuery?: NamedQuery;
  public readonly topIpsNamedQuery?: NamedQuery;


  /**
     * Creates a new instance of the S3AccessLogsTable class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: WafLogsTableProps) {
    super(scope, id, {
      columns: [
        new BasicColumn({
          name: 'timestamp',
          type: 'bigint',
        }),
        new BasicColumn({
          name: 'formatversion',
          type: 'int',
        }),
        new BasicColumn({
          name: 'webaclid',
          type: 'string',
        }),
        new BasicColumn({
          name: 'terminatingruleid',
          type: 'string',
        }),
        new BasicColumn({
          name: 'terminatingruletype',
          type: 'string',
        }),
        new BasicColumn({
          name: 'action',
          type: 'string',
        }),
        new ArrayColumn({
          name: 'terminatingrulematchdetails',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'conditiontype',
                type: 'string',
              }),
              new BasicColumn({
                name: 'location',
                type: 'string',
              }),
              new ArrayColumn({
                name: 'matcheddata',
                data: new BasicColumn({
                  type: 'string',
                }),
              }),
            ],
          }),
        }),
        new BasicColumn({
          name: 'httpsourcename',
          type: 'string',
        }),
        new BasicColumn({
          name: 'httpsourceid',
          type: 'string',
        }),
        new ArrayColumn({
          name: 'rulegrouplist',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'rulegroupid',
                type: 'string',
              }),
              new StructColumn({
                name: 'terminatingrule',
                data: [
                  new BasicColumn({
                    name: 'ruleid',
                    type: 'string',
                  }),
                  new BasicColumn({
                    name: 'action',
                    type: 'string',
                  }),
                  new BasicColumn({
                    name: 'rulematchdetails',
                    type: 'string',
                  }),
                ],
              }),
              new ArrayColumn({
                name: 'nonterminatingmatchingrules',
                data: new BasicColumn({
                  type: 'string',
                }),
              }),
              new BasicColumn({
                name: 'excludedrules',
                type: 'string',
              }),
            ],
          }),
        }),
        new ArrayColumn({
          name: 'ratebasedrulelist',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'ratebasedruleid',
                type: 'string',
              }),
              new BasicColumn({
                name: 'limitkey',
                type: 'string',
              }),
              new BasicColumn({
                name: 'maxrateallowed',
                type: 'int',
              }),
            ],
          }),
        }),
        new ArrayColumn({
          name: 'nonterminatingmatchingrules',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'ruleid',
                type: 'string',
              }),
              new BasicColumn({
                name: 'action',
                type: 'string',
              }),
            ],
          }),
        }),
        new BasicColumn({
          name: 'requestheadersinserted',
          type: 'string',
        }),
        new BasicColumn({
          name: 'responsecodesent',
          type: 'string',
        }),
        new StructColumn({
          name: 'httprequest',
          data: [
            new BasicColumn({
              name: 'clientip',
              type: 'string',
            }),
            new BasicColumn({
              name: 'country',
              type: 'string',
            }),
            new ArrayColumn({
              name: 'headers',
              data: new StructColumn({
                data: [
                  new BasicColumn({
                    name: 'name',
                    type: 'string',
                  }),
                  new BasicColumn({
                    name: 'value',
                    type: 'string',
                  }),
                ],
              }),
            }),
            new BasicColumn({
              name: 'uri',
              type: 'string',
            }),
            new BasicColumn({
              name: 'args',
              type: 'string',
            }),
            new BasicColumn({
              name: 'httpversion',
              type: 'string',
            }),
            new BasicColumn({
              name: 'httpmethod',
              type: 'string',
            }),
            new BasicColumn({
              name: 'requestid',
              type: 'string',
            }),
          ],
        }),
        new ArrayColumn({
          name: 'labels',
          data: new StructColumn({
            data: [
              new BasicColumn({
                name: 'name',
                type: 'string',
              }),
            ],
          }),
        }),
        new StructColumn({
          name: 'captcharesponse',
          data: [
            new BasicColumn({
              name: 'responsecode',
              type: 'string',
            }),
            new BasicColumn({
              name: 'solvetimestamp',
              type: 'string',
            }),
            new BasicColumn({
              name: 'failureReason',
              type: 'string',
            }),
          ],
        }),
      ],
      compressed: false,
      dataFormat: {
        inputFormat: InputFormat.TEXT,
        outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
        serializationLibrary: SerializationLibrary.OPENX_JSON,
      },
      database: props.database,
      description: 'Table used for querying AWS WAF logs.',
      location: `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}AWSLogs/`,
      name: props.name,
      owner: 'hadoop',
      parameters: {
        'EXTERNAL': 'TRUE',
        'projection.region.type': 'enum',
        'projection.region.values': RegionInfo.regions.map((x) => {
          return x.name;
        }).join(','),
        'projection.account.type': 'enum',
        'projection.account.values': Lazy.string({
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
        'storage.location.template': `s3://${props.bucket.bucketName}/${props.s3Prefix ?? ''}AWSLogs/\${account}/WAFLogs/\${region}/`,
      },
      partitionKeys: [
        new BasicColumn({
          name: 'account',
          type: 'string',
        }),
        new BasicColumn({
          name: 'region',
          type: 'string',
        }),
      ],
      storedAsSubDirectories: false,
      tableType: TableType.EXTERNAL_TABLE,
    });

    this.createQueries = props.createQueries ?? true;
    this.friendlyQueryNames = props.friendlyQueryNames ?? false;
  }
}
