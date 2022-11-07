import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, Port, SecurityGroup, SubnetSelection, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import { Domain, DomainDiscovery, Domains, IDnsResolvable } from '../route53/domain-aspect';


/**
 * Configuration for the Echoserver resource.
 */
export interface EchoserverProps extends ResourceProps {
  /**
     * The EKS Cluster where the service should be deployed.
     */
  readonly cluster: ICluster;

  /**
   * Determines the behavior of automatic DNS discovery and configuration.
   *
   * @default DomainDiscovery.PUBLIC
   */
  readonly domainDiscovery?: DomainDiscovery;

  /**
   * The subnets where the load balancer should be created.
   */
  readonly loadBalancerSubnets?: SubnetSelection;

  /**
   * The name of the Kubernetes service to be created.
   *
   * @default 'echoserver'
   */
  readonly name?: string;

  /**
   * The Kubernetes namespace where the service should be created.
   *
   * @default 'default'
   */
  readonly namespace?: string;

  /**
   * The port which netcat should listen on.
   *
   * @default 3838
   */
  readonly port?: number;

  /**
   * The number of replicas that should exist.
   *
   * @default 1
   */
  readonly replicas?: number;

  /**
   * The Security groups which should be applied to the service.
   */
  readonly securityGroups?: ISecurityGroup[];

  /**
   * A subdomain that should be prefixed to the beginning of all registered
   * domains.
   */
  readonly subdomain?: string;

  /**
   * The Docker tag specifying the version of echoserver to use.
   *
   * @see [Google echoserver image repository](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/echoserver)
   */
  readonly tag?: string;
}

/**
 * Creates a simple Kubernetes test service using the Google echoserver test
 * image.
 *
 * The server listens for incoming web requests and echos the details of the
 * request back to the user. Each request results in output being written to
 * the Docker log providing a convenient way to test logging setup.
 *
 * @see [Google echoserver image repository](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/echoserver)
 */
export class Echoserver extends Resource implements IConnectable, IDnsResolvable {
  /**
   * The default setting controlling how automatic DNS configuration should
   * behave if none is provided as input.
   */
  public static readonly DEFAULT_DOMAIN_DISCOVERY: DomainDiscovery = DomainDiscovery.PUBLIC;

  /**
   * Default subnet selection that will be used if none is provided as input.
   */
  public static readonly DEFAULT_LOAD_BALANCER_SUBNETS: SubnetSelection = {
    onePerAz: true,
    subnetType: SubnetType.PUBLIC,
  };

  /**
   * Default name of the Kubernetes service that will be created if none is
   * provided as input.
   */
  public static readonly DEFAULT_NAME: string = 'echoserver';

  /**
   * Default Kubernetes namespace where the service will be created if none is
   * provided as input.
   */
  public static readonly DEFAULT_NAMESPACE: string = 'default';

  /**
   * Default port where the service will be accessible if none is provided as
   * input.
   */
  public static readonly DEFAULT_PORT: number = 80;

  /**
   * Default number of replicas that should be running is none is provided as
   * input.
   */
  public static readonly DEFAULT_REPLICAS: number = 1;

  /**
   * The Docker repository where the echoserver image will be pulled from.
   */
  public static readonly DEFAULT_REPOSITORY: string = 'gcr.io/google_containers/echoserver';

  /**
   * The default Docker tag of the image to use if none is provided as input.
   */
  public static readonly DEFAULT_TAG: string = '1.10';

  /**
   * Internal collection of domain objects that should be used for configuring
   * DNS resolution.
   */
  public readonly _domains: Domain[];

  /**
   * The EKS Cluster where the service should be deployed.
   *
   * @group Inputs
   */
  public readonly cluster: ICluster;

  /**
   * The subnets where the load balancer should be created..
   *
   * @group Inputs
   */
  readonly loadBalancerSubnets: SubnetSelection;

  /**
   * The name of the Kubernetes service to be created.
   *
   * @group Inputs
   */
  public readonly name: string;

  /**
   * The Kubernetes namespace where the service should be created.
   *
   * @group Inputs
   */
  public readonly namespace: string;

  /**
   * The port which netcat should listen on.
   *
   * @group Inputs
   */
  public readonly port: number;

  /**
   * The number of replicas that should exist.
   *
   * @group Inputs
   */
  public readonly replicas: number;

  /**
   * A subdomain that should be prefixed to the beginning of all registered
   * domains.
   */
  readonly subdomain?: string;

  /**
   * The Docker tag specifying the version of echoserver to use.
   *
   * @see [Google echoserver image repository](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/echoserver)
   *
   * @group Inputs
   */
  readonly tag: string;

  /**
   * The Kubernetes manifest that creates the ConfigMap that Fargate uses to
   * configure logging.
   *
   * @group Resources
   */
  public readonly manifest: KubernetesManifest;

  /**
   * Access for network connections.
   *
   * @group IConnectable
   */
  public readonly connections: Connections;

  /**
   * Determines the behavior of automatic DNS discovery and configuration.
   *
   * @group IDnsResolvable
   */
  public readonly domainDiscovery: DomainDiscovery;


  /**
   * Creates a new instance of the Echoserver class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: EchoserverProps) {
    super(scope, id, {
      ...props,
    });

    this._domains = [];

    this.cluster = props.cluster;
    this.domainDiscovery = props.domainDiscovery ?? Echoserver.DEFAULT_DOMAIN_DISCOVERY;
    this.loadBalancerSubnets = props.loadBalancerSubnets ?? Echoserver.DEFAULT_LOAD_BALANCER_SUBNETS;
    this.name = props.name ?? Echoserver.DEFAULT_NAME;
    this.namespace = props.namespace ?? Echoserver.DEFAULT_NAMESPACE;
    this.port = props.port ?? Echoserver.DEFAULT_PORT;
    this.replicas = props.replicas ?? Echoserver.DEFAULT_REPLICAS;
    this.subdomain = props.subdomain !== Domains.ROOT ? (props.subdomain ?? this.name) : undefined;
    this.tag = props.tag ?? Echoserver.DEFAULT_TAG;

    this.connections = new Connections({
      defaultPort: Port.tcp(this.port),
      securityGroups: props.securityGroups ?? [
        new SecurityGroup(this, 'load-balancer-security-group', {
          vpc: this.cluster.vpc,
        }),
      ],
    });

    const serviceSecurityGroup = new SecurityGroup(this, 'service-security-group', {
      description: `Security group used by pods belonging to the ${this.name} service.`,
      vpc: this.cluster.vpc,
    });

    serviceSecurityGroup.connections.allowFrom(this.cluster.clusterSecurityGroup, Port.allTraffic(), 'Internal Kubernetes communication.');
    serviceSecurityGroup.connections.allowFrom(this.connections, Port.tcp(8080), 'ALB inbound traffic.');

    this.manifest = new KubernetesManifest(this, 'Resource', {
      cluster: this.cluster,
      manifest: [
        {
          apiVersion: 'vpcresources.k8s.aws/v1beta1',
          kind: 'SecurityGroupPolicy',
          metadata: {
            name: this.name,
            namespace: this.namespace,
          },
          spec: {
            podSelector: {
              matchLabels: {
                app: this.name,
              },
            },
            securityGroups: {
              groupIds: [
                serviceSecurityGroup.securityGroupId,
              ],
            },
          },
        },
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            labels: {
              app: this.name,
            },
            name: this.name,
            namespace: this.namespace,
          },
          spec: {
            replicas: this.replicas,
            selector: {
              matchLabels: {
                app: this.name,
              },
            },
            template: {
              metadata: {
                labels: {
                  app: this.name,
                },
              },
              spec: {
                containers: [
                  {
                    image: `${Echoserver.DEFAULT_REPOSITORY}:${this.tag}`,
                    imagePullPolicy: 'Always',
                    name: 'echoserver',
                    ports: [
                      {
                        containerPort: 8080,
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            annotations: {
              'alb.ingress.kubernetes.io/target-type': 'ip',
            },
            name: this.name,
          },
          spec: {
            ports: [
              {
                port: this.port,
                protocol: 'TCP',
                targetPort: 8080,
              },
            ],
            selector: {
              app: this.name,
            },
            type: 'NodePort',
          },
        },
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'Ingress',
          metadata: {
            name: this.name,
            annotations: {
              'kubernetes.io/ingress.class': 'alb',
              'alb.ingress.kubernetes.io/listen-ports': this.stack.toJsonString([{
                HTTP: this.port,
              }]),
              'alb.ingress.kubernetes.io/scheme': 'internet-facing',
              'alb.ingress.kubernetes.io/security-groups': Lazy.string({
                produce: () => {
                  return this.connections.securityGroups.map((x) => {
                    return x.securityGroupId;
                  }).join(', ');
                },
              }),
              'alb.ingress.kubernetes.io/subnets': this.cluster.vpc.selectSubnets(this.loadBalancerSubnets).subnetIds.join(', '),
              'external-dns.alpha.kubernetes.io/hostname': Lazy.string({
                produce: () => {
                  if (this._domains.length === 0) {
                    return undefined;
                  }

                  return this._domains.map((x) => {
                    return this.subdomain ? `${this.subdomain}.${x.fqdn}` : x.fqdn;
                  }).join(',');
                },
              }),
            },
          },
          spec: {
            rules: [
              {
                http: {
                  paths: [
                    {
                      backend: {
                        service: {
                          name: this.name,
                          port: {
                            number: this.port,
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
        },
      ],
    });
  }

  public registerDomain(domain: Domain): void {
    this._domains.push(domain);
  }
}