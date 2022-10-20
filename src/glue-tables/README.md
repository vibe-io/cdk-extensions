# Vibe-io CDK-Extensions Glue Tables Construct Library
The cdk-extensions/glue-tables package contains advanced constructs and patterns
for setting up Glue databases, tables, and Athena Named Queries. The constructs
presented here are intended to be replacements for equivalent AWS constructs in
the CDK module, but with additional features included.All defaults follow best
practices, and utilize most secure settings.

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
**stacks/AwsLoggingStack**, but can be deployed individually. They define Glue
databases, tables, and named Athena queries for ingesting and analyzing each services
log data from an S3 Bucket.
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
By default, for each service in the **AwsLoggingStack** a Glue crawler performs
an ETL process to analyze and categorize the stored data and store the associated
metadata in the AWS Glue Data Catalog.

Several default named queries are defined that aid in improving the security posture
of your AWS Account. These default named queries have been defined for each AWS
service.

Set `createQueries` to `false` to skip query creation.

*Examples*

**TypeScript**
```typescript

```
**Python**
```Python

```

## Glue Tables
### Common Defaults

### AlbLogsTable

#### Glue

#### Athena Queries

### CloudFrontLogsTable

#### Glue

#### Athena Queries

### FlowLogsTable

#### Glue

#### Athena Queries


### S3AccessLogsTable

#### Glue

#### Athena Queries

### SesLogsTable

#### Glue

#### Athena Queries

### WafLogsTable

#### Glue

#### Athena Queries
