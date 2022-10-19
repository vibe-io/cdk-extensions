# replace this


## Getting Started
___

### TypeScript

#### Installation
```shell
$ npm install cdk-extensions
```

#### Usage
<i>Minimal deployable example creates the default AwsLoggingStack. For more details on this and the other available stacks and constructs, consult the respective READMEs.</i>
```TypeScript
import { AwsLoggingStack } from 'cdk-extensions/lib/stacks/aws-logging-stack';
 ...
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
<i>Minimal deployable example creates the default AwsLoggingStack. For more details on this and the other available stacks and constructs, consult the respective READMEs.</i>
```Python
from cdk_extensions.stacks import (
  AwsLoggingStack
)

...

aws_logging_stack = AwsLoggingStack(self, 'AwsLoggingStack')
```

#### Deploy
```shell
$ cdk deploy
```
