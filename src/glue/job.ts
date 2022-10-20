import { Annotations, Duration, Lazy, RemovalPolicy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnJob } from 'aws-cdk-lib/aws-glue';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { undefinedIfNoKeys } from '../utils/formatting';
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
  /**
   * The number of capacity units that are allocated to this job.
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-allocatedcapacity)
   */
  readonly allocatedCapacity?: number;
  /**
   * List of Connections for use with this job.
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-connections) 
   */
  readonly connections?: Connection[];
  /**
   * Set of properties for configuration of Continuous Logging 
   */
  readonly continuousLogging?: ContinuousLoggingProps;
  /**
   * The default arguments for this job, specified as name-value pairs. 
   * 
   * You can specify arguments here that your own job-execution script consumes, in addition to arguments that AWS Glue itself consumes.
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-defaultarguments) 
   */
  readonly defaultArguments?: {[key: string]: string};
  /**
   * A description of the job. 
   */
  readonly description?: string;
  /**
   * Boolean value for whether to enable Profiling Metrics 
   */
  readonly enableProfilingMetrics?: boolean;
  /**
   * Executable properties for the Job 
   */
  readonly executable: JobExecutable;
  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. 
   * 
   * Do not set Max Capacity if using WorkerType and NumberOfWorkers.
   * 
   * The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job or an Apache Spark ETL job:
   * 
   *    - When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.
   * 
   *    - When you specify an Apache Spark ETL job (JobCommand.Name="glueetl"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.
   * 
   */
  readonly maxCapacity?: number;
  /**
   * Maximum number of concurrent executions 
   * 
   * @see [AWS::Glue::Job ExecutionProperty](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-executionproperty.html)
   */
  readonly maxConcurrentRuns?: number;
  /**
   * The maximum number of times to retry this job after a JobRun fails. 
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-maxretries)
   */
  readonly maxRetries?: number;
  /**
   * A name for the Job 
   */
  readonly name?: string;
  /**
   * After a job run starts, the number of minutes to wait before sending a job run delay notification.
   * 
   * @see [AWS::Glue::Job NotificationProperty](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-notificationproperty.html)
   */
  readonly notifyDelayAfter?: Duration;
  /**
   * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
   */
  readonly role?: IRole;
  /**
   * The Security Configuration object to be applied to the Job 
   */
  readonly securityConfiguration?: SecurityConfiguration;
  /**
   * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-timeout)
   */
  readonly timeout?: Duration;
  /**
   * The number of worker available the Job 
   */
  readonly workerCount?: number;
  /**
   * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.
   *    - For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   *    - For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.
   *    - For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.
   * 
   * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-workertype)
   */
  readonly workerType?: WorkerType;
}

/**
 * Creates a Glue Job 
 * 
 * @see [AWS::Glue::Job](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html)
 */

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

/**
 * Creates a new instance of the Job class
 * 
 * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
 */
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
