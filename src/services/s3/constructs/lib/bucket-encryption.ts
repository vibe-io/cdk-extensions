import { Annotations, RemovalPolicy } from "aws-cdk-lib";
import { AccountRootPrincipal } from "aws-cdk-lib/aws-iam";
import { IKey, Key, KeySpec, KeyUsage } from "aws-cdk-lib/aws-kms";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";


enum BucketEncryptionAlgorithm {
    KMS = 'aws:kms',
    AES256 = 'AES256'
}

interface BucketEncryptionOptions {
    readonly algorithm?: BucketEncryptionAlgorithm;
    readonly bucketKeyEnabled?: boolean;
    readonly encryptionKey?: IKey;
    readonly generateKey?: boolean;
}

export interface KmsEncryptionOptions {
    readonly bucketKeyEnabled?: boolean;
    readonly encryptionKey?: IKey;
}

export interface BucketEncryptionConfiguration {
    readonly encryptionKey?: IKey;
    readonly encryptionSettings?: CfnBucket.BucketEncryptionProperty;
}

export class BucketEncryption {
    public static readonly KMS: BucketEncryption = new BucketEncryption({
        algorithm: BucketEncryptionAlgorithm.KMS,
        bucketKeyEnabled: true,
        generateKey: true
    });

    public static readonly KMS_MANAGED: BucketEncryption = new BucketEncryption({
        algorithm: BucketEncryptionAlgorithm.KMS
    });

    public static readonly S3_MANAGED: BucketEncryption = new BucketEncryption({
        algorithm: BucketEncryptionAlgorithm.AES256
    });

    public static readonly UNENCRYPTED: BucketEncryption = new BucketEncryption();


    public static kms(options: KmsEncryptionOptions): BucketEncryption {
        return new BucketEncryption({
            algorithm: BucketEncryptionAlgorithm.KMS,
            encryptionKey: options.encryptionKey,
            bucketKeyEnabled: options.bucketKeyEnabled,
            generateKey: !!options.encryptionKey
        })
    }


    public readonly algorithm?: BucketEncryptionAlgorithm;
    public readonly bucketKeyEnabled?: boolean;
    public readonly encryptionKey?: IKey;
    public readonly generateKey?: boolean;

    private constructor(options: BucketEncryptionOptions = {}) {
        this.algorithm = options.algorithm;
        this.bucketKeyEnabled = options.bucketKeyEnabled;
        this.generateKey = options.generateKey;
    }

    public bind(scope: IConstruct): BucketEncryptionConfiguration {
        if (!this.algorithm) {
            return {};
        }
        else if (this.algorithm === BucketEncryptionAlgorithm.AES256) {
            return {
                encryptionSettings: {
                    serverSideEncryptionConfiguration: [
                        {
                            serverSideEncryptionByDefault: {
                                sseAlgorithm: this.algorithm
                            }
                        }
                    ]
                }
            };
        }
        else {
            let key: IKey | undefined = this.encryptionKey;
            if (key && this.generateKey) {
                Annotations.of(scope).addError([
                    'Cannot generate an encryption key as another KMS key was',
                    'explicitly specified.'
                ].join(' '));
            }
            else if (this.generateKey) {
                key = new Key(scope, 'encryption-key', {
                    admins: [
                        new AccountRootPrincipal()
                    ],
                    description: `Handles bucket encryption for ${scope.node.path}.`,
                    enabled: true,
                    keySpec: KeySpec.SYMMETRIC_DEFAULT,
                    keyUsage: KeyUsage.ENCRYPT_DECRYPT,
                    removalPolicy: RemovalPolicy.RETAIN
                });
            }

            return {
                encryptionKey: key,
                encryptionSettings: !key ? undefined : {
                    serverSideEncryptionConfiguration: [
                        {
                            bucketKeyEnabled: this.bucketKeyEnabled,
                            serverSideEncryptionByDefault: {
                                sseAlgorithm: this.algorithm,
                                kmsMasterKeyId: key.keyArn
                            }
                        }
                    ]
                }
            }
        }
    }
}