import { Names, Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, AlertManagerDestination, AlertManagerReceiver } from '..';


test('receiver with no configuration should have expected default values', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });

  const receiver = new AlertManagerReceiver(configuration, 'receiver-001');

  expect(receiver.name).toBe(Names.uniqueId(receiver));
  expect(receiver.destinations.length).toBe(0);
});

test('receiver should respect passed configuration options', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn001 = 'arn:aws:sns:us-east-1:123456789012:test-topic-001';
  const topicArn002 = 'arn:aws:sns:us-east-1:123456789012:test-topic-002';
  const topic001 = Topic.fromTopicArn(stack, 'test-topic-001', topicArn001);
  const topic002 = Topic.fromTopicArn(stack, 'test-topic-002', topicArn002);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic001,
  });

  const receiver = new AlertManagerReceiver(configuration, 'receiver-001', {
    destinations: [
      AlertManagerDestination.snsTopic(topic002),
    ],
    name: 'test-receiver',
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const expected = {
    receivers: [
      {
        name: 'default',
        sns_configs: [{
          sigv4: {
            region: 'us-east-1',
          },
          topic_arn: topicArn001,
        }],
      },
      {
        name: 'test-receiver',
        sns_configs: [{
          sigv4: {
            region: 'us-east-1',
          },
          topic_arn: topicArn002,
        }],
      },
    ],
    route: {
      receiver: 'default',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(receiver.name).toBe('test-receiver');
  expect(receiver.destinations.length).toBe(1);
});

test('adding multiple of the same destination should give a list of destinations for that type', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn001 = 'arn:aws:sns:us-east-1:123456789012:test-topic-001';
  const topicArn002 = 'arn:aws:sns:us-east-1:123456789012:test-topic-002';
  const topicArn003 = 'arn:aws:sns:us-east-1:123456789012:test-topic-003';
  const topic001 = Topic.fromTopicArn(stack, 'test-topic-001', topicArn001);
  const topic002 = Topic.fromTopicArn(stack, 'test-topic-002', topicArn002);
  const topic003 = Topic.fromTopicArn(stack, 'test-topic-003', topicArn003);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic001,
  });

  const receiver = new AlertManagerReceiver(configuration, 'receiver-001', {
    destinations: [
      AlertManagerDestination.snsTopic(topic002),
      AlertManagerDestination.snsTopic(topic003),
    ],
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const expected = {
    receivers: [
      {
        name: 'default',
        sns_configs: [{
          sigv4: {
            region: 'us-east-1',
          },
          topic_arn: topicArn001,
        }],
      },
      {
        name: Names.uniqueId(receiver),
        sns_configs: [
          {
            sigv4: {
              region: 'us-east-1',
            },
            topic_arn: topicArn002,
          },
          {
            sigv4: {
              region: 'us-east-1',
            },
            topic_arn: topicArn003,
          },
        ],
      },
    ],
    route: {
      receiver: 'default',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(receiver.destinations.length).toBe(2);
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