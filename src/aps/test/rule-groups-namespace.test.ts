import { ArnFormat, Names, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { defaultRecordingRuleProps, rulesContent, rulesFilePath } from './default-values';
import { PrometheusRule, RuleGroupConfiguration, RuleGroupsNamespace, Workspace } from '..';


test('creating an APS rule groups namespace should add it to the CloudFormation stack', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const ns = new RuleGroupsNamespace(stack, 'namespace', {
    configuration: RuleGroupConfiguration.fromRulesFile(stack, 'configuration', rulesFilePath),
    workspace: resources.workspace,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: rulesContent,
    Name: Names.uniqueId(ns),
    Workspace: stack.resolve(resources.workspace.workspaceArn),
  });
});

test('specified optional arguments should be reflected in the namespace', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  new RuleGroupsNamespace(stack, 'namespace', {
    configuration: RuleGroupConfiguration.fromRulesFile(stack, 'configuration', rulesFilePath),
    name: 'test-namespace',
    workspace: resources.workspace,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: rulesContent,
    Name: 'test-namespace',
    Workspace: stack.resolve(resources.workspace.workspaceArn),
  });
});

test('can add rule groups via namespace when building a configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const ns = new RuleGroupsNamespace(stack, 'namespace', {
    workspace: resources.workspace,
  });
  const group = ns.addRuleGroup('test-group', {
    rules: [
      PrometheusRule.recordingRule(defaultRecordingRuleProps),
    ],
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: JSON.stringify({
      groups: [{
        name: Names.uniqueId(group),
        rules: [{
          expr: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
          record: 'metric:recording_rule',
        }],
      }],
    }),
    Name: Names.uniqueId(ns),
    Workspace: stack.resolve(resources.workspace.workspaceArn),
  });
});

test('adding a rule group for a namespace with an imported configuration should throw an error', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const ns = new RuleGroupsNamespace(stack, 'namespace', {
    configuration: RuleGroupConfiguration.fromRulesFile(stack, 'configuration', rulesFilePath),
    workspace: resources.workspace,
  });

  expect(() => {
    ns.addRuleGroup('test-group');
  }).toThrowError([
    'Cannot add rule groups to namespaces that are using an imported or',
    'custom rule group configuration.',
  ].join(' '));
});

describe('imports', () => {
  test ('import rule groups namespace using arn', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const workspaceName = 'test-workspace';
    const name = 'test-rule-groups-namespace';
    const arn = stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      partition: 'aws',
      resource: 'rulegroupsnamespace',
      resourceName: `${workspaceName}/${name}`,
      service: 'aps',
    });
    const ns = RuleGroupsNamespace.fromRuleGroupsNamespaceArn(stack, 'namespace', arn);

    expect(stack.resolve(ns.rulesGroupsNamespaceArn)).toBe(arn);
  });
});

function getCommonResources() {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });
  const workspace = new Workspace(stack, 'workspace');

  return {
    stack,
    workspace,
  };
}