import { ArnFormat, Stack, Token } from 'aws-cdk-lib';
import { Effect, IRole, ManagedPolicy, PolicyDocument, PolicyStatement, PrincipalWithConditions, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { AnalyticsEngineVersion, ApacheSparkEngineVersion, AthenaSqlEngineVersion } from './analytics-engine-versions';
import { ApacheSparkOutputEncryption, IAthenaResultEncryption } from './result-encryption';
import { DataSize } from '../../core';


interface OutputConfiguration {
  readonly bucket: IBucket;
  readonly encryptionKey?: IKey;
  readonly encryptionType?: string;
  readonly expectedBucketOwner?: string;
  readonly outputLocation?: string;
}

function configureBucket(scope: IConstruct, options: AnalyticsEngineOutputOptions = {}): OutputConfiguration {
  const bucketAccount = options.bucket?.stack.account;
  const bucketRegion = options.bucket?.stack.region;
  const scopeAccount = Stack.of(scope).account;
  const scopeRegion = Stack.of(scope).region;

  const isCrossAccount = !!(
    bucketAccount &&
    !Token.isUnresolved(bucketAccount) &&
    !Token.isUnresolved(scopeAccount) &&
    bucketAccount !== scopeAccount
  );
  const isCrossRegion = !!(
    bucketRegion &&
    !Token.isUnresolved(bucketRegion) &&
    !Token.isUnresolved(scopeRegion) &&
    bucketRegion !== scopeRegion
  );

  if (isCrossRegion) {
    throw new Error([
      'Buckets for Athena results must be in the same AWS region as the',
      'WorkGroup they are associated with. Cannot set bucket',
      `'${options.bucket!.node.path}' as the results path for resource`,
      `'${scope.node.path}' as the former is in the region '${bucketRegion}'`,
      `while the latter is in region '${scopeRegion}'.`,
    ].join(' '));
  }

  const bucketEncryption = options.encryption ?? ApacheSparkOutputEncryption.sseS3();
  const bucketEncryptionConfiguration = bucketEncryption.bind(scope);

  const bucket = options.bucket ?? new Bucket(scope, 'results-bucket', {
    blockPublicAccess: {
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    },
    encryption: bucketEncryptionConfiguration.bucketEncryption,
    encryptionKey: bucketEncryptionConfiguration.encryptionKey,
    versioned: true,
  });

  const expectedBucketOwner = options.expectedOwnerId ?? (isCrossAccount ? bucketAccount : undefined);

  return {
    bucket: bucket,
    encryptionKey: bucketEncryptionConfiguration.encryptionKey,
    encryptionType: bucketEncryptionConfiguration.encryptionLabel,
    expectedBucketOwner: expectedBucketOwner,
    outputLocation: `s3://${bucket.bucketName}/${options.keyPrefix ?? ''}`,
  };
}

export interface AnalyticsEngineConfiguration {
  readonly encrpytionKey?: IKey;
  readonly enforceConfiguration?: boolean;
  readonly engineVersion?: AnalyticsEngineVersion;
  readonly expectedBucketOwner?: string;
  readonly outputLocation?: string;
  readonly publishMetrics?: boolean;
  readonly queryScannedBytesLimit?: DataSize;
  readonly requesterPays?: boolean;
  readonly resultsBucket?: IBucket;
  readonly resultsBucketEncryptionKey?: IKey;
  readonly resultsBucketEncryptionType?: string;
  readonly role?: IRole;
}

export interface AnalyticsEngineBindProps {
  readonly workGroupName: string;
}

export interface IAnalyticsEngine {
  bind(scope: IConstruct, options: AnalyticsEngineBindProps): AnalyticsEngineConfiguration;
}

export interface AnalyticsEngineOutputOptions {
  readonly bucket?: IBucket;
  readonly encryption?: IAthenaResultEncryption;
  readonly expectedOwnerId?: string;
  readonly keyPrefix?: string;
}

export class ApacheSparkEngineOptions {
  readonly encryptionKey?: IKey;
  readonly engineVersion?: ApacheSparkEngineVersion;
  readonly output?: AnalyticsEngineOutputOptions;
  readonly publishMetrics?: boolean;
  readonly role?: IRole;
}

export interface AthenaSqlEngineOptions {
  readonly enforceConfiguration?: boolean;
  readonly engineVersion?: AthenaSqlEngineVersion;
  readonly output?: AnalyticsEngineOutputOptions;
  readonly publishMetrics?: boolean;
  readonly queryScannedBytesLimit?: DataSize;
  readonly requesterPays?: boolean;
}

export class AnalyticsEngine {
  public static apacheSpark(options: ApacheSparkEngineOptions): IAnalyticsEngine {
    return {
      bind: (scope: IConstruct, props: AnalyticsEngineBindProps) => {
        const output = configureBucket(scope, options.output);

        const role = options.role ?? new Role(scope, 'role', {
          assumedBy: new PrincipalWithConditions(new ServicePrincipal('athena.amazonaws.com'), {
            ArnLike: {
              'aws:SourceAccount': Stack.of(scope).formatArn({
                arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
                resource: 'workgroup',
                resourceName: props.workGroupName,
                service: 'athena',
              }),
            },
            StringEquals: {
              'aws:SourceAccount': Stack.of(scope).account,
            },
          }),
          description: 'Allows Athena WorkGroup to make AWS API calls.',
        });

        if (!options.role) {
          new ManagedPolicy(scope, 'apache-spark-policy', {
            description: 'Grants permissions needed for Apache Spark Athena WorkGroup.',
            document: new PolicyDocument({
              assignSids: false,
              minimize: true,
              statements: [
                new PolicyStatement({
                  actions: [
                    'athena:CreatePresignedNotebookUrl',
                    'athena:ExportNotebook',
                    'athena:GetCalculationExecution',
                    'athena:GetCalculationExecutionCode',
                    'athena:GetCalculationExecutionStatus',
                    'athena:GetSession',
                    'athena:GetSessionStatus',
                    'athena:GetWorkGroup',
                    'athena:ListCalculationExecutions',
                    'athena:ListExecutors',
                    'athena:ListSessions',
                    'athena:StartCalculationExecution',
                    'athena:StopCalculationExecution',
                    'athena:TerminateSession',
                    'athena:UpdateNotebook',
                  ],
                  effect: Effect.ALLOW,
                  resources: [
                    Stack.of(scope).formatArn({
                      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
                      resource: 'workgroup',
                      resourceName: props.workGroupName,
                      service: 'athena',
                    }),
                  ],
                }),
                new PolicyStatement({
                  actions: [
                    'cloudwatch:PutMetricData',
                  ],
                  conditions: {
                    StringEquals: {
                      'cloudwatch:namespace': 'AmazonAthenaForApacheSpark',
                    },
                  },
                  effect: Effect.ALLOW,
                  resources: [
                    '*',
                  ],
                }),
                ...(!options.encryptionKey ? [] : [new PolicyStatement({
                  actions: [
                    'kms:Decrypt',
                    'kms:GenerateDataKey',
                  ],
                  effect: Effect.ALLOW,
                  resources: [
                    options.encryptionKey.keyArn,
                  ],
                })]),
                new PolicyStatement({
                  actions: [
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:DescribeLogStreams',
                    'logs:PutLogEvents',
                  ],
                  effect: Effect.ALLOW,
                  resources: [
                    Stack.of(scope).formatArn({
                      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
                      resource: 'log-group',
                      resourceName: '/aws-athena:*',
                      service: 'logs',
                    }),
                    Stack.of(scope).formatArn({
                      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
                      resource: 'log-group',
                      resourceName: '/aws-athena*:log-stream:*',
                      service: 'logs',
                    }),
                  ],
                }),
                new PolicyStatement({
                  actions: [
                    'logs:DescribeLogGroups',
                  ],
                  effect: Effect.ALLOW,
                  resources: [
                    Stack.of(scope).formatArn({
                      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
                      resource: 'log-group',
                      resourceName: '*',
                      service: 'logs',
                    }),
                  ],
                }),
                new PolicyStatement({
                  actions: [
                    's3:PutObject',
                    's3:ListBucket',
                    's3:DeleteObject',
                    's3:GetObject',
                  ],
                  effect: Effect.ALLOW,
                  resources: [
                    output.bucket.bucketArn,
                    output.bucket.arnForObjects('*'),
                  ],
                }),
              ],
            }),
            roles: [
              role,
            ],
          });
        }

        return {
          encryptionKey: options.encryptionKey,
          engineVersion: options.engineVersion ?? ApacheSparkEngineVersion.AUTO,
          expectedBucketOwner: output.expectedBucketOwner,
          outputLocation: output.outputLocation,
          publishMetrics: options.publishMetrics,
          resultsBucket: output.bucket,
          resultsBucketEncryptionKey: output.encryptionKey,
          resultsBucketEncryptionType: output.encryptionType,
          role: role,
        };
      },
    };
  }

  public static athenaSql(options: AthenaSqlEngineOptions = {}): IAnalyticsEngine {
    return {
      bind: (scope: IConstruct) => {
        const output = configureBucket(scope, options.output);

        return {
          enforceConfiguration: options.enforceConfiguration ?? true,
          engineVersion: options.engineVersion ?? AthenaSqlEngineVersion.AUTO,
          expectedBucketOwner: output.expectedBucketOwner,
          outputLocation: output.outputLocation,
          publishMetrics: options.publishMetrics ?? true,
          queryScannedBytesLimit: options.queryScannedBytesLimit ?? DataSize.tebibytes(1000),
          requesterPays: options.requesterPays,
          resultsBucket: output.bucket,
          resultsBucketEncryptionKey: output.encryptionKey,
          resultsBucketEncryptionType: output.encryptionType,
        };
      },
    };
  }
}