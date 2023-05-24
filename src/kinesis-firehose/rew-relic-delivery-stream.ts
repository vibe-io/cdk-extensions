import { Duration, SecretValue } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { DeliveryStream, DeliveryStreamType } from './delivery-stream';
import { BackupConfiguration, BufferingConfiguration, CloudWatchLoggingConfiguration, ContentEncoding, HttpEndpointDestination, ProcessorConfiguration } from './lib';


export interface INewRelicEndpoint {
  readonly loggingEndpoint: string;
  readonly metricsEndpoint: string;
}

export class NewRelicEndpoint {
  public static readonly EU: INewRelicEndpoint = {
    loggingEndpoint: 'https://aws-api.eu.newrelic.com/firehose/v1',
    metricsEndpoint: 'https://aws-api.eu01.nr-data.net/cloudwatch-metrics/v1',
  };

  public static readonly US: INewRelicEndpoint = {
    loggingEndpoint: 'https://aws-api.newrelic.com/firehose/v1',
    metricsEndpoint: 'https://aws-api.newrelic.com/cloudwatch-metrics/v1',
  };
}

export enum NewRelicDeliveryStreamType {
  LOGGING = 'logging',
  METRICS = 'metrics',
}

export interface NewRelicDeliveryStreamProps {
  readonly apiKey: SecretValue;
  readonly backupConfiguration?: BackupConfiguration;
  readonly commonAttributes?: { [name: string]: string };
  readonly cloudWatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  readonly dataType?: NewRelicDeliveryStreamType;
  readonly endpoint?: INewRelicEndpoint;
  readonly processorConfiguration?: ProcessorConfiguration;
}

export class NewRelicDeliveryStream extends DeliveryStream {
  // Input properties
  public readonly dataType: NewRelicDeliveryStreamType;
  public readonly endpoint: INewRelicEndpoint;


  public constructor(scope: IConstruct, id: string, props: NewRelicDeliveryStreamProps) {
    const dataType = props.dataType ?? NewRelicDeliveryStreamType.LOGGING;
    const endpoint = props.endpoint ?? NewRelicEndpoint.US;

    const typeSpecificEndpoint = dataType === NewRelicDeliveryStreamType.LOGGING ?
      endpoint.loggingEndpoint :
      endpoint.metricsEndpoint;

    super(scope, id, {
      destination: new HttpEndpointDestination(typeSpecificEndpoint, {
        accessKey: props.apiKey,
        backupConfiguration: props.backupConfiguration,
        buffering: new BufferingConfiguration({
          interval: Duration.seconds(60),
          sizeInMb: 1,
        }),
        cloudwatchLoggingConfiguration: props.cloudWatchLoggingConfiguration,
        commonAttributes: props.commonAttributes,
        contentEncoding: ContentEncoding.GZIP,
        endpointName: 'New Relic',
        processorConfiguration: props.processorConfiguration,
        retryDuration: Duration.seconds(60),
      }),
      streamType: DeliveryStreamType.DIRECT_PUT,
    });

    this.dataType = dataType;
    this.endpoint = endpoint;
  }
}