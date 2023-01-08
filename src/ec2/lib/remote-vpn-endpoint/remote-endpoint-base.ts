import { IConstruct } from 'constructs';


/**
 * Configuration object containing the vlues needed to configure the remote end
 * of a VPN connection.
 */
export interface RemoteVpnEndpointConfiguration {
  /**
   * The BGP ASN of the customer gateway which is configured with the details
   * of the remote endpoint device.
   */
  readonly customerGatewayAsn: number;

  /**
   * The ID of the customer gateway which is configured with the details of the
   * remote endpoint device.
   */
  readonly customerGatewayId: string;

  /**
   * The IP address of the customer gateway which is configured with the
   * details of the remote endpoint device.
   */
  readonly customerGatewayIp: string;

}

/**
 * An object that can be used to retrieve the details for the remote end of a
 * VPN connection.
 */
export interface IRemoteVpnEndpoint {
  /**
   * Produces a configuration that can be used when configuring the remote
   * end of a VPN connection.
   *
   * @param scope The construct configuring the VPN connection that will be
   * referencing the remote endpoint.
   */
  bind(scope: IConstruct): RemoteVpnEndpointConfiguration;
}