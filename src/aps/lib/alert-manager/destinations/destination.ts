import { ITopic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerSnsDestination, AlertManagerSnsDestinationOptions } from './sns-destination';


/**
 * Provides an interface for creating various alert manager destination objects
 * that can receive notifications when an alert happens in Prometheus.
 */
export class AlertManagerDestination {
  /**
   * Creates an alert manager destination that sends alert notifications to an
   * Amazon SNS topic.
   *
   * @param topic The SNS topic where alert notifications should be sent.
   * @param options Options controlling aspects of how alert notification
   * should be handled when being sent to the SNS topic.
   * @returns An alert manager destination that represents the SNS topic.
   */
  public static snsTopic(topic: ITopic, options?: AlertManagerSnsDestinationOptions): AlertManagerSnsDestination {
    return new AlertManagerSnsDestination({
      topic: topic,
      ...(options ?? {}),
    });
  }
}