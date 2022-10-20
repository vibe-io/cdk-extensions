# Vibe-io CDK-Extensions S3 Buckets Construct Library
The cdk-extensions/s3_buckets package contains advanced constructs and patterns
for setting up S3 Buckets. The constructs presented here are intended to be replacements
for equivalent AWS constructs in the CDK module, but with additional features included.
All defaults follow best practices, and utilize secure settings.


[AWS CDK S3 API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3-readme.html)

To import and use this module within your CDK project:

#### Typescript
```typescript
import * as s3_buckets from 'cdk-extensions/s3-buckets';
```
#### Python
```python
import cdk_extensions.s3_buckets as s3_buckets
```

## Common defaults
All S3 buckets extend the private RawBucket resource, which implements the
[`iBucket`](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-s3.IBucket.html) interface to expose all
resource configurations and creates a [`CfnBucket`](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-s3.CfnBucket.html) resource.

All buckets have a default Removal Policy applied, retaining them if the stack
is deleted.
- **ApplyRemovalPolicy**: Defaults to `RETAIN`.

# AWS Logging Buckets
These buckets are utilized as part of the logging strategy defined by
**stacks/AwsLoggingStack**, but can be deployed individually. When applicable, storing
these logs in S3 offers significant cost savings over CloudWatch. Additionally,
Glue and Athena can be utilized for fast and efficient analysis of data stored in S3.
- [Common Settings](#CommonSettings)
- [Buckets](#Buckets)
  - [AlbLogsBucket](#AlbLogsBucket)
  - [CloudFrontLogsBucket](#CloudFrontLogsBucket)
  - [CloudTrailLogsBucket](#CloudTrailLogsBucket)
  - [FlowLogsBucket](#FlowLogsBucket)
  - [S3AccessLogsBucket](#S3AccessLogsBucket)
  - [SesLogsBucket](#SesLogsBucket)
  - [WafLogsBucket](#WafLogsBucket)

## Common Settings
By default, for each service in the **AwsLoggingStack** a Glue crawler performs
an ETL process to analyze and categorize the stored data and store the associated
metadata in the AWS Glue Data Catalog.

Several default named Athena queries are defined that aid in improving the security posture
of your AWS Account. These default named queries have been defined for each AWS
service.

Set `createQueries` to `false` to skip query creation.

*Examples*

**TypeScript**
```typescript
const alb_bucket_with_queries = new s3_buckets.AlbLogsBucket(this, "AlbLogsBucket")
const cloudtrail_bucket_without_queries = new s3_buckets.CloudtrailBucket(this, 'CloudtrailBucket', {
  createQueries: false
})
```
**Python**
```Python
alb_bucket_with_queries = s3_buckets.AlbLogsBucket(self, 'AlbLogsBucket')

cloudtrail_bucket_without_queries = s3_buckets.CloudTrailLogsBucket(self, 'CloudTrailLogsBucket', create_queries=False)
```
## Buckets
All log buckets are [`CfnBucket`](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-s3.CfnBucket.html) constructs
with the additional secure defaults:
- All `PublicAccessBlockConfiguration` properties default to `true`. (i.e.
  `blockPublicAcls`, `blockPublicPolicy`, `ignorePublicAcls`,
  `restrictPublicBuckets`)
- Versioning is set to `Enabled`
- Server side bucket encryption using AES256

### AlbLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing Elastic Load Balancer
access logs. By default, creates named Athena Queries useful in querying ELB access
log data.
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
construct **AlbLogTables**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **alb-top-ips**: Gets the 100 most actvie IP addresses by request count.
- **alb-5xx-errors**: Gets the 100 most recent ELB 5XX responses

### CloudFrontLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing CloudFront access logs.
By default generates a Glue Database and Table, and creates named Athena
Queries useful in querying CloudFront log data.

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
construct **CloudFrontLogTable**, from the **glue-tables** module. Glue crawler
performs an ETL process to analyze and categorize data in Amazon S3 and store the
associated metadata in the AWS Glue Data Catalog.

#### Athena Queries
Four Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **cloudfront-distribution-statistics**: Gets statistics for CloudFront distributions
  for the last day.
- **cloudfront-request-errors**: Gets the 100 most recent requests that resulted
  in an error from CloudFront.
- **cloudfront-top-ips**: Gets the 100 most active IP addresses by request count.
- **cloudfront-top-objects**: Gets the 100 most requested CloudFront objects.

### CloudTrailLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing CloudTrail logs.
By default generates a Glue Database and Table, and creates named Athena
Queries useful in querying CloudTrail log data.

#### Usage
**TypeScript**
```typescript
import { CloudTrailLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new CloudTrailLogsBucket(this, 'CloudTrailLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  CloudTrailLogsBucket
)
```
```python
cloudtrail_logs_bucket = CloudTrailLogsBucket(self, 'CloudTrailLogsBucket')
```

#### Glue
By default creates database and tables from CloudTrail logs bucket, using cdk-extensions
construct **CloudTrailTable**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **cloudtrail-unauthorized-errors**: Gets the 100 most recent unauthorized AWS
  API calls.
- **cloudtrail-user-logins**: Gets the 100 most recent AWS user logins.

### FlowLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing VPC FlowLogs.
By default generates a Glue Database and Table, and creates named Athena
Queries useful in querying FlowLog data.

#### Usage
**TypeScript**
```typescript
import { FlowLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new FlowLogsBucket(this, 'FlowLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  FlowLogsBucket
)
```
```python
flowlogs_bucket = FlowLogsBucket(self, 'FlowLogsBucket')
```

#### Glue
By default creates database and tables from FlowLogs bucket, using cdk-extensions
construct **FlowLogsTable**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
One AthenaNamedQuery is created by default:
- **flow-logs-internal-rejected**: Gets the 100 most recent rejected packets that
  stayed within the private network ranges.

### S3AccessLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing VPC S3AccessLogs.
By default generates a Glue Database and Table, and creates named Athena
Queries useful in querying S3 access log data.

#### Usage
**TypeScript**
```typescript
import { S3AccessLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new S3AccessLogsBucket(this, 'S3AccessLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  S3AccessLogsLogsBucket
)
```
```python
s3_access_logs_bucket = S3AccessLogsBucket(self, 'S3AccessLogsBucket')
```

#### Glue
By default creates database and tables from S3 Access logs bucket, using cdk-extensions
construct **S3AccessLogsTable**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
One AthenaNamedQuery is created by default:
- **s3-request-errors**: Gets the 100 most recent failed S3 access requests.

### SesLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing SES Logs.
By default, generates a Glue Database and Table and creates named Athena
Queries useful in querying SES log data.

#### Usage
**TypeScript**
```typescript
import { SesLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new SesLogsBucket(this, 'SesLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  SesLogsLogsBucket
)
```
```python
ses_logs_bucket = SesLogsBucket(self, 'SesLogsBucket')
```

#### Glue
By default creates database and tables from SES logs bucket, using cdk-extensions
construct **SesLogsTable**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **ses-bounces**: Gets the 100 most recent bounces from the last day.
- **ses-complaints**: Gets the 100 most recent complaints from the last day.

### WafLogsBucket
Creates an S3 Bucket and Glue jobs for storing and analyzing Web Applications
Firewall Logs. By default, generates a Glue Database and Table and creates named
Athena Queries useful in querying WAF log data.

#### Usage
**TypeScript**
```typescript
import { WafLogsBucket } from 'cdk-extensions/s3-buckets';
```
```typescript
new WafLogsBucket(this, 'WafLogsBucket')
```
**Python**
```python
from cdk_extensions.s3_buckets import (
  WafLogsLogsBucket
)
```
```python
waf_logs_bucket = WafLogsBucket(self, 'WafLogsBucket')
```

#### Glue
By default creates database and tables from WAF logs bucket, using cdk-extensions
construct **WafLogsTable**, from the **glue-tables** module. Glue crawler performs
an ETL process to analyze and categorize data in Amazon S3 and store the associated
metadata in the AWS Glue Data Catalog.

#### Athena Queries
No default Named Athena Queries have been implemented for WAF logs at this time.
