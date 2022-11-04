import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { FargateLogger, FluentBitCloudWatchLogsOutput, FluentBitFilter, FluentBitMatch, FluentBitOutput, FluentBitParser } from '../src/k8s-aws';


test('when create log group is passed Fargate Profiles should have logs:CreateLogGroup permission', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const logGroup = LogGroup.fromLogGroupName(stack, 'log-group', 'test-log-group');
  new FargateLogger(stack, 'fargate-logger', {
    cluster: resources.cluster,
    fargateProfiles: [
      resources.cluster.defaultProfile,
    ],
    outputs: [
      new FluentBitCloudWatchLogsOutput({
        autoCreateGroup: true,
        logGroup: logGroup,
      }),
    ],
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: Match.arrayWith([
            'logs:CreateLogGroup',
          ]),
        }),
      ]),
    },
    Roles: Match.arrayWith([
      stack.resolve(resources.cluster.defaultProfile.podExecutionRole.roleName),
    ]),
  });
});

test('when create log group is not passed Fargate Profiles should not have logs:CreateLogGroup permission', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const logGroup = LogGroup.fromLogGroupName(stack, 'log-group', 'test-log-group');
  new FargateLogger(stack, 'fargate-logger', {
    cluster: resources.cluster,
    fargateProfiles: [
      resources.cluster.defaultProfile,
    ],
    outputs: [
      FluentBitOutput.cloudwatchLogs(FluentBitMatch.ALL, logGroup)
    ],
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.not(Match.arrayWith([
        Match.objectLike({
          Action: Match.arrayWith([
            'logs:CreateLogGroup',
          ]),
        }),
      ])),
    },
    Roles: Match.arrayWith([
      stack.resolve(resources.cluster.defaultProfile.podExecutionRole.roleName),
    ]),
  });
});

test('when a parser filter is added it should register its parsers with the logging configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const logGroup = LogGroup.fromLogGroupName(stack, 'log-group', 'test-log-group');
  new FargateLogger(stack, 'fargate-logger', {
    cluster: resources.cluster,
    fargateProfiles: [
      resources.cluster.defaultProfile,
    ],
    filters: [
      FluentBitFilter.parser(
        FluentBitMatch.ALL,
        'log',
        FluentBitParser.regex('crio', '^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>P|F) (?<log>.*)$')
      )
    ],
    outputs: [
      FluentBitOutput.cloudwatchLogs(FluentBitMatch.ALL, logGroup)
    ],
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
    Manifest: Match.serializedJson(Match.arrayWith([
      Match.objectLike({
        kind: 'ConfigMap',
        data: {
          'filters.conf': Match.stringLikeRegexp('\\s+Name parser\\n(.*\\n)*\\s+Parser crio'),
          'parsers.conf': Match.stringLikeRegexp('\\s+Name crio')
        }
      })
    ])),
  });
});

function getCommonResources() {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });
  const cluster = new FargateCluster(stack, 'cluster', {
    version: KubernetesVersion.V1_21,
  });

  return {
    stack,
    cluster,
  };
}

