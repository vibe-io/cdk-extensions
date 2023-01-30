import { Names } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PrometheusRule } from '..';
import { defaultRecordingRuleProps, getDefaultRuleGroup } from './default-values';


test('recording rule renders properly with minimum config', () => {
  const resources = getDefaultRuleGroup();

  resources.ruleGroup.addRule(PrometheusRule.recordingRule(defaultRecordingRuleProps));

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(resources.ruleGroup),
        rules: [{
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
          record: 'metric:recording_rule',
        }],
      }],
    }),
    Name: Names.uniqueId(resources.ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });
});

test('recording rule properly reflects optionsal arguments', () => {
  const resources = getDefaultRuleGroup();

  const rule = resources.ruleGroup.addRecordingRule({
    ...defaultRecordingRuleProps,
    labels: {
      label1: 'value1',
      label2: 'value2',
    },
  });

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(resources.ruleGroup),
        rules: [{
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
          labels: {
            label1: 'value1',
            label2: 'value2',
          },
          record: 'metric:recording_rule',
        }],
      }],
    }),
    Name: Names.uniqueId(resources.ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });

  expect(rule.labels).toStrictEqual({
    label1: 'value1',
    label2: 'value2',
  });
});

test('adding a duplicate label should throw an error', () => {
  const resources = getDefaultRuleGroup();

  const rule = resources.ruleGroup.addRecordingRule({
    ...defaultRecordingRuleProps,
    labels: {
      label1: 'value1',
    },
  });

  expect(() => {
    rule.addLabel('label1', 'value2');
  }).toThrowError([
    'Cannot add duplicate label to Prometheus recording rule with the',
    "label value 'label1'.",
  ].join(' '));
});