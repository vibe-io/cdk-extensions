import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnSecurityConfiguration } from 'aws-cdk-lib/aws-glue';
import { IKey, Key } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../utils/formatting';


/**
 * Encryption mode for S3.
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_S3Encryption.html#Glue-Type-S3Encryption-S3EncryptionMode
 */
export enum S3EncryptionMode {
  /**
     * Server-side encryption (SSE) with an AWS KMS key managed by the account owner.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html
     */
  KMS = 'SSE-KMS',

  /**
     * Server side encryption (SSE) with an Amazon S3-managed key.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html
     */
  S3_MANAGED = 'SSE-S3'
}

/**
 * Encryption mode for CloudWatch Logs.
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_CloudWatchEncryption.html#Glue-Type-CloudWatchEncryption-CloudWatchEncryptionMode
 */
export enum CloudWatchEncryptionMode {
  /**
     * Server-side encryption (SSE) with an AWS KMS key managed by the account owner.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html
     */
  KMS = 'SSE-KMS'
}

/**
 * Encryption mode for Job Bookmarks.
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_JobBookmarksEncryption.html#Glue-Type-JobBookmarksEncryption-JobBookmarksEncryptionMode
 */
export enum JobBookmarksEncryptionMode {
  /**
     * Client-side encryption (CSE) with an AWS KMS key managed by the account owner.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html
     */
  CLIENT_SIDE_KMS = 'CSE-KMS'
}

/**
 * CloudWatch Logs encryption configuration.
 */
export interface CloudWatchEncryption {
  /**
     * The KMS key to be used to encrypt the data.
     * @default A key will be created if one is not provided.
     */
  readonly kmsKey?: IKey;

  /**
     * Encryption mode
     */
  readonly mode: CloudWatchEncryptionMode;
}

/**
 * Job bookmarks encryption configuration.
 */
export interface JobBookmarksEncryption {
  /**
     * The KMS key to be used to encrypt the data.
     * @default A key will be created if one is not provided.
     */
  readonly kmsKey?: IKey;

  /**
     * Encryption mode.
     */
  readonly mode: JobBookmarksEncryptionMode;
}

/**
 * S3 encryption configuration.
 */
export interface S3Encryption {
  /**
     * The KMS key to be used to encrypt the data.
     * @default no kms key if mode = S3_MANAGED. A key will be created if one is not provided and mode = KMS.
     */
  readonly kmsKey?: IKey;

  /**
     * Encryption mode.
     */
  readonly mode: S3EncryptionMode;
}

/**
 * Configuration for the Glue SecurityConfiguration resource.
 */
export interface SecurityConfigurationProps extends ResourceProps {
  /**
   * Cloudwatch Encryption Settings
   * 
   * @see [AWS::Glue::SecurityConfiguration EncryptionConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-cloudwatchencryption)
   */
  readonly cloudWatchEncryption?: CloudWatchEncryption;
  /**
   * The encryption configuration for job bookmarks.
   * 
   * @see [AWS::Glue::SecurityConfiguration EncryptionConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-jobbookmarksencryption)
   */
  readonly jobBookmarksEncryption?: JobBookmarksEncryption;
  /**
   * Name for the Security Configuration.
   */
  readonly name?: string;
  /**
   * The encyption configuration for Amazon Simple Storage Service (Amazon S3) data.
   * 
   * @see [AWS::Glue::SecurityConfiguration EncryptionConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-s3encryptions)
   */
  readonly s3Encryption?: S3Encryption;
}

export class SecurityConfiguration extends Resource {
  // Input properties
  /**
    * {@link SecurityConfigurationProps.cloudWatchEncryption}
    */
	public readonly cloudWatchEncryption?: CloudWatchEncryption;
  /**
    * {@link SecurityConfigurationProps.jobBookmarksEncryption}
    */
	public readonly jobBookmarksEncryption?: JobBookmarksEncryption;
  /**
    * {@link SecurityConfigurationProps.name}
    */
	public readonly name?: string;
  /**
    * {@link SecurityConfigurationProps.s3Encryption}
    */
	public readonly s3Encryption?: S3Encryption;

  // Resource properties
  public readonly key: Key;
  public readonly resource: CfnSecurityConfiguration;

  // Standard properties
  public readonly securityConfigurationName: string;


  constructor(scope: Construct, id: string, props: SecurityConfigurationProps) {
    super(scope, id, props);

    this.name = props.name ?? Names.uniqueId(this);

    let cloudWatchKey = undefined;
    let jobBookmarksKey = undefined;
    let s3Key = undefined;

    const fetchKey = (key?: IKey): IKey => {
      return key ?? this.node.tryFindChild('key') as Key ?? new Key(this, 'key');
    };

    if (this.cloudWatchEncryption?.mode === CloudWatchEncryptionMode.KMS) {
      cloudWatchKey = fetchKey(this.cloudWatchEncryption.kmsKey);
    } else if (this.jobBookmarksEncryption?.mode === JobBookmarksEncryptionMode.CLIENT_SIDE_KMS && !!!this.jobBookmarksEncryption.kmsKey) {
      jobBookmarksKey = fetchKey(this.jobBookmarksEncryption.kmsKey);
    } else if (this.s3Encryption?.mode === S3EncryptionMode.KMS && !!!this.s3Encryption.kmsKey) {
      s3Key = fetchKey(this.s3Encryption.kmsKey);
    }

    this.key = this.node.tryFindChild('key') as Key;

    this.resource = new CfnSecurityConfiguration(this, 'Resource', {
      encryptionConfiguration: {
        cloudWatchEncryption: undefinedIfNoKeys({
          cloudWatchEncryptionMode: this.cloudWatchEncryption?.mode,
          kmsKeyArn: cloudWatchKey?.keyArn,
        }),
        jobBookmarksEncryption: undefinedIfNoKeys({
          jobBookmarksEncryptionMode: this.jobBookmarksEncryption?.mode,
          kmsKeyArn: jobBookmarksKey?.keyArn,
        }),
        s3Encryptions: !!!this.s3Encryption ? undefined : [{
          s3EncryptionMode: this.s3Encryption?.mode,
          kmsKeyArn: s3Key?.keyArn,
        }],
      },
      name: this.name,
    });

    this.securityConfigurationName = this.resource.ref;
  }
}
