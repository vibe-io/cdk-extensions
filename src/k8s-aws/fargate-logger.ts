import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { FargateProfile, ICluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { FluentBitCloudWatchLogsOutput, IFluentBitFilterPlugin, IFluentBitOutputPlugin, IFluentBitParserPlugin, FluentBitKubernetesFilter, FluentBitRewriteTagFilter } from '.';


/**
 * Optional configuration for the FargateLogger resource.
 */
export interface FargateLoggerOptions {
  /**
     * A default list of Fargate profiles that should have permissions
     * configured. Alternatively profiles can be added at any time by calling
     * `addProfile`.
     */
  readonly fargateProfiles?: FargateProfile[];

  /**
   * The filters that should be applied to logs being processed.
   */
  readonly filters?: IFluentBitFilterPlugin[];

  /**
     * The CloudWatch log group where Farget container logs will be sent.
     */
  readonly logGroup?: ILogGroup;

  /**
   * The output destinations where logs should be written.
   */
  readonly outputs?: IFluentBitOutputPlugin[];

  /**
   * The parsers to be used when reading log files.
   */
  readonly parsers?: IFluentBitParserPlugin[];
}

/**
 * Required configuration for the Fargate logger resource.
 */
export interface FargateLoggerProps extends FargateLoggerOptions, ResourceProps {
  /**
   * The EKS Cluster to configure Fargate logging for.
   */
  readonly cluster: ICluster;
}

/**
 * Creates a ConfigMap that configures logging for containers running in EKS
 * on Fargate.
 */
export class FargateLogger extends Resource {
  /**
   * Internal collection of Fargate Profiles that will be using this
   * configuration for setting up container logging.
   *
   * @group Internal
   */
  private readonly _fargateProfiles: FargateProfile[];

  /**
   * Internal collection of Fluent Bit filter plugins being configured for
   * logging.
   *
   * @group Internal
   */
  private readonly _filters: IFluentBitFilterPlugin[];

  /**
   * Internal collection for Fluent Bit output plugins being configured for
   * logging.
   *
   * @group Internal
   */
  private readonly _outputs: IFluentBitOutputPlugin[];

  /**
   * Internal collection for Fluent Bit parser plugins being configured for
   * logging.
   *
   * @group Internal
   */
  private readonly _parsers: IFluentBitParserPlugin[];

  /**
   * The EKS cluster where Fargate logging is being configured.
   *
   * @group Inputs
   */
  public readonly cluster: ICluster;

  /**
   * Collection of Fluent Bit filter plugins being configured for logging.
   *
   * @group Inputs
   */
  public get filters(): IFluentBitFilterPlugin[] {
    return [...this._filters];
  }

  /**
   * Collection of Fluent Bit output plugins being configured for logging.
   *
   * @group Inputs
   */
  public get outputs(): IFluentBitOutputPlugin[] {
    return [...this._outputs];
  }

  /**
   * Collection of Fluent Bit parser plugins being configured for logging.
   *
   * @group Inputs
   */
  public get parsers(): IFluentBitParserPlugin[] {
    return [...this._parsers];
  }

  /**
   * The Kubernetes manifest that creates the ConfigMap that Fargate uses to
   * configure logging.
   *
   * @group Resources
   */
  public readonly manifest: KubernetesManifest;


  /**
   * Creates a new instance of the FargateLogger class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope: Construct, id: string, props: FargateLoggerProps) {
    super(scope, id, {
      ...props,
    });

    this._fargateProfiles = [];
    this._filters = [];
    this._outputs = [];
    this._parsers = [];

    this.cluster = props.cluster;

    this.manifest = new KubernetesManifest(this, 'Resource', {
      cluster: this.cluster,
      manifest: [
        {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'aws-observability',
            labels: {
              'aws-observability': 'enabled',
            },
          },
        },
        {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'aws-logging',
            namespace: 'aws-observability',
          },
          data: {
            'filters.conf': Lazy.string({
              produce: () => {
                if (!this._filters.length) {
                  this.addFilter(new FluentBitKubernetesFilter());
                }

                const result = this._filters.map((filter) => {
                  const boundConfig = filter.bind(this);
                  boundConfig.parsers?.forEach((parser) => {
                    this.addParser(parser);
                  });
                  boundConfig.permissions?.forEach((statement) => {
                    this._fargateProfiles.forEach((profile) => {
                      profile.podExecutionRole.addToPrincipalPolicy(statement);
                    });
                  });
                  return boundConfig.configFile;
                });

                return result.length > 0 ? result.join('\n') : undefined;
              },
            }),
            'output.conf': Lazy.string({
              produce: () => {
                if (!this._outputs.length) {
                  this.addOutput(new FluentBitCloudWatchLogsOutput());
                }

                return this._outputs.map((x) => {
                  const boundConfig = x.bind(this);
                  boundConfig.parsers?.forEach((parser) => {
                    this.addParser(parser);
                  });
                  boundConfig.permissions?.forEach((statement) => {
                    this._fargateProfiles.forEach((profile) => {
                      profile.podExecutionRole.addToPrincipalPolicy(statement);
                    });
                  });
                  return boundConfig.configFile;
                }).join('\n');
              },
            }),
            'parsers.conf': Lazy.string({
              produce: () => {
                const result: string[] = [];
                let batch: IFluentBitParserPlugin[] = this._parsers;
                let queue: IFluentBitParserPlugin[] = [];

                while (batch.length > 0) {
                  batch.forEach((x) => {
                    const boundConfig = x.bind(this);
                    queue.concat(boundConfig.parsers ?? []);
                    boundConfig.permissions?.forEach((statement) => {
                      this._fargateProfiles.forEach((profile) => {
                        profile.podExecutionRole.addToPrincipalPolicy(statement);
                      });
                    });
                    result.push(boundConfig.configFile);
                  });

                  batch = queue;
                  queue = [];
                }

                return result.length > 0 ? result.join('\n') : undefined;
              },
            }),
          },
        },
      ],
    });

    this.node.addValidation({
      validate: () => {
        let hasKubernetesFilter = false;
        const result: string[] = [];

        this.filters.forEach((x) => {
          if (x.name === FluentBitKubernetesFilter.PLUGIN_NAME) {
            hasKubernetesFilter = true;
          } else if (hasKubernetesFilter && x.name === FluentBitRewriteTagFilter.PLUGIN_NAME) {
            result.push([
              'Cannot have rewrite_tag filters applied after kubernetes',
              'filters in Fluent Bit filter configuration. See:',
              'https://github.com/aws/containers-roadmap/issues/1697',
            ].join(' '));
          }
        });

        return result;
      },
    });

    props.fargateProfiles?.forEach((x) => {
      this.addFargateProfile(x);
    });

    props.filters?.forEach((x) => {
      this.addFilter(x);
    });

    props.outputs?.forEach((x) => {
      this.addOutput(x);
    });

    props.parsers?.forEach((x) => {
      this.addParser(x);
    });
  }

  public addFargateProfile(profile: FargateProfile): FargateLogger {
    this._fargateProfiles.push(profile);
    return this;
  }

  public addFilter(filter: IFluentBitFilterPlugin): FargateLogger {
    this._filters.push(filter);
    return this;
  }

  public addOutput(output: IFluentBitOutputPlugin): FargateLogger {
    this._outputs.push(output);
    return this;
  }

  public addParser(parser: IFluentBitParserPlugin): FargateLogger {
    this._parsers.push(parser);
    return this;
  }
}