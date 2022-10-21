# replace this


## Getting Started

### TypeScript

#### Installation
```shell
$ npm install cdk-extensions
```

### Python

#### Installation
```shell
$ pip install cdk-extensions
```

### Examples

#### AwsLoggingStack
Minimal deployable example creates the default logging strategy defined in AwsLoggingStack for ALB, CloudFront, CloudTrail, Flow Logs, and S3 access logs. For each service, an S3 bucket is created and a Glue crawler to analyze and categorize the data and store the associated metadata in the AWS Glue Data Catalog. Default named queries have been defined for each AWS service. For more details on this and the other available stacks and constructs, consult the respective READMEs.

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

#### Deploy
```shell
$ cdk deploy
```

#### FourTierNetwork

// To Do
