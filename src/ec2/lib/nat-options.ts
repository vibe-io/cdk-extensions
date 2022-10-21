import { NatProvider, SubnetSelection } from 'aws-cdk-lib/aws-ec2';


export interface InternetProvider {
  readonly count?: number;
  readonly provider?: NatProvider;
  readonly subnets?: SubnetSelection;
}