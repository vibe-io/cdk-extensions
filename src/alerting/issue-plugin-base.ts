import { Resource, ResourceProps } from 'aws-cdk-lib';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LogLevel, LogOptions } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { StateMachineLogging } from './lib/logging';


export interface IssuePluginBaseProps extends ResourceProps {
  readonly logging?: StateMachineLogging;
}

export abstract class IssuePluginBase extends Resource {
  public readonly logging: StateMachineLogging;

  public constructor(scope: IConstruct, id: string, props: IssuePluginBaseProps) {
    super(scope, id, props);

    this.logging = props.logging ?? {
      includeExecutionData: true,
      level: LogLevel.ALL,
    };
  }

  protected buildLogging(): LogOptions | undefined {
    return this.logging.enabled === false ? undefined : {
      ...this.logging,
      destination: this.logging.destination ?? new LogGroup(this, 'log-group', {
        retention: RetentionDays.TWO_WEEKS,
      }),
    };
  }
}