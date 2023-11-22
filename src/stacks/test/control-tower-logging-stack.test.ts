import { Template } from 'aws-cdk-lib/assertions';
import { ControlTowerLoggingStack } from '../control-tower-logging-stack';
import { DefaultStackSynthesizer, Stack } from 'aws-cdk-lib';
import { IKey, Key } from 'aws-cdk-lib/aws-kms';

const ENCRYPTION_KEY = 'arn:aws:kms:us-east-1:123456789012:key/00000000-0000-0000-0000-000000000000'

test ('creating a generic instance of the stack should produce logical defaults', () => {
  const stack = new ControlTowerLoggingStack(undefined, undefined, {
    analyticsReporting: false,
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  });

  const template = Template.fromStack(stack);
  console.log(JSON.stringify(template.toJSON()));
});

test ('passing a kms key should add kms conditions to polcies', () => {
  const stack = new ControlTowerLoggingStack(undefined, undefined, {
    analyticsReporting: false,
    encryptionKey: getEncyptionKey(),
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  });

  const template = Template.fromStack(stack);
  console.log(JSON.stringify(template.toJSON()));
});

function getEncyptionKey(): IKey {
  const stack = new Stack();
  return Key.fromKeyArn(stack, 'encryption-key', ENCRYPTION_KEY);
}