import { Annotations, Lazy, Token } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";
import { StepBase, StepBaseProps } from "./step-base";


export interface ExecuteAwsApiCallStepProps extends StepBaseProps {
  readonly actionOverride?: string;
  readonly api: string;
  readonly iamResources?: string[];
  readonly service: string;
}

export class ExecuteAwsApiCallStep extends StepBase {
  private readonly _iamResources: string[];
  private readonly _permissions: PolicyStatement[];

  public readonly api: string;
  public readonly service: string;


  public constructor(scope: IConstruct, id: string, props: ExecuteAwsApiCallStepProps) {
    super(scope, id, props);

    this._iamResources = [];
    this._permissions = [];

    this.api = props.api;
    this.service = props.service;

    this.addInput('Api', props.api);
    this.addInput('Service', props.service);

    const action = props.actionOverride ?? `${this.service}:${this.api}`;
    if (Token.isUnresolved(this.service) || Token.isUnresolved(this.api)) {
      throw new Error([
        "When an ExecuteAwsApiCall step has an 'service' or 'api' property",
        "containing tokens the 'actionOverride' property is required.",
      ].join(' '));
    }

    this._permissions.push(new PolicyStatement({
      actions: [
        action,
      ],
      effect: Effect.ALLOW,
      resources: Lazy.list({
        produce: () => {
          if (this._iamResources.length > 0) {
            return this._iamResources;
          } else {
            Annotations.of(this).addWarning([
              'ExecuteAwsApiCall step has an implicit global allow for the',
              `${action} AWS API call. This is a security liability. It is`,
              'highly recommended that the resources that are allowed be',
              "limited by specifying the 'iamResources' property or calling",
              "the 'addIamResource' method.",
            ].join(' '));

            return [
              '*'
            ];
          }
        }
      })
    }));
  }
}