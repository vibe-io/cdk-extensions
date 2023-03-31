import { IConstruct } from 'constructs';


/**
 * Configuration object containing the vlues needed to configure the local end
 * of a VPN connection.
 */
export interface LocalVpnEndpointConfiguration {
  /**
   * The ID of the transit gateway that serves as the local end of the VPN
   * connection.
   */
  readonly transitGatewayId?: string;

  /**
   * The ID of the VPN gateway that serves as the local end of the VPN
   * connection.
   */
  readonly vpnGatewayId?: string;
}

export interface ILocalVpnEndpoint {
  /**
   * Produces a configuration that can be used when configuring the local end
   * of a VPN connection.
   *
   * @param scope The construct configuring the VPN connection that will be
   * referencing the local endpoint.
   */
  bind(scope: IConstruct): LocalVpnEndpointConfiguration;
}