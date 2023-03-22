import { IMachineImage } from "aws-cdk-lib/aws-ec2";
import { IConstruct } from "constructs";
import { DocumentReference } from "../ssm/lib/document-reference";
import { StepBase, StepBaseProps } from "./step-base";


export interface DeleteImageStepProps extends StepBaseProps {
  readonly image: IMachineImage | DocumentReference;
}

export class DeleteImageStep extends StepBase {
  public constructor(scope: IConstruct, id: string, props: DeleteImageStepProps) {
    super(scope, id, props);

    this.addInput('ImageId', DocumentReference.resolveUnion(props.image, (x) => {
      return x.getImage(this).imageId;
    }));
  }
}