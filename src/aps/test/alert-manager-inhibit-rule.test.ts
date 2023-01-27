import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, AlertManagerMatcher, Workspace } from '..';


test('creating an inhibit rule respects passed configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });

  const sMatcher001 = AlertManagerMatcher.fromString('source001 = "active"');
  const sMatcher002 = AlertManagerMatcher.fromString('source002 = "active"');
  const tMatcher001 = AlertManagerMatcher.fromString('target001 = "active"');
  const tMatcher002 = AlertManagerMatcher.fromString('target002 = "active"');

  const rule001 = configuration.addInhibitRule('001', {
    sourceMatchers: [
      sMatcher001,
      sMatcher002,
    ],
    targetMatchers: [
      tMatcher001,
      tMatcher002,
    ],
  });
  const rule002 = configuration.addInhibitRule('002', {
    equalLabels: [
      'label001',
      'label002',
    ],
    sourceMatchers: [
      sMatcher001,
      sMatcher002,
    ],
    targetMatchers: [
      tMatcher001,
      tMatcher002,
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
    inhibit_rules: [
      {
        source_matchers: [
          'source001 = "active"',
          'source002 = "active"',
        ],
        target_matchers: [
          'target001 = "active"',
          'target002 = "active"',
        ],
      },
      {
        equal: [
          'label001',
          'label002',
        ],
        source_matchers: [
          'source001 = "active"',
          'source002 = "active"',
        ],
        target_matchers: [
          'target001 = "active"',
          'target002 = "active"',
        ],
      },
    ],
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(rule001.sourceMatchers).toStrictEqual([
    sMatcher001,
    sMatcher002,
  ]);
  expect(rule001.targetMatchers).toStrictEqual([
    tMatcher001,
    tMatcher002,
  ]);
  expect(rule002.equalLabels).toStrictEqual([
    'label001',
    'label002',
  ]);
});

test('an inhibit rule with no source matchers should throw an error', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });
  new Workspace(stack, 'workspace', {
    alerting: {
      configuration: configuration,
    },
  });

  const matcher001 = AlertManagerMatcher.fromString('label001 = "active"');
  const matcher002 = AlertManagerMatcher.fromString('label002 = "active"');

  configuration.addInhibitRule('001', {
    targetMatchers: [
      matcher001,
      matcher002,
    ],
  });

  expect(() => {
    Template.fromStack(stack);
  }).toThrowError([
    'When creating an alert manager inhibit rule at least one',
    'source matcher is required.',
  ].join(' '));
});

test('an inhibit rule with no target matchers should throw an error', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });
  new Workspace(stack, 'workspace', {
    alerting: {
      configuration: configuration,
    },
  });

  const matcher001 = AlertManagerMatcher.fromString('label001 = "active"');
  const matcher002 = AlertManagerMatcher.fromString('label002 = "active"');

  configuration.addInhibitRule('001', {
    sourceMatchers: [
      matcher001,
      matcher002,
    ],
  });

  expect(() => {
    Template.fromStack(stack);
  }).toThrowError([
    'When creating an alert manager inhibit rule at least one',
    'target matcher is required.',
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