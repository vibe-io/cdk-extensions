import { App, CfnResource, IResolvable, Reference, ResolutionTypeHint, Stack, Stage, Token } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DynamicReference } from '../dynamic-reference';


test('cross stage string references with the same environment should generate imports', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING,
    transformer: stringTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('CDKE::Test::Consumer', {
    Reference: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
  });
});

test('cross stage string references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING,
    transformer: stringTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'String',
  });
});

test('cross stage string references with different regions should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
    typeHint: ResolutionTypeHint.STRING,
    transformer: stringTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'String',
  });
});

test('cross stage number references with the same environment should generate imports', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.NUMBER,
    transformer: numberTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('CDKE::Test::Consumer', {
    Reference: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
  });
});

test('cross stage number references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.NUMBER,
    transformer: numberTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'Number',
  });
});

test('cross stage number references with different regions should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
    typeHint: ResolutionTypeHint.NUMBER,
    transformer: numberTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'Number',
  });
});

test('cross stage list references with the same environment should generate imports', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING_LIST,
    transformer: listTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('CDKE::Test::Consumer', {
    Reference: {
      'Fn::Split': ['||', {
        'Fn::ImportValue': producerOutput[outputId].Export.Name,
      }],
    },
  });
});

test('cross stage list references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING_LIST,
    transformer: listTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'CommaDelimitedList',
  });
});

test('cross stage list references with different regions should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
    typeHint: ResolutionTypeHint.STRING_LIST,
    transformer: listTransform,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'CommaDelimitedList',
  });
});

interface CrossStageReferenceProps {
  producerAccount: string;
  producerRegion: string;
  consumerAccount: string;
  consumerRegion: string;
  typeHint?: ResolutionTypeHint;
  transformer?: {(ref: Reference): any};
}

test('cross stage any references with the same environment should generate imports', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('CDKE::Test::Consumer', {
    Reference: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
  });
});

test('cross stage any references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
    typeHint: ResolutionTypeHint.STRING,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'String',
  });
});

test('cross stage any references with different regions should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
    typeHint: ResolutionTypeHint.STRING,
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  consumerTemplate.hasParameter(`stage1stack${outputId}`, {
    Type: 'String',
  });
});

interface CrossStageReferenceProps {
  producerAccount: string;
  producerRegion: string;
  consumerAccount: string;
  consumerRegion: string;
  typeHint?: ResolutionTypeHint;
  transformer?: {(ref: Reference): any};
}


function anyTransform(ref: Reference): IResolvable {
  return DynamicReference.any(ref.target, ref);
}

function listTransform(ref: Reference): string[] {
  return DynamicReference.stringList(ref.target, Token.asList(ref));
}

function numberTransform(ref: Reference): number {
  return DynamicReference.number(ref.target, Token.asNumber(ref));
}

function stringTransform(ref: Reference): string {
  return DynamicReference.string(ref.target, Token.asString(ref));
}

function createCrossStageResources(props: CrossStageReferenceProps) {
  const app = new App();
  const stage1 = createStage(app, 'stage-1', props.producerAccount, props.producerRegion);
  const stage2 = createStage(app, 'stage-2', props.consumerAccount, props.consumerRegion);
  const stack1 = new Stack(stage1, 'stack');
  const stack2 = new Stack(stage2, 'stack');
  const outputId = 'ExportsOutputFnGetAttproducerresourceTestFieldF2B91D10';
  const transformer = props.transformer ?? anyTransform;

  const producerResource = new CfnResource(stack1, 'producer-resource', {
    type: 'CDKE::Test::Producer',
  });

  const consumerResource = new CfnResource(stack2, 'consumer-resource', {
    type: 'CDKE::Test::Consumer',
    properties: {
      Reference: transformer(producerResource.getAtt('TestField', props.typeHint)),
    },
  });

  const producerTemplate = Template.fromStack(stack1);
  const consumerTemplate = Template.fromStack(stack2);

  return {
    producerResource,
    consumerResource,
    producerTemplate,
    consumerTemplate,
    outputId,
  };
}

function createStage(stage: Stage, id: string, account: string, region: string): Stage {
  return new Stage(stage, id, {
    env: {
      account: account,
      region: region,
    },
  });
}