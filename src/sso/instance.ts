import { Fn, Resource, Stack, Token } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export interface IInstance {
  /**
   * The ARN of the IAM Identity Center instance under which the operation will be executed. For more information about ARNs, see Amazon Resource Names (ARNs) and AWS Service Namespaces in the AWS General Reference.
   * 
   * @see [AWS::SSO::Assignment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-instancearn)
   */
  readonly instanceArn: string;
  /**
   * The ID of the IAM Identity Center instance under which the operation will be executed. 
   */
  readonly instanceId: string;
}

export abstract class InstanceBase extends Resource implements IInstance {
  readonly abstract instanceArn: string;
  readonly abstract instanceId: string;
}

export class Instance {
  public static fromArn(scope: IConstruct, id: string, arn: string): IInstance {
    class Import extends InstanceBase {
      public readonly instanceArn: string = arn;
      public readonly instanceId: string = Token.isUnresolved(arn) ? Fn.select(1, Fn.split('/', arn, 2)) : arn.split('/')[1];

      public constructor() {
        super(scope, id);
      }
    }

    return new Import();
  }

  public static fromInstanceId(scope: IConstruct, id: string, instanceId: string): IInstance {
    return Instance.fromArn(scope, id, Stack.of(scope).formatArn({
      account: '',
      region: '',
      resource: 'instance',
      resourceName: instanceId,
      service: 'sso',
    }));
  }
}