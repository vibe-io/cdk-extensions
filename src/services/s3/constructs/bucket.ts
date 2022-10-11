/*import { Duration, Lazy, Resource, ResourceProps } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { IKey } from "aws-cdk-lib/aws-kms";
import { BlockPublicAccess, BucketAccessControl, CfnBucket, CorsRule, IBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";
import { definedFieldsOrUndefined } from "../../utils/formatting";
import { BucketEncryption } from "./lib/bucket-encryption";
import { CorsRuleConfiguration } from "./lib/cors-rule";


export enum Acceleration {
    DISABLED = 'Disabled',
    ENABLED = 'Enabled',
    SUSPENDED = 'Suspended'
}

export interface AccessLogging {
    readonly bucket: IBucket;
    readonly prefix?: string;
}

export enum ObjectLockMode {
    COMPLIANCE = 'COMPLIANCE',
    GOVERNANCE = 'GOVERNANCE'
}

export interface ObjectLock {
    readonly retention: Duration;
    readonly mode: ObjectLockMode
}

export enum ObjectOwnership {
    BUCKET_OWNER_ENFORCED = 'BucketOwnerEnforced',
    BUCKET_OWNER_PREFERRED = 'BucketOwnerPreferred',
    OBJECT_WRITER = 'ObjectWriter'
}

export interface BucketProps extends ResourceProps {
    readonly acceleration?: Acceleration;
    readonly accessControl?: BucketAccessControl;
    readonly accessLogging?: AccessLogging;
    readonly blockPublicAccess?: BlockPublicAccess;
    readonly cors?: CorsRuleConfiguration[];
    readonly encryption?: BucketEncryption;
    readonly name?: string;
    readonly objectLock?: ObjectLock;
    readonly objectOwnership?: ObjectOwnership;
    readonly versioned?: boolean;
}

export class Bucket extends Resource implements IBucket {
    // Internal properties
    private readonly _cors: CorsRuleConfiguration[] = [];
    private  _replicationRole?: IRole;

    // Input properties
    public readonly acceleration?: Acceleration;
    public readonly accessControl?: BucketAccessControl;
    public readonly accessLogging?: AccessLogging;
    public readonly blockPublicAccess?: BlockPublicAccess;
    public readonly cors?: CorsRuleConfiguration[];
    public readonly encryption?: BucketEncryption;
    public readonly name?: string;
    public readonly objectLock?: ObjectLock;
    public readonly objectOwnership?: ObjectOwnership;
    public readonly versioned?: boolean;

    // Resource properties
    public readonly encryptionKey?: IKey;
    public readonly resource: CfnBucket;

    // Resource accessors
    public get replicationRole(): IRole {
        return this._replicationRole;
    }


    public constructor(scope: IConstruct, id: string, props: BucketProps = {}) {
        super(scope, id, props);

        this.acceleration = props.acceleration;
        this.accessControl = props.accessControl;
        this.accessLogging = props.accessLogging;
        this.blockPublicAccess = props.blockPublicAccess;
        this.encryption = props.encryption;
        this.name = props.name;
        this.objectLock = props.objectLock;
        this.objectOwnership = props.objectOwnership;
        this.versioned = props.versioned;

        const encryptionConfiguration = this.encryption?.bind(this);
        this.encryptionKey = encryptionConfiguration?.encryptionKey;

        this.resource = new CfnBucket(this, 'Resource', {
            accelerateConfiguration: (this.acceleration ?? Acceleration.DISABLED) === Acceleration.DISABLED ? undefined : {
                accelerationStatus: this.acceleration
            },
            accessControl: ,
            analyticsConfigurations: ,
            bucketEncryption: encryptionConfiguration?.encryptionSettings,
            bucketName: this.name,
            corsConfiguration: Lazy.any({
                produce: () => {
                    return this.renderCors();
                }
            }),
            intelligentTieringConfigurations: ,
            inventoryConfigurations: ,
            lifecycleConfiguration: ,
            loggingConfiguration: !this.accessLogging ? undefined : {
                destinationBucketName: this.accessLogging.bucket.bucketName,
                logFilePrefix: this.accessLogging.prefix
            },
            metricsConfigurations: ,
            notificationConfiguration: ,
            objectLockConfiguration: !this.objectLock ? undefined : {
                objectLockEnabled: 'Enabled',
                rule: {
                    defaultRetention: {
                        days: this.objectLock.retention.toDays(),
                        mode: this.objectLock.mode
                    }
                }
            },
            objectLockEnabled: !!this.objectLock,
            ownershipControls: !this.objectOwnership ? undefined : {
                rules: [
                    {
                        objectOwnership: this.objectOwnership
                    }
                ]
            },
            publicAccessBlockConfiguration: definedFieldsOrUndefined({
                blockPublicAcls: this.blockPublicAccess.blockPublicAcls,
                blockPublicPolicy: this.blockPublicAccess.blockPublicPolicy,
                ignorePublicAcls: this.blockPublicAccess.ignorePublicAcls,
                restrictPublicBuckets: this.blockPublicAccess.restrictPublicBuckets
            }),
            replicationConfiguration: ,
            versioningConfiguration: !this.versioned ? undefined : {
                status: 'Enabled'
            },
            websiteConfiguration:
        });
    }

    public addCorsRule(rule: CorsRuleConfiguration): Bucket {
        this._cors.push(rule);
        return this;
    }

    protected renderCors(): CfnBucket.CorsConfigurationProperty | undefined {
        if (this._cors.length === 0) {
            return undefined;
        }

        return {
            corsRules: this._cors.map((x) => {
                return {
                    allowedHeaders: x.allowedHeaders,
                    allowedMethods: x.allowedMethods,
                    allowedOrigins: x.allowedOrigins,
                    exposedHeaders: x.exposedHeaders,
                    id: x.id,
                    maxAge: x.maxAge.toSeconds()
                }
            })
        };
    }

    protected renderReplication(): CfnBucket.ReplicationConfigurationProperty | undefined {

    }
}*/