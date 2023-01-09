import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { ISubnet } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';


export interface ISharedResource {
  bind(scope: IConstruct): string;
}

export class SharedResource implements ISharedResource {
  public static fromArn(arn: string): SharedResource {
    return new SharedResource(arn);
  }

  public static fromProject(project: IProject): SharedResource {
    return new SharedResource(project.projectArn);
  }

  public static fromSubnet(subnet: ISubnet): SharedResource {
    return new SharedResource(subnet.stack.formatArn({
      resource: 'subnet',
      resourceName: subnet.subnetId,
      service: 'ec2',
    }));
  }

  private readonly arn: string;

  private constructor(arn: string) {
    this.arn = arn;
  }

  public bind(_scope: IConstruct): string {
    return this.arn;
  }
}