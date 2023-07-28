import { Duration, Names } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { defaultAlertingRuleProps, getDefaultRuleGroup } from './default-values';
import { PrometheusRule } from '..';


test('alerting rule renders properly with minimum config', () => {
  const resources = getDefaultRuleGroup();

  resources.ruleGroup.addRule(PrometheusRule.alertingRule(defaultAlertingRuleProps));

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(resources.ruleGroup),
        rules: [{
          alert: 'metric:alerting_rule',
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
        }],
      }],
    }),
    Name: Names.uniqueId(resources.ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });
});

test('alerting rule properly reflects optional arguments', () => {
  const resources = getDefaultRuleGroup();

  resources.ruleGroup.addRule(PrometheusRule.alertingRule({
    ...defaultAlertingRuleProps,
    annotations: {
      annotation1: 'value1',
      annotation2: 'value2',
    },
    labels: {
      label1: 'value1',
      label2: 'value2',
    },
    period: Duration.minutes(2),
  }));

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(resources.ruleGroup),
        rules: [{
          alert: 'metric:alerting_rule',
          annotations: {
            annotation1: 'value1',
            annotation2: 'value2',
          },
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
          for: '120s',
          labels: {
            label1: 'value1',
            label2: 'value2',
          },
        }],
      }],
    }),
    Name: Names.uniqueId(resources.ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });
});

test('adding a duplicate annotation should throw an error', () => {
  const resources = getDefaultRuleGroup();

  const rule = resources.ruleGroup.addAlertingRule({
    ...defaultAlertingRuleProps,
    annotations: {
      annotation1: 'value1',
    },
  });

  expect(() => {
    rule.addAnnotation('annotation1', 'value2');
  }).toThrowError([
    'Cannot add duplicate annotation to Prometheus alerting rule with the',
    "label value 'annotation1'.",
  ].join(' '));
});

test('adding a duplicate label should throw an error', () => {
  const resources = getDefaultRuleGroup();

  const rule = resources.ruleGroup.addAlertingRule({
    ...defaultAlertingRuleProps,
    labels: {
      label1: 'value1',
    },
  });

  expect(() => {
    rule.addLabel('label1', 'value2');
  }).toThrowError([
    'Cannot add duplicate label to Prometheus alerting rule with the',
    "label value 'label1'.",
  ].join(' '));
});