import { IVpnGateway } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { ILocalVpnEndpoint, LocalVpnEndpointConfiguration } from './local-endpoint-base';


/**
 * Specifies a VPN connection endpoint which routes to a VPN gateway on the AWS
 * side.
 */
export class VpnGatewayLocalVpnEndpoint implements ILocalVpnEndpoint {
  /**
   * The VPN gateway that serves as the local end of a VPN connection.
   *
   * @group Inputs
   */
  public readonly vpnGateway: IVpnGateway;


  /**
   * Creates a new instance of the VpnGatewayLocalVpnEndpoint class.
   *
   * @param vpnGateway The VPN gateway that serves as the local end of a VPN
   * connection.
   */
  public constructor(vpnGateway: IVpnGateway) {
    this.vpnGateway = vpnGateway;
  }

  /**
   * Produces a configuration that can be used when configuring the local
   * end of a VPN connection.
   *
   * @param scope The construct configuring the VPN connection that will be
   * referencing the local endpoint.
   */
  bind(_scope: IConstruct): LocalVpnEndpointConfiguration {
    return {
      vpnGatewayId: this.vpnGateway.gatewayId,
    };
  }
}
