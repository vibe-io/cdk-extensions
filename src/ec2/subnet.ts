import { Stack, ResourceEnvironment, RemovalPolicy, ResourceProps } from 'aws-cdk-lib';
import { INetworkAcl, IRouteTable, ISubnet } from 'aws-cdk-lib/aws-ec2';
import { Construct, IDependable, Node } from 'constructs';


export class Subnet implements ISubnet {
  public constructor(scope: Construct, id: string, props: ResourceProps = {}) {

  }

  availabilityZone: string;
  subnetId: string;
  internetConnectivityEstablished: IDependable;
  ipv4CidrBlock: string;
  routeTable: IRouteTable;
  associateNetworkAcl(id: string, acl: INetworkAcl): void {
    throw new Error('Method not implemented.');
  }
  stack: Stack;
  env: ResourceEnvironment;
  applyRemovalPolicy(policy: RemovalPolicy): void {
    throw new Error('Method not implemented.');
  }
  node: Node;

}