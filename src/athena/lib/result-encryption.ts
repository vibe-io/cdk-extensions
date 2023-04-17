import { IKey } from 'aws-cdk-lib/aws-kms';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';


function buildAes256Configuration(): AthenaResultEncryptionConfiguration {
  return {
    bucketEncryption: BucketEncryption.S3_MANAGED,
    encryptionLabel: 'SSE_S3',
  };
}

function buildKmsConfiguration(label: string, encryptionKey?: IKey): AthenaResultEncryptionConfiguration {
  return {
    bucketEncryption: encryptionKey ? BucketEncryption.KMS : BucketEncryption.KMS_MANAGED,
    encryptionKey: encryptionKey,
    encryptionLabel: label,
  };
}

export interface AthenaResultEncryptionConfiguration {
  readonly bucketEncryption: BucketEncryption;
  readonly encryptionKey?: IKey;
  readonly encryptionLabel: string;
}

export interface AthenaResultKmsEncryptionOptions {
  readonly encryptionKey?: IKey;
}

export interface IAthenaResultEncryption {
  bind(scope: IConstruct): AthenaResultEncryptionConfiguration;
}

export class ApacheSparkOutputEncryption {
  public static sseS3(): IAthenaResultEncryption {
    return {
      bind: () => {
        return buildAes256Configuration();
      },
    };
  }

  public static sseKms(options: AthenaResultKmsEncryptionOptions = {}): IAthenaResultEncryption {
    return {
      bind: () => {
        return buildKmsConfiguration('SSE_KMS', options.encryptionKey);
      },
    };
  }
}

export class AthenaSqlOutputEncryption {
  public static cseKms(options: AthenaResultKmsEncryptionOptions = {}): IAthenaResultEncryption {
    return {
      bind: () => {
        return buildKmsConfiguration('CSE_KMS', options.encryptionKey);
      },
    };
  }

  public static sseS3(): IAthenaResultEncryption {
    return {
      bind: () => {
        return buildAes256Configuration();
      },
    };
  }

  public static sseKms(options: AthenaResultKmsEncryptionOptions = {}): IAthenaResultEncryption {
    return {
      bind: () => {
        return buildKmsConfiguration('SSE_KMS', options.encryptionKey);
      },
    };
  }
}
