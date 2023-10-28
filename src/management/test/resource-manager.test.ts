import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ResourceManager } from '../resource-manager';


test ('basic creation should produce a working template', () => {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  new ResourceManager(stack, 'resource-manager');
  Template.fromStack(stack);
});