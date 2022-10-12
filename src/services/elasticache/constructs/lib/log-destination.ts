import { CfnReplicationGroup } from 'aws-cdk-lib/aws-elasticache';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { IConstruct } from 'constructs';
import { IDeliveryStream } from '../../../kinesis-firehose/constructs/delivery-stream';


export enum LogDestinationType {
  CLOUDWATCH = 'cloudwatch-logs',
  FIREHOSE = 'kinesis-firehose'
}

export interface LogDestinationConfiguration {
  destinationDetails: CfnReplicationGroup.DestinationDetailsProperty;
  destinationType: LogDestinationType;
}

export class LogDestination {
  public static cloudwatch(logGroup: ILogGroup): LogDestination {
    return new LogDestination({
      destinationDetails: {
        cloudWatchLogsDetails: {
          logGroup: logGroup.logGroupName,
        },
      },
      destinationType: LogDestinationType.CLOUDWATCH,
    });
  }

  public static firehose(deliveryStream: IDeliveryStream): LogDestination {
    return new LogDestination({
      destinationDetails: {
        kinesisFirehoseDetails: {
          deliveryStream: deliveryStream.deliveryStreamName,
        },
      },
      destinationType: LogDestinationType.FIREHOSE,
    });
  }


  private configuration: LogDestinationConfiguration;

  private constructor(configuration: LogDestinationConfiguration) {
    this.configuration = configuration;
  }

  public bind(_scope: IConstruct): LogDestinationConfiguration {
    return this.configuration;
  }
}
