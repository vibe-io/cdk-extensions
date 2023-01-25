import { ITopic } from 'aws-cdk-lib/aws-sns';
import { AlertManagerSnsDestination, AlertManagerSnsDestinationOptions } from './sns-destination';


export class AlertManagerDestination {
  public static snsTopic(topic: ITopic, options?: AlertManagerSnsDestinationOptions): AlertManagerSnsDestination {
    return new AlertManagerSnsDestination({
      topic: topic,
      ...(options ?? {}),
    });
  }
}