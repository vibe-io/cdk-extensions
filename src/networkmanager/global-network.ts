import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnGlobalNetwork } from 'aws-cdk-lib/aws-networkmanager';
import { IConstruct } from 'constructs';
import { ITransitGatewayRegistration, TransitGatewayRegistration } from './transit-gateway-registration';
import { ITransitGateway } from '../ec2';


export interface IGlobalNetwork {
  readonly globalNetworkArn: string;
  readonly globalNetworkId: string;
}

export interface GlobalNetworkProps extends ResourceProps {
  readonly description?: string;
}

export interface RegisterTransitGatewayProps {
  readonly transitGateway: ITransitGateway;
}

abstract class GlobalNetworkBase extends Resource implements IGlobalNetwork {
  public abstract readonly globalNetworkArn: string;
  public abstract readonly globalNetworkId: string;
}

export class GlobalNetwork extends GlobalNetworkBase {
  // Input properties
  public readonly description?: string;

  // Resource properties
  public readonly resource?: CfnGlobalNetwork;

  public readonly globalNetworkArn: string;
  public readonly globalNetworkId: string;


  public constructor(scope: IConstruct, id: string, props: GlobalNetworkProps = {}) {
    super(scope, id, props);

    this.description = props.description;

    this.resource = new CfnGlobalNetwork(this, 'Resource', {
      description: this.description,
    });

    this.globalNetworkArn = this.resource.attrArn;
    this.globalNetworkId = this.resource.ref;
  }

  public registerTransitGateway(id: string, options: RegisterTransitGatewayProps): ITransitGatewayRegistration {
    return new TransitGatewayRegistration(this, `transit-gateway-registration-${id}`, {
      globalNetwork: this,
      transitGateway: options.transitGateway,
    });
  }
}