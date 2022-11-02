import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { FargateLogger, FluentBitCloudWatchLogsOutput } from '../src/k8s-aws';


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
      new FluentBitCloudWatchLogsOutput({
        logGroup: logGroup,
      }),
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