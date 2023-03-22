import { Annotations, Lazy, Token } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";
import { StepBase, StepBaseProps } from "./step-base";


export interface WaitForAwsResourcePropertyStepProps extends StepBaseProps {
  readonly actionOverride?: string;
  readonly api: string;
  readonly desiredValues?: string[];
  readonly iamResources?: string[];
  readonly propertySelector: string;
  readonly service: string;
}

export class WaitForAwsResourcePropertyStep extends StepBase {
  private readonly _desiredValues: string[];
  private readonly _iamResources: string[];
  private readonly _permissions: PolicyStatement[];

  public readonly api: string;
  public readonly propertySelector: string;
  public readonly service: string;

  public get desiredValues(): string[] {
    return [...this._desiredValues];
  }


  public constructor(scope: IConstruct, id: string, props: WaitForAwsResourcePropertyStepProps) {
    super(scope, id, props);

    this._desiredValues = [];
    this._iamResources = [];
    this._permissions = [];

    this.api = props.api;
    this.propertySelector = props.propertySelector;
    this.service = props.service;

    this.addInput('Api', this.api);
    this.addInput('DesiredValues', Lazy.list({
      produce: () => {
        return this._desiredValues;
      }
    }));
    this.addInput('PropertySelector', this.propertySelector);
    this.addInput('Service', this.service);

    const action = props.actionOverride ?? `${this.service}:${this.api}`;
    if (Token.isUnresolved(this.service) || Token.isUnresolved(this.api)) {
      throw new Error([
        "When an WaitForAwsResourceProperty step has an 'service' or 'api'",
        "property containing tokens the 'actionOverride' property is",
        'required.',
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
              'WaitForAwsResourceProperty step has an implicit global allow',
              `for the ${action} AWS API call. This is a security liability.`,
              'It is highly recommended that the resources that are allowed',
              "be limited by specifying the 'iamResources' property or",
              "calling the 'addIamResource' method.",
            ].join(' '));

            return [
              '*'
            ];
          }
        }
      })
    }));

    props.desiredValues?.forEach((x) => {
      this.addDesiredValue(x);
    });
  }

  public addDesiredValue(value: string): WaitForAwsResourcePropertyStep {
    this._desiredValues.push(value);
    return this;
  }
}