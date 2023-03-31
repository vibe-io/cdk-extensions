import { IConstruct } from 'constructs';
import { IRemoteVpnEndpoint, RemoteVpnEndpointConfiguration } from './remote-endpoint-base';
import { CustomerGateway, CustomerGatewayProps } from '../../customer-gateway';


/**
 * Specifies a remote VPN endpoint device by directly specifyingits details.
 */
export class CustomerGatewayConfigurationRemoteVpnEndpoint implements IRemoteVpnEndpoint {
  /**
   * The customer gateway that was created to represent the device on the
   * remote end of the VPN connection.
   */
  private _customerGateway?: CustomerGateway;

  /**
   * The details of the device on the remote end of the VPN connection.
   *
   * @group Inputs
   */
  public readonly configuration: CustomerGatewayProps;

  /**
   * The customer gateway that was created to represent the device on the
   * remote end of the VPN connection.
   *
   * @group Resources
   */
  public get customerGateway(): CustomerGateway | undefined {
    return this._customerGateway;
  }


  /**
   * Creates a new instance of the
   * CustomerGatewayConfigurationRemoteVpnEndpoint class.
   *
   * @param configuration The details of the device on the remote end of the
   * VPN connection.
   */
  public constructor(configuration: CustomerGatewayProps) {
    this.configuration = configuration;
  }

  /**
   * Produces a configuration that can be used when configuring the remote
   * end of a VPN connection.
   *
   * @param scope The construct configuring the VPN connection that will be
   * referencing the remote endpoint.
   */
  bind(scope: IConstruct): RemoteVpnEndpointConfiguration {
    this._customerGateway = new CustomerGateway(scope, 'customer-gateway', this.configuration);

    return {
      customerGatewayAsn: this._customerGateway.customerGatewayAsn,
      customerGatewayId: this._customerGateway.customerGatewayId,
      customerGatewayIp: this._customerGateway.customerGatewayIp,
    };
  }
}
