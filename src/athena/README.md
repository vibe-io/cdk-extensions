# Vibe-io CDK-Extensions Athena Construct Library

The @cdk-extensions/athena package contains advanced constructs and patterns for
setting up named queries. The constructs presented here are intended
to be replacements for equivalent AWS constructs in the CDK Athena module, but with
additional features included.

[AWS CDK Athena API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_athena-readme.html)

To import and use this module within your CDK project:

```ts
import * as ec2 from 'cdk-extensions/athena';
```

## Objective

The Athena module is a component of the logging strategy provided by this project. Athena uses the AWS Glue Data Catalog to store and retrieve table metadata for the Amazon S3 data in your Amazon Web Services account. The table metadata lets the Athena query engine know how to find, read, and process the data that you want to query. 

The logging strategy defined in this project accounts for ALB, CloudFront, CloudTrail, Flow Logs, and S3 access logs. For each service a Glue crawler preforms an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog.

The Athena module creates `CfnNamedQuery` resources when the `createQueries` property is set to `true` in the `glue-tables` module. Several default named queires are defined that aid in improving the secuirty posture of your AWS Account. These default named queries have been defined for each AWS service:

### ALB
Gets the 100 most actvie IP addresses by request count.

Gets the 100 most recent ELB 5XX responses.

### CloudFront
Gets statistics for CloudFront distributions for the last day.

Gets the 100 most recent requests that resulted in an error from CloudFront.

Gets the 100 most active IP addresses by request count.

Gets the 100 most requested CloudFront objects.

### CloudTrail
Gets the 100 most recent unauthorized AWS API calls.

Gets the 100 most recent AWS user logins.

### Flow Logs
Gets the 100 most recent rejected packets that stayed within the private network ranges.

### S3 Access Logs
Gets the 100 most recent failed S3 access requests.