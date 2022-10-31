import { Duration } from 'aws-cdk-lib';
import { DataSize } from '../../../../core';
import { FluentBitFilterPlugin, FluentBitFilterPluginCommonOptions } from './filter-plugin';


/**
 * Options for configuring the Kubernetes Fluent Bit filter plugin.
 *
 * @see [Kubernetes Plugin Documention](https://docs.fluentbit.io/manual/pipeline/filters/kubernetes)
 */
export interface FluentBitKubernetesFilterOptions extends FluentBitFilterPluginCommonOptions {
  /**
     * Include Kubernetes resource annotations in the extra metadata.
     *
     * @default true
     */
  readonly annotations?: boolean;

  /**
     * Set the buffer size for HTTP client when reading responses from
     * Kubernetes API server.
     *
     * A value of 0 results in no limit, and the buffer will expand as-needed.
     *
     * Note that if pod specifications exceed the buffer limit, the API
     * response will be discarded when retrieving metadata, and some kubernetes
     * metadata will fail to be injected to the logs.
     *
     * @default 32k
     */
  readonly bufferSize?: DataSize;

  /**
     * When enabled, metadata will be fetched from K8s when docker_id is
     * changed.
     *
     * @default false
     */
  readonly cacheUseDockerId?: boolean;

  /**
     * DNS lookup retries N times until the network starts working.
     *
     * @default 6
     */
  readonly dnsRetries?: number;

  /**
     * DNS lookup interval between network status checks.
     *
     * @default 30 seconds
     */
  readonly dnsWaitTime?: Duration;

  /**
     * If set, use dummy-meta data (for test/dev purposes)
     *
     * @default false
     */
  readonly dummyMeta?: boolean;

  /**
     * Allow Kubernetes Pods to exclude their logs from the log processor.
     *
     * @default false
     */
  readonly k8sLoggingExclude?: boolean;

  /**
     * Allow Kubernetes Pods to suggest a pre-defined Parser.
     *
     * @default false
     */
  readonly k8sLoggingParser?: boolean;

  /**
     * When `keepLog` is disabled, the log field is removed from the incoming
     * message once it has been successfully merged (`mergeLog` must be enabled
     * as well).
     *
     * @default true
     */
  readonly keepLog?: boolean;

  /**
     * CA certificate file.
     *
     * @default '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
     */
  readonly kubeCaFile?: string;

  /**
     * Absolute path to scan for certificate files.
     */
  readonly kubeCaPath?: string;

  /**
     * Kubelet host using for HTTP request, this only works when `useKubelet`
     * is enabled.
     */
  readonly kubeletHost?: string;

  /**
     * Kubelet port using for HTTP request, this only works when `useKubelet`
     * is enabled.
     *
     * @default 10250
     */
  readonly kubeletPort?: number;

  /**
     * Configurable TTL for K8s cached metadata.
     *
     * By default, it is set to 0 which means TTL for cache entries is disabled
     * and cache entries are evicted at random when capacity is reached.
     *
     * In order to enable this option, you should set the number to a time
     * interval.
     *
     * @default 0
     */
  readonly kubeMetaCacheTtl?: Duration;

  /**
     * If set, Kubernetes meta-data can be cached/pre-loaded from files in JSON
     * format in this directory, named as namespace-pod.meta
     */
  readonly kubeMetaPreloadCacheDir?: string;

  /**
     * When the source records comes from Tail input plugin, this option allows
     * to specify what's the prefix used in Tail configuration.
     *
     * @default 'kube.var.log.containers.'
     */
  readonly kubeTagPrefix?: string;

  /**
     * Command to get Kubernetes authorization token.
     *
     * If you want to manually choose a command to get it, you can set the
     * command here.
     *
     * For example, run running the following to get the token using aws-cli:
     *
     * ```
     * aws-iam-authenticator -i your-cluster-name token --token-only
     * ```
     *
     * This option is currently Linux-only.
     */
  readonly kubeTokenCommand?: string;

  /**
     * Token file.
     *
     * @default '/var/run/secrets/kubernetes.io/serviceaccount/token'
     */
  readonly kubeTokenFile?: string;

  /**
     * Configurable 'time to live' for the K8s token.
     *
     * After this time, the token is reloaded from `kubeTokenFile` or the
     * `kubeTokenCommand`.
     *
     * @default 10 minutes
     */
  readonly kubeTokenTtl?: Duration;

  /**
     * API Server end-point.
     *
     * @default 'https://kubernetes.default.svc/'
     */
  readonly kubeUrl?: string;

  /**
     * Include Kubernetes resource labels in the extra metadata.
     *
     * @default true
     */
  readonly labels?: boolean;

  /**
     * When enabled, it checks if the `log` field content is a JSON string
     * map, if so, it append the map fields as part of the log structure.
     *
     * @default false
     */
  readonly mergeLog?: boolean;

  /**
     * When `mergeLog` is enabled, the filter tries to assume the `log` field
     * from the incoming message is a JSON string message and make a structured
     * representation of it at the same level of the `log` field in the map.
     *
     * Now if `mergeLogKey` is set (a string name), all the new structured
     * fields taken from the original `log` content are inserted under the new
     * key.
     */
  readonly mergeLogKey?: string;

  /**
     * When Merge_Log is enabled, trim (remove possible \n or \r) field values.
     *
     * @default true
     */
  readonly mergeLogTrim?: boolean;

  /**
     * Optional parser name to specify how to parse the data contained in the
     * log key. Recommended use is for developers or testing only.
     */
  readonly mergeParser?: string;

  /**
     * Set an alternative Parser to process record Tag and extract pod_name,
     * namespace_name, container_name and docker_id.
     *
     * The parser must be registered in a parsers file.
     *
     * @see [Parsers File](https://github.com/fluent/fluent-bit/blob/master/conf/parsers.conf)
     */
  readonly regexParser?: string;

  /**
     * Debug level between 0 (nothing) and 4 (every detail).
     *
     * @default -1
     */
  readonly tlsDebug?: number;

  /**
     * When enabled, turns on certificate validation when connecting to the
     * Kubernetes API server.
     *
     * @default true
     */
  readonly tlsVerify?: boolean;

  /**
     * This is an optional feature flag to get metadata information from
     * kubelet instead of calling Kube Server API to enhance the log.
     *
     * @default false
     *
     * @see [Kube API heavy traffic issue for large cluster](https://docs.fluentbit.io/manual/pipeline/filters/kubernetes#optional-feature-using-kubelet-to-get-metadata)
     */
  readonly useKubelet?: boolean;

  /**
     * When enabled, the filter reads logs coming in Journald format.
     *
     * @default false
     */
  readonly useJournal?: boolean;
}

/**
 * A Fluent Bit filter that allows log records to be annotated with Kubernetes
 * metadata based on the containers that generated them.
 */
export class KubernetesFilter extends FluentBitFilterPlugin {
  public constructor(options: FluentBitKubernetesFilterOptions = {}) {
    super('kubernetes', options);

    if (options.annotations !== undefined) {
      this.addField('Annotations', options.annotations ? 'On' : 'Off');
    }

    if (options.bufferSize !== undefined) {
      this.addField('Buffer_Size', options.bufferSize.toBytes().toString());
    }

    if (options.cacheUseDockerId !== undefined) {
      this.addField('Cache_Use_Docker_Id', options.cacheUseDockerId ? 'On' : 'Off');
    }

    if (options.dnsRetries !== undefined) {
      this.addField('DNS_Retries', options.dnsRetries.toString());
    }

    if (options.dnsWaitTime !== undefined) {
      this.addField('DNS_Wait_Time', options.dnsWaitTime.toSeconds().toString());
    }

    if (options.dummyMeta !== undefined) {
      this.addField('Dummy_Meta', options.dummyMeta ? 'On' : 'Off');
    }

    if (options.k8sLoggingExclude !== undefined) {
      this.addField('K8S-Logging.Exclude', options.k8sLoggingExclude ? 'On' : 'Off');
    }

    if (options.k8sLoggingParser !== undefined) {
      this.addField('K8S-Logging.Parser', options.k8sLoggingParser ? 'On' : 'Off');
    }

    if (options.keepLog !== undefined) {
      this.addField('Keep_Log', options.keepLog ? 'On' : 'Off');
    }

    if (options.kubeCaFile !== undefined) {
      this.addField('Kube_CA_File', options.kubeCaFile);
    }

    if (options.kubeCaPath !== undefined) {
      this.addField('Kube_CA_Path', options.kubeCaPath);
    }

    if (options.kubeMetaCacheTtl !== undefined) {
      this.addField('Kube_Meta_Cache_TTL', options.kubeMetaCacheTtl.toSeconds().toString());
    }

    if (options.kubeMetaPreloadCacheDir !== undefined) {
      this.addField('Kube_meta_preload_cache_dir', options.kubeMetaPreloadCacheDir);
    }

    if (options.kubeTagPrefix !== undefined) {
      this.addField('Kube_Tag_Prefix', options.kubeTagPrefix);
    }

    if (options.kubeTokenCommand !== undefined) {
      this.addField('Kube_Token_Command', options.kubeTokenCommand);
    }

    if (options.kubeUrl !== undefined) {
      this.addField('Kube_URL', options.kubeUrl);
    }

    if (options.kubeletHost !== undefined) {
      this.addField('Kubelet_Host', options.kubeletHost);
    }

    if (options.kubeletPort !== undefined) {
      this.addField('Kubelet_Port', options.kubeletPort.toString());
    }

    if (options.labels !== undefined) {
      this.addField('Labels', options.labels ? 'On' : 'Off');
    }

    if (options.mergeLog !== undefined) {
      this.addField('Merge_Log', options.mergeLog ? 'On' : 'Off');
    }

    if (options.mergeLogKey !== undefined) {
      this.addField('Merge_Log_Key', options.mergeLogKey);
    }

    if (options.mergeLogKey !== undefined) {
      this.addField('Merge_Log_Trim', options.mergeLogTrim ? 'On' : 'Off');
    }

    if (options.mergeParser !== undefined) {
      this.addField('Merge_Parser', options.mergeParser);
    }

    if (options.regexParser !== undefined) {
      this.addField('Regex_Parser', options.regexParser);
    }

    if (options.tlsDebug !== undefined) {
      this.addField('tls.debug', options.tlsDebug ? 'On' : 'Off');
    }

    if (options.tlsVerify !== undefined) {
      this.addField('tls.verify', options.tlsVerify ? 'On' : 'Off');
    }

    if (options.useJournal !== undefined) {
      this.addField('Use_Journal', options.useJournal ? 'On' : 'Off');
    }

    if (options.useKubelet !== undefined) {
      this.addField('Use_Kubelet', options.useKubelet ? 'On' : 'Off');
    }
  }
}