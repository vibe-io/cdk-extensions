import { Names, Stack } from "aws-cdk-lib";
import { IMachineImage } from "aws-cdk-lib/aws-ec2";
import { IKey } from "aws-cdk-lib/aws-kms";
import { IConstruct } from "constructs";
import { DocumentReference } from "../ssm/lib/document-reference";
import { StepBase, StepBaseProps } from "./step-base";


export interface CopyImageStepProps extends StepBaseProps {
  readonly clientToken?: string;
  readonly encrypted?: string;
  readonly encryptionKey?: IKey | DocumentReference;
  readonly imageDescription?: string;
  readonly imageName?: string;
  readonly sourceImage: IMachineImage | DocumentReference;
  readonly sourceRegion?: string;
}

export class CopyImageStep extends StepBase {
  public readonly clientToken?: string;
  public readonly encrypted?: string;
  public readonly imageDescription?: string;
  public readonly imageName?: string;
  public readonly sourceRegion?: string;

  public constructor(scope: IConstruct, id: string, props: CopyImageStepProps) {
    super(scope, id, props);

    this.clientToken = props.clientToken;
    this.encrypted = props.encrypted;
    this.imageDescription = props.imageDescription;
    this.imageName = props.imageName ?? Names.uniqueId(this);
    this.sourceRegion = props.sourceRegion ?? Stack.of(this).region;

    this.addInput('ImageName', this.imageName);
    this.addInput('SourceImageId', DocumentReference.resolveUnion(props.sourceImage, (x) => {
      return x.getImage(this).imageId;
    }));
    this.addInput('SourceRegion', this.sourceRegion);

    if (this.clientToken !== undefined) {
      this.addInput('ClientToken', this.clientToken);
    }
    if (this.encrypted !== undefined) {
      this.addInput('Encrypted', this.encrypted);
    }
    if (this.imageDescription !== undefined) {
      this.addInput('ImageDescription', this.imageDescription);
    }

    if (props.encryptionKey !== undefined) {
      this.addInput('KmsKeyId', DocumentReference.resolveUnion(props.encryptionKey, (x) => {
        return x.keyArn;
      }));
    }
  }
}