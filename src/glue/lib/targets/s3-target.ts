import { Lazy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Connection } from '../../connection';
import { Crawler, CrawlerTargetCollection, ICrawlerTarget } from '../../crawler';


/**
 * Configuration for Crawler S3 target
 */
export interface S3TargetOptions {
  /**
   * A {@link aws-glue.Connection | "Connection" } object to connect to the target with
   */
  readonly connection?: Connection;
  /**
   * A list of glob patterns used to exclude from the crawl.
   *
   * @see [AWS::Glue::Crawler S3Target](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-exclusions)
   * @see [For More Information](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html)
   */
  readonly exclusions?: string[];
  /**
   * A Prefix Key for identification and organization of objects in the bucket
   */
  readonly keyPrefix?: string;
  /**
   * Sets the number of files in each leaf folder to be crawled when crawling sample files in a dataset. If not set, all the files are crawled. A valid value is an integer between 1 and 249.
   *
   * @see [AWS::Glue::Crawler S3Target](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-samplesize)
   */
  readonly sampleSize?: string;
}

export class S3Target implements ICrawlerTarget {
  // Internal properties
  private readonly _exclusions: string[] = [];

  // Input properties
  /**
   * Bucket to use as the Target
   */
  public readonly bucket: IBucket;
  /**
	 * {@link S3TargetOptions.connection}
	 */
  public readonly connection?: Connection;
  /**
	 * {@link S3TargetOptions.exclusions}
	 */
  public readonly exclusions?: string[];
  /**
	 * {@link S3TargetOptions.keyPrefix}
	 */
  public readonly keyPrefix?: string;
  /**
	 * {@link S3TargetOptions.sampleSize}
	 */
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