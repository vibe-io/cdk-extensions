import { RemovalPolicy, Resource } from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { AddToResourcePolicyResult, Grant, IGrantable, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { Bucket, BucketPolicy, CfnBucket, CfnBucketProps, EventType, IBucket, IBucketNotificationDestination, NotificationKeyFilter, OnCloudTrailBucketEventOptions, TransferAccelerationUrlOptions, VirtualHostedStyleUrlOptions } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { contextAwareString } from '../../utils/lazy';


/**
 * Configuration for objects bucket
 */
export interface RawBucketProps extends CfnBucketProps {}

/**
 * Do not use directly. Will be removed once a better replacemnt is written.
 */
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

  public urlForObject(_key?: string): string {
    throw new Error('Method not implemented.');
  }

  public transferAccelerationUrlForObject(_key?: string, _options?: TransferAccelerationUrlOptions): string {
    throw new Error('Method not implemented.');
  }

  public virtualHostedUrlForObject(_key?: string, _options?: VirtualHostedStyleUrlOptions): string {
    throw new Error('Method not implemented.');
  }

  public s3UrlForObject(_key?: string): string {
    throw new Error('Method not implemented.');
  }

  public arnForObjects(_keyPattern: string): string {
    throw new Error('Method not implemented.');
  }

  public grantRead(_identity: IGrantable, _objectsKeyPattern?: any): Grant {
    throw new Error('Method not implemented.');
  }

  public grantWrite(_identity: IGrantable, _objectsKeyPattern?: any): Grant {
    throw new Error('Method not implemented.');
  }

  public grantPut(_identity: IGrantable, _objectsKeyPattern?: any): Grant {
    throw new Error('Method not implemented.');
  }

  public grantPutAcl(_identity: IGrantable, _objectsKeyPattern?: string): Grant {
    throw new Error('Method not implemented.');
  }

  public grantDelete(_identity: IGrantable, _objectsKeyPattern?: any): Grant {
    throw new Error('Method not implemented.');
  }

  public grantReadWrite(_identity: IGrantable, _objectsKeyPattern?: any): Grant {
    throw new Error('Method not implemented.');
  }

  public grantPublicAccess(_keyPrefix?: string, ..._allowedActions: string[]): Grant {
    throw new Error('Method not implemented.');
  }

  public onCloudTrailEvent(_id: string, _options?: OnCloudTrailBucketEventOptions): Rule {
    throw new Error('Method not implemented.');
  }

  public onCloudTrailPutObject(_id: string, _options?: OnCloudTrailBucketEventOptions): Rule {
    throw new Error('Method not implemented.');
  }

  public onCloudTrailWriteObject(_id: string, _options?: OnCloudTrailBucketEventOptions): Rule {
    throw new Error('Method not implemented.');
  }

  public addEventNotification(_event: EventType, _dest: IBucketNotificationDestination, ..._filters: NotificationKeyFilter[]): void {
    throw new Error('Method not implemented.');
  }

  public addObjectCreatedNotification(_dest: IBucketNotificationDestination, ..._filters: NotificationKeyFilter[]): void {
    throw new Error('Method not implemented.');
  }

  public addObjectRemovedNotification(_dest: IBucketNotificationDestination, ..._filters: NotificationKeyFilter[]): void {
    throw new Error('Method not implemented.');
  }

  public enableEventBridgeNotification(): void {
    throw new Error('Method not implemented.');
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