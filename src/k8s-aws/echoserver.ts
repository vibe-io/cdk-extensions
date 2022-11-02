import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, Port, SecurityGroup, SubnetSelection, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';


/**
 * Configuration for the Echoserver resource.
 */
export interface EchoserverProps extends ResourceProps {
  /**
     * The EKS Cluster where the service should be deployed.
     */
  readonly cluster: ICluster;

  /**
   * The subnets where the load balancer should be created..
   */
  readonly loadBalancerSubnets?: SubnetSelection;

  /**
   * The name of the Kubernetes service to be created.
   *
   * @default 'netcat'
   */
  readonly name?: string;

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
   * The subnets where the service pods should run.
   */
  readonly serviceSubnets?: SubnetSelection;
}

/**
 * Creates a ConfigMap that configures logging for containers running in EKS
 * on Fargate.
 */
export class Echoserver extends Resource implements IConnectable {
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
   * The subnets where the service pods should run.
   *
   * @group Inputs
   */
  readonly serviceSubnets: SubnetSelection;

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

    this.cluster = props.cluster;
    this.loadBalancerSubnets = props.loadBalancerSubnets ?? {
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    };
    this.name = props.name ?? 'echoserver';
    this.port = props.port ?? 80;
    this.replicas = props.replicas ?? 1;
    this.serviceSubnets = props.serviceSubnets ?? {
      onePerAz: true,
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    };

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
            name: this.name,
            labels: {
              app: this.name,
            },
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
                    image: 'gcr.io/google_containers/echoserver:1.4',
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
}