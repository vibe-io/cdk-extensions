# Vibe-io CDK-Extensions Stacks Library
These are full-stack solutions, offering rapid deployment of commonly used enterprise
scale patterns with little to no configuration needed.

All Stacks utilize patterns and constructs from the **cdk-extensions** library.

- [About](#AboutTheCDK-ExtensionsLibraries)
- [Stacks](#Stacks)
  - [AwsLoggingStack](#AwsLoggingStack)

# Stacks

## AwsLoggingStack
- [Summary](#Summary)
- [Usage](#Usage)
- [The Athena Queries](#The-Athena-Queries)
  - [Application Load Balancer](#Application-Load-Balancer)
  - [CloudFront](#CloudFront-Distribution)
  - [CloudTrail](#CloudTrail)
  - [VPC FlowLogs](#VPC-Flowlogs)
  - [S3 Access Logs](#S3-Access-Logs)
  - [SES](#SES)
  - [WAF](#WAF)
- [More Info About The Resources](#More-Info-About-The-Resources)

### Summary
Having a good logging strategy for your AWS Services is a recommended best
practice in every case. It increases operational visibility and strengthens an
enterprise's security posture in a measurable manner.

**It is *recommended*, but it is not always easy to set up, and it is rarely done
for you.**

A good logging strategy for AWS services should utilize the most cost effective,
secure, and reliable solutions available, and include data analysis that can yield
actionable intelligence.

- This will mean storing logs in S3, typically with secure encryption and versioning
  enabled, as well as Cfn Retention set.
- Creating a secure Glue Database for storage and analysis of log data
- Writing custom Glue jobs that can extract and transform logs from S3, and store
  them in the Glue database
- Writing Athena queries tuned for that particular service's log data, that can
  produce good information, and saving them as named queries

The **AwsLoggingStack** sets that up for seven of the AWS services where it
is most frequently needed, handling everything from bucket to query for:
- Application Load Balancer
- CloudFront
- CloudTrail
- VPC FlowLogs
- S3(Access Logs)
- SES
- WAF


### Usage
All S3 buckets, Glue resources, and Athena queries are created using **cdk_extensions**
modules. As such, this stack can be initialized with no parameters to rapidly
deploy an industry standard logging strategy into an AWS account, including recommended
named Athena Queries for each service.

To import and use this module within your CDK project:

**TypeScript**
```TypeScript
import { AwsLoggingStack } from 'cdk-extensions/stacks';
```
```TypeScript
new AwsLoggingStack(this, 'AwsLoggingStack')
```
**Python**
```Python
from cdk_extensions.stacks import (
  AwsLoggingStack
)
```
```Python
aws_logging_stack = AwsLoggingStack(self, 'AwsLoggingStack')
```

### The Athena Queries
Once beyond the nuts and bolts of setting up logging buckets and glue jobs to get
important data into a secure format that can be queried, your data provides its best
value through well written Athena queries that draw out important metrics and actionable
intelligence. The **AwsLoggingStack** creates a few immediately useful [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.aws_athena/CfnNamedQuery.html) for
each service to get you started.

#### Application Load Balancer
Two Athena queries provide valuable insight into traffic to your ALB:
- **alb-top-ips**: Gets the 100 most active IP addresses by request count.
- **alb-5xx-errors**: Gets the 100 most recent ELB 5XX responses

#### CloudFront Distribution
Four Athena queries provide valuable insight into traffic across your CDNs.
- **cloudfront-distribution-statistics**: Gets statistics for CloudFront distributions
  for the last day.
- **cloudfront-request-errors**: Gets the 100 most recent requests that resulted
  in an error from CloudFront.
- **cloudfront-top-ips**: Gets the 100 most active IP addresses by request count.
- **cloudfront-top-objects**: Gets the 100 most requested CloudFront objects.

#### CloudTrail
Two Athena queries provide valuable insight into user activity on your AWS account.
- **cloudtrail-unauthorized-errors**: Gets the 100 most recent unauthorized AWS
  API calls.
- **cloudtrail-user-logins**: Gets the 100 most recent AWS user logins.

#### VPC FlowLogs
An Athena query is created to expose info about rejected internal traffic
- **flow-logs-internal-rejected**: Gets the 100 most recent rejected packets that
  stayed within the private network ranges.

#### S3 Access Logs
An Athena query is created that exposes failed attempts to access your S3 buckets
- **s3-request-errors**: Gets the 100 most recent failed S3 access requests.

#### SES
Protect your domain, and your enterprise's, sending reputation by tracking **bounces**
and **complaints**
- **ses-bounces**: Gets the 100 most recent bounces from the last day.
- **ses-complaints**: Gets the 100 most recent complaints from the last day.

#### WAF
Strategy is implemented for storage of WAF logs in S3 with ETL jobs loading to the
Glue table, but no default Athena queries have been added yet.

### More Info About The Resources
This solution utilizes the **AwsLoggingStack** patterns from the **cdk-extensions/glue-tables** and **cdk-extensions/s3-buckets** libraries, which in turn utilize constructs from
**cdk-extensions** **Glue** and **Athena** libraries. Detailed info about each is
covered their respective documentation.
