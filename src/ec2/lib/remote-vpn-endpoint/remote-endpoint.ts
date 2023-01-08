import { CustomerGatewayProps, ICustomerGateway } from '../../customer-gateway';
import { CustomerGatewayRemoteVpnEndpoint } from './customer-gateway';
import { CustomerGatewayConfigurationRemoteVpnEndpoint } from './customer-gateway-configuration';


/**
 * Provides options for specifying the remote side of a VPN connection.
 */
export class VpnConnectionRemoteEndpoint {
  /**
   * Creates a remote connection using the configuration details provided.
   *
   * @param configuration The configuration for the remote endpoint device.
   * @returns A configuration object representing a remote VPN destination.
   */
  public static fromConfiguration(configuration: CustomerGatewayProps): CustomerGatewayConfigurationRemoteVpnEndpoint {
    return new CustomerGatewayConfigurationRemoteVpnEndpoint(configuration);
  }

  /**
   * Creates a remote connection using a customer gateway.
   *
   * @param customerGateway The customer gateway that is configured for the
   * remote endpoint device.
   * @returns A configuration object representing a remote VPN destination.
   */
  public static fromCustomerGateway(customerGateway: ICustomerGateway): CustomerGatewayRemoteVpnEndpoint {
    return new CustomerGatewayRemoteVpnEndpoint(customerGateway);
  }
}