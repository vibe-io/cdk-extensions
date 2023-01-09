import { Duration, Lazy, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { undefinedIfNoKeys } from '../../../utils/formatting';


/**
 * Configuration for the Workflow Action resource.
 */
export interface WorkflowActionOptions extends ResourceProps {
  readonly arguments?: {[key: string]: string};
  readonly notifyDelayAfter?: Duration;
  readonly securityConfiguration?: string;
  readonly timeout?: Duration;
}

export class WorkflowActionBase {
  // Internal properties
  private readonly _arguments: {[key: string]: string} = {};

  // Input properties
  public readonly notifyDelayAfter?: Duration;
  public readonly securityConfiguration?: string;
  public readonly timeout?: Duration;


  constructor(options?: WorkflowActionOptions) {
    this.notifyDelayAfter = options?.notifyDelayAfter;
    this.securityConfiguration = options?.securityConfiguration;
    this.timeout = options?.timeout;

    const args = options?.arguments ?? {};
    Object.keys(args).forEach((x) => {
      this.addArgument(x, args[x]);
    });
  }

  public addArgument(key: string, value: string): void {
    this._arguments[key] = value;
  }

  protected bindOptions(_scope: IConstruct): any {
    return {
      arguments: Lazy.uncachedAny({
        produce: () => {
          return !!Object.keys(this._arguments).length ? this._arguments : undefined;
        },
      }),
      notificationProperty: undefinedIfNoKeys({
        notifyDelayAfter: this.notifyDelayAfter?.toMinutes(),
      }),
      securityConfiguration: this.securityConfiguration,
      timeout: this.timeout?.toMinutes(),
    };
  }
}