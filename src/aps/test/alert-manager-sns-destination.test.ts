import { Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, AlertManagerDestination } from '..';


test('with no options an sns destination should include a topic arn and region', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const expected = {
    receivers: [{
      name: 'default',
      sns_configs: [{
        sigv4: {
          region: 'us-east-1',
        },
        topic_arn: topicArn,
      }],
    }],
    route: {
      receiver: 'default',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
});

test('optional arguments should be reflected in the configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const destination = AlertManagerDestination.snsTopic(topic, {
    apiUrl: 'https://test.example.com/',
    attributes: {
      attr1: 'value1',
      attr2: 'value2',
    },
    message: 'test-message-template',
    sendResolved: false,
    subject: 'test-subject-template',
  });
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      destination,
    ],
  });
  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const expected = {
    receivers: [{
      name: 'default',
      sns_configs: [{
        api_url: 'https://test.example.com/',
        attributes: {
          attr1: 'value1',
          attr2: 'value2',
        },
        message: 'test-message-template',
        send_resolved: false,
        sigv4: {
          region: 'us-east-1',
        },
        subject: 'test-subject-template',
        topic_arn: topicArn,
      }],
    }],
    route: {
      receiver: 'default',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(destination.attributes).toStrictEqual({
    attr1: 'value1',
    attr2: 'value2',
  });
});

test('setting an attribute that already exists with a different value should throw an error', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const destination = AlertManagerDestination.snsTopic(topic, {
    attributes: {
      attr1: 'value1',
    },
  });

  expect(() => {
    destination.addAttribute('attr1', 'value2');
  }).toThrowError([
    "Tried to add duplicate key 'attr1' to SNS destination attributes",
    "with a value of 'value2'. However an attribute already exists for",
    "'attr1' with a value of 'value1'.",
  ].join(' '));
});

function getCommonResources() {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  return {
    stack,
  };
}