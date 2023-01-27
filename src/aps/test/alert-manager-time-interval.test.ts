import { Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerConfiguration, TimeIntervalEntry, Weekday } from '..';


test('creating an inhibit rule respects passed configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });

  const group = configuration.addTimeInterval('001');
  const interval001 = group.addInterval(new TimeIntervalEntry({
    daysOfTheMonth: [{
      start: 1,
      end: 7,
    }],
    months: [{
      start: 9,
      end: 12,
    }],
    timeZone: 'UTC',
    times: [{
      start: '09:00',
      end: '17:00',
    }],
    weekdays: [{
      start: Weekday.MONDAY,
      end: Weekday.FRIDAY,
    }],
    years: [{
      start: 2000,
      end: 2099,
    }],
  }));
  const interval002 = group.addInterval(new TimeIntervalEntry({
    daysOfTheMonth: [{
      start: -7,
      end: -1,
    }],
    months: [{
      start: 6,
    }],
    weekdays: [{
      start: Weekday.SATURDAY,
    }],
    years: [{
      start: 2050,
    }],
  }));

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
    time_intervals: [{
      name: group.name,
      time_intervals: [
        {
          days_of_month: [
            '1:7',
          ],
          location: 'UTC',
          months: [
            '9:12',
          ],
          times: [{
            end_time: '17:00',
            start_time: '09:00',
          }],
          weekdays: [
            'monday:friday',
          ],
          years: [
            '2000:2099',
          ],
        },
        {
          days_of_month: [
            '-7:-1',
          ],
          months: [
            '6',
          ],
          weekdays: [
            'saturday',
          ],
          years: [
            '2050',
          ],
        },
      ],
    }],
  };

  expect(alertManagerConfig).toStrictEqual(expected);
  expect(group.intervals).toStrictEqual([
    interval001,
    interval002,
  ]);
  expect(interval001.daysOfTheMonth).toStrictEqual([{
    start: 1,
    end: 7,
  }]);
  expect(interval001.months).toStrictEqual([{
    start: 9,
    end: 12,
  }]);
  expect(interval001.times).toStrictEqual([{
    start: '09:00',
    end: '17:00',
  }]);
  expect(interval001.weekdays).toStrictEqual([{
    start: Weekday.MONDAY,
    end: Weekday.FRIDAY,
  }]);
  expect(interval001.years).toStrictEqual([{
    start: 2000,
    end: 2099,
  }]);
  expect(interval002.daysOfTheMonth).toStrictEqual([{
    start: -7,
    end: -1,
  }]);
  expect(interval002.months).toStrictEqual([{
    start: 6,
    end: undefined,
  }]);
  expect(interval002.weekdays).toStrictEqual([{
    start: Weekday.SATURDAY,
    end: undefined,
  }]);
  expect(interval002.years).toStrictEqual([{
    start: 2050,
    end: undefined,
  }]);
});

test('custom name is used if one is provided', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const topicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';
  const topic = Topic.fromTopicArn(stack, 'test-topic', topicArn);
  const configuration = new AlertManagerConfiguration(stack, 'configuration', {
    defaultTopic: topic,
  });

  const group = configuration.addTimeInterval('001', {
    name: 'custom-name',
  });
  group.addInterval(new TimeIntervalEntry({
    years: [{
      start: 2000,
    }],
  }));

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
    time_intervals: [{
      name: 'custom-name',
      time_intervals: [{
        years: [
          '2000',
        ],
      }],
    }],
  };

  expect(alertManagerConfig).toStrictEqual(expected);
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