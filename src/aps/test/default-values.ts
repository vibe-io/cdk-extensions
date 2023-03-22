import { readFileSync } from 'fs';
import { Stack } from 'aws-cdk-lib';
import { AlertingRuleProps, RecordingRuleProps, RuleGroupsNamespace, Workspace } from '..';


export const getDefaultRuleGroup = () => {
  const inherit = getDefaultRuleGroupsNamespace();
  const ruleGroup = inherit.ns.addRuleGroup('test-group');

  return {
    ...inherit,
    ruleGroup,
  };
};

export const getDefaultRuleGroupsNamespace = () => {
  const inherit = getDefaultWorkspace();
  const ns = new RuleGroupsNamespace(inherit.workspace, 'namespace', {
    workspace: inherit.workspace,
  });

  return {
    ...inherit,
    ns,
  };
};

export const getDefaultStack = () => {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  return {
    stack,
  };
};

export const getDefaultWorkspace = () => {
  const inherit = getDefaultStack();
  const workspace = new Workspace(inherit.stack, 'workspace');

  return {
    ...inherit,
    workspace,
  };
};

export const rulesFilePath = './src/aps/test/configs/rules.yaml';
export const rulesContent = readFileSync(rulesFilePath, {
  encoding: 'utf8',
  flag: 'r',
});
export const defaultAlertingRuleProps: AlertingRuleProps = {
  alert: 'metric:alerting_rule',
  expression: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
};
export const defaultRecordingRuleProps: RecordingRuleProps = {
  expression: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
  record: 'metric:recording_rule',
};