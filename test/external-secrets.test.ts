import { ArnFormat, CfnResource, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, HelmChart, KubernetesManifest, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ExternalSecretsOperator } from '../src/k8s-aws';
import { AwsSecretStore } from '../src/k8s-aws/aws-secret-store';


test('there should be a helm chart for installing external secrets', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Chart: 'external-secrets',
  });
});

test('the secret store should depend on the helm chart', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const template = Template.fromStack(stack);

  template.hasResource('Custom::AWSCDK-EKS-KubernetesResource', {
    DependsOn: Match.arrayWith([
      stack.resolve(getHelmLogicalId(resources.provider.helmChart)),
    ]),
    Properties: {
      PruneLabel: `aws.cdk.eks/prune-${resources.store.manifest.node.addr}`,
    },
  });
});

test('the kubernetes external secret resource should depend on the secret store', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const template = Template.fromStack(stack);

  template.hasResource('Custom::AWSCDK-EKS-KubernetesResource', {
    DependsOn: Match.arrayWith([
      stack.resolve(getManifestLogicalId(resources.store.manifest)),
    ]),
    Properties: {
      PruneLabel: `aws.cdk.eks/prune-${resources.eSecret.manifest.node.addr}`,
    },
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
  const provider = new ExternalSecretsOperator(stack, 'provider', {
    cluster: cluster,
  });
  const smSecret = Secret.fromSecretCompleteArn(stack, 'sm-secret', stack.formatArn({
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    resource: 'secret',
    resourceName: 'test-secret',
    service: 'secretsmanager',
  }));
  const eSecret = provider.registerSecretsManagerSecret('external-secret', smSecret);
  const store = (provider.node.findChild('store::default::secrets-manager') as AwsSecretStore);

  return {
    stack,
    cluster,
    provider,
    smSecret,
    eSecret,
    store,
  };
}

function getHelmLogicalId(chart: HelmChart): string | undefined {
  return (chart.node.defaultChild?.node.defaultChild as CfnResource)?.logicalId;
}

function getManifestLogicalId(manifest: KubernetesManifest): string | undefined {
  return (manifest.node.defaultChild as CfnResource)?.logicalId;
}