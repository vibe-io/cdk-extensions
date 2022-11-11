import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { FargateCluster, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Match } from '../src/asserts';
import { Echoserver } from '../src/k8s-aws';
import { DomainDiscovery, Domains } from '../src/route53';


describe('basic usage', () => {
  test('creating an echoserver should add the manifest to the stack', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
    });
    const serviceSecurityGroup = server.node.findChild('service-security-group') as SecurityGroup;

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'vpcresources.k8s.aws/v1beta1',
          kind: 'SecurityGroupPolicy',
          spec: {
            podSelector: {
              matchLabels: {
                app: Echoserver.DEFAULT_NAME,
              },
            },
            securityGroups: {
              groupIds: [
                stack.resolve(serviceSecurityGroup.securityGroupId),
              ],
            },
          },
        }),
        Match.objectLike({
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            labels: {
              app: Echoserver.DEFAULT_NAME,
            },
            name: Echoserver.DEFAULT_NAME,
            namespace: Echoserver.DEFAULT_NAMESPACE,
          },
          spec: {
            replicas: Echoserver.DEFAULT_REPLICAS,
            selector: {
              matchLabels: {
                app: Echoserver.DEFAULT_NAME,
              },
            },
            template: {
              metadata: {
                labels: {
                  app: Echoserver.DEFAULT_NAME,
                },
              },
              spec: {
                containers: [
                  Match.objectLike({
                    image: `${Echoserver.DEFAULT_REPOSITORY}:${Echoserver.DEFAULT_TAG}`,
                    name: Echoserver.DEFAULT_NAME,
                    ports: [
                      {
                        containerPort: 8080,
                      },
                    ],
                  }),
                ],
              },
            },
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            annotations: {
              'alb.ingress.kubernetes.io/target-type': 'ip',
            },
            name: Echoserver.DEFAULT_NAME,
            namespace: Echoserver.DEFAULT_NAMESPACE,
          },
          spec: {
            ports: [
              {
                port: Echoserver.DEFAULT_PORT,
                protocol: 'TCP',
                targetPort: 8080,
              },
            ],
            selector: {
              app: Echoserver.DEFAULT_NAME,
            },
            type: 'NodePort',
          },
        }),
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'alb.ingress.kubernetes.io/listen-ports': stack.resolve(stack.toJsonString([{ HTTP: Echoserver.DEFAULT_PORT }])),
              'alb.ingress.kubernetes.io/scheme': 'internet-facing',
              'alb.ingress.kubernetes.io/security-groups': stack.resolve(server.connections.securityGroups[0].securityGroupId),
              'alb.ingress.kubernetes.io/subnets': stack.resolve(resources.vpc.selectSubnets(Echoserver.DEFAULT_LOAD_BALANCER_SUBNETS).subnetIds.join(', ')),
              'external-dns.alpha.kubernetes.io/hostname': Match.absent(),
              'kubernetes.io/ingress.class': 'alb',
            },
            name: Echoserver.DEFAULT_NAME,
            namespace: Echoserver.DEFAULT_NAMESPACE,
          },
          spec: {
            rules: [
              {
                http: {
                  paths: [
                    {
                      backend: {
                        service: {
                          name: Echoserver.DEFAULT_NAME,
                          port: {
                            number: Echoserver.DEFAULT_PORT,
                          },
                        },
                      },
                      path: '/',
                      pathType: 'Prefix',
                    },
                  ],
                },
              },
            ],
          },
        }),
      ])),
    });
  });

  test('all properties should result in a change to the output manifest', () => {
    const resources = getCommonResources();
    const stack = resources.stack;

    const subnets = {
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      onePerAz: true,
    };
    const securityGroup = new SecurityGroup(stack, 'security-group', {
      vpc: resources.vpc,
    });
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      loadBalancerSubnets: subnets,
      name: 'test-server',
      namespace: 'test-namespace',
      port: 3838,
      replicas: 3,
      securityGroups: [
        securityGroup,
      ],
      tag: 'latest',
    });
    const serviceSecurityGroup = server.node.findChild('service-security-group') as SecurityGroup;

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'vpcresources.k8s.aws/v1beta1',
          kind: 'SecurityGroupPolicy',
          spec: {
            podSelector: {
              matchLabels: {
                app: 'test-server',
              },
            },
            securityGroups: {
              groupIds: [
                stack.resolve(serviceSecurityGroup.securityGroupId),
              ],
            },
          },
        }),
        Match.objectLike({
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            labels: {
              app: 'test-server',
            },
            name: 'test-server',
            namespace: 'test-namespace',
          },
          spec: {
            replicas: 3,
            selector: {
              matchLabels: {
                app: 'test-server',
              },
            },
            template: {
              metadata: {
                labels: {
                  app: 'test-server',
                },
              },
              spec: {
                containers: [
                  Match.objectLike({
                    image: `${Echoserver.DEFAULT_REPOSITORY}:latest`,
                    name: 'echoserver',
                  }),
                ],
              },
            },
          },
        }),
        Match.objectLike({
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: 'test-server',
            namespace: 'test-namespace',
          },
          spec: {
            ports: [
              {
                port: 3838,
                protocol: 'TCP',
                targetPort: 8080,
              },
            ],
            selector: {
              app: 'test-server',
            },
            type: 'NodePort',
          },
        }),
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'alb.ingress.kubernetes.io/listen-ports': stack.resolve(stack.toJsonString([{ HTTP: 3838 }])),
              'alb.ingress.kubernetes.io/security-groups': stack.resolve(securityGroup.securityGroupId),
              'alb.ingress.kubernetes.io/subnets': stack.resolve(resources.vpc.selectSubnets(subnets).subnetIds.join(', ')),
            },
            name: 'test-server',
            namespace: 'test-namespace',
          },
          spec: {
            rules: [
              {
                http: {
                  paths: [
                    {
                      backend: {
                        service: {
                          name: 'test-server',
                          port: {
                            number: 3838,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        }),
      ])),
    });
  });
});

describe('domain association', () => {
  test('registering a public domain should result in alb hostname annotation', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test.example.com',
    }), true);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': `${Echoserver.DEFAULT_NAME}.test.example.com`,
            },
          },
        }),
      ])),
    });
  });

  test('registering a private domain should not result in alb hostname annotation', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test.example.com',
    }), false);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': Match.absent(),
            },
          },
        }),
      ])),
    });
  });

  test('registering multiple public domains should result in a comma delimited list', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test1.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test2.example.com',
    }), true);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': `${Echoserver.DEFAULT_NAME}.test1.example.com,${Echoserver.DEFAULT_NAME}.test2.example.com`,
            },
          },
        }),
      ])),
    });
  });

  test('registered private domains should not appear in list by default', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public1.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private1.example.com',
    }), false);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public2.example.com',
    }), true);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': `${Echoserver.DEFAULT_NAME}.public1.example.com,${Echoserver.DEFAULT_NAME}.public2.example.com`,
            },
          },
        }),
      ])),
    });
  });

  test('setting a custom subdomain should be correctly reflected', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      subdomain: 'test-subdomain',
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test.example.com',
    }), true);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': 'test-subdomain.test.example.com',
            },
          },
        }),
      ])),
    });
  });

  test('setting domain root as the subdomain should result in no subdomain', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      subdomain: Domains.ROOT,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'hosted-zone', {
      hostedZoneId: '1234567890123456',
      zoneName: 'test.example.com',
    }), true);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': 'test.example.com',
            },
          },
        }),
      ])),
    });
  });

  test('setting domain discovery to all should result in all domains being reflected', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      domainDiscovery: DomainDiscovery.ALL,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public1.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public2.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private1.example.com',
    }), false);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private2.example.com',
    }), false);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': `${Echoserver.DEFAULT_NAME}.public1.example.com,${Echoserver.DEFAULT_NAME}.public2.example.com,${Echoserver.DEFAULT_NAME}.private1.example.com,${Echoserver.DEFAULT_NAME}.private2.example.com`,
            },
          },
        }),
      ])),
    });
  });

  test('setting domain discovery to private should result in only private domains being reflected', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      domainDiscovery: DomainDiscovery.PRIVATE,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public1.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public2.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private1.example.com',
    }), false);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private2.example.com',
    }), false);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': `${Echoserver.DEFAULT_NAME}.private1.example.com,${Echoserver.DEFAULT_NAME}.private2.example.com`,
            },
          },
        }),
      ])),
    });
  });

  test('setting domain discovery to none should disable domain configuration', () => {
    const resources = getCommonResources();
    const stack = resources.stack;
    const server = new Echoserver(stack, 'echoserver', {
      cluster: resources.cluster,
      domainDiscovery: DomainDiscovery.NONE,
    });

    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public1.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'public-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'public2.example.com',
    }), true);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-1', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private1.example.com',
    }), false);
    Domains.of(server).add(HostedZone.fromHostedZoneAttributes(stack, 'private-hosted-zone-2', {
      hostedZoneId: '1234567890123456',
      zoneName: 'private2.example.com',
    }), false);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      ClusterName: stack.resolve(resources.cluster.clusterName),
      Manifest: Match.joinedJson(Match.arrayWith([
        Match.objectLike({
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            annotations: {
              'external-dns.alpha.kubernetes.io/hostname': Match.absent(),
            },
          },
        }),
      ])),
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