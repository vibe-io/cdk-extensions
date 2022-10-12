import { RemovalPolicy, Resource } from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { AddToResourcePolicyResult, Grant, IGrantable, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { Bucket, BucketPolicy, CfnBucket, CfnBucketProps, EventType, IBucket, IBucketNotificationDestination, NotificationKeyFilter, OnCloudTrailBucketEventOptions, TransferAccelerationUrlOptions, VirtualHostedStyleUrlOptions } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { contextAwareString } from '../../../../utils/lazy';


/**
 * Configuration for objects bucket
 */
export interface RawBucketProps extends CfnBucketProps {}

export class RawBucket extends Resource implements IBucket {
  // Internal properties
  private readonly _cdkBucket: IBucket;

  // Resource properties
  public policy?: BucketPolicy;
  public readonly resource: CfnBucket;

  // IBucket properties
  public readonly bucketArn: string;
  public readonly bucketName: string;
  public readonly bucketWebsiteUrl: string;
  public readonly bucketWebsiteDomainName: string;
  public readonly bucketDomainName: string;
  public readonly bucketDualStackDomainName: string;
  public readonly bucketRegionalDomainName: string;
  public readonly encryptionKey?: IKey | undefined;
  public readonly isWebsite?: boolean | undefined;

  // IBucket methods
  public addEventNotification: { (event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void };
  public addObjectCreatedNotification: { (dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void };
  public addObjectRemovedNotification: { (dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void };
  public arnForObjects: { (keyPattern: string): string };
  public enableEventBridgeNotification: { (): void };
  public grantDelete: { (identity: IGrantable, objectsKeyPattern?: any): Grant };
  public grantPublicAccess: { (keyPrefix?: string, ...allowedActions: string[]): Grant };
  public grantPut: { (identity: IGrantable, objectsKeyPattern?: any): Grant };
  public grantPutAcl: { (identity: IGrantable, objectsKeyPattern?: string): Grant };
  public grantRead: { (identity: IGrantable, objectsKeyPattern?: any): Grant };
  public grantReadWrite: { (identity: IGrantable, objectsKeyPattern?: any): Grant };
  public grantWrite: { (identity: IGrantable, objectsKeyPattern?: any): Grant };
  public onCloudTrailEvent: { (id: string, options?: OnCloudTrailBucketEventOptions): Rule };
  public onCloudTrailPutObject: { (id: string, options?: OnCloudTrailBucketEventOptions): Rule };
  public onCloudTrailWriteObject: { (id: string, options?: OnCloudTrailBucketEventOptions): Rule };
  public s3UrlForObject: { (key?: string): string };
  public transferAccelerationUrlForObject: { (key?: string, options?: TransferAccelerationUrlOptions): string };
  public urlForObject: { (key?: string): string };
  public virtualHostedUrlForObject: { (key?: string, options?: VirtualHostedStyleUrlOptions): string };


  /**
     * Creates a new instance of the ReplicatedBucket class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: RawBucketProps = {}) {
    super(scope, id, {
      physicalName: props.bucketName,
    });

    this.resource = new CfnBucket(this, 'Resource', {
      ...props,
      bucketName: this.physicalName,
    });
    this.resource.applyRemovalPolicy(RemovalPolicy.RETAIN);

    this.bucketArn = this.getResourceArnAttribute(this.resource.attrArn, {
      account: '',
      region: '',
      resource: this.physicalName,
      service: 's3',
    });
    this.bucketName = this.getResourceNameAttribute(this.resource.ref);
    this.bucketRegionalDomainName = contextAwareString(
      this,
      this.resource.attrRegionalDomainName,
      `${this.bucketName}.s3.${this.stack.region}.amazonaws.com`, // TODO - find a better way to resolve the TLD
    );


    this._cdkBucket = Bucket.fromBucketAttributes(this, 'cdk-bucket', {
      account: this.stack.account,
      bucketArn: this.bucketArn,
      bucketDomainName: this.resource.attrDomainName,
      bucketDualStackDomainName: this.resource.attrDualStackDomainName,
      bucketName: this.bucketName,
      bucketRegionalDomainName: this.resource.attrRegionalDomainName,
      bucketWebsiteUrl: this.resource.attrWebsiteUrl,
      region: this.stack.region,
    });

    this.bucketWebsiteUrl = this._cdkBucket.bucketWebsiteUrl;
    this.bucketWebsiteDomainName = this._cdkBucket.bucketWebsiteDomainName;
    this.bucketDomainName = this._cdkBucket.bucketDomainName;
    this.bucketDualStackDomainName = this._cdkBucket.bucketDualStackDomainName;
    this.isWebsite = this._cdkBucket.isWebsite;
    this.encryptionKey = this._cdkBucket.encryptionKey;

    this.addEventNotification = this._cdkBucket.addEventNotification;
    this.addObjectCreatedNotification = this._cdkBucket.addObjectCreatedNotification;
    this.addObjectRemovedNotification = this._cdkBucket.addObjectRemovedNotification;
    this.arnForObjects = this._cdkBucket.arnForObjects;
    this.enableEventBridgeNotification = this._cdkBucket.enableEventBridgeNotification;
    this.grantDelete = this._cdkBucket.grantDelete;
    this.grantPublicAccess = this._cdkBucket.grantPublicAccess;
    this.grantPut = this._cdkBucket.grantPut;
    this.grantPutAcl = this._cdkBucket.grantPutAcl;
    this.grantRead = this._cdkBucket.grantRead;
    this.grantReadWrite = this._cdkBucket.grantReadWrite;
    this.grantWrite = this._cdkBucket.grantWrite;
    this.onCloudTrailEvent = this._cdkBucket.onCloudTrailEvent;
    this.onCloudTrailPutObject = this._cdkBucket.onCloudTrailPutObject;
    this.onCloudTrailWriteObject = this._cdkBucket.onCloudTrailWriteObject;
    this.s3UrlForObject = this._cdkBucket.s3UrlForObject;
    this.transferAccelerationUrlForObject = this._cdkBucket.transferAccelerationUrlForObject;
    this.urlForObject = this._cdkBucket.urlForObject;
    this.virtualHostedUrlForObject = this._cdkBucket.virtualHostedUrlForObject;
  }

  public addToResourcePolicy(permission: PolicyStatement): AddToResourcePolicyResult {
    const policy = this.policy ?? new BucketPolicy(this, 'policy', {
      bucket: this,
    });
    this.policy = policy;

    policy.document.addStatements(permission);
    return {
      statementAdded: true,
      policyDependable: this.policy,
    };
  }
}