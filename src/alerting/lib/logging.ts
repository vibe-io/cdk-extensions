import { ILogGroup } from 'aws-cdk-lib/aws-logs';
import { LogLevel } from 'aws-cdk-lib/aws-stepfunctions';


export interface StateMachineLogging {
  readonly enabled?: boolean;
  readonly destination?: ILogGroup;
  readonly includeExecutionData?: boolean;
  readonly level?: LogLevel;
}