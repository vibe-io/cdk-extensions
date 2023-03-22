import { readFileSync } from 'fs';
import { Duration, Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, AlertManagerDestination, AlertManagerMatcher, AlertManagerTemplate } from '..';

test ('creating an alert manager config should give a basic configuration', () => {
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

test ('an sns topic should be created when default destinations is undefined', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const configuration = new AlertManagerConfiguration(stack, 'configuration');

  expect(configuration.defaultTopic).toBeDefined();
  expect(configuration.defaultReceiver.destinations.length).toBe(1);
});

test ('default route should respect passed configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
    defaultRoute: {
      groupByLabels: [
        'testLabel001',
        'testLabel002',
      ],
      groupInterval: Duration.minutes(15),
      groupWait: Duration.seconds(30),
      matchers: [
        AlertManagerMatcher.fromString('matchLabel001 = "active"'),
        AlertManagerMatcher.fromString('matchLabel002 = "active"'),
      ],
      repeatInterval: Duration.hours(12),
    },
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
      group_by: [
        'testLabel001',
        'testLabel002',
      ],
      group_interval: '900s',
      group_wait: '30s',
      matchers: [
        'matchLabel001 = "active"',
        'matchLabel002 = "active"',
      ],
      receiver: 'default',
      repeat_interval: '43200s',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
});

test ('default receiver should route to passed destinations', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn001 = 'arn:aws:sns:us-east-1:123456789012:test-topic-001';
  const topicArn002 = 'arn:aws:sns:us-east-1:123456789012:test-topic-002';
  const topic001 = Topic.fromTopicArn(stack, 'test-topic-001', topicArn001);
  const topic002 = Topic.fromTopicArn(stack, 'test-topic-002', topicArn002);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic001),
      AlertManagerDestination.snsTopic(topic002),
    ],
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const expected = {
    receivers: [{
      name: 'default',
      sns_configs: [
        {
          sigv4: {
            region: 'us-east-1',
          },
          topic_arn: topicArn001,
        },
        {
          sigv4: {
            region: 'us-east-1',
          },
          topic_arn: topicArn002,
        },
      ],
    }],
    route: {
      receiver: 'default',
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
});

test ('imported combined file configs should render to the contents of the file', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const path = './src/aps/test/configs/alert-manager-combined.yaml';

  const contents = readFileSync(path, {
    encoding: 'utf8',
    flag: 'r',
  });

  const configuration = AlertManagerConfiguration.fromFullConfigurationFile(stack, 'configuration', path);
  const detail = configuration.bind(stack);

  expect(detail.contents).toStrictEqual(contents);
});

test ('imported split file configs should render to the contents of their files', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const pathConfig = './src/aps/test/configs/alert-manager-standalone.yaml';
  const pathTemplate = './src/aps/test/configs/alert-manager-template.tmpl';

  const contentsConfig = readFileSync(pathConfig, {
    encoding: 'utf8',
    flag: 'r',
  });
  const contentsTemplate = readFileSync(pathTemplate, {
    encoding: 'utf8',
    flag: 'r',
  });

  const configuration = AlertManagerConfiguration.fromSplitConfigurationFiles(stack, 'configuration', pathConfig, {
    default: AlertManagerTemplate.fromFile(pathTemplate),
  });

  const detail = configuration.bind(stack);

  expect(JSON.parse(stack.resolve(detail.contents))).toStrictEqual({
    alertmanager_config: contentsConfig,
    template_files: {
      default: contentsTemplate,
    },
  });
});

test ('imported split file configs with no templates should not have template_files section', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const pathConfig = './src/aps/test/configs/alert-manager-standalone.yaml';

  const contentsConfig = readFileSync(pathConfig, {
    encoding: 'utf8',
    flag: 'r',
  });

  const configuration = AlertManagerConfiguration.fromSplitConfigurationFiles(stack, 'configuration', pathConfig);

  const detail = configuration.bind(stack);

  expect(JSON.parse(stack.resolve(detail.contents))).toStrictEqual({
    alertmanager_config: contentsConfig,
  });
});

test('registered templates should appear in template_files and alertmanager_config', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const pathTemplate = './src/aps/test/configs/alert-manager-template.tmpl';
  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
    templates: [
      AlertManagerTemplate.fromFile(pathTemplate),
    ],
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const contentsTemplate = readFileSync(pathTemplate, {
    encoding: 'utf8',
    flag: 'r',
  });

  const expectedAlertManager = {
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
    templates: [
      `tmpl_${configuration.node.addr}_001`,
    ],
  };

  const expectedTemplates = {
    [`tmpl_${configuration.node.addr}_001`]: contentsTemplate,
  };

  expect(alertManagerConfig).toStrictEqual(expectedAlertManager);
  expect(apsConfig.template_files).toStrictEqual(expectedTemplates);
});

test('multiple templates should each to uniquely generated names', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const pathTemplate = './src/aps/test/configs/alert-manager-template.tmpl';
  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
    templates: [
      AlertManagerTemplate.fromFile(pathTemplate),
      AlertManagerTemplate.fromFile(pathTemplate),
    ],
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const contentsTemplate = readFileSync(pathTemplate, {
    encoding: 'utf8',
    flag: 'r',
  });

  const expectedAlertManager = {
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
    templates: [
      `tmpl_${configuration.node.addr}_001`,
      `tmpl_${configuration.node.addr}_002`,
    ],
  };

  const expectedTemplates = {
    [`tmpl_${configuration.node.addr}_001`]: contentsTemplate,
    [`tmpl_${configuration.node.addr}_002`]: contentsTemplate,
  };

  expect(alertManagerConfig).toStrictEqual(expectedAlertManager);
  expect(apsConfig.template_files).toStrictEqual(expectedTemplates);
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