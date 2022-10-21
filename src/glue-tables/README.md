# Vibe-io CDK-Extensions Glue Tables Construct Library
The **cdk-extensions/glue-tables** package contains advanced constructs and patterns
for setting up commonly needed Glue tables and Athena Named Queries. The constructs
presented here are intended to be replacements for equivalent AWS constructs in
the CDK module, but with additional features included.

The patterns here extend the Glue constructs in the **cdk-extensions/glue** module to
ensure all defaults follow best practices, and utilize most secure settings. and

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
- [Common Settings](#CommonSettings)
- [GlueTables](#GlueTables)
  - [AlbLogsTable](#AlbLogsTable)
  - [CloudFrontLogsTable](#CloudFrontLogsTable)
  - [CloudTrailLogsTable](#CloudTrailLogsTable)
  - [FlowLogsTable](#FlowLogsTable)
  - [S3AccessLogsTable](#S3AccessLogsTable)
  - [SesLogsTable](#SesLogsTable)
  - [WafLogsTable](#WafLogsTable)

## Common Settings
### Required Parameters
These constructs are intended to be used internally by the **AwsLoggingStack**. If
using them directly, requires:
- **bucket**: An [AWS S3 iBucket](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IBucket.html) representing the s3 bucket logs are stored in
- **database**: A **cdk-extensions/glue** `Database` to create the table in.

These tables all expect input from S3_buckets. By default, for each service in
the **AwsLoggingStack** a Glue crawler performs an ETL process to analyze and categorize
the stored data and store the associated metadata in the AWS Glue Data Catalog.

For each service, projections are configured where necessary and tables constructed to patterns
expected for that service.

Several default named queries are defined that aid in improving the security posture
of your AWS Account. These default named queries have been defined for each AWS
service.

*Examples*

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

```

## AlbLogsTable

### Glue

### Athena Queries

## CloudFrontLogsTable

### Glue

### Athena Queries

## FlowLogsTable

### Glue

### Athena Queries

## S3AccessLogsTable

### Glue

### Athena Queries

## SesLogsTable

### Glue

### Athena Queries

## WafLogsTable

### Glue

### Athena Queries
No default Athena Queries have been implemented at this time.
