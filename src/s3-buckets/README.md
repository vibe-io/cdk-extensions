# S3 Buckets
A module of s3 buckets that follow commonly used patterns.
All defaults follow best practices, and utilize most secure settings.

## Common defaults
All S3 buckets extend the private raw-bucket resource, which implements the the
iBucket interface, and creates a CfnBucket resource with some best practice defaults.
- **ApplyRemovalPolicy**: Defaults to `RETAIN`.

# alb-logs-bucket
Creates an S3 Bucket suitable for storing Elastic Load Balancer access logs.
By default generates a Glue Database and Table, and generates named Athena
Queries useful in querying ELB acces log data.
## Usage
```typescript
import { AlbLogsBucket } from 'cdk-extensions/lib/s3-buckets';
...
new AlbLogsBucket(this, 'AlbLogsBucket')
```
## S3 Bucket
Creates a CfnBucket resource with additional best practice defaults.
- All `PublicAccessBlockConfiguration` properties default to `true`. (i.e.
  `blockPublicAcls`, `blockPublicPolicy`, `ignorePublicAcls`,
  `restrictPublicBuckets`)
- Versioning is set to `Enabled`
- Server side bucket encryption using AES256

## Glue
By default creates database and tables from ALB logs bucket, using cdk-extensions
construct **AlbLogTables**, from the **glue-tables** module. Database is configured
with the schema definition and Partition keys for reading ELB access log data.

### Athena Queries
Two AthenaNamedQueries are created by default:
- **alb-top-ips**: Gets the 100 most actvie IP addresses by request count.
- **alb-5xx-errors**: Gets the 100 most recent ELB 5XX responses
