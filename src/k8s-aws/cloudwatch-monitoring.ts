import { Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICluster, KubernetesManifest, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export interface CloudWatchMonitoringProps extends ResourceProps {
  readonly cluster: ICluster;
}

export class CloudWatchMonitoring extends Resource {
  // Input properties
  public readonly cluster: ICluster;

  // Resource properties
  public readonly resource: KubernetesManifest;
  public readonly serviceAccount: ServiceAccount;


  constructor(scope: Construct, id: string, props: CloudWatchMonitoringProps) {
    super(scope, id, props);

    this.cluster = props.cluster;

    this.serviceAccount = new ServiceAccount(this, 'service-account', {
      cluster: this.cluster,
      namespace: 'kube-system',
      name: `sa${Names.uniqueId(this).slice(-61).toLowerCase()}`,
    });
    this.serviceAccount.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'));

    this.resource = new KubernetesManifest(this, 'Resource', {
      cluster: this.cluster,
      manifest: [
        {
          kind: 'ClusterRole',
          apiVersion: 'rbac.authorization.k8s.io/v1',
          metadata: {
            name: 'adotcol-admin-role',
          },
          rules: [
            {
              apiGroups: [
                '',
              ],
              resources: [
                'nodes',
                'nodes/proxy',
                'nodes/metrics',
                'services',
                'endpoints',
                'pods',
                'pods/proxy',
              ],
              verbs: [
                'get',
                'list',
                'watch',
              ],
            },
            {
              nonResourceURLs: [
                '/metrics/cadvisor',
              ],
              verbs: [
                'get',
                'list',
                'watch',
              ],
            },
          ],
        },
        {
          kind: 'ClusterRoleBinding',
          apiVersion: 'rbac.authorization.k8s.io/v1',
          metadata: {
            name: 'adotcol-admin-role-binding',
          },
          subjects: [
            {
              kind: 'ServiceAccount',
              name: this.serviceAccount.serviceAccountName,
              namespace: this.serviceAccount.serviceAccountNamespace,
            },
          ],
          roleRef: {
            kind: 'ClusterRole',
            name: 'adotcol-admin-role',
            apiGroup: 'rbac.authorization.k8s.io',
          },
        },
        {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'adot-collector-config',
            namespace: 'kube-system',
            labels: {
              app: 'aws-adot',
              component: 'adot-collector-config',
            },
          },
          data: {
            'adot-collector-config': `
                            receivers:
                                prometheus:
                                    config:
                                        global:
                                            scrape_interval: 1m
                                            scrape_timeout: 40s
                                        scrape_configs:
                                            - job_name: 'kubelets-cadvisor-metrics'
                                              sample_limit: 10000
                                              scheme: https
                                              kubernetes_sd_configs:
                                                  - role: node
                                              tls_config:
                                                  ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
                                              bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
                                              relabel_configs:
                                                  - action: labelmap
                                                    regex: __meta_kubernetes_node_label_(.+)
                                                  - target_label: __address__
                                                    replacement: kubernetes.default.svc:443
                                                  - source_labels: [__meta_kubernetes_node_name]
                                                    regex: (.+)
                                                    target_label: __metrics_path__
                                                    replacement: /api/v1/nodes/$\${1}/proxy/metrics/cadvisor
                                              metric_relabel_configs:
                                                  - action: replace
                                                    source_labels: [id]
                                                    regex: '^/machine\\.slice/machine-rkt\\\\x2d([^\\\\]+)\\\\.+/([^/]+)\\.service$'
                                                    target_label: rkt_container_name
                                                    replacement: "$\${2}-$\${1}"
                                                  - action: replace
                                                    source_labels: [id]
                                                    regex: '^/system\\.slice/(.+)\\.service$'
                                                    target_label: systemd_service_name
                                                    replacement: "$\${1}"
                            processors:
                                metricstransform/label_1:
                                    transforms:
                                      - include: .*
                                        match_type: regexp
                                        action: update
                                        operations:
                                          - action: update_label
                                            label: name
                                            new_label: container_id
                                          - action: update_label
                                            label: kubernetes_to_hostname
                                            new_label: NodeName
                                          - action: update_label
                                            label: eks_amazonaws_com_compute_type
                                            new_label: LaunchType

                                metricstransform/rename:
                                    transforms:
                                      - include: container_spec_cpu_quota
                                        new_name: new_container_cpu_limit_raw
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_spec_cpu_shares
                                        new_name: new_container_cpu_request
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_cpu_usage_seconds_total
                                        new_name: new_container_cpu_usage_seconds_total
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_spec_memory_limit_bytes
                                        new_name: new_container_memory_limit
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_cache
                                        new_name: new_container_memory_cache
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_max_usage_bytes
                                        new_name: new_container_memory_max_usage
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_usage_bytes
                                        new_name: new_container_memory_usage
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_working_set_bytes
                                        new_name: new_container_memory_working_set
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_rss
                                        new_name: new_container_memory_rss
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_swap
                                        new_name: new_container_memory_swap
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_failcnt
                                        new_name: new_container_memory_failcnt
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_failures_total
                                        new_name: new_container_memory_hierarchical_pgfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate", "failure_type": "pgfault", "scope": "hierarchy"}
                                      - include: container_memory_failures_total
                                        new_name: new_container_memory_hierarchical_pgmajfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate", "failure_type": "pgmajfault", "scope": "hierarchy"}
                                      - include: container_memory_failures_total
                                        new_name: new_container_memory_pgfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate", "failure_type": "pgfault", "scope": "container"}
                                      - include: container_memory_failures_total
                                        new_name: new_container_memory_pgmajfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate", "failure_type": "pgmajfault", "scope": "container"}
                                      - include: container_fs_limit_bytes
                                        new_name: new_container_filesystem_capacity
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_fs_usage_bytes
                                        new_name: new_container_filesystem_usage
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"container": "\\\\S", "LaunchType": "fargate"}
                                        # POD LEVEL METRICS
                                      - include: container_spec_cpu_quota
                                        new_name: pod_cpu_limit_raw
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_spec_cpu_shares
                                        new_name: pod_cpu_request
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_cpu_usage_seconds_total
                                        new_name: pod_cpu_usage_seconds_total
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_spec_memory_limit_bytes
                                        new_name: pod_memory_limit
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_cache
                                        new_name: pod_memory_cache
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_max_usage_bytes
                                        new_name: pod_memory_max_usage
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_usage_bytes
                                        new_name: pod_memory_usage
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_working_set_bytes
                                        new_name: pod_memory_working_set
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_rss
                                        new_name: pod_memory_rss
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_swap
                                        new_name: pod_memory_swap
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_failcnt
                                        new_name: pod_memory_failcnt
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_memory_failures_total
                                        new_name: pod_memory_hierarchical_pgfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate", "failure_type": "pgfault", "scope": "hierarchy"}
                                      - include: container_memory_failures_total
                                        new_name: pod_memory_hierarchical_pgmajfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate", "failure_type": "pgmajfault", "scope": "hierarchy"}
                                      - include: container_memory_failures_total
                                        new_name: pod_memory_pgfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate", "failure_type": "pgfault", "scope": "container"}
                                      - include: container_memory_failures_total
                                        new_name: pod_memory_pgmajfault
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"image": "^$", "container": "^$", "pod": "\\\\S", "LaunchType": "fargate", "failure_type": "pgmajfault", "scope": "container"}
                                      - include: container_network_receive_bytes_total
                                        new_name: pod_network_rx_bytes
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_receive_packets_dropped_total
                                        new_name: pod_network_rx_dropped
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_receive_errors_total
                                        new_name: pod_network_rx_errors
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_receive_packets_total
                                        new_name: pod_network_rx_packets
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_transmit_bytes_total
                                        new_name: pod_network_tx_bytes
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_transmit_packets_dropped_total
                                        new_name: pod_network_tx_dropped
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_transmit_errors_total
                                        new_name: pod_network_tx_errors
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                      - include: container_network_transmit_packets_total
                                        new_name: pod_network_tx_packets
                                        action: insert
                                        match_type: regexp
                                        experimental_match_labels: {"pod": "\\\\S", "LaunchType": "fargate"}
                                filter:
                                    metrics:
                                        include:
                                            match_type: regexp
                                            metric_names:
                                              - new_container_.*
                                              - pod_.*

                                cumulativetodelta:
                                    metrics:
                                      - new_container_cpu_usage_seconds_total
                                      - pod_cpu_usage_seconds_total
                                      - pod_memory_pgfault
                                      - pod_memory_pgmajfault
                                      - pod_memory_hierarchical_pgfault
                                      - pod_memory_hierarchical_pgmajfault
                                      - pod_network_rx_bytes
                                      - pod_network_rx_dropped
                                      - pod_network_rx_errors
                                      - pod_network_rx_packets
                                      - pod_network_tx_bytes
                                      - pod_network_tx_dropped
                                      - pod_network_tx_errors
                                      - pod_network_tx_packets
                                      - new_container_memory_pgfault
                                      - new_container_memory_pgmajfault
                                      - new_container_memory_hierarchical_pgfault
                                      - new_container_memory_hierarchical_pgmajfault

                                deltatorate:
                                    metrics:
                                      - new_container_cpu_usage_seconds_total
                                      - pod_cpu_usage_seconds_total
                                      - pod_memory_pgfault
                                      - pod_memory_pgmajfault
                                      - pod_memory_hierarchical_pgfault
                                      - pod_memory_hierarchical_pgmajfault
                                      - pod_network_rx_bytes
                                      - pod_network_rx_dropped
                                      - pod_network_rx_errors
                                      - pod_network_rx_packets
                                      - pod_network_tx_bytes
                                      - pod_network_tx_dropped
                                      - pod_network_tx_errors
                                      - pod_network_tx_packets
                                      - new_container_memory_pgfault
                                      - new_container_memory_pgmajfault
                                      - new_container_memory_hierarchical_pgfault
                                      - new_container_memory_hierarchical_pgmajfault
                                experimental_metricsgeneration/1:
                                    rules:
                                      - name: pod_network_total_bytes
                                        unit: Bytes/Second
                                        type: calculate
                                        metric1: pod_network_rx_bytes
                                        metric2: pod_network_tx_bytes
                                        operation: add
                                      - name: pod_memory_utilization_over_pod_limit
                                        unit: Percent
                                        type: calculate
                                        metric1: pod_memory_working_set
                                        metric2: pod_memory_limit
                                        operation: percent
                                      - name: pod_cpu_usage_total
                                        unit: Millicore
                                        type: scale
                                        metric1: pod_cpu_usage_seconds_total
                                        operation: multiply
                                        scale_by: 1000
                                      - name: pod_cpu_limit
                                        unit: Millicore
                                        type: scale
                                        metric1: pod_cpu_limit_raw
                                        operation: divide
                                        scale_by: 100
                                experimental_metricsgeneration/2:
                                    rules:
                                      - name: pod_cpu_utilization_over_pod_limit
                                        type: calculate
                                        unit: Percent
                                        metric1: pod_cpu_usage_total
                                        metric2: pod_cpu_limit
                                        operation: percent
                                metricstransform/label_2:
                                    transforms:
                                      - include: pod_.*
                                        match_type: regexp
                                        action: update
                                        operations:
                                          - action: add_label
                                            new_label: Type
                                            new_value: "Pod"
                                      - include: new_container_.*
                                        match_type: regexp
                                        action: update
                                        operations:
                                          - action: add_label
                                            new_label: Type
                                            new_value: Container
                                      - include: .*
                                        match_type: regexp
                                        action: update
                                        operations:
                                          - action: update_label
                                            label: namespace
                                            new_label: Namespace
                                          - action: update_label
                                            label: pod
                                            new_label: PodName
                                      - include: ^new_container_(.*)$$
                                        match_type: regexp
                                        action: update
                                        new_name: container_$$1

                                resourcedetection:
                                    detectors: [env, eks]

                                batch:
                                    timeout: 60s

                            exporters:
                                awsemf:
                                    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
                                    log_stream_name: '{PodName}'
                                    namespace: 'ContainerInsights'
                                    region: ${this.stack.region}
                                    resource_to_telemetry_conversion:
                                        enabled: true
                                    eks_fargate_container_insights_enabled: true
                                    parse_json_encoded_attr_values: ["kubernetes"]
                                    dimension_rollup_option: NoDimensionRollup
                                    metric_declarations:
                                      - dimensions: [ [ClusterName, LaunchType], [ClusterName, Namespace, LaunchType], [ClusterName, Namespace, PodName, LaunchType]]
                                        metric_name_selectors:
                                          - pod_cpu_utilization_over_pod_limit
                                          - pod_cpu_usage_total
                                          - pod_cpu_limit
                                          - pod_memory_utilization_over_pod_limit
                                          - pod_memory_working_set
                                          - pod_memory_limit
                                          - pod_network_rx_bytes
                                          - pod_network_tx_bytes

                            extensions:
                                health_check:

                            service:
                                pipelines:
                                    metrics:
                                        receivers: [prometheus]
                                        processors: [metricstransform/label_1, resourcedetection, metricstransform/rename, filter, cumulativetodelta, deltatorate, experimental_metricsgeneration/1, experimental_metricsgeneration/2, metricstransform/label_2, batch]
                                        exporters: [awsemf]
                                extensions: [health_check]`,
          },
        },
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: 'adot-collector-service',
            namespace: 'kube-system',
            labels: {
              app: 'aws-adot',
              component: 'adot-collector',
            },
          },
          spec: {
            ports: [
              {
                name: 'metrics',
                port: 8888,
              },
            ],
            selector: {
              component: 'adot-collector',
            },
            type: 'ClusterIP',
          },
        },
        {
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          metadata: {
            name: 'adot-collector',
            namespace: 'kube-system',
            labels: {
              app: 'aws-adot',
              component: 'adot-collector',
            },
          },
          spec: {
            selector: {
              matchLabels: {
                app: 'aws-adot',
                component: 'adot-collector',
              },
            },
            serviceName: 'adot-collector-service',
            template: {
              metadata: {
                labels: {
                  app: 'aws-adot',
                  component: 'adot-collector',
                },
              },
              spec: {
                serviceAccountName: this.serviceAccount.serviceAccountName,
                securityContext: {
                  fsGroup: 65534,
                },
                containers: [{
                  image: 'amazon/aws-otel-collector:v0.15.1',
                  name: 'adot-collector',
                  imagePullPolicy: 'Always',
                  command: [
                    '/awscollector',
                    '--config=/conf/adot-collector-config.yaml',
                    '--set=service.telemetry.logs.level=DEBUG',
                  ],
                  env: [{
                    name: 'OTEL_RESOURCE_ATTRIBUTES',
                    value: `ClusterName=${this.cluster.clusterName}`,
                  }],
                  resources: {
                    limits: {
                      cpu: 2,
                      memory: '2Gi',
                    },
                    requests: {
                      cpu: '200m',
                      memory: '400Mi',
                    },
                  },
                  volumeMounts: [{
                    name: 'adot-collector-config-volume',
                    mountPath: '/conf',
                  }],
                }],
                volumes: [{
                  configMap: {
                    name: 'adot-collector-config',
                    items: [{
                      key: 'adot-collector-config',
                      path: 'adot-collector-config.yaml',
                    }],
                  },
                  name: 'adot-collector-config-volume',
                }],
              },
            },
          },
        },
      ],
    });
  }
}