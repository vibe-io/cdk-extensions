import { ArnFormat, Duration, Lazy, SecretValue, Stack } from 'aws-cdk-lib';
import { Effect, IRole, PolicyStatement, PrincipalWithConditions, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { definedFieldsOrUndefined, undefinedIfNoKeys } from '../../../../utils/formatting';
import { BackupConfiguration } from '../backup-configuration';
import { BufferingConfiguration } from '../buffering-configuration';
import { CloudWatchLoggingConfiguration } from '../cloudwatch-logging-configuration';
import { ProcessorConfiguration } from '../processor-configuration';
import { DeliveryStreamProcessor } from '../processors/delivery-stream-processor';
import { DeliveryStreamDestination, DeliveryStreamDestinationConfiguration } from './delivery-stream-destination';
import { S3CompressionFormat, S3Destination } from './s3-destination';


export enum ContentEncoding {
  GZIP = 'GZIP',
  NONE = 'NONE'
}

export interface HttpEndpointDestinationOptions {
  readonly accessKey?: SecretValue;
  readonly backupConfiguration?: BackupConfiguration;
  readonly buffering?: BufferingConfiguration;
  readonly cloudwatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  readonly commonAttributes?: {[name: string]: string};
  readonly contentEncoding?: ContentEncoding;
  readonly endpointName?: string;
  readonly processorConfiguration?: ProcessorConfiguration;
  readonly retryDuration?: Duration;
}

export class HttpEndpointDestination extends DeliveryStreamDestination {
  // Internal properties
  private readonly _commonAttributes: {[name: string]: string} = {};
  private _processingEnabled?: boolean;
  private _processors: DeliveryStreamProcessor[] = [];
  private _role?: IRole;

  // Input properties
  public readonly accessKey?: SecretValue;
  public readonly backupConfiguration?: BackupConfiguration;
  public readonly buffering?: BufferingConfiguration;
  public readonly cloudwatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  public readonly commonAttributes?: {[name: string]: string};
  public readonly contentEncoding?: ContentEncoding;
  public readonly endpointName?: string;
  public readonly endpointUrl: string;
  public readonly processorConfiguration?: ProcessorConfiguration;
  public readonly retryDuration?: Duration;

  // Internal accessors
  public get processingEnabled(): boolean {
    return this._processingEnabled ?? !!this._processors?.length;
  }

  public get role(): IRole | undefined {
    return this._role;
  }


  public constructor(url: string, options: HttpEndpointDestinationOptions = {}) {
    super();

    this.accessKey = options.accessKey;
    this.backupConfiguration = options.backupConfiguration;
    this.buffering = options.buffering;
    this.cloudwatchLoggingConfiguration = options.cloudwatchLoggingConfiguration;
    this.contentEncoding = options.contentEncoding;
    this.endpointName = options.endpointName;
    this.endpointUrl = url;
    this.processorConfiguration = options.processorConfiguration;
    this.retryDuration = options.retryDuration;

    if (options.commonAttributes) {
      const commonAttributes = options.commonAttributes;
      Object.keys(commonAttributes).forEach((x) => {
        this.addCommonAttribute(x, commonAttributes[x]);
      });
    }
  }

  public addCommonAttribute(name: string, value: string): HttpEndpointDestination {
    this._commonAttributes[name] = value;
    return this;
  }

  public addProcessor(processor: DeliveryStreamProcessor): HttpEndpointDestination {
    this._processors.push(processor);
    return this;
  }

  public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration {
    const processorConfiguration = this.processorConfiguration?.bind(scope);

    this._processingEnabled = processorConfiguration?.enabled;
    processorConfiguration?.processors.forEach((x) => {
      this.addProcessor(x);
    });

    if (this.cloudwatchLoggingConfiguration?.enabled) {
      const role = this.getOrCreateRole(scope);
      const logGroupScope = this.cloudwatchLoggingConfiguration.logGroup?.logGroupName ?? '*';
      const logStreamScope = this.cloudwatchLoggingConfiguration.logStream?.logStreamName ?? '*';

      role.addToPrincipalPolicy(new PolicyStatement({
        actions: [
          'logs:PutLogEvents',
        ],
        effect: Effect.ALLOW,
        resources: [
          Stack.of(this.cloudwatchLoggingConfiguration.logGroup ?? scope).formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'log-group',
            resourceName: `${logGroupScope}:log-stream:${logStreamScope}`,
            service: 'logs',
          }),
        ],
      }));

      this._role = role;
    }

    const backupConfiguration = this.buildBackupConfiguration(scope).bind(scope);

    return {
      httpEndpointDestinationConfiguration: {
        ...backupConfiguration,
        bufferingHints: this.buffering?.bind(scope),
        cloudWatchLoggingOptions: this.cloudwatchLoggingConfiguration?.bind(scope),
        endpointConfiguration: {
          accessKey: this.accessKey?.toString(),
          name: this.endpointName,
          url: this.endpointUrl,
        },
        processingConfiguration: Lazy.any({
          produce: () => {
            return this.renderProcessorConfiguration(scope);
          },
        }),
        requestConfiguration: definedFieldsOrUndefined({
          commonAttributes: Lazy.any({
            produce: () => {
              return !Object.keys(this._commonAttributes).map((x) => {
                return {
                  attributeName: x,
                  attributeValue: this._commonAttributes[x],
                };
              });
            },
          }),
          contentEncoding: this.contentEncoding,
        }),
        retryOptions: undefinedIfNoKeys({
          durationInSeconds: this.retryDuration?.toSeconds(),
        }),
        roleArn: this.role?.roleArn,
        s3BackupMode: backupConfiguration.s3BackupMode,
        s3Configuration: backupConfiguration.s3BackupConfiguration,
      },
    };
  }

  protected buildBackupConfiguration(scope: IConstruct): BackupConfiguration {
    if (this.backupConfiguration) {
      return this.backupConfiguration;
    } else {
      const bucket = new Bucket(scope, 'http-endpoint-backup-bucket', {
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
        versioned: true,
      });

      return new BackupConfiguration({
        destination: new S3Destination(bucket, {
          cloudwatchLoggingConfiguration: this.cloudwatchLoggingConfiguration,
          compressionFormat: S3CompressionFormat.GZIP,
          role: this.getOrCreateRole(scope),
        }),
      });
    }
  }

  protected getOrCreateRole(scope: IConstruct): IRole {
    if (this.role) {
      return this.role;
    } else {
      this._role = new Role(scope, 'http-endpoint-delivery-role', {
        assumedBy: new PrincipalWithConditions(
          new ServicePrincipal('firehose.amazonaws.com'),
          {
            StringEquals: {
              'sts:ExternalId': Stack.of(scope).account,
            },
          },
        ),
      });

      return this._role;
    }
  }

  protected renderProcessorConfiguration(scope: IConstruct): CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
    return definedFieldsOrUndefined({
      enabled: this.processingEnabled,
      processors: this._processors.map((x) => {
        return x.bind(scope);
      }),
    });
  }
}