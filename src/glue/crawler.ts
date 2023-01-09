import { Arn, ArnFormat, Lazy, Resource, ResourceProps, Stack } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnCrawler } from 'aws-cdk-lib/aws-glue';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct, IConstruct } from 'constructs';
import { definedFieldsOrUndefined, flattenedOrUndefined, undefinedIfNoKeys } from '../utils/formatting';
import { Database } from './database';
import { SecurityConfiguration } from './security-configuration';


export enum ConfigurationVersion {
  V1_0 = 1.0
}

export enum DeleteBehavior {
  DELETE_FROM_DATABASE = 'DELETE_FROM_DATABASE',
  DEPRECATE_IN_DATABASE = 'DEPRECATE_IN_DATABASE',
  LOG = 'LOG'
}

export enum PartitionUpdateBehavior {
  INHERIT_FROM_TABLE = 'InheritFromTable'
}

export enum RecrawlBehavior {
  EVENT_MODE = 'CRAWL_EVENT_MODE',
  EVERYTHING = 'CRAWL_EVERYTHING',
  NEW_FOLDERS_ONLY = 'CRAWL_NEW_FOLDERS_ONLY'
}

export enum TableGroupingPolicy {
  COMBINE_COMPATIBLE_SCHEMAS = 'CombineCompatibleSchemas'
}

export enum TableUpdateBehavior {
  MERGE_NEW_COLUMNS = 'MergeNewColumns'
}

export enum UpdateBehavior {
  UPDATE_IN_DATABASE = 'UPDATE_IN_DATABASE',
  LOG = 'LOG'
}

export interface CrawlerConfiguration {
  readonly partitionUpdateBehavior?: PartitionUpdateBehavior;
  readonly tableGroupingPolicy?: TableGroupingPolicy;
  readonly tableLevel?: number;
  readonly tableUpdateBehavior?: TableUpdateBehavior;
  readonly version?: ConfigurationVersion;
}

export interface CrawlerTargetCollection {
  readonly catalogTargets?: CfnCrawler.CatalogTargetProperty[];
  readonly dynamoDbTargets?: CfnCrawler.DynamoDBTargetProperty[];
  readonly jdbcTargets?: CfnCrawler.JdbcTargetProperty[];
  readonly s3Targets?: CfnCrawler.S3TargetProperty[];
}

export interface ICrawlerTarget {
  bind(crawler: Crawler): CrawlerTargetCollection;
}

export interface ICrawler extends IConstruct {
  /**
   * The Amazon Resource Name (ARN) of the crawler.
   */
  readonly crawlerArn: string;

  /**
   * The name of the crawler.
   */
  readonly crawlerName: string;
}

abstract class CrawlerBase extends Resource implements ICrawler {
  /**
   * The Amazon Resource Name (ARN) of the crawler.
   */
  public abstract readonly crawlerArn: string;

  /**
   * The name of the crawler.
   */
  public abstract readonly crawlerName: string;
}

/**
 * Configuration for Crawler
 */
export interface CrawlerProps extends ResourceProps {
  /**
   * A list of UTF-8 strings that specify the names of custom classifiers that are associated with the crawler.
   *
   * @see [AWS::Glue::Crawler](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-classifiers)
   */
  readonly classifiers?: string[];

  /**
   * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Configuring a Crawler.
   *
   * @see [AWS::Glue::Crawler](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-configuration)
   */
  readonly configuration?: CrawlerConfiguration;

  /**
   * The {@link aws-glue.Database | Database } object in which the crawler's output is stored.
   */
  readonly database?: Database;

  /**
   * The deletion behavior when the crawler finds a deleted object.
   *
   * @see [AWS::Glue::Crawler SchemaChangePolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-deletebehavior)
   */
  readonly deleteBehavior?: DeleteBehavior;

  /**
   * Description of the Crawler
   */
  readonly description?: string;

  /**
   * Name of the Crawler
   */
  readonly name?: string;

  /**
   * When crawling an Amazon S3 data source after the first crawl is complete, specifies whether to crawl the entire dataset again or to crawl only folders that were added since the last crawler run.
   *
   * @see [AWS::Glue::Crawler RecrawlPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-recrawlpolicy.html)
   */
  readonly recrawlBehavior?: RecrawlBehavior;

  /**
   * A {@link aws-glue.SecurityConfiguration | SecurityConfiguration } object to apply to the Crawler
   */
  readonly securityConfiguration?: SecurityConfiguration;

  /**
   * For scheduled crawlers, the schedule when the crawler runs.
   *
   * @see [AWS::Glue::Crawler Schedule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schedule.html)
   */
  readonly scheduleExpression?: Schedule;

  /**
   * The prefix added to the names of tables that are created.
   *
   * @see [AWS::Glue::Crawler](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-tableprefix)
   */
  readonly tablePrefix?: string;

  /**
   * A collection of targets to crawl.
   *
   * @see [AWS::Glue::Crawler](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-targets)
   */
  readonly targets?: ICrawlerTarget[];

  /**
   * The update behavior when the crawler finds a changed schema.
   *
   * @see [AWS::Glue::Crawler SchemaChangePolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-updatebehavior)
   */
  readonly updateBehavior?: UpdateBehavior;
}

/**
 * Create a Crawler resource to pull information from the provided resource.
 *
 * @see [AWS::Glue::Crawler](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html)
 */
export class Crawler extends CrawlerBase {
  /**
   * Imports an existing crawler using its Amazon Resource Name (ARN).
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param crawlerArn The ARN of the crawler to import.
   * @returns An object representing the crawler that was imported.
   */
  public static fromCrawlerArn(scope: IConstruct, id: string, crawlerArn: string): ICrawler {
    class Import extends CrawlerBase {
      public readonly crawlerArn: string = crawlerArn;
      public readonly crawlerName: string = Arn.split(crawlerArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing crawler using its name.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param crawlerName The name of the crawler to import.
   * @returns An object representing the crawler that was imported.
   */
  public static fromCrawlerName(scope: IConstruct, id: string, crawlerName: string): ICrawler {
    return Crawler.fromCrawlerArn(scope, id, Stack.of(scope).formatArn({
      resource: 'crawler',
      resourceName: crawlerName,
      service: 'glue',
    }));
  }

  // Internal properties
  private readonly _classifiers: string[] = [];
  private readonly _targets: ICrawlerTarget[] = [];

  // Input properties
  /**
    * {@link CrawlerProps.configuration}
    */
  public readonly configuration?: CrawlerConfiguration;

  /**
    * {@link CrawlerProps.database}
    */
  public readonly database?: Database;

  /**
    * {@link CrawlerProps.deleteBehavior}
    */
  public readonly deleteBehavior?: DeleteBehavior;

  /**
    * {@link CrawlerProps.description}
    */
  public readonly description?: string;

  /**
    * {@link CrawlerProps.name}
    */
  public readonly name?: string;

  /**
    * {@link CrawlerProps.recrawlBehavior}
    */
  public readonly recrawlBehavior?: RecrawlBehavior;

  /**
    * {@link CrawlerProps.scheduleExpression}
    */
  public readonly scheduleExpression?: Schedule;

  /**
    * {@link CrawlerProps.securityConfiguration}
    */
  public readonly securityConfiguration?: SecurityConfiguration;

  /**
    * {@link CrawlerProps.tablePrefix}
    */
  public readonly tablePrefix?: string;

  /**
    * {@link CrawlerProps.updateBehavior}
    */
  public readonly updateBehavior?: UpdateBehavior;

  // Resource properties
  public readonly role: Role;
  public readonly resource: CfnCrawler;

  // Standard properties
  public readonly crawlerArn: string;
  public readonly crawlerName: string;


  /**
   * Creates a new instance of the Crawler class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: CrawlerProps) {
    super(scope, id, props);

    this.configuration = props.configuration;
    this.database = props.database;
    this.deleteBehavior = props.deleteBehavior;
    this.description = props.description;
    this.name = props.name;
    this.recrawlBehavior = props.recrawlBehavior;
    this.scheduleExpression = props.scheduleExpression;
    this.securityConfiguration = props.securityConfiguration;
    this.tablePrefix = props.tablePrefix;
    this.updateBehavior = props.updateBehavior;

    props.targets?.forEach((x) => {
      this.addTarget(x);
    });

    this.role = new Role(this, 'role', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
      ],
    });

    this.resource = new CfnCrawler(this, 'Resource', {
      classifiers: Lazy.uncachedList(
        {
          produce: () => {
            return this._classifiers;
          },
        },
        {
          omitEmpty: true,
        },
      ),
      configuration: this.renderConfiguration(),
      crawlerSecurityConfiguration: this.securityConfiguration?.securityConfigurationName,
      databaseName: this.database?.databaseName,
      description: this.description,
      name: this.name,
      recrawlPolicy: undefinedIfNoKeys({
        recrawlBehavior: this.recrawlBehavior,
      }),
      role: this.role.roleArn,
      schedule: undefinedIfNoKeys({
        scheduleExpression: this.scheduleExpression?.expressionString,
      }),
      schemaChangePolicy: undefinedIfNoKeys({
        deleteBehavior: this.deleteBehavior,
        updateBehavior: this.updateBehavior,
      }),
      tablePrefix: this.tablePrefix,
      targets: Lazy.uncachedAny({
        produce: () => {
          return this.renderTargets();
        },
      }),
    });

    this.crawlerArn = this.stack.formatArn({
      resource: 'crawler',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.crawlerName = this.resource.ref;
  }

  public addClassifier(classifier: string): void {
    this._classifiers.push(classifier);
  }

  public addTarget(target: ICrawlerTarget): void {
    this._targets.push(target);
  }

  private renderConfiguration(): string | undefined {
    const configuration = definedFieldsOrUndefined({
      CrawlerOutput: definedFieldsOrUndefined({
        Partitions: definedFieldsOrUndefined({
          AddOrUpdateBehavior: this.configuration?.partitionUpdateBehavior,
        }),
        Tables: definedFieldsOrUndefined({
          AddOrUpdateBehavior: this.configuration?.tableUpdateBehavior,
        }),
      }),
      Grouping: definedFieldsOrUndefined({
        TableGroupingPolicy: this.configuration?.tableGroupingPolicy,
        TableLevelConfiguration: this.configuration?.tableLevel,
      }),
    });

    return configuration === undefined ? undefined : this.stack.toJsonString({
      Version: this.configuration?.version ?? ConfigurationVersion.V1_0,
      ...configuration,
    });
  }

  private renderTargets(): CfnCrawler.TargetsProperty | undefined {
    const resolved = this._targets.map((x) => {
      return x.bind(this);
    });

    return undefinedIfNoKeys({
      catalogTargets: flattenedOrUndefined(resolved.map((x) => {
        return x.catalogTargets ?? [] as CfnCrawler.CatalogTargetProperty[];
      })),
      dynamoDbTargets: flattenedOrUndefined(resolved.map((x) => {
        return x.dynamoDbTargets ?? [] as CfnCrawler.DynamoDBTargetProperty[];
      })),
      jdbcTargets: flattenedOrUndefined(resolved.map((x) => {
        return x.jdbcTargets ?? [] as CfnCrawler.JdbcTargetProperty[];
      })),
      s3Targets: flattenedOrUndefined(resolved.map((x) => {
        return x.s3Targets ?? [] as CfnCrawler.S3TargetProperty[];
      })),
    });
  }
}
