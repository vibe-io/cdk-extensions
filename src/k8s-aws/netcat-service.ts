import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { Connections, IConnectable, ISecurityGroup, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';


/**
 * Configuration for the NetcatService resource.
 */
export interface NetcatServiceProps extends ResourceProps {
  /**
     * The EKS Cluster where the service should be deployed.
     */
  readonly cluster: ICluster;

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
}

/**
 * Creates a ConfigMap that configures logging for containers running in EKS
 * on Fargate.
 */
export class NetcatService extends Resource implements IConnectable {
  /**
   * The EKS Cluster where the service should be deployed.
   *
   * @group Inputs
   */
  public readonly cluster: ICluster;

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
   * Creates a new instance of the NetcatService class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: NetcatServiceProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.name = props.name ?? 'netcat';
    this.port = props.port ?? 3838;
    this.replicas = props.replicas ?? 1;

    this.connections = new Connections({
      defaultPort: Port.tcp(this.port),
      securityGroups: props.securityGroups ?? [
        new SecurityGroup(this, 'security-group', {
          vpc: this.cluster.vpc,
        }),
      ],
    });

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
              groupIds: Lazy.list({
                produce: () => {
                  return this.connections.securityGroups.map((x) => {
                    return x.securityGroupId;
                  });
                },
              }),
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
                    command: [
                      'nc',
                      '-l',
                      '-p',
                      this.port.toString(),
                    ],
                    image: 'busybox:latest',
                    name: 'netcat',
                    ports: [
                      {
                        containerPort: this.port,
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
              'service.beta.kubernetes.io/aws-load-balancer-nlb-target-type': 'ip',
              'service.beta.kubernetes.io/aws-load-balancer-scheme': 'internet-facing',
              'service.beta.kubernetes.io/aws-load-balancer-type': 'external',
            },
            name: this.name,
          },
          spec: {
            ports: [
              {
                port: this.port,
                protocol: 'TCP',
                targetPort: this.port,
              },
            ],
            selector: {
              app: this.name,
            },
          },
        },
      ],
    });
  }
}