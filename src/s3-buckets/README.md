# S3 Buckets
A module of s3 buckets that follow commonly used patterns.
All defaults follow best practices, and utilize most secure settings.

#### Typescript
```typescript
import * as s3_buckets from 'cdk-extensions/s3-buckets';
```
#### Python
```python
import cdk_extensions.s3_buckets as s3_buckets
```

## Common defaults
All S3 buckets extend the private raw-bucket resource, which implements the the
iBucket interface, and creates a CfnBucket resource with some best practice defaults.
- **ApplyRemovalPolicy**: Defaults to `RETAIN`.

# Aws Logging Buckets
These buckets are utilized as part of the logging strategy defined by **stacks/AwsLoggingStack**, but can be deployed individually. For each service a Glue crawler preforms an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog.

Several default named queries are defined that aid in improving the security posture of your AWS Account. These default named queries have been defined for each AWS service.

Set `createQueries` to `false` to skip Querie creation.

*Examples*
```typescript
const alb_bucket_with_queries = new s3_buckets.AlbLogsBucket(this, "AlbLogsBucket")
    const clooudtrail_bucket_without_queires = new s3_buckets.CloudtrailBucket(this, 'CloudtrailBucket', {
      createQueries: false
    })
```
## Buckets
All log buckets are `CfnBucket` constructs with the additional secure defaults:
- All `PublicAccessBlockConfiguration` properties default to `true`. (i.e.
  `blockPublicAcls`, `blockPublicPolicy`, `ignorePublicAcls`,
  `restrictPublicBuckets`)
- Versioning is set to `Enabled`
- Server side bucket encryption using AES256

### alb-logs-bucket
Creates an S3 Bucket for storing Elastic Load Balancer access logs.
By default, creates named Athena Queries useful in querying ELB acces log data.
#### Usage
**TypeScript**
```typescript
import { AlbLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new AlbLogsBucket(this, 'AlbLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  AlbLogsBucket
)
```
```python
alb_logs_bucket = AlbLogsBucket(self, 'AlbLogsBucket')
```

#### Glue
By default creates database and tables from ALB logs bucket, using cdk-extensions
construct **AlbLogTables**, from the **glue-tables** module. Glue crawler performs an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog.

#### Athena Queries
Two AthenaNamedQueries are created by default:
- **alb-top-ips**: Gets the 100 most actvie IP addresses by request count.
- **alb-5xx-errors**: Gets the 100 most recent ELB 5XX responses

### cloudfront-logs-bucket
Creates an S3 Bucket suitable for storing Elastic Load Balancer access logs.
By default generates a Glue Database and Table, and generates named Athena
Queries useful in querying ELB acces log data.

#### Usage
**TypeScript**
```typescript
import { CloudFrontLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new CloudFrontLogsBucket(this, 'CloudFrontLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  CloudFrontLogsBucket
)
```
```python
cloudfront_logs_bucket = CloudFrontLogsBucket(self, 'CloudFrontLogsBucket')
```

#### Glue
By default creates database and tables from CloudFront logs bucket, using cdk-extensions
construct **CloudFrontLogTables**, from the **glue-tables** module. Glue crawler performs an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog.

#### Athena Queries
Four AthenaNamedQueries are created by default:
- **cloudfront-distribution-statistics**: Gets statistics for CloudFront distributions for the last day.
- **cloudfront-request-errors**: Gets the 100 most recent requests that resulted in an error from CloudFront.
- **cloudfront-top-ips**: Gets the 100 most active IP addresses by request count.
- **cloudfront-top-objects**: Gets the 100 most requested CloudFront objects.
