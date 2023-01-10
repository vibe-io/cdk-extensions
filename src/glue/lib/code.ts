import { createHash } from 'crypto';
import { lstatSync } from 'fs';
import { AssetOptions, Stack } from 'aws-cdk-lib';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { IBucket, Location } from 'aws-cdk-lib/aws-s3';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';

/**
 * Represents a Glue Job's Code assets (an asset can be a scripts, a jar, a python file or any other file).
 */
export abstract class Code {
  /**
   * Job code as an S3 object.
   *
   * @param bucket The S3 bucket.
   * @param key The object key.
   */
  public static fromBucket(bucket: IBucket, key: string): S3Code {
    return new S3Code(bucket, key);
  }

  /**
   * Job code from a local disk path.
   *
   * @param path Code file (not a directory).
   */
  public static fromAsset(path: string, options?: AssetOptions): AssetCode {
    return new AssetCode(path, options);
  }

  /**
   * Called when the Job is initialized to allow this object to bind.
   */
  public abstract bind(scope: Construct, grantable: IGrantable): CodeConfig;
}

/**
 * Glue job Code from an S3 bucket.
 */
export class S3Code extends Code {
  constructor(private readonly bucket: IBucket, private readonly key: string) {
    super();
  }

  public bind(_scope: Construct, grantable: IGrantable): CodeConfig {
    this.bucket.grantRead(grantable, this.key);
    return {
      s3Location: {
        bucketName: this.bucket.bucketName,
        objectKey: this.key,
      },
    };
  }
}

/**
 * Job Code from a local file.
 */
export class AssetCode extends Code {
  private asset?: Asset;

  /**
   * @param path The path to the Code file.
   */
  constructor(private readonly path: string, private readonly options: AssetOptions = {}) {
    super();

    if (lstatSync(this.path).isDirectory()) {
      throw new Error(`Code path ${this.path} is a directory. Only files are supported`);
    }
  }

  public bind(scope: Construct, grantable: IGrantable): CodeConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new Asset(scope, `Code${this.hashcode(this.path)}`, {
        path: this.path,
        ...this.options,
      });
    } else if (Stack.of(this.asset) !== Stack.of(scope)) {
      throw new Error([
        `Asset is already associated with another stack '${Stack.of(this.asset).stackName}'.` +
                'Create a new Code instance for every stack.',
      ].join(' '));
    }

    this.asset.grantRead(grantable);

    return {
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }

  /**
   * Hash a string
   */
  private hashcode(s: string): string {
    const hash = createHash('md5');
    hash.update(s);
    return hash.digest('hex');
  };
}

/**
 * Result of binding `Code` into a `Job`.
 */
export interface CodeConfig {
  /**
   * The location of the code in S3.
   */
  readonly s3Location: Location;
}
