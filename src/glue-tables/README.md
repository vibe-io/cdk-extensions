# Vibe-io CDK-Extensions Glue Tables Construct Library
The **cdk-extensions/glue-tables** package contains advanced constructs and patterns
for setting up commonly needed Glue tables and Athena Named Queries. The constructs
presented here are intended to be replacements for equivalent AWS constructs in
the CDK module, but with additional features included.

[AWS CDK Glue API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-glue-alpha-readme.html)

The patterns here extend and depend on the Glue constructs in the **cdk-extensions/glue** module(`crawler`, `table`, et al) to
ensure all defaults follow best practices, and utilize most secure settings.

To import and use this module within your CDK project:

#### Typescript
```typescript
import * as glue_tables from 'cdk-extensions/glue-tables';
```
#### Python
```python
import cdk_extensions.glue_tables as glue_tables
```

# AWS Logging Tables
These constructs are utilized as part of the logging strategy defined by
**stacks/AwsLoggingStack**, but can be deployed individually. They define Glue tables
and named Athena queries for ingesting and analyzing each services log data from
an S3 Bucket.
- [Usage](#Usage)
  - [Required Parameters](#RequiredParameters)
- [GlueTables](#GlueTables)
  - [AlbLogsTable](#AlbLogsTable)
  - [CloudFrontLogsTable](#CloudFrontLogsTable)
  - [CloudTrailTable](#CloudTrailTable)
  - [FlowLogsTable](#FlowLogsTable)
  - [S3AccessLogsTable](#S3AccessLogsTable)
  - [SesLogsTable](#SesLogsTable)
  - [WafLogsTable](#WafLogsTable)

### Usage
These tables all expect input from S3_buckets. By default, for each service in
the **AwsLoggingStack**, a Glue crawler performs an ETL process to analyze and categorize
the stored data and store the associated metadata in the AWS Glue Data Catalog.
All fields are represented, with handling for nested data as structs.

For each service, projections are configured where necessary and tables constructed
to patterns expected for that service, including any necessary SerDe Info.

Several default named **Athena** queries are defined using the **cdk_extensions/athena**
module that aid in improving the security posture of your AWS Account. These named
queries have been defined for each AWS service.

#### Required Parameters
These constructs are intended to be used internally by the **AwsLoggingStack**. If
using them directly, requires:
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

### About ETL
ETL stands for **E**xtract, **T**ransform, **L**oad. Data is *extracted* from the
service logs by the Glue crawler, and *transformed* to a proper schema and format
for *loading* into a Glue table.

## AlbLogsTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { AlbLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new AlbLogsTable(this, 'AlbLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  AlbLogsTable
)
```
```Python
alb_logging_stack = AlbLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected ALB log fields.

The following partition keys are set:
- `source`
- `logname`
- `regionname`
- `day`

Projection is enabled and configured for the expected `yyyy/MM/dd` log format.

### Athena Queries
Creates Athena Queries using the **cdk-extensions/athena** module.
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **alb-top-ips**: Gets the 100 most active IP addresses by request count.
- **alb-5xx-errors**: Gets the 100 most recent ELB 5XX responses

## CloudFrontLogsTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { CloudFrontLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new CloudFrontLogsTable(this, 'CloudFrontLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  CloudFrontLogsTable
)
```
```Python
cloudfront_logging_stack = CloudFrontLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```
### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected CloudFront log fields.

### Athena Queries
Creates Athena Queries using the **cdk-extensions/athena** constructs.
Four Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **cloudfront-distribution-statistics**: Gets statistics for CloudFront distributions
  for the last day.
- **cloudfront-request-errors**: Gets the 100 most recent requests that resulted
  in an error from CloudFront.
- **cloudfront-top-ips**: Gets the 100 most active IP addresses by request count.
- **cloudfront-top-objects**: Gets the 100 most requested CloudFront objects.

## CloudTrailTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { CloudTrailTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new CloudTrailTable(this, 'CloudTrailTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  CloudTrailTable
)
```
```Python
cloudtrail_table_stack = CloudTrailTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected CloudTrail event logs data.

The following partition keys are set:
- `source`
- `logname`
- `regionname`
- `day`

Projection is enabled and configured for the expected `yyyy/MM/dd` log format.

### Athena Queries
Creates Athena Queries using the **cdk-extensions/athena** constructs.
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **cloudtrail-unauthorized-errors**: Gets the 100 most recent unauthorized AWS
  API calls.
- **cloudtrail-user-logins**: Gets the 100 most recent AWS user logins.

## FlowLogsTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { FlowLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new FlowLogsTable(this, 'FlowLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  FlowLogsTable
)
```
```Python
flowlogs_stack = FlowLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected VPC FlowLog data.

The following partition keys are set:
- `source`
- `logname`
- `regionname`
- `day`

Projection is enabled and configured for the expected `yyyy/MM/dd` log format.

### Athena Queries
One AthenaNamedQuery is created by default:
- **flow-logs-internal-rejected**: Gets the 100 most recent rejected packets that
  stayed within the private network ranges.

## S3AccessLogsTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { S3AccessLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new S3AccessLogsTable(this, 'S3AccessLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  S3AccessLogsTable
)
```
```Python
s3_access_logging_stack = S3AccessLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected S3 Access log data.

### Athena Queries
Creates an Athena Query using the **cdk-extensions/athena** constructs.
One AthenaNamedQuery is created by default:
- **s3-request-errors**: Gets the 100 most recent failed S3 access requests.

## SesLogsTable
### Usage
#### Required Parameters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

**TypeScript**
```Typescript
import { SesLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new SesLogsTable(this, 'SesLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  SesLogsTable
)
```
```Python
ses_logging_stack = SesLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for the expected SES event logs.

Projection is enabled and configured for the expected `yyyy/MM/dd` log format.

The following partition keys are set:
- `day`

### Athena Queries
Creates Athena Queries using the **cdk-extensions/athena** constructs.
Two Athena [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) are created by default:
- **ses-bounces**: Gets the 100 most recent bounces from the last day.
- **ses-complaints**: Gets the 100 most recent complaints from the last day.

## WafLogsTable
### Usage
#### Required Paramaters
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html)
representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.
**TypeScript**
```Typescript
import { WafLogsTable } from 'cdk-extensions/glue-tables'
```
```Typescript
new WafLogsTable(this, 'WafLogsTable', {
  'bucket': bucket,
  'database': database
})
```
**Python**
```Python
from cdk_extensions.glue_tables import (
  WafLogsTable
)
```
```Python
waf_logging_stack = WafLogsTable(self, 'AwsLoggingStack',
                                 bucket=bucket,
                                 database=database
                                 )
```

### Glue
Creates a Glue table using constructs from the **cdk_extensions/glue** module.
Table schema is configured for expected WAF log data.

The following partition keys are set:
- `account`
- `region`

Projection is enabled.

### Athena Queries
No default Athena Queries have been implemented at this time.

### Examples

Creates an ALB Logging stack, with an S3 logging bucket, **cdk_extensions/glue** `Database`, and `AlbLogsTable` with its default Athena Queries.

**TypeScript**
```typescript
import { App, Stack, StackProps, RemovalPolicy, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from 'cdk-extensions/glue/database';
import { AlbLogsTable } from 'cdk-extensions/glue-tables';

export class AlbLogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // If we were to use the cdk-extensions AlbLogsBucket pattern,
    // Glue tables would be created for us. Instead, we use the
    // standard library, remembering to set some secure best practices
    // like encryption and removal policy
    const bucket = new s3.Bucket(this, 'MyEncryptedBucket', {
      encryption: s3.BucketEncryption.KMS,
      removalPolicy: RemovalPolicy.RETAIN
    });

    // Create a cdk-extensions/glue Database with secure defaults
    const database = new Database(this, 'GlueDatabase');

    // Create the AlbLogsTable Glue table with defaults
    const alb_logs_table = new AlbLogsTable(this, 'AlbLogsTable', {
      'bucket': bucket,
      'database': database
    })
  }
}
```
**Python**
```Python
from constructs import Construct
from aws_cdk import (
    RemovalPolicy,
    Stack,
    aws_s3 as s3
)
from cdk_extensions.glue import (
  Database
)
from cdk_extensions.glue_tables import (
  AlbLogsTable
)


class AlbLogStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        # If we were to use the cdk-extensions AlbLogsBucket pattern,
        # Glue tables would be created for us. Instead, we use the
        # standard library, remembering to set some secure best practices
        # like encryption and removal policy
        bucket = s3.Bucket(self, 'MyEncryptedBucket',
                           encryption=s3.BucketEncryption.KMS,
                           removalPolicy=RemovalPolicy.RETAIN
                           )
        # Create a cdk-extensions/glue Database with secure defaults
        database = Database(self, 'MyGlueDatabase')

        # Create the AlbLogsTable Glue table with defaults
        alb_logging_stack = AlbLogsTable(self, 'AwsLoggingStack',
                                         bucket=bucket,
                                         database=database
                                         )
```
