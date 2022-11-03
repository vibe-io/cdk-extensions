import { Duration } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { ResolvedFluentBitConfiguration } from '..';
import { DataSize } from '../../../../core';
import { convertBool } from '../utils';
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
export class FluentBitKubernetesFilter extends FluentBitFilterPlugin {
  /**
     * Include Kubernetes resource annotations in the extra metadata.
     *
     * @group Inputs
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
      * @group Inputs
      */
  readonly bufferSize?: DataSize;

  /**
      * When enabled, metadata will be fetched from K8s when docker_id is
      * changed.
      *
      * @group Inputs
      */
  readonly cacheUseDockerId?: boolean;

  /**
      * DNS lookup retries N times until the network starts working.
      *
      * @group Inputs
      */
  readonly dnsRetries?: number;

  /**
      * DNS lookup interval between network status checks.
      *
      * @group Inputs
      */
  readonly dnsWaitTime?: Duration;

  /**
      * If set, use dummy-meta data (for test/dev purposes).
      *
      * @group Inputs
      */
  readonly dummyMeta?: boolean;

  /**
      * Allow Kubernetes Pods to exclude their logs from the log processor.
      *
      * @group Inputs
      */
  readonly k8sLoggingExclude?: boolean;

  /**
      * Allow Kubernetes Pods to suggest a pre-defined Parser.
      *
      * @group Inputs
      */
  readonly k8sLoggingParser?: boolean;

  /**
      * When `keepLog` is disabled, the log field is removed from the incoming
      * message once it has been successfully merged (`mergeLog` must be enabled
      * as well).
      *
      * @group Inputs
      */
  readonly keepLog?: boolean;

  /**
      * CA certificate file.
      *
      * @group Inputs
      */
  readonly kubeCaFile?: string;

  /**
      * Absolute path to scan for certificate files.
      *
      * @group Inputs
      */
  readonly kubeCaPath?: string;

  /**
      * Kubelet host using for HTTP request, this only works when `useKubelet`
      * is enabled.
      *
      * @group Inputs
      */
  readonly kubeletHost?: string;

  /**
      * Kubelet port using for HTTP request, this only works when `useKubelet`
      * is enabled.
      *
      * @group Inputs
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
      * @group Inputs
      */
  readonly kubeMetaCacheTtl?: Duration;

  /**
      * If set, Kubernetes meta-data can be cached/pre-loaded from files in JSON
      * format in this directory, named as namespace-pod.meta.
      *
      * @group Inputs
      */
  readonly kubeMetaPreloadCacheDir?: string;

  /**
      * When the source records comes from Tail input plugin, this option allows
      * to specify what's the prefix used in Tail configuration.
      *
      * @group Inputs
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
      *
      * @group Inputs
      */
  readonly kubeTokenCommand?: string;

  /**
      * Token file.
      *
      * @group Inputs
      */
  readonly kubeTokenFile?: string;

  /**
      * Configurable 'time to live' for the K8s token.
      *
      * After this time, the token is reloaded from `kubeTokenFile` or the
      * `kubeTokenCommand`.
      *
      * @group Inputs
      */
  readonly kubeTokenTtl?: Duration;

  /**
      * API Server end-point.
      *
      * @group Inputs
      */
  readonly kubeUrl?: string;

  /**
      * Include Kubernetes resource labels in the extra metadata.
      *
      * @group Inputs
      */
  readonly labels?: boolean;

  /**
      * When enabled, it checks if the `log` field content is a JSON string
      * map, if so, it append the map fields as part of the log structure.
      *
      * @group Inputs
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
      *
      * @group Inputs
      */
  readonly mergeLogKey?: string;

  /**
      * When Merge_Log is enabled, trim (remove possible \n or \r) field values.
      *
      * @group Inputs
      */
  readonly mergeLogTrim?: boolean;

  /**
      * Optional parser name to specify how to parse the data contained in the
      * log key. Recommended use is for developers or testing only.
      *
      * @group Inputs
      */
  readonly mergeParser?: string;

  /**
      * Set an alternative Parser to process record Tag and extract pod_name,
      * namespace_name, container_name and docker_id.
      *
      * The parser must be registered in a parsers file.
      *
      * @see [Parsers File](https://github.com/fluent/fluent-bit/blob/master/conf/parsers.conf)
      *
      * @group Inputs
      */
  readonly regexParser?: string;

  /**
      * Debug level between 0 (nothing) and 4 (every detail).
      *
      * @group Inputs
      */
  readonly tlsDebug?: number;

  /**
      * When enabled, turns on certificate validation when connecting to the
      * Kubernetes API server.
      *
      * @group Inputs
      */
  readonly tlsVerify?: boolean;

  /**
      * This is an optional feature flag to get metadata information from
      * kubelet instead of calling Kube Server API to enhance the log.
      *
      * @see [Kube API heavy traffic issue for large cluster](https://docs.fluentbit.io/manual/pipeline/filters/kubernetes#optional-feature-using-kubelet-to-get-metadata)
      *
      * @group Inputs
      */
  readonly useKubelet?: boolean;

  /**
      * When enabled, the filter reads logs coming in Journald format.
      *
      * @group Inputs
      */
  readonly useJournal?: boolean;


  /**
   * Creates a new instance of the FluentBitKubernetesFilter class.
   *
   * @param options Options for configuring the filter.
   */
  public constructor(options: FluentBitKubernetesFilterOptions = {}) {
    super('kubernetes', options);

    this.annotations = options.annotations;
    this.bufferSize = options.bufferSize;
    this.cacheUseDockerId = options.cacheUseDockerId;
    this.dnsRetries = options.dnsRetries;
    this.dnsWaitTime = options.dnsWaitTime;
    this.dummyMeta = options.dummyMeta;
    this.k8sLoggingExclude = options.k8sLoggingExclude;
    this.k8sLoggingParser = options.k8sLoggingParser;
    this.keepLog = options.keepLog;
    this.kubeCaFile = options.kubeCaFile;
    this.kubeCaPath = options.kubeCaPath;
    this.kubeMetaCacheTtl = options.kubeMetaCacheTtl;
    this.kubeMetaPreloadCacheDir = options.kubeMetaPreloadCacheDir;
    this.kubeTagPrefix = options.kubeTagPrefix;
    this.kubeTokenCommand = options.kubeTokenCommand;
    this.kubeTokenFile = options.kubeTokenFile;
    this.kubeTokenTtl = options.kubeTokenTtl;
    this.kubeUrl = options.kubeUrl;
    this.kubeletHost = options.kubeletHost;
    this.kubeletPort = options.kubeletPort;
    this.labels = options.labels;
    this.mergeLog = options.mergeLog;
    this.mergeLogKey = options.mergeLogKey;
    this.mergeLogTrim = options.mergeLogTrim;
    this.mergeParser = options.mergeParser;
    this.regexParser = options.regexParser;
    this.tlsDebug = options.tlsDebug;
    this.tlsVerify = options.tlsVerify;
    this.useJournal = options.useJournal;
    this.useKubelet = options.useKubelet;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(_scope: IConstruct): ResolvedFluentBitConfiguration {
    return {
      configFile: super.renderConfigFile({
        'Annotations': convertBool(this.annotations),
        'Buffer_Size': this.bufferSize?.toBytes(),
        'Cache_Use_Docker_Id': convertBool(this.cacheUseDockerId),
        'DNS_Retries': this.dnsRetries,
        'DNS_Wait_Time': this.dnsWaitTime?.toSeconds(),
        'Dummy_Meta': convertBool(this.dummyMeta),
        'K8S-Logging.Exclude': convertBool(this.k8sLoggingExclude),
        'K8S-Logging.Parser': convertBool(this.k8sLoggingParser),
        'Keep_Log': convertBool(this.keepLog),
        'Kube_CA_File': this.kubeCaFile,
        'Kube_CA_Path': this.kubeCaPath,
        'Kube_Meta_Cache_TTL': this.kubeMetaCacheTtl?.toSeconds(),
        'Kube_meta_preload_cache_dir': this.kubeMetaPreloadCacheDir,
        'Kube_Tag_Prefix': this.kubeTagPrefix,
        'Kube_Token_Command': this.kubeTokenCommand,
        'Kube_Token_File': this.kubeTokenFile,
        'Kube_Token_TTL': this.kubeTokenTtl?.toSeconds(),
        'Kube_URL': this.kubeUrl,
        'Kubelet_Host': this.kubeletHost,
        'Kubelet_Port': this.kubeletPort,
        'Labels': convertBool(this.labels),
        'Merge_Log': convertBool(this.mergeLog),
        'Merge_Log_Key': this.mergeLogKey,
        'Merge_Log_Trim': convertBool(this.mergeLogTrim),
        'Merge_Parser': this.mergeParser,
        'Regex_Parser': this.regexParser,
        'tls.debug': this.tlsDebug,
        'tls.verify': convertBool(this.tlsVerify),
        'Use_Journal': convertBool(this.useJournal),
        'Use_Kubelet': convertBool(this.useKubelet),
      }),
    };
  }
}