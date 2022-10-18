import { Annotations, Duration, Lazy, RemovalPolicy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnJob } from 'aws-cdk-lib/aws-glue';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../../utils/formatting';
import { Connection } from './connection';
import { Code } from './lib/code';
import { JobExecutable } from './lib/job-executable';
import { WorkerType } from './lib/worker-type';
import { SecurityConfiguration } from './security-configuration';


export interface ContinuousLoggingProps {
  /**
     * Apply the provided conversion pattern.
     *
     * This is a Log4j Conversion Pattern to customize driver and executor logs.
     *
     * @default `%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n`
     */
  readonly conversionPattern?: string;

  /**
     * Enable continouous logging.
     */
  readonly enabled: boolean;

  /**
     * Specify a custom CloudWatch log group name.
     *
     * @default - a log group is created with name `/aws-glue/jobs/logs-v2/`.
     */
  readonly logGroup?: ILogGroup;

  /**
     * Specify a custom CloudWatch log stream prefix.
     *
     * @default - the job run ID.
     */
  readonly logStreamPrefix?: string;

  /**
     * Filter out non-useful Apache Spark driver/executor and Apache Hadoop YARN heartbeat log messages.
     *
     * @default true
     */
  readonly quiet?: boolean;
}

/**
 * Configuration for the Glue Job resource.
 */
export interface JobProps extends ResourceProps {
  readonly allocatedCapacity?: number;
  readonly connections?: Connection[];
  readonly continuousLogging?: ContinuousLoggingProps;
  readonly defaultArguments?: {[key: string]: string};
  readonly description?: string;
  readonly enableProfilingMetrics?: boolean;
  readonly executable: JobExecutable;
  readonly maxCapacity?: number;
  readonly maxConcurrentRuns?: number;
  readonly maxRetries?: number;
  readonly name?: string;
  readonly notifyDelayAfter?: Duration;
  readonly role?: IRole;
  readonly securityConfiguration?: SecurityConfiguration;
  readonly timeout?: Duration;
  readonly workerCount?: number;
  readonly workerType?: WorkerType;
}

export class Job extends Resource {
  // Internal properties
  private readonly _arguments: {[key: string]: string} = {};
  private readonly _connections: Connection[] = [];

  // Input properties
  public readonly allocatedCapacity?: number;
  public readonly connections?: Connection[];
  public readonly continuousLogging?: ContinuousLoggingProps;
  public readonly description?: string;
  public readonly executable: JobExecutable;
  public readonly maxCapacity?: number;
  public readonly maxConcurrentRuns?: number;
  public readonly maxRetries?: number;
  public readonly name?: string;
  public readonly notifyDelayAfter?: Duration;
  public readonly securityConfiguration?: SecurityConfiguration;
  public readonly timeout?: Duration;
  public readonly workerCount?: number;
  public readonly workerType?: WorkerType;

  // Resource properties
  public readonly logGroup?: ILogGroup;
  public readonly resource: CfnJob;
  public readonly role: IRole;

  // Standard properties
  public readonly jobArn: string;
  public readonly jobName: string;


  constructor(scope: Construct, id: string, props: JobProps) {
    super(scope, id, props);

    this.allocatedCapacity = props.allocatedCapacity;
    this.continuousLogging = props.continuousLogging;
    this.description = props.description;
    this.executable = props.executable;
    this.maxCapacity = props.maxCapacity;
    this.maxConcurrentRuns = props.maxConcurrentRuns;
    this.maxRetries = props.maxRetries;
    this.name = props.name;
    this.notifyDelayAfter = props.notifyDelayAfter;
    this.securityConfiguration = props.securityConfiguration;
    this.timeout = props.timeout;
    this.workerCount = props.workerCount;
    this.workerType = props.workerType;

    const executable = props.executable.bind();

    if (props.enableProfilingMetrics) {
      this.addArgument('--enable-metrics', '');
    }

    if (this.continuousLogging?.enabled) {
      this.logGroup = this.configureContinuousLogging(this.continuousLogging);
    }

    if (this.workerType?.name === 'G.1X' && (this.workerCount ?? 0) > 299) {
      Annotations.of(this).addError('The maximum number of workers you can define for G.1X is 299.');
    } else if (this.workerType?.name === 'G.2X' && (this.workerCount ?? 0) > 149) {
      Annotations.of(this).addError('The maximum number of workers you can define for G.2X is 149.');
    }

    this.role = props.role ?? new Role(this, 'role', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
      ],
    });

    this.resource = new CfnJob(this, 'Resource', {
      allocatedCapacity: this.allocatedCapacity,
      command: {
        name: executable.type.name,
        pythonVersion: executable.pythonVersion,
        scriptLocation: this.buildCodeS3ObjectUrl(executable.script),
      },
      connections: Lazy.uncachedAny({
        produce: () => {
          return !!!this._connections.length ? undefined : {
            connections: this._connections.map((x) => {
              return x.connectionName;
            }),
          };
        },
      }),
      defaultArguments: Lazy.uncachedAny({
        produce: () => {
          return !!Object.keys(this._arguments).length ? this._arguments : undefined;
        },
      }),
      description: this.description,
      executionProperty: undefinedIfNoKeys({
        maxConcurrentRuns: this.maxConcurrentRuns,
      }),
      glueVersion: executable.glueVersion.name,
      maxCapacity: this.maxCapacity,
      maxRetries: this.maxRetries,
      name: this.name,
      notificationProperty: undefinedIfNoKeys({
        notifyDelayAfter: this.notifyDelayAfter?.toMinutes(),
      }),
      numberOfWorkers: this.workerCount,
      role: this.role.roleArn,
      securityConfiguration: this.securityConfiguration?.securityConfigurationName,
      timeout: this.timeout?.toMinutes(),
      workerType: this.workerType?.name,
    });

    this.jobArn = this.stack.formatArn({
      resource: 'job',
      resourceName: this.resource.ref,
      service: 'glue',
    });
    this.jobName = this.resource.ref;

    const args = props.defaultArguments ?? {};
    Object.keys(args).forEach((x) => {
      this.addArgument(x, args[x]);
    });

    props.connections?.forEach((x) => {
      this.addConnection(x);
    });
  }

  public addArgument(key: string, value: string): void {
    this._arguments[key] = value;
  }

  public addConnection(connection: Connection): void {
    this._connections.push(connection);
  }

  private buildCodeS3ObjectUrl(code: Code) {
    const s3Location = code.bind(this, this.role).s3Location;
    return `s3://${s3Location.bucketName}/${s3Location.objectKey}`;
  }

  private configureContinuousLogging(props: ContinuousLoggingProps): ILogGroup {
    const logGroup = props?.logGroup ?? new LogGroup(this, 'log-group', {
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.TWO_WEEKS,
    });

    logGroup.grantWrite(this.role);

    this.addArgument('--enable-continuous-cloudwatch-log', 'true');
    this.addArgument('--enable-continuous-log-filter', `${props.quiet ?? true}`);
    this.addArgument('--continuous-log-logGroup', logGroup.logGroupName);

    if (props.logStreamPrefix) {
      this.addArgument('--continuous-log-logStreamPrefix', props.logStreamPrefix);
    }

    if (props.conversionPattern) {
      this.addArgument('--continuous-log-conversionPattern', props.conversionPattern);
    }

    return logGroup;
  }
}
