import { ILogGroup, LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { LogLevel, LogOptions } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";


export interface ResourceManagerLogging {
  readonly destination?: ILogGroup;
  readonly enabled?: boolean;
  readonly includeExecutionData?: boolean;
  readonly logLevel?: LogLevel;
  readonly retention?: RetentionDays;
}

export function resolveLogging(scope: IConstruct, options: ResourceManagerLogging = {}): LogOptions | undefined {
  if ((options.enabled ?? true) === false) {
    return undefined;
  }

  return {
    destination: options.destination ?? new LogGroup(scope, 'log-group', {
      logGroupName: `/aws/vendedlogs/states/${scope.node.id}`,
      retention: options.retention ?? RetentionDays.TWO_WEEKS,
    }),
    includeExecutionData: options.includeExecutionData ?? true,
    level: options.logLevel ?? LogLevel.ALL,
  };
}