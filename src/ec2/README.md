# Vibe-io CDK-Extensions EC2 Construct Library

The @cdk-extensions/ec2 package contains advanced constructs and patterns for
setting up networking and instances. The constructs presented here are intended
to be replacements for equivalent AWS constructs in the CDK EC2 module, but with
additional features included.

[AWS CDK EC2 API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html)

To import and use this module within your CDK project:

```ts
import * as ec2 from 'cdk-extensions/ec2';
```

## VPC Flow Logs

VPC Flow Logs is a feature that enables you to capture information about the IP
traffic going to and from network interfaces in your VPC. Flow log data can be
published to Amazon CloudWatch Logs and Amazon S3. After you've created a flow
log, you can retrieve and view its data in the chosen destination.
[AWS VPC Flow Logs User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
[AWS VPC Flow Logs CFN Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html)

For this construct, by default a S3 bucket will be created as the Flow Logs
destination. It will also include a Glue table with the same schema as the
configured FlowLogFormat, as well as prepared Athena queries.

### Usage

You can create a flow log like this:

```ts
new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(myVpc)
})
```
You can also add multiple flow logs with different destinations.

```ts
const bucket = new s3.Bucket(this, 'MyCustomBucket');

new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(myVpc),
  destination: ec2.FlowLogDestination.toS3(bucket)
});

new ec2.FlowLog(this, 'FlowLogCloudWatch', {
  resourceType: ec2.FlowLogResourceType.fromVpc(myVpc),
  trafficType: ec2.FlowLogTrafficType.REJECT,
  maxAggregationInterval: FlowLogMaxAggregationInterval.ONE_MINUTE,
});
```

### Additional Features

The main advantage that this module has over the official AWS CDK module is that
you can specific the log format at the time of FlowLog creation like this:

```ts
new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(myVpc),
  format: ec2.FlowLogFormat.V3,
})
```

There are several formats that are included as part of the module, and each one
will define the fields included in the flow log records. Each one acts similarly
to a log level (Info, Debug, etc), with each level providing increasingly more
detail in the logs (like region or AZ details, or AWS service details).

The formats and descriptions are as follows:

-ec2.FlowLogFormat.V2: The default format if none is specified. Includes common
                      basic details like log status, account ID, source and
                      destination.
-ec2.FlowLogFormat.V3: Includes all fields from V2, as well as information on
                      the specific AWS resources associated with the traffic
                      like Vpc, subnet and instance IDs.
-ec2.FlowLogFormat.V4: Includes all fields from V3, as well as information about
                      the region and AZ associated with the traffic.
-ec2.FlowLogFormat.V5: Includes all fields from V4, as well as information that
                      provides visibility on packet routing.

### Caveats

With the offical AWS CDK VPC construct, you can normally add a Flow Log to a VPC
 by using the addFlowLog() method like this:

```ts
const vpc = new ec2.Vpc(this, 'Vpc');

vpc.addFlowLog('FlowLog');
```

However, this will not include the additional FlowLogFormat functionality
provided by the FlowLog construct in this module.
