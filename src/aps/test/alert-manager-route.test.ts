import { Duration, Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, AlertManagerDestination, AlertManagerMatcher, MatchOperator, TimeIntervalEntry, Weekday } from '..';


test('set default route details should be reflected in configuration', () => {
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
        AlertManagerMatcher.fromComponents('matchLabel001', MatchOperator.EQUALS, 'active'),
        AlertManagerMatcher.fromComponents('matchLabel002', MatchOperator.EQUALS, 'active'),
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
  expect(configuration.defaultRoute.groupByLabels).toStrictEqual([
    'testLabel001',
    'testLabel002',
  ]);
});

test('setting time intervals on the default route should throw an error', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const configuration = new AlertManagerConfiguration(stack, 'configuration');
  const timeInterval = configuration.addTimeInterval('time-interval', {
    intervals: [
      new TimeIntervalEntry({
        weekdays: [
          {
            start: Weekday.SATURDAY,
          },
        ],
      }),
    ],
  });

  expect(() => {
    configuration.defaultRoute.addActiveTimeInterval(timeInterval);
  }).toThrowError([
    'Cannot add an active time interval to the default route of an alert',
    'manager configuration.',
  ].join(' '));

  expect(() => {
    configuration.defaultRoute.addMuteTimeInterval(timeInterval);
  }).toThrowError([
    'Cannot add a mute time interval to the default route of an alert',
    'manager configuration.',
  ].join(' '));
});

test('routes can have children for more advanced alerting', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });

  const receiver001 = configuration.addReciever('001', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const receiver002 = configuration.addReciever('002', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const receiver003 = configuration.addReciever('003', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const receiver004 = configuration.addReciever('004', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });

  const child001 = configuration.defaultRoute.addChild('001', {
    children: [
      {
        receiver: receiver003,
      },
      {
        receiver: receiver004,
      },
    ],
    receiver: receiver001,
  });
  const child002 = configuration.defaultRoute.addChild('002', {
    receiver: receiver002,
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const receiverCommonConfig = {
    sns_configs: [{
      sigv4: {
        region: 'us-east-1',
      },
      topic_arn: topicArn,
    }],
  };

  const expected = {
    receivers: [
      {
        name: 'default',
        ...receiverCommonConfig,
      },
      {
        name: receiver001.name,
        ...receiverCommonConfig,
      },
      {
        name: receiver002.name,
        ...receiverCommonConfig,
      },
      {
        name: receiver003.name,
        ...receiverCommonConfig,
      },
      {
        name: receiver004.name,
        ...receiverCommonConfig,
      },
    ],
    route: {
      receiver: 'default',
      routes: [
        {
          receiver: receiver001.name,
          routes: [
            {
              receiver: receiver003.name,
            },
            {
              receiver: receiver004.name,
            },
          ],
        },
        {
          receiver: receiver002.name,
        },
      ],
    },
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(configuration.defaultRoute.children).toStrictEqual([
    child001,
    child002,
  ]);
});

test('child routes support additional configuration options', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultReceiverDestinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });

  const matcher = AlertManagerMatcher.fromComponents('matchLabel', MatchOperator.EQUALS, 'active');

  const receiver001 = configuration.addReciever('001', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const receiver002 = configuration.addReciever('002', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });
  const receiver003 = configuration.addReciever('003', {
    destinations: [
      AlertManagerDestination.snsTopic(topic),
    ],
  });

  const timeInterval001 = configuration.addTimeInterval('001', {
    intervals: [
      new TimeIntervalEntry({
        daysOfTheMonth: [{
          end: 7,
          start: 1,
        }],
      }),
    ],
  });
  const timeInterval002 = configuration.addTimeInterval('002', {
    intervals: [
      new TimeIntervalEntry({
        months: [{
          end: 9,
          start: 4,
        }],
      }),
    ],
  });

  const child001 = configuration.defaultRoute.addChild('001', {
    activeTimeIntervals: [
      timeInterval001,
      timeInterval002,
    ],
    continueMatching: true,
    receiver: receiver001,
  });
  const child002 = configuration.defaultRoute.addChild('002', {
    continueMatching: false,
    muteTimeInterval: [
      timeInterval001,
      timeInterval002,
    ],
    receiver: receiver002,
  });
  const child003 = configuration.defaultRoute.addChild('003', {
    activeTimeIntervals: [
      timeInterval001,
    ],
    matchers: [
      matcher,
    ],
    muteTimeInterval: [
      timeInterval002,
    ],
    receiver: receiver003,
  });

  const detail = configuration.bind(stack);
  const content = stack.resolve(detail.contents);
  const apsConfig = JSON.parse(content);
  const alertManagerConfig = JSON.parse(apsConfig.alertmanager_config);

  const receiverCommonConfig = {
    sns_configs: [{
      sigv4: {
        region: 'us-east-1',
      },
      topic_arn: topicArn,
    }],
  };

  const expected = {
    receivers: [
      {
        name: 'default',
        ...receiverCommonConfig,
      },
      {
        name: receiver001.name,
        ...receiverCommonConfig,
      },
      {
        name: receiver002.name,
        ...receiverCommonConfig,
      },
      {
        name: receiver003.name,
        ...receiverCommonConfig,
      },
    ],
    route: {
      receiver: 'default',
      routes: [
        {
          active_time_intervals: [
            timeInterval001.name,
            timeInterval002.name,
          ],
          continue: true,
          receiver: receiver001.name,
        },
        {
          continue: false,
          receiver: receiver002.name,
          mute_time_intervals: [
            timeInterval001.name,
            timeInterval002.name,
          ],
        },
        {
          active_time_intervals: [
            timeInterval001.name,
          ],
          matchers: [
            'matchLabel = "active"',
          ],
          mute_time_intervals: [
            timeInterval002.name,
          ],
          receiver: receiver003.name,
        },
      ],
    },
    time_intervals: [
      {
        name: timeInterval001.name,
        time_intervals: [{
          days_of_month: [
            '1:7',
          ],
        }],
      },
      {
        name: timeInterval002.name,
        time_intervals: [{
          months: [
            '4:9',
          ],
        }],
      },
    ],
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(child001.activeTimeIntervals).toStrictEqual([
    timeInterval001,
    timeInterval002,
  ]);
  expect(child002.muteTimeIntervals).toStrictEqual([
    timeInterval001,
    timeInterval002,
  ]);
  expect(child003.activeTimeIntervals).toStrictEqual([
    timeInterval001,
  ]);
  expect(child003.muteTimeIntervals).toStrictEqual([
    timeInterval002,
  ]);
  expect(child003.matchers).toStrictEqual([
    matcher,
  ]);
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