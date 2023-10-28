import { Stack } from 'aws-cdk-lib';
import { EvaluateTags } from '../evaluate-tags';
import { DefinitionBody, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Template } from 'aws-cdk-lib/assertions';


test ('generic creation should produce valid fragment', () => {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const evaluateTags = new EvaluateTags(stack, 'evaluate-tags', {
    desiredTagsPath: '$.Tags',
    resourcesPath: '$.Resources',
    tagField: 'Tags',
  });

  new StateMachine(stack, 'state-machine', {
    definitionBody: DefinitionBody.fromChainable(evaluateTags),
  });

  Template.fromStack(stack);
});