import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { ISubnet } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { ITransitGateway } from '../ec2';
import { ISharable } from '../ram';


export class SharedResource implements ISharable {
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

  public static fromTransitGateway(transitGateway: ITransitGateway): SharedResource {
    return new SharedResource(transitGateway.transitGatewayArn);
  }

  private readonly arn: string;

  private constructor(arn: string) {
    this.arn = arn;
  }

  public share(_scope: IConstruct): string {
    return this.arn;
  }
}