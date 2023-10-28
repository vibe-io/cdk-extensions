import { FeatureFlags, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DefinitionBody, FieldUtils, Pass, StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { HandlerReference } from "../handler-reference";
import { ENABLE_PARTITION_LITERALS } from "aws-cdk-lib/cx-api";


test ('handler references should resolve using state machine context in a stae machine', () => {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });
  stack.node.setContext(ENABLE_PARTITION_LITERALS, true);
  FeatureFlags.of(stack).isEnabled(ENABLE_PARTITION_LITERALS);

  const reference = HandlerReference.create(stack, 'handler', 'handle-test');

  const step = new Pass(stack, 'step', {
    parameters: FieldUtils.renderObject({
      stateMachine: reference.stateMachineArn,
    }),
  });

  new StateMachine(stack, 'state-machine', {
    definitionBody: DefinitionBody.fromChainable(step),
  });

  const template = Template.fromStack(stack);
  console.log(template);
});