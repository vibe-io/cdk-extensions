# Vibe-io CDK-Extensions Athena Construct Library

The @cdk-extensions/athena package contains advanced constructs and patterns for
setting up named queries. The constructs presented here are intended
to be replacements for equivalent AWS constructs in the CDK Athena module, but with
additional features included.

[AWS CDK Athena API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_athena-readme.html)

To import and use this module within your CDK project:

```ts
import * as athena from 'cdk-extensions/athena';
```

## Objective

The Athena module is a component of the logging strategy provided by this project defined by **stacks/AwsLoggingStack**. Athena uses the AWS Glue Data Catalog to store and retrieve table metadata for the Amazon S3 data in your Amazon Web Services account. The table metadata lets the Athena query engine know how to find, read, and process the data that you want to query. 

The logging strategy defined in this project accounts for all AWS services that log to S3 including ALB, CloudFront, CloudTrail, Flow Logs, S3 access logs, SES, and WAF. For each service a Glue crawler preforms an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in AWS Glue Data Catalog.

## Usage

The Athena module creates `CfnNamedQuery` resources when the `createQueries` property is set to `true` in the `glue-tables` module. Several default named queires are defined that aid in improving the security posture of your AWS Account. This package introduces several named queries for the following AWS services:

Examples for each of the services below can be found in **src/glue-tables** 

Example of an Athena query to retrive the 100 most active IP addresses by request count:
``` ts
if (this.createQueries) {
    this.topIpsNamedQuery = new NamedQuery(this, 'top-ips-named-query', {
    database: this.database,
    description: 'Gets the 100 most actvie IP addresses by request count.',
    name: this.friendlyQueryNames ? 'alb-top-ips' : undefined,
    queryString: [
        'SELECT client_ip,',
        '    COUNT(*) AS requests,',
        '    COUNT_IF(elb_status_code BETWEEN 400 AND 499) AS errors_4xx,',
        '    COUNT_IF(elb_status_code BETWEEN 500 AND 599) AS errors_5xx,',
        '    SUM(sent_bytes) AS sent,',
        '    SUM(received_bytes) AS received,',
        '    SUM(sent_bytes + received_bytes) AS total,',
        '    ARBITRARY(user_agent) as user_agent',
        `FROM ${this.tableName}`,
        "WHERE day >= DATE_FORMAT(NOW() - PARSE_DURATION('1d'), '%Y/%m/%d')",
        "    AND FROM_ISO8601_TIMESTAMP(time) >= NOW() - PARSE_DURATION('1d')",
        'GROUP BY client_ip',
        'ORDER by total DESC LIMIT 100;',
    ].join('\n'),
    });
```
### ALB
See **src/glue-tables/alb-logs-table.ts**
Gets the 100 most actvie IP addresses by request count.
Gets the 100 most recent ELB 5XX responses.

### CloudFront
See **src/glue-tables/cloudfront-logs-table.ts**
Gets statistics for CloudFront distributions for the last day.
Gets the 100 most recent requests that resulted in an error from CloudFront.
Gets the 100 most active IP addresses by request count.
Gets the 100 most requested CloudFront objects.

### CloudTrail
See **src/glue-tables/cloudtrail-logs-table.ts**
Gets the 100 most recent unauthorized AWS API calls.
Gets the 100 most recent AWS user logins.

### Flow Logs
See **src/glue-tables/flow-logs-table.ts**
Gets the 100 most recent rejected packets that stayed within the private network ranges.

### S3 Access Logs
See **src/glue-tables/s3-access-logs-table.ts**
Gets the 100 most recent failed S3 access requests.

### SES Logs
See **src/glue-tables/ses-logs-table.ts**
Gets the 100 most recent bounces from the last day.
Gets the 100 most recent complaints from the last day.

### WAF Logs
See **src/glue-tables/waf-logs-table.ts**