import { Annotations, RemovalPolicy } from 'aws-cdk-lib';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { ILogGroup, ILogStream, LogGroup, LogStream, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined } from '../../utils/formatting';


export interface CloudWatchLoggingConfigurationOptions {
  readonly enabled?: boolean;
  readonly logGroup?: ILogGroup;
  readonly logStream?: ILogStream;
}

export class CloudWatchLoggingConfiguration {
  // Internal properties
  private _logGroup?: ILogGroup;
  private _logStream?: ILogStream;

  // Input properties
  public readonly enabled?: boolean;

  // Internal accessors
  public get logGroup(): ILogGroup | undefined {
    return this._logGroup;
  }

  public get logStream(): ILogStream | undefined {
    return this._logStream;
  }


  public constructor(options: CloudWatchLoggingConfigurationOptions) {
    this.enabled = options.enabled;
    this._logGroup = options.logGroup;
    this._logStream = options.logStream;

    if (this.enabled === undefined && (this.logGroup || this.logStream)) {
      this.enabled = true;
    }
  }

  public bind(scope: IConstruct): CfnDeliveryStream.CloudWatchLoggingOptionsProperty | undefined {
    if (this.enabled && !this.logGroup) {
      const logGroup = scope.node.tryFindChild('delivery-stream-log-group') as ILogGroup;

      this._logGroup = logGroup ?? new LogGroup(scope, 'delivery-stream-log-group', {
        removalPolicy: RemovalPolicy.DESTROY,
        retention: RetentionDays.TWO_WEEKS,
      });
    }

    if (this.enabled && !this.logStream) {
      const logStream = scope.node.tryFindChild('delivery-stream-log-stream') as ILogStream;

      if (logStream) {
        this._logStream = logStream;
      } else if (this.logGroup) {
        this._logStream = this._logStream = new LogStream(scope, 'delivery-stream-log-stream', {
          logGroup: this.logGroup,
          removalPolicy: RemovalPolicy.DESTROY,
        });
      } else {
        Annotations.of(scope).addError([
          'When specifying Firehose Delivery Stream logging',
          'configuration you cannot specify a log stream without',
          'also specifying a log group.',
        ].join(' '));
      }
    }

    return definedFieldsOrUndefined({
      enabled: this.enabled,
      logGroupName: this.logGroup?.logGroupName,
      logStreamName: this.logStream?.logStreamName,
    });
  }
}
