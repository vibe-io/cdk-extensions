import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { Match } from '../src/asserts';
import { AdotCollector } from '../src/k8s-aws';


describe('basic-usage', () => {
  test('creating an adot-collector should add the manifest to the template', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    new AdotCollector(stack, 'adot-collector', {
      cluster: resources.cluster,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: AdotCollector.DEFAULT_NAMESPACE,
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'adot-collector-config',
            namespace: AdotCollector.DEFAULT_NAMESPACE,
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: 'adot-collector-service',
            namespace: AdotCollector.DEFAULT_NAMESPACE,
          },
        }),
        Match.objectLike({
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          metadata: {
            name: 'adot-collector',
            namespace: AdotCollector.DEFAULT_NAMESPACE,
          },
        }),
      ])),
    });
  });

  test('all properties should result in a change to the output manifest', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    new AdotCollector(stack, 'adot-collector', {
      cluster: resources.cluster,
      namespace: 'test-namespace',
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'test-namespace',
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'adot-collector-config',
            namespace: 'test-namespace',
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: 'adot-collector-service',
            namespace: 'test-namespace',
          },
        }),
        Match.objectLike({
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          metadata: {
            name: 'adot-collector',
            namespace: 'test-namespace',
          },
        }),
      ])),
    });
  });

  test('setting createNamespace to false should not add the namespace to the manifest', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const collector = new AdotCollector(stack, 'adot-collector', {
      cluster: resources.cluster,
      createNamespace: false,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.not(Match.arrayWith([
        Match.objectLike({
          kind: 'Namespace',
        }),
      ]))),
      PruneLabel: `aws.cdk.eks/prune-${collector.manifest.node.addr}`,
    });
  });
});

function getCommonResources(): any {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });
  const cluster = new FargateCluster(stack, 'cluster', {
    version: KubernetesVersion.V1_21,
  });
  const vpc = cluster.vpc;

  return {
    stack,
    cluster,
    vpc,
  };
}