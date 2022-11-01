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
- [Examples](#Examples)

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

S3 Access logging is enabled for all the logging buckets, with logs delivered to the
`S3AccessLogsBucket`.

### Usage
All S3 buckets, Glue resources, and Athena queries are created using **cdk_extensions**
modules. As such, this stack can be initialized with no parameters to rapidly
deploy an industry standard logging strategy into an AWS account, including recommended
named Athena Queries for each service.

#### Install
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

#### Enable Logging
**AwsLoggingStack** manages buckets, glue tables, and permissions. All that is left is to
start delivering the logs.

Remember that logging configuration for most **aws-cdk-lib** constructs will require
an L2 construct(i.e. `iBucket`), but the resources created by the AwsLoggingStack
are L1 constructs(i.e. `CfnBucket`). In order to configure **cdk-extensions** logging
buckets, they must be first wrapped in an L2 construct.

```Typescript
logging_stack = new AwsLoggingStack(this, 'LoggingStack')

const l2_cloudtrail_bucket = s3.Bucket.fromCfnBucket(
  logging_stack.cloudtraillogsBucket.resource
);

const trail = new cloudtrail.Trail(this, 'myCloudTrail', {
  bucket: l2_cloudtrail_bucket
});
```

Follow the docs for each service or resource to enable logging to the respective
`AwsLoggingStack` S3 buckets:
- [Enable Logging on an ALB](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.ApplicationLoadBalancer.html#logwbraccesswbrlogsbucket-prefix)
- [Enable Logging on a CloudFront Distribution](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Distribution.html#logbucket)
- [Create A Trail on CloudTrail](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudtrail.Trail.html)
- [Publish VPC Flow Logs to S3](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.FlowLogDestination.html#static-towbrs3bucket-keyprefix-options)
- [Enable Server Access logging for S3 Access Logs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.CfnBucket.LoggingConfigurationProperty.html)
- [Stream SES Event logs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ses.CfnConfigurationSetEventDestination.EventDestinationProperty.html)
- As described in the documentation linked above, SES event logs first need to
publish to an intermediate service, such as [Kinesis Firehose](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-kinesisfirehose-readme.html#s3), and then be streamed to the S3 bucket(opinionated Firehose constructs are also
  available in [cdk-extensions/kinesis-firehose](../kinesis-firehose))
  - [Enable WAF logging to S3](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_wafv2.CfnLoggingConfiguration.html)

  ### The Athena Queries
  Once beyond the nuts and bolts of setting up logging buckets and glue jobs to get
  important data into a secure format that can be queried, your data provides its best
  value through well written Athena queries that draw out important metrics and actionable
  intelligence. The **AwsLoggingStack** creates a few immediately useful [`CfnNamedQueries`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_athena.CfnNamedQuery.html) for
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

  ### Examples
  #### TypeScript
  *bin/demo.ts*
  ```typescript
  #!/usr/bin/env node
  import * as cdk from 'aws-cdk-lib';
  import { DemoStack } from '../lib/demo-stack';
  import { AwsLoggingStack } from 'cdk-extensions/stacks';

  const app = new cdk.App();

  // For some cases, like ALB and Flow Logs, we can not have an environment agnostic
  // stack
  const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }

  const aws_logging_stack = new AwsLoggingStack(app, 'AwsLoggingStack', {
    env: env
  });

  new DemoStack(app, 'DemoStack', {
    env: env,
    aws_logging_stack: aws_logging_stack
  });
  ```
  */lib/demo-stack*
  ```TypeScript
  import {
    App,
    Stack,
    StackProps,
    aws_s3 as s3,
    aws_elasticloadbalancingv2 as elbv2,
    aws_ec2 as ec2,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_cloudtrail as cloudtrail,
    aws_iam as iam,
    aws_ses as ses,
    aws_wafv2 as wafv2
  } from 'aws-cdk-lib';
  import { Construct } from 'constructs';
  import { AwsLoggingStack } from 'cdk-extensions/stacks';
  import * as firehose from '@aws-cdk/aws-kinesisfirehose-alpha';
  import { S3Bucket } from '@aws-cdk/aws-kinesisfirehose-destinations-alpha';

  export interface DemoProps extends StackProps {
    readonly aws_logging_stack: AwsLoggingStack;
  }

  export class DemoStack extends Stack {
    // input properties
    public readonly aws_logging_stack: AwsLoggingStack;

    constructor(scope: Construct, id: string, props: DemoProps) {
      super(scope, id, props);

      /**************
      VPC FLOW LOGS
      ***************/
      // Wrap L1 logging bucket in L2 Construct
      const flow_logs_bucket = s3.Bucket.fromCfnBucket(
        props.aws_logging_stack.flowLogsBucket.resource
      );
      // Create a VPC
      const vpc = new ec2.Vpc(this, 'VPC');
      // Enable flow log output to the FlowLogs bucket for the new VPC
      new ec2.FlowLog(this, 'FlowLog', {
        resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
        destination: ec2.FlowLogDestination.toS3(
          flow_logs_bucket
        )
      });


      /***************
      S3 ACCESS LOGS
      ****************/
      const s3_access_logs_bucket = s3.Bucket.fromCfnBucket(
        props.aws_logging_stack.s3AccessLogsBucket.resource
      );
      // Create a simple S3 bucket, with access logging sent to
      // the s3AccessLogsBucket
      const s3Bucket = new s3.Bucket(this, 'WebsiteBucket', {
        serverAccessLogsBucket: s3_access_logs_bucket
      });


      /****************
      CLOUDFRONT LOGS
      *****************/
      // Wrap L1 logging bucket in L2 Construct
      const cloudfront_logs_bucket = s3.Bucket.fromCfnBucket(
        props.aws_logging_stack.cloudfrontLogsBucket.resource
      );
      // Create a CDN in front of the demo bucket, with logBucket configured
      // to the cloudfrontLogsBucket
      const cdn = new cloudfront.Distribution(this, 'Distro', {
        defaultBehavior: {
          origin: new origins.S3Origin(s3Bucket)
        },
        logBucket: cloudfront_logs_bucket
      });


      /****************
      ALB ACCESS LOGS
      *****************/
      //  Wrap L1 bucket in L2 construct
      // Create a simple Load Balancer
      const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
        vpc
      });

      // Send logs to the AlbLogsBucket
      lb.logAccessLogs(
        s3.Bucket.fromCfnBucket(props.aws_logging_stack.albLogsBucket.resource )
      );


      /***********
      CLOUDTRAIL
      ************/
      // //  Wrap L1 logging bucket in L2 Construct
      const cloudtrail_logs_bucket = s3.Bucket.fromCfnBucket(
        props.aws_logging_stack.cloudtrailLogsBucket.resource
      );
      // // Create a Cloudtrail trail that sends logs to the CloudtrailLogsBucket
      const trail = new cloudtrail.Trail(this, 'myCloudTrail', {
        bucket: cloudtrail_logs_bucket
      });


      /*********
      SES LOGS
      **********/
      // Wrap L1 logging bucket in L2 Construct
      const ses_logs_bucket =  s3.Bucket.fromCfnBucket(
        props.aws_logging_stack.sesLogsBucket.resource
      );

      // Creates IAM roles for firehose to assume
      const destinationRole = new iam.Role(this, 'Destination Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      const deliveryStreamRole = new iam.Role(this, 'Delivery Stream Role', {
        assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
      });
      
      // Specify the roles created above when defining the destination and delivery stream.
      // Connects Kinesis Firehose to the SES Logs Bucket
      const destination = new S3Bucket(ses_logs_bucket, {role: destinationRole});
      
      // Create the Kinesis DeliveryStream for the SES log destination
      const delivery_stream = new firehose.DeliveryStream(this, 'KinesisStream', {
        destinations: [destination],
        role: deliveryStreamRole
      });

      // Creates an SES ConfigurationSet with reputation metrics enabled
      const config_set = new ses.ConfigurationSet(this, 'ConfigurationSet', {
        reputationMetrics: true
      });

      // Set up permissions for SES to publish events to Kinesis Firehose
      // Creates service principal we can use to restrict the IAM role to the ConfigurationSet
      const service_principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal('ses.amazonaws.com'), {
        "StringEquals": {
          "AWS:SourceAccount": [process.env.CDK_DEFAULT_ACCOUNT],
          "AWS:SourceArn": [
              `arn:aws:ses:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:configuration-set/${config_set.configurationSetName}`
            ]
          }
        }
      );
      // Create the IAM Role
      const sesRole = new iam.Role(this, 'SES Role', {
        assumedBy: new iam.ServicePrincipal('ses.amazonaws.com'),
        // It's important to add the firehose permissions as inline
        // policies. If policies are added after role creation, CDK
        // will not know to wait, and may fail to create the ConfigurationSet
        // due to insufficient permissions
        inlinePolicies: {
          'root': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  'firehose:PutRecord',
                  'firehose:PutRecordBatch'
                ],
                resources: [
                  delivery_stream.deliveryStreamArn
                ]
              })
            ]
          })
        }
      });

      // Creates a Configuraton Set Event Destination that will send all SES events
      // to the Kinesis Firehose Stream.
      const cfnConfigurationSetEventDestination = new ses.CfnConfigurationSetEventDestination(this, 'MyCfnConfigurationSetEventDestination', {
        configurationSetName: config_set.configurationSetName,
        eventDestination: {
          matchingEventTypes: [
            'send',
            'reject',
            'bounce',
            'complaint',
            'delivery',
            'open',
            'click',
            'renderingFailure'
          ],
          enabled: true,
          kinesisFirehoseDestination: {
            deliveryStreamArn: delivery_stream.deliveryStreamArn,
            iamRoleArn: sesRole.roleArn
          }
        }
      });
      // TODO: Manually configure any verified SES sending domains, or emails, for which
      // event publishing is desired to use the above configuration set


      /*****
       WAF
      ******/
      // Create a simple WAF with default settings and no rules
      const cfnWebACL = new wafv2.CfnWebACL(this, 'MyCfnWebACL', {
        defaultAction: {
          allow: {}
        },
        scope: 'REGIONAL',
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName:'MetricForWebACLCDK',
          sampledRequestsEnabled: true,
        },
      });
      // Create a logging configuration for the WAF logging bucket
      const cfnLoggingConfiguration = new wafv2.CfnLoggingConfiguration(this, 'MyCfnLoggingConfiguration', {
        logDestinationConfigs: [props.aws_logging_stack.wafLogsBucket.bucketArn],
        resourceArn: cfnWebACL.attrArn
      });
    }
}
