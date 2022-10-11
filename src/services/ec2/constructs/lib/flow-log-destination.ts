import { ArnFormat, PhysicalName, RemovalPolicy, Stack } from "aws-cdk-lib";
import { FlowLogDestinationType } from "aws-cdk-lib/aws-ec2";
import { Effect, IRole, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { ILogGroup, LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";
import { FlowLogsBucket } from "../../../s3/patterns/flow-logs-bucket";
import { undefinedIfNoKeys } from "../../../../utils/formatting";


export enum FlowLogFileFormat {
    PARQUET = ' parquet',
    PLAIN_TEXT = 'plain-text'
}

export interface FlowLogDestinationConfig {
    readonly bucket?: IBucket;
    readonly destinationOptions?: {[key: string]: any};
    readonly destinationType: FlowLogDestinationType;
    readonly keyPrefix?: string;
    readonly logGroup?: ILogGroup;
    readonly role?: IRole;
    readonly s3Path?: string;
}

export interface FlowLogS3Options {
    readonly fileFormat?: FlowLogFileFormat;
    readonly hiveCompatiblePartitions?: boolean;
    readonly keyPrefix?: string;
    readonly perHourPartition?: boolean;
}

export interface ILogDestination {
    bind(scope: IConstruct): FlowLogDestinationConfig;
}

export abstract class FlowLogDestination implements ILogDestination {
    public static toCloudWatchLogs(logGroup?: ILogGroup, role?: IRole): FlowLogDestination {
        return {
            bind: (scope: IConstruct) => {
                const resolvedLogGroup = logGroup ?? new LogGroup(scope, 'log-group', {
                    removalPolicy: RemovalPolicy.DESTROY,
                    retention: RetentionDays.TWO_WEEKS
                });

                const resolvedRole = role ?? new Role(scope, 'role', {
                    assumedBy: new ServicePrincipal('vpc-flow-logs.amazonaws.com'),
                    roleName: PhysicalName.GENERATE_IF_NEEDED
                });

                resolvedRole.addToPrincipalPolicy(new PolicyStatement({
                    actions: [
                        'logs:CreateLogStream',
                        'logs:DescribeLogStreams',
                        'logs:PutLogEvents'
                    ],
                    // TODO - Handle condition for extra security
                    // See: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html#flow-logs-iam
                    effect: Effect.ALLOW,
                    resources: [
                        resolvedLogGroup.logGroupArn
                    ]
                }));

                return {
                    role: resolvedRole,
                    destinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
                    logGroup: logGroup
                }
            }
        }
    }

    public static toS3(bucket?: IBucket, options?: FlowLogS3Options): FlowLogDestination {
        return {
            bind: (scope: IConstruct) => {
                const resolvedBucket = bucket ?? new FlowLogsBucket(scope, 'bucket');

                resolvedBucket.addToResourcePolicy(
                    new PolicyStatement({
                        actions: [
                            's3:PutObject'
                        ],
                        conditions: {
                            ArnLike: {
                                'aws:SourceArn': Stack.of(scope).formatArn({
                                    arnFormat: ArnFormat.NO_RESOURCE_NAME,
                                    resource: '*',
                                    service: 'logs'
                                })
                            },
                            StringEquals: {
                                'aws:SourceAccount': Stack.of(scope).account,
                                's3:x-amz-acl': 'bucket-owner-full-control'
                            }
                        },
                        effect: Effect.ALLOW,
                        principals: [
                            new ServicePrincipal('delivery.logs.amazonaws.com')
                        ],
                        resources: [
                            resolvedBucket.arnForObjects('*')
                        ]
                    })
                );
        
                resolvedBucket.addToResourcePolicy(
                    new PolicyStatement({
                        actions: [
                            's3:GetBucketAcl'
                        ],
                        conditions: {
                            ArnLike: {
                                'aws:SourceArn': Stack.of(scope).formatArn({
                                    arnFormat: ArnFormat.NO_RESOURCE_NAME,
                                    resource: '*',
                                    service: 'logs'
                                })
                            },
                            StringEquals: {
                                'aws:SourceAccount': Stack.of(scope).account
                            }
                        },
                        effect: Effect.ALLOW,
                        principals: [
                            new ServicePrincipal('delivery.logs.amazonaws.com')
                        ],
                        resources: [
                            resolvedBucket.bucketArn
                        ]
                    })
                );

                return {
                    bucket: resolvedBucket,
                    destinationOptions: undefinedIfNoKeys({
                        FileFormat: options?.fileFormat,
                        HiveCompatiblePartitions: options?.hiveCompatiblePartitions,
                        PerHourPartition: options?.perHourPartition
                    }),
                    destinationType: FlowLogDestinationType.S3,
                    keyPrefix: options?.keyPrefix,
                    s3Path: options?.keyPrefix ? resolvedBucket.arnForObjects(options?.keyPrefix) : resolvedBucket.bucketArn
                };
            }
        };
    }

    public abstract bind(scope: IConstruct): FlowLogDestinationConfig;
}
