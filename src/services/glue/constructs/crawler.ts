import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnCrawler } from 'aws-cdk-lib/aws-glue';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { definedFieldsOrUndefined, flattenedOrUndefined, undefinedIfNoKeys } from '../../../utils/formatting';
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
    catalogTargets?: CfnCrawler.CatalogTargetProperty[];
    dynamoDbTargets?: CfnCrawler.DynamoDBTargetProperty[];
    jdbcTargets?: CfnCrawler.JdbcTargetProperty[]
    s3Targets?: CfnCrawler.S3TargetProperty[];
}

export interface ICrawlerTarget {
    bind(crawler: Crawler): CrawlerTargetCollection;
}

/**
 * Configuration for Crawlner
 */
export interface CrawlerProps extends ResourceProps {
    readonly classifiers?: string[];
    readonly configuration?: CrawlerConfiguration;
    readonly database?: Database;
    readonly deleteBehavior?: DeleteBehavior;
    readonly description?: string;
    readonly name?: string;
    readonly recrawlBehavior?: RecrawlBehavior;
    readonly securityConfiguration?: SecurityConfiguration;
    readonly scheduleExpression?: Schedule;
    readonly tablePrefix?: string;
    readonly targets?: ICrawlerTarget[];
    readonly updateBehavior?: UpdateBehavior;
}

export class Crawler extends Resource {
    // Internal properties
    private readonly _classifiers: string[] = [];
    private readonly _targets: ICrawlerTarget[] = [];

    // Input properties
    public readonly configuration?: CrawlerConfiguration;
    public readonly database?: Database;
    public readonly deleteBehavior?: DeleteBehavior;
    public readonly description?: string;
    public readonly name?: string;
    public readonly recrawlBehavior?: RecrawlBehavior;
    public readonly scheduleExpression?: Schedule;
    public readonly securityConfiguration?: SecurityConfiguration;
    public readonly tablePrefix?: string;
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
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique 
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
    constructor(scope: Construct, id: string, props: CrawlerProps) {
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
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')
            ]
        });

        this.resource = new CfnCrawler(this, 'Resource', {
            classifiers: Lazy.uncachedList(
                {
                    produce: () => {
                        return this._classifiers;
                    }
                },
                {
                    omitEmpty: true
                }
            ),
            configuration: this.renderConfiguration(),
            crawlerSecurityConfiguration: this.securityConfiguration?.securityConfigurationName,
            databaseName: this.database?.databaseName,
            description: this.description,
            name: this.name,
            recrawlPolicy: undefinedIfNoKeys({
                recrawlBehavior: this.recrawlBehavior
            }),
            role: this.role.roleArn,
            schedule: undefinedIfNoKeys({
                scheduleExpression: this.scheduleExpression?.expressionString
            }),
            schemaChangePolicy: undefinedIfNoKeys({
                deleteBehavior: this.deleteBehavior,
                updateBehavior: this.updateBehavior
            }),
            tablePrefix: this.tablePrefix,
            targets: Lazy.uncachedAny({
                produce: () => {
                    return this.renderTargets();
                }
            })
        });

        this.crawlerArn = this.stack.formatArn({
            resource: 'crawler',
            resourceName: this.resource.ref,
            service: 'glue'
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
                    AddOrUpdateBehavior: this.configuration?.partitionUpdateBehavior
                }),
                Tables: definedFieldsOrUndefined({
                    AddOrUpdateBehavior: this.configuration?.tableUpdateBehavior
                })
            }),
            Grouping: definedFieldsOrUndefined({
                TableGroupingPolicy: this.configuration?.tableGroupingPolicy,
                TableLevelConfiguration: this.configuration?.tableLevel
            })
        });

        return configuration === undefined ? undefined : this.stack.toJsonString({
            Version: this.configuration?.version ?? ConfigurationVersion.V1_0,
            ...configuration
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
            }))
        });
    }
}
