import { ArnFormat, Lazy, Stack } from "aws-cdk-lib";
import { Effect, IRole, IUser, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { IConstruct } from "constructs";
import { DocumentReference } from "../ssm/lib/document-reference";
import { StepBase, StepBaseProps } from "./step-base";


export interface ApproverDetails {
  readonly principal: string;
}

export interface IApprover {
  bind(scope: IConstruct): ApproverDetails;
}

export class Approver {
  public static assumedRole(role: IRole, sessionName: string): IApprover {
    return {
      bind: (scope: IConstruct) => {
        return {
          principal: Stack.of(scope).formatArn({
            account: Stack.of(scope).splitArn(role.roleArn, ArnFormat.SLASH_RESOURCE_NAME).account,
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            region: '',
            resource: 'assumed-role',
            resourceName: `${role.roleName}/${sessionName}`,
            service: 'sts',
          }),
        };
      }
    };
  }

  public static role(principal: IRole): IApprover {
    return {
      bind: (_scope: IConstruct) => {
        return {
          principal: principal.roleArn,
        };
      }
    };
  }

  public static user(principal: IUser): IApprover {
    return {
      bind: (_scope: IConstruct) => {
        return {
          principal: principal.userArn,
        };
      }
    };
  }

  public static of(principalArn: string): IApprover {
    return {
      bind: (_scope: IConstruct) => {
        return {
          principal: principalArn,
        };
      }
    };
  }
}

export interface ApproveStepProps extends StepBaseProps {
  readonly approvers?: IApprover[] | DocumentReference;
  readonly message?: string;
  readonly minRequiredApprovals?: number;
  readonly notificationTopic?: ITopic | DocumentReference;
}

export class ApproveStep extends StepBase {
  private readonly _approvers: IApprover[];
  private readonly _permissions: PolicyStatement[];

  public readonly approversLocked: boolean;
  public readonly message?: string;
  public readonly minRequiredApprovals?: number;

  public get approvers(): IApprover[] {
    return [...this._approvers];
  }


  public constructor(scope: IConstruct, id: string, props: ApproveStepProps) {
    super(scope, id, props);

    this._approvers = [];
    this._permissions = [];

    this.message = props.message;
    this.minRequiredApprovals = props.minRequiredApprovals;

    if (this.message) {
      this.addInput('Message', this.message);
    }
    if (this.minRequiredApprovals) {
      this.addInput('MinRequiredApprovals', this.minRequiredApprovals);
    }
    if (props.notificationTopic) {
      if (DocumentReference.isReference(props.notificationTopic)) {
        this.addInput('NotificationArn', props.notificationTopic.valueAsString);

        this._permissions.push(new PolicyStatement({
          actions: [
            'sns:Publish'
          ],
          effect: Effect.ALLOW,
          resources: [
            Stack.of(this).formatArn({
              account: '*',
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
              region: '*',
              resource: 'topic',
              resourceName: '*',
              service: 'sns',
            }),
          ],
        }));
      } else {
        this.addInput('NotificationArn', props.notificationTopic.topicArn);

        this._permissions.push(new PolicyStatement({
          actions: [
            'sns:Publish'
          ],
          effect: Effect.ALLOW,
          resources: [
            props.notificationTopic.topicArn,
          ],
        }));
      }
    }

    if (DocumentReference.isReference(props.approvers)) {
      this.addInput('Approvers', props.approvers.valueAsString);
      this.approversLocked = true;
    } else {
      this.addInput('Approvers', Lazy.list({
        produce: () => {
          const resolved = this._approvers.map((x) => {
            return x.bind(scope).principal;
          });
  
          if (resolved.length === 0) {
            throw new Error([
              'An automation approval step requires at least one approver.',
              'Add an approver by passing them to the constructor or calling',
              "the 'addApprover' method.",
            ].join(' '));
          }
  
          return resolved;
        }
      }));

      props.approvers?.forEach((x) => {
        this.addApprover(x);
      });
      this.approversLocked = false;
    }
  }

  public addApprover(approver: IApprover): ApproveStep {
    if (this.approversLocked) {
      throw new Error([
        'Cannot add a new approver to an Automation approve step when the',
        'for the approvers list is being read from a parameter or elsewhere in',
        'the document.',
      ].join(' '));
    }

    this._approvers.push(approver);
    return this;
  }

  public bind(scope: IConstruct): { [key: string]: any; } {
    return super.bind(scope);
  }
}