import { Duration, Names } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PrometheusRule, RuleGroupConfiguration, RuleGroupsNamespace } from '..';
import { defaultAlertingRuleProps, getDefaultWorkspace } from './default-values';


test('rule groups configuration should render properly with minimum configuration', () => {
  const resources = getDefaultWorkspace();

  const configuration = new RuleGroupConfiguration(resources.stack, 'configuration');
  const ruleGroup = configuration.addRuleGroup('test-group', {
    rules: [
      PrometheusRule.alertingRule(defaultAlertingRuleProps),
    ],
  });

  const ns = new RuleGroupsNamespace(resources.stack, 'namespace', {
    configuration: configuration,
    workspace: resources.workspace,
  });

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(ruleGroup),
        rules: [{
          alert: 'metric:alerting_rule',
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
        }],
      }],
    }),
    Name: Names.uniqueId(ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });
  expect(configuration.ruleGroups).toStrictEqual([
    ruleGroup,
  ]);
});

test('added rule groups should respect optional configuration', () => {
  const resources = getDefaultWorkspace();

  const configuration = new RuleGroupConfiguration(resources.stack, 'configuration');
  const ruleGroup = configuration.addRuleGroup('test-group', {
    interval: Duration.minutes(5),
    limit: 5,
    name: 'test-group',
    rules: [
      PrometheusRule.alertingRule(defaultAlertingRuleProps),
    ],
  });

  const ns = new RuleGroupsNamespace(resources.stack, 'namespace', {
    configuration: configuration,
    workspace: resources.workspace,
  });

  const template = Template.fromStack(resources.stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        interval: '300s',
        limit: 5,
        name: 'test-group',
        rules: [{
          alert: 'metric:alerting_rule',
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
        }],
      }],
    }),
    Name: Names.uniqueId(ns),
    Workspace: resources.stack.resolve(resources.workspace.workspaceArn),
  });
  expect(configuration.ruleGroups).toStrictEqual([
    ruleGroup,
  ]);
});

test('rending a configuration with no rule groups should fail validation', () => {
  const resources = getDefaultWorkspace();

  const configuration = new RuleGroupConfiguration(resources.stack, 'configuration');

  new RuleGroupsNamespace(resources.stack, 'namespace', {
    configuration: configuration,
    workspace: resources.workspace,
  });

  expect(configuration.node.validate()).toStrictEqual([[
    'A rule group configuration must contain at least one rule group.',
    'To add rule groups to a rule group configuration call the',
    '`addRuleGroup` method.',
  ].join(' ')]);
});