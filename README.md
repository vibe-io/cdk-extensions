# replace this


## Getting Started
___

### TypeScript

#### Installation
```shell
$ npm install cdk-extensions
```

#### Usage
<i>Minimal deployable example creates the default logging strategy defined in AwsLoggingStack for ALB, CloudFront, CloudTrail, Flow Logs, and S3 access logs. For each service a Glue crawler preforms an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog. Default named queries have been defined for each AWS service. For more details on this and the other available stacks and constructs, consult the respective READMEs.</i>
```TypeScript
import { AwsLoggingStack } from 'cdk-extensions/stacks';
```
```TypeScript
new AwsLoggingStack(this, 'AwsLoggingStack')

```

#### Deploy
```shell
$ cdk deploy
```

### Python

#### Installation
```shell
$ pip install cdk-extensions
```
#### Usage
<i>Minimal deployable example creates the default logging strategy defined in AwsLoggingStack for ALB, CloudFront, CloudTrail, Flow Logs, and S3 access logs. For each service a Glue crawler preforms an ETL process to analyze and categorize data in Amazon S3 and store the associated metadata in the AWS Glue Data Catalog. Default named queries have been defined for each AWS service. For more details on this and the other available stacks and constructs, consult the respective READMEs.</i>
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
