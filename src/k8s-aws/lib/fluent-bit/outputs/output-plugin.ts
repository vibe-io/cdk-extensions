import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { IDomain } from 'aws-cdk-lib/aws-opensearchservice';
import { FluentBitCloudWatchLogsOutput, FluentBitKinesisFirehoseOutput, FluentBitKinesisOutput, FluentBitLogGroupOutput, FluentBitOpenSearchOutput, IFluentBitOutputPlugin } from '.';
import { IDeliveryStream } from '../../../../kinesis-firehose';


/**
 * Common options that allow configuration of destinations where Fluent Bit
 * should send records after processing.
 */
export class FluentBitOutput {
  /**
     * Sends matched records to a CloudWatch Logs log group.
     *
     * @param match A pattern filtering to which records the output should be
     * applied.
     * @param logGroup The log group where matched records should be sent.
     * @returns An output filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static cloudwatchLogs(match: string, logGroup: ILogGroup): IFluentBitOutputPlugin {
    return new FluentBitCloudWatchLogsOutput({
      logGroup: FluentBitLogGroupOutput.fromLogGroup(logGroup),
      match: match,
    });
  }

  /**
     * Sends matched records to a Kinesis data stream.
     *
     * @param match A pattern filtering to which records the output should be
     * applied.
     * @param stream The Kinesis stream where matched records should be sent.
     * @returns An output filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static kinesis(match: string, stream: IStream): IFluentBitOutputPlugin {
    return new FluentBitKinesisOutput({
      match: match,
      stream: stream,
    });
  }

  /**
     * Sends matched records to a Kinesis Firehose delivery stream.
     *
     * @param match A pattern filtering to which records the output should be
     * applied.
     * @param deliveryStream The Firehose delivery stream where matched
     * records should be sent.
     * @returns An output filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static kinesisFirehose(match: string, deliveryStream: IDeliveryStream): IFluentBitOutputPlugin {
    return new FluentBitKinesisFirehoseOutput({
      deliveryStream: deliveryStream,
      match: match,
    });
  }

  /**
     * Sends matched records to an OpenSearch domain.
     *
     * @param match A pattern filtering to which records the output should be
     * applied.
     * @param domain The OpenSearch domain where matched records should be
     * sent.
     * @returns An output filter object that can be applied to the Fluent Bit
     * configuration.
     */
  public static opensearch(match: string, domain: IDomain): IFluentBitOutputPlugin {
    return new FluentBitOpenSearchOutput({
      domain: domain,
      match: match,
    });
  }
}