import { IConstruct } from 'constructs';
import { ILocalVpnEndpoint, LocalVpnEndpointConfiguration } from '.';
import { ITransitGateway } from '../..';


/**
 * Specifies a VPN connection endpoint which routes to a transit gateway on the
 * AWS side.
 */
export class TransitGatewayLocalVpnEndpoint implements ILocalVpnEndpoint {
  /**
   * The transit gateway that serves as the local end of a VPN connection.
   *
   * @group Inputs
   */
  public readonly transitGateway: ITransitGateway;


  /**
   * Creates a new instance of the TransitGatewayLocalVpnEndpoint class.
   *
   * @param transitGateway The transit gateway that serves as the local end of
   * a VPN connection.
   */
  public constructor(transitGateway: ITransitGateway) {
    this.transitGateway = transitGateway;
  }

  /**
   * Produces a configuration that can be used when configuring the local
   * end of a VPN connection.
   *
   * @param _scope The construct configuring the VPN connection that will be
   * referencing the local endpoint.
   */
  bind(_scope: IConstruct): LocalVpnEndpointConfiguration {
    return {
      transitGatewayId: this.transitGateway.transitGatewayId,
    };
  }
}
