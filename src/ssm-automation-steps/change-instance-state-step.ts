/*import { Duration } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { AutomationStepBase, AutomationStepBaseProps } from "./step-base";


export class AutomationInstanceDesiredState {
  public static readonly RUNNING: AutomationInstanceDesiredState = AutomationInstanceDesiredState.of('running');
  public static readonly STOPPED: AutomationInstanceDesiredState = AutomationInstanceDesiredState.of('stopped');
  public static readonly TERMINATED: AutomationInstanceDesiredState = AutomationInstanceDesiredState.of('terminated');

  public static of(value: string): AutomationInstanceDesiredState {
    return new AutomationInstanceDesiredState(value);
  }


  public constructor(public readonly value: string) {}
}

export interface AutomationChangeInstanceStateStepProps extends AutomationStepBaseProps {
  readonly checkStateOnly?: boolean;
  readonly desiredState: AutomationInstanceDesiredState;
  readonly force?: boolean;
  readonly instances: ;
}

export class AutomationChangeInstanceStateStep extends AutomationStepBase {
  public readonly checkStateOnly?: boolean;
  public readonly desiredState: AutomationInstanceDesiredState;
  public readonly force?: boolean;


  public constructor(scope: IConstruct, id: string, props: AutomationChangeInstanceStateStepProps) {
    super(scope, id, props);

    this.checkStateOnly = props.force;
    this.desiredState = props.desiredState;
    this.force = props.force;

    this.addInput('DesiredState', this.desiredState.value);

    if (this.checkStateOnly !== undefined) {
      this.addInput('CheckStateOnly', this.checkStateOnly);
    }
    if (this.force !== undefined) {
      this.addInput('Force', this.force);
    }
  }
}*/