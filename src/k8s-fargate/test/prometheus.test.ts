import { ArnFormat, Names, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { Prometheus } from '..';
import { Workspace } from '../../aps';


test('there should be a helm chart for installing external secrets', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const prometheus = new Prometheus(stack, 'prometheus', {
    cluster: resources.cluster,
    workspace: resources.workspace,
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Chart: Prometheus.CHART_NAME,
    Namespace: Prometheus.DEFAULT_NAMESPACE,
    Repository: Prometheus.CHART_REPOSITORY,
    Values: Match.serializedJson(Match.objectLike({
      'alertmanager': {
        enabled: false,
      },
      'kube-state-metrics': {
        customLabels: {
          'cdk-service-node': Names.uniqueId(prometheus),
        },
      },
      'prometheus-pushgateway': {
        podLabels: {
          'cdk-service-node': Names.uniqueId(prometheus),
        },
      },
      'prometheus-node-exporter': {
        enabled: false,
      },
      'server': {
        persistentVolume: {
          enabled: false,
        },
        podLabels: {
          'cdk-service-node': Names.uniqueId(prometheus),
        },
        remoteWrite: [{
          queue_config: {
            capacity: 2500,
            max_samples_per_send: 1000,
            max_shards: 200,
          },
          url: 'https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-1234567890/api/v1/remote_write',
        }],
      },
      'serviceAccounts': {
        server: {
          create: false,
          name: prometheus.serviceAccount.serviceAccountName,
        },
      },
    })),
  });
});

test('resource should respect passed optional configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  new Prometheus(stack, 'prometheus', {
    cluster: resources.cluster,
    namespace: 'test-namespace',
    queueConfiguration: {
      capacity: 5000,
      maxSamplesPerSend: 2000,
      maxShards: 400,
    },
    serviceAccountName: 'prometheus-service-account',
    workspace: resources.workspace,
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Namespace: 'test-namespace',
    Values: Match.serializedJson(Match.objectLike({
      server: {
        remoteWrite: [{
          queue_config: {
            capacity: 5000,
            max_samples_per_send: 2000,
            max_shards: 400,
          },
        }],
      },
      serviceAccounts: {
        server: {
          name: 'prometheus-service-account',
        },
      },
    })),
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
  const workspace = Workspace.fromWorkspaceAttributes(stack, 'workspace', {
    workspaceArn: stack.formatArn({
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      partition: 'aws',
      resource: 'workspace',
      resourceName: 'ws-1234567890',
      service: 'aps',
    }),
    workspaceId: 'ws-1234567890',
    workspacePrometheusEndpoint: 'https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-1234567890/',
  });

  return {
    stack,
    cluster,
    workspace,
  };
}