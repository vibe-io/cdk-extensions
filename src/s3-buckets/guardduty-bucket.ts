import { PhysicalName, ResourceProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IKey } from 'aws-cdk-lib/aws-kms';


/**
 * Configuration for GuarddutyBucket
 */
export interface GuarddutyBucketProps extends ResourceProps {
  readonly bucketName?: string;
  readonly encryptionKey?: IKey;
}

export class GuarddutyBucket extends Bucket {
  // Input properties
  public readonly encryptionKey?: IKey;

  // Resource properties


  /**
   * Creates a new instance of the GuarddutyBucket class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in the
   * construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: GuarddutyBucketProps = {}) {
    super(scope, id, {
      ...props,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      bucketName: props.bucketName ?? PhysicalName.GENERATE_IF_NEEDED,
      encryption: props.encryptionKey ? BucketEncryption.KMS : BucketEncryption.S3_MANAGED,
      versioned: true,
    });

    this.encryptionKey = props.encryptionKey;

    this.addToResourcePolicy(new PolicyStatement({
      actions: [
        's3:GetBucketAcl',
        's3:ListBucket',
        's3:GetBucketLocation',
      ],
      effect: Effect.ALLOW,
      principals: [
        new ServicePrincipal('guardduty.amazonaws.com'),
      ],
      resources: [
        this.bucketArn,
      ],
    }));

    this.addToResourcePolicy(new PolicyStatement({
      actions: [
        's3:PutObject',
      ],
      effect: Effect.ALLOW,
      principals: [
        new ServicePrincipal('guardduty.amazonaws.com'),
      ],
      resources: [
        this.arnForObjects('*'),
      ],
    }));

    this.addToResourcePolicy(new PolicyStatement({
      actions: [
        's3:PutObject',
      ],
      conditions: {
        'Bool': {
          'aws:SecureTransport': 'false',
        },
      },
      effect: Effect.DENY,
      principals: [
        new ServicePrincipal('guardduty.amazonaws.com'),
      ],
      resources: [
        this.arnForObjects('*'),
      ],
    }));

    if (this.encryptionKey) {
      this.addToResourcePolicy(new PolicyStatement({
        actions: [
          's3:PutObject',
        ],
        conditions: {
          'StringNotEquals': {
            's3:x-amz-server-side-encryption': 'aws:kms',
          },
        },
        effect: Effect.DENY,
        principals: [
          new ServicePrincipal('guardduty.amazonaws.com'),
        ],
        resources: [
          this.arnForObjects('*'),
        ],
      }));

      this.addToResourcePolicy(new PolicyStatement({
        actions: [
          's3:PutObject',
        ],
        conditions: {
          'StringNotEquals': {
            's3:x-amz-server-side-encryption-aws-kms-key-id': this.encryptionKey.keyArn,
          },
        },
        effect: Effect.DENY,
        principals: [
          new ServicePrincipal('guardduty.amazonaws.com'),
        ],
        resources: [
          this.arnForObjects('*'),
        ],
      }));
    }
  }
}
