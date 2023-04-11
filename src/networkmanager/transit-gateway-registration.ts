import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnTransitGatewayRegistration } from 'aws-cdk-lib/aws-networkmanager';
import { IConstruct } from 'constructs';
import { IGlobalNetwork } from './global-network';
import { ITransitGateway } from '../ec2';


export interface ITransitGatewayRegistration {}

abstract class TransitGatewayRegistrationBase extends Resource implements ITransitGatewayRegistration {}

export interface TransitGatewayRegistrationProps extends ResourceProps {
  readonly globalNetwork: IGlobalNetwork;
  readonly transitGateway: ITransitGateway;
}

export class TransitGatewayRegistration extends TransitGatewayRegistrationBase {
  // Input properties
  public readonly globalNetwork: IGlobalNetwork;
  public readonly transitGateway: ITransitGateway;

  // Resource properties
  public readonly resource?: CfnTransitGatewayRegistration;


  public constructor(scope: IConstruct, id: string, props: TransitGatewayRegistrationProps) {
    super(scope, id, props);

    this.globalNetwork = props.globalNetwork;
    this.transitGateway = props.transitGateway;

    this.resource = new CfnTransitGatewayRegistration(this, 'Resource', {
      globalNetworkId: this.globalNetwork.globalNetworkId,
      transitGatewayArn: this.transitGateway.transitGatewayArn,
    });
  }
}