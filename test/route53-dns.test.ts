import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { ExternalDnsLogFormat, ExternalDnsLogLevel, ExternalDnsRegistry, ExternalDnsSyncPolicy, ExternalDnsZoneType, Route53Dns, TxtRegistry } from '../src/k8s-aws';

test('creating an external dns resource should add the Helm chart', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const provider = new Route53Dns(stack, 'route53-dns', {
    cluster: resources.cluster,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Chart: Route53Dns.CHART_NAME,
    Namespace: Route53Dns.DEFAULT_NAMESPACE,
    Repository: Route53Dns.CHART_REPOSITORY,
    Values: Match.serializedJson(Match.objectLike({
      policy: 'sync',
      provider: 'aws',
      registry: 'txt',
      serviceAccount: {
        create: false,
        name: provider.serviceAccount.serviceAccountName,
      },
      txtOwnerId: provider.node.addr,
      txtPrefix: 'edns.',
    })),
  });
});

test('all input values should be present in generated configuration', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const provider = new Route53Dns(stack, 'route53-dns', {
    apiRetries: 10,
    batchChangeSize: 500,
    cluster: resources.cluster,
    domainFilter: [
      'test1.example.com',
    ],
    evaluateTargetHealth: true,
    logFormat: ExternalDnsLogFormat.TEXT,
    logLevel: ExternalDnsLogLevel.DEBUG,
    namespace: 'custom-namespace',
    preferCname: true,
    recordOwnershipRegistry: ExternalDnsRegistry.txt({
      ownerId: 'test-owner',
      prefix: 'test.',
    }),
    region: 'us-east-2',
    replicaCount: 3,
    syncPolicy: ExternalDnsSyncPolicy.UPSERT_ONLY,
    zoneTags: [
      {
        key: 'key1',
        value: 'value1',
      },
      {
        key: 'key2',
        value: 'value2',
      },
    ],
    zoneType: ExternalDnsZoneType.PUBLIC,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Chart: Route53Dns.CHART_NAME,
    Namespace: 'custom-namespace',
    Repository: Route53Dns.CHART_REPOSITORY,
    Values: Match.serializedJson(Match.objectLike({
      aws: {
        apiRetries: 10,
        batchChangeSize: 500,
        evaluateTargetHealth: true,
        preferCNAME: true,
        region: 'us-east-2',
        zoneTags: [
          'key1=value1',
          'key2=value2',
        ],
        zoneType: 'public',
      },
      domainFilters: [
        'test1.example.com',
      ],
      logFormat: 'text',
      logLevel: 'debug',
      policy: 'upsert-only',
      provider: 'aws',
      registry: 'txt',
      replicaCount: 3,
      serviceAccount: {
        create: false,
        name: provider.serviceAccount.serviceAccountName,
      },
      txtOwnerId: 'test-owner',
      txtPrefix: 'test.',
    })),
  });
});

test('using txt registry with no input results in the default options', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const provider = new Route53Dns(stack, 'route53-dns', {
    cluster: resources.cluster,
    recordOwnershipRegistry: new TxtRegistry(),
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Values: Match.serializedJson(Match.objectLike({
      registry: 'txt',
      txtOwnerId: provider.node.addr,
      txtPrefix: 'edns.',
    })),
  });
});

test('using txt prefix escape hatch disables ownership txt record prefixing', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const provider = new Route53Dns(stack, 'route53-dns', {
    cluster: resources.cluster,
    recordOwnershipRegistry: ExternalDnsRegistry.txt({
      prefix: TxtRegistry.NO_PREFIX,
    }),
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Values: Match.serializedJson(Match.objectLike({
      registry: 'txt',
      txtOwnerId: provider.node.addr,
      txtPrefix: Match.absent(),
    })),
  });
});

test('using service discovery registry should add cloud map permissions', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  const provider = new Route53Dns(stack, 'route53-dns', {
    cluster: resources.cluster,
    recordOwnershipRegistry: ExternalDnsRegistry.awsServiceDiscovery(),
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: Match.arrayWith([
          'servicediscovery:*',
        ]),
        Effect: 'Allow',
        Resource: '*',
      })]),
    },
    Roles: [
      stack.resolve(provider.serviceAccount.role.roleName),
    ],
  });

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Values: Match.serializedJson(Match.objectLike({
      registry: 'aws-sd',
      txtOwnerId: Match.absent(),
      txtPrefix: Match.absent(),
    })),
  });
});

test('using a noop registry disables record ownership validation', () => {
  const resources = getCommonResources();
  const stack = resources.stack;
  new Route53Dns(stack, 'route53-dns', {
    cluster: resources.cluster,
    recordOwnershipRegistry: ExternalDnsRegistry.noop(),
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
    Values: Match.serializedJson(Match.objectLike({
      registry: 'noop',
      txtOwnerId: Match.absent(),
      txtPrefix: Match.absent(),
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

  return {
    stack,
    cluster,
  };
}