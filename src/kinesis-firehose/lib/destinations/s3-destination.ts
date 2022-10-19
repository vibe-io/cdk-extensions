import { ArnFormat, Stack, Token } from 'aws-cdk-lib';
import { AccountPrincipal, Effect, IRole, PolicyStatement, PrincipalWithConditions, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../../../utils/formatting';
import { BackupConfigurationResult, IDeliveryStreamBackupDestination } from '../backup-configuration';
import { BufferingConfiguration } from '../buffering-configuration';
import { CloudWatchLoggingConfiguration } from '../cloudwatch-logging-configuration';
import { DeliveryStreamDestination, DeliveryStreamDestinationConfiguration } from './delivery-stream-destination';


export enum S3CompressionFormat {
  GZIP = 'GZIP',
  HADOOP_SNAPPY = 'HADOOP_SNAPPY',
  SNAPPY = 'Snappy',
  UNCOMPRESSED = 'UNCOMPRESSED',
  ZIP = 'ZIP'
}

export interface S3DestinationOptions {
  readonly buffering?: BufferingConfiguration;
  readonly cloudwatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  readonly compressionFormat?: S3CompressionFormat;
  readonly encryptionEnabled?: boolean;
  readonly encryptionKey?: IKey;
  readonly errorOutputPrefix?: string;
  readonly keyPrefix?: string;
  readonly role?: IRole;
}

export class S3Destination extends DeliveryStreamDestination implements IDeliveryStreamBackupDestination {
  // Internal properties
  private _role?: IRole;

  // Input properties
  public readonly bucket: IBucket;
  public readonly buffering?: BufferingConfiguration;
  public readonly cloudwatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  public readonly compressionFormat?: S3CompressionFormat;
  public readonly encryptionEnabled?: boolean;
  public readonly encryptionKey?: IKey;
  public readonly errorOutputPrefix?: string;
  public readonly keyPrefix?: string;

  // Private accessors
  public get role(): IRole | undefined {
    return this._role;
  }


  public constructor(bucket: IBucket, options: S3DestinationOptions = {}) {
    super();

    this.bucket = bucket;
    this.buffering = options.buffering;
    this.cloudwatchLoggingConfiguration = options.cloudwatchLoggingConfiguration;
    this.compressionFormat = options.compressionFormat;
    this.encryptionEnabled = options.encryptionEnabled ?? !!options.encryptionKey;
    this.encryptionKey = options.encryptionKey;
    this.errorOutputPrefix = options.errorOutputPrefix;
    this.keyPrefix = options.keyPrefix;
    this._role = options.role;
  }

  public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration {
    return {
      s3DestinationConfiguration: this.buildConfiguration(scope),
    };
  }

  protected buildConfiguration(scope: IConstruct): CfnDeliveryStream.S3DestinationConfigurationProperty {
    const stack = Stack.of(scope);
    const isCrossAccount = this.bucket.stack.account !== stack.account;

    this._role = this._role ?? scope.node.tryFindChild('s3-delivery-role') as IRole ?? new Role(scope, 's3-delivery-role', {
      assumedBy: new PrincipalWithConditions(
        new ServicePrincipal('firehose.amazonaws.com'),
        {
          StringEquals: {
            'sts:ExternalId': Stack.of(scope).account,
          },
        },
      ),
    });

    this._role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        's3:GetBucketLocation',
        's3:ListBucket',
        's3:ListBucketMultipartUploads',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.bucket.bucketArn,
      ],
    }));

    this._role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        's3:AbortMultipartUpload',
        's3:GetObject',
        's3:PutObject',
        ...(isCrossAccount ? ['s3:PutObjectAcl'] : []),
      ],
      effect: Effect.ALLOW,
      resources: [
        this.bucket.arnForObjects('*'),
      ],
    }));

    if (this.encryptionKey && this.encryptionEnabled) {
      this._role.addToPrincipalPolicy(new PolicyStatement({
        actions: [
          'kms:Decrypt',
          'kms:GenerateDataKey',
        ],
        conditions: {
          StringEquals: {
            'kms:ViaService': `s3.${Stack.of(scope).region}.amazonaws.com`,
          },
          StringLike: {
            'kms:EncryptionContext:aws:s3:arn': [
              this.bucket.arnForObjects(`${this.keyPrefix ?? ''}*`),
              ...(this.errorOutputPrefix ? this.bucket.arnForObjects(`${this.errorOutputPrefix ?? ''}*`) : []),
            ],
          },
        },
        effect: Effect.ALLOW,
        resources: [
          this.encryptionKey.keyArn,
        ],
      }));
    }

    // Configure cross account bucket access
    if (!Token.isUnresolved(stack.account) && isCrossAccount) {
      this.bucket.addToResourcePolicy(new PolicyStatement({
        actions: [
          's3:GetBucketLocation',
          's3:ListBucket',
          's3:ListBucketMultipartUploads',
        ],
        effect: Effect.ALLOW,
        principals: [
          new AccountPrincipal(stack.account),
        ],
        resources: [
          stack.resolve(this.bucket.bucketArn),
        ],
      }));

      this.bucket.addToResourcePolicy(new PolicyStatement({
        actions: [
          's3:AbortMultipartUpload',
          's3:GetObject',
          's3:PutObject',
          's3:PutObjectAcl',
        ],
        effect: Effect.ALLOW,
        principals: [
          new AccountPrincipal(stack.account),
        ],
        resources: [
          this.bucket.arnForObjects('*'),
        ],
      }));
    }

    if (this.cloudwatchLoggingConfiguration?.enabled) {
      const logGroupScope = this.cloudwatchLoggingConfiguration.logGroup?.logGroupName ?? '*';
      const logStreamScope = this.cloudwatchLoggingConfiguration.logStream?.logStreamName ?? '*';

      this._role.addToPrincipalPolicy(new PolicyStatement({
        actions: [
          'logs:PutLogEvents',
        ],
        effect: Effect.ALLOW,
        resources: [
          Stack.of(this.cloudwatchLoggingConfiguration.logGroup ?? scope).formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'log-group',
            resourceName: `${logGroupScope}:log-stream:${logStreamScope}`,
            service: 'logs',
          }),
        ],
      }));
    }

    return {
      bucketArn: this.bucket.bucketArn,
      bufferingHints: this.buffering?.bind(scope),
      cloudWatchLoggingOptions: this.cloudwatchLoggingConfiguration?.bind(scope),
      compressionFormat: this.compressionFormat,
      encryptionConfiguration: definedFieldsOrUndefined({
        kmsEncryptionConfig: this.encryptionKey === undefined ? undefined : definedFieldsOrUndefined({
          awskmsKeyArn: this.encryptionKey.keyArn,
        }),
        noEncryptionConfig: (!this.encryptionEnabled && this.encryptionKey) ? 'NoEncryption' : undefined,
      }),
      errorOutputPrefix: this.errorOutputPrefix,
      prefix: this.keyPrefix,
      roleArn: this._role.roleArn,
    };
  }

  public renderBackupConfiguration(scope: IConstruct, enabled?: boolean): BackupConfigurationResult {
    const mode = enabled ? 'Enabled' : 'Disabled';

    return {
      s3BackupConfiguration: this.buildConfiguration(scope),
      s3BackupMode: enabled === undefined ? undefined : mode,
    };
  }
}