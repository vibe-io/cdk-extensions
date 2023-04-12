import { App, CfnResource, IResolvable, Reference, ResolutionTypeHint, Stack, Stage } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { CfnIPAM, CfnNetworkInterface, CfnSecurityGroupIngress } from 'aws-cdk-lib/aws-ec2';
import { CfnUser } from 'aws-cdk-lib/aws-iam';
import { CfnParameter } from 'aws-cdk-lib/aws-ssm';
import { DynamicReference } from '../dynamic-reference';


test('cross stage string references with the same environment should generate imports', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageStringResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('AWS::SSM::Parameter', {
    Value: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
  });
});

test('cross stage string references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageStringResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
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
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageStringResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
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
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageNumberResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    FromPort: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
    ToPort: {
      'Fn::ImportValue': producerOutput[outputId].Export.Name,
    },
  });
});

test('cross stage number references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageNumberResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
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
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageListResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-1',
  });

  producerTemplate.hasOutput(outputId, {
    Export: {
      Name: Match.anyValue(),
    },
  });

  const producerOutput = producerTemplate.findOutputs(outputId);
  consumerTemplate.hasResourceProperties('AWS::IAM::User', {
    Groups: {
      'Fn::Split': ['||', {
        'Fn::ImportValue': producerOutput[outputId].Export.Name,
      }],
    },
  });
});

test('cross stage number references with different regions should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageNumberResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
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

test('cross stage list references with different accounts should generate parameter', () => {
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageListResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '234567890123',
    consumerRegion: 'us-east-1',
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
  const { producerTemplate, consumerTemplate, outputId } = createCrossStageListResources({
    producerAccount: '123456789012',
    producerRegion: 'us-east-1',
    consumerAccount: '123456789012',
    consumerRegion: 'us-east-2',
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


function createCrossStageStringResources(props: CrossStageReferenceProps) {
  const app = new App();
  const stage1 = createStage(app, 'stage-1', props.producerAccount, props.producerRegion);
  const stage2 = createStage(app, 'stage-2', props.consumerAccount, props.consumerRegion);
  const stack1 = new Stack(stage1, 'stack');
  const stack2 = new Stack(stage2, 'stack');
  const outputId = 'ExportsOutputRefproducerparameterFCF9B3E8';

  const producerParameter = new CfnParameter(stack1, 'producer-parameter', {
    type: 'String',
    value: 'test',
  });

  const consumerParameter = new CfnParameter(stack2, 'consumer-parameter', {
    type: 'String',
    value: DynamicReference.string(producerParameter, producerParameter.ref),
  });

  const producerTemplate = Template.fromStack(stack1);
  const consumerTemplate = Template.fromStack(stack2);

  return {
    producerParameter,
    consumerParameter,
    producerTemplate,
    consumerTemplate,
    outputId,
  };
}

function createCrossStageNumberResources(props: CrossStageReferenceProps) {
  const app = new App();
  const stage1 = createStage(app, 'stage-1', props.producerAccount, props.producerRegion);
  const stage2 = createStage(app, 'stage-2', props.consumerAccount, props.consumerRegion);
  const stack1 = new Stack(stage1, 'stack');
  const stack2 = new Stack(stage2, 'stack');
  const outputId = 'ExportsOutputFnGetAttproducerresourceScopeCount1E770B74';

  const producerResource = new CfnIPAM(stack1, 'producer-resource');

  const consumerResource = new CfnSecurityGroupIngress(stack2, 'consumer-resource', {
    ipProtocol: 'tcp',
    fromPort: DynamicReference.number(producerResource, producerResource.attrScopeCount),
    toPort: DynamicReference.number(producerResource, producerResource.attrScopeCount),
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

function createCrossStageListResources(props: CrossStageReferenceProps) {
  const app = new App();
  const stage1 = createStage(app, 'stage-1', props.producerAccount, props.producerRegion);
  const stage2 = createStage(app, 'stage-2', props.consumerAccount, props.consumerRegion);
  const stack1 = new Stack(stage1, 'stack');
  const stack2 = new Stack(stage2, 'stack');
  const outputId = 'ExportsOutputFnGetAttproducerresourceSecondaryPrivateIpAddressesF8649255';

  const producerResource = new CfnNetworkInterface(stack1, 'producer-resource', {
    secondaryPrivateIpAddressCount: 2,
    subnetId: 'subnet-1234567890123456',
  });

  const consumerResource = new CfnUser(stack2, 'consumer-resource', {
    groups: DynamicReference.stringList(producerResource, producerResource.attrSecondaryPrivateIpAddresses),
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

/*function createCrossStageStrResources(props: CrossStageReferenceProps) {
  const app = new App();
  const stage1 = createStage(app, 'stage-1', props.producerAccount, props.producerRegion);
  const stage2 = createStage(app, 'stage-2', props.consumerAccount, props.consumerRegion);
  const stack1 = new Stack(stage1, 'stack');
  const stack2 = new Stack(stage2, 'stack');
  const outputId = 'ExportsOutputFnGetAttproducerresourceSecondaryPrivateIpAddressesF8649255';

  const producerResource = new CfnResource(stack1, 'producer-resource', {
    type: 'CDKE::Test::Producer'
  });

  const consumerResource = new CfnResource(stack2, 'consumer-resource', {
    type: 'CDKE::Test::Consumer',
    properties: {
      Reference: Token.asString(producerResource.getAtt('TestField'))
    }
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
}*/

function anyTransform(ref: Reference): IResolvable {
  return DynamicReference.any(ref.target, ref);
}

/*function listTransform(ref: Reference): string[] {
  return DynamicReference.stringList(ref.target, Token.asList(ref));
}

function numberTransform(ref: Reference): number {
  return DynamicReference.number(ref.target, Token.asNumber(ref));
}

function stringTransform(ref: Reference): string {
  return DynamicReference.string(ref.target, Token.asString(ref));
}*/

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