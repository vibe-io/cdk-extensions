import { ArnFormat, Fn, Lazy, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Workspace } from '..';

test ('creating an APS workspace should add it to the CloudFormation stack', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const workspace = new Workspace(stack, 'workspace');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::APS::Workspace', {
    AlertManagerDefinition: Match.anyValue(),
    LoggingConfiguration: {
      LogGroupArn: stack.resolve(workspace.logGroup?.logGroupArn),
    },
  });
});

describe('imports', () => {
  test ('import workspace using attributes', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const name = 'test-workspace';
    const arn = 'test-arn';
    const endpoint = 'test-endpoint';
    const workspace = Workspace.fromWorkspaceAttributes(stack, 'import', {
      workspaceArn: arn,
      workspaceId: name,
      workspacePrometheusEndpoint: endpoint,
    });

    expect(stack.resolve(workspace.workspaceArn)).toBe(arn);
    expect(stack.resolve(workspace.workspaceId)).toBe(name);
    expect(stack.resolve(workspace.workspacePrometheusEndpoint)).toBe(endpoint);
  });

  test ('import workspace using arn', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const name = 'test-workspace';
    const arn = stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      partition: 'aws',
      resource: 'workspace',
      resourceName: name,
      service: 'aps',
    });
    const endpoint = `https://aps-workspaces.${stack.region}.amazonaws.${stack.urlSuffix}/workspaces/${name}/`;
    const workspace = Workspace.fromWorkspaceArn(stack, 'import', arn);

    expect(stack.resolve(workspace.workspaceArn)).toBe(arn);
    expect(stack.resolve(workspace.workspaceId)).toBe(name);
    expect(stack.resolve(workspace.workspacePrometheusEndpoint)).toStrictEqual(stack.resolve(endpoint));
  });

  test ('import workspace using id', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const name = 'test-workspace';
    const arn = stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resource: 'workspace',
      resourceName: name,
      service: 'aps',
    });
    const endpoint = `https://aps-workspaces.${stack.region}.amazonaws.${stack.urlSuffix}/workspaces/${name}/`;
    const workspace = Workspace.fromWorkspaceId(stack, 'import', arn);

    expect(stack.resolve(workspace.workspaceArn)).toStrictEqual(stack.resolve(arn));
    expect(stack.resolve(workspace.workspaceId)).toBe(name);
    expect(stack.resolve(workspace.workspacePrometheusEndpoint)).toStrictEqual(stack.resolve(endpoint));
  });

  test ('import workspace using prometheus endpoint string', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const name = 'test-workspace';
    const arn = stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resource: 'workspace',
      resourceName: name,
      service: 'aps',
    });
    const endpoint = stack.resolve(`https://aps-workspaces.${stack.region}.amazonaws.com/workspaces/${name}/`);
    const workspace = Workspace.fromWorkspaceAttributes(stack, 'import', {
      workspacePrometheusEndpoint: endpoint,
    });

    expect(stack.resolve(workspace.workspaceArn)).toStrictEqual(stack.resolve(arn));
    expect(stack.resolve(workspace.workspaceId)).toBe(name);
    expect(workspace.workspacePrometheusEndpoint).toBe(endpoint);
  });

  test ('import workspace using prometheus endpoint token', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const endpoint = Lazy.string({
      produce: () => {
        return `https://aps-workspaces.${stack.region}.amazonaws.com/workspaces/test-workspace/`;
      },
    });
    const name = Fn.select(4, Fn.split('/', endpoint));
    const arn = stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resource: 'workspace',
      resourceName: name,
      service: 'aps',
    });
    const workspace = Workspace.fromWorkspaceAttributes(stack, 'import', {
      workspacePrometheusEndpoint: endpoint,
    });

    expect(stack.resolve(workspace.workspaceArn)).toStrictEqual(stack.resolve(arn));
    expect(stack.resolve(workspace.workspaceId)).toStrictEqual(stack.resolve(name));
    expect(stack.resolve(workspace.workspacePrometheusEndpoint)).toBe(stack.resolve(endpoint));
  });
});

describe('logging', () => {
  test ('setting logging to disabled should disable logging', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    new Workspace(stack, 'workspace', {
      logging: {
        enabled: false,
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::APS::Workspace', {
      AlertManagerDefinition: Match.anyValue(),
      LoggingConfiguration: Match.absent(),
    });
  });

  test ('specifying a custom log retention should set default log group accordingly', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    new Workspace(stack, 'workspace', {
      logging: {
        retention: RetentionDays.ONE_YEAR,
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 365,
    });
  });

  test ('providing a custom log group should change the logging destination', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const logGroup = LogGroup.fromLogGroupName(stack, 'log-group', 'test-log-group');
    new Workspace(stack, 'workspace', {
      logging: {
        logGroup: logGroup,
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::APS::Workspace', {
      AlertManagerDefinition: Match.anyValue(),
      LoggingConfiguration: {
        LogGroupArn: stack.resolve(logGroup.logGroupArn),
      },
    });
  });

  test ('importing workspace with no identity attributes should throw error', () => {
    const resources = getCommonResources();
    const stack = resources.stack;

    expect(() => {
      Workspace.fromWorkspaceAttributes(stack, 'workspace', {});
    }).toThrowError([
      "At least one of 'workspaceId', 'workspaceArn', or",
      "'workspacePrometheusEndpoint' must be spacified when importing a",
      'Prometheus workspace.',
    ].join(' '));
  });
});

describe('alerting', () => {
  test('setting alerting to false should disable alerting', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const workspace = new Workspace(stack, 'workspace', {
      alerting: {
        enabled: false,
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::APS::Workspace', {
      AlertManagerDefinition: Match.absent(),
      LoggingConfiguration: {
        LogGroupArn: stack.resolve(workspace.logGroup?.logGroupArn),
      },
    });
  });
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