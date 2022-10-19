import { Lazy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Connection } from '../../connection';
import { Crawler, CrawlerTargetCollection, ICrawlerTarget } from '../../crawler';


/**
 * Configuration for Crawler S3 target
 */
export interface S3TargetOptions {
  readonly connection?: Connection;
  readonly exclusions?: string[];
  readonly keyPrefix?: string;
  readonly sampleSize?: string;
}

export class S3Target implements ICrawlerTarget {
  // Internal properties
  private readonly _exclusions: string[] = [];

  // Input properties
  public readonly bucket: IBucket;
  public readonly connection?: Connection;
  public readonly exclusions?: string[];
  public readonly keyPrefix?: string;
  public readonly sampleSize?: string;


  constructor(bucket: IBucket, options?: S3TargetOptions) {
    this.bucket = bucket;
    this.connection = options?.connection;
    this.keyPrefix = options?.keyPrefix;
    this.sampleSize = options?.sampleSize;

    options?.exclusions?.forEach((x) => {
      this.addExclusion(x);
    });
  }

  public addExclusion(exclusion: string): void {
    this._exclusions.push(exclusion);
  }

  public bind(crawler: Crawler): CrawlerTargetCollection {
    crawler.role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        's3:GetObject',
        's3:PutObject',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.bucket.arnForObjects(`${this.keyPrefix ?? ''}*`),
      ],
    }));

    return {
      s3Targets: [{
        connectionName: this.connection?.connectionName,
        exclusions: Lazy.uncachedList(
          {
            produce: () => {
              return this._exclusions;
            },
          },
          {
            omitEmpty: true,
          },
        ),
        path: `s3://${this.bucket.bucketName}/${this.keyPrefix ?? ''}`,
      }],
    };
  }
}