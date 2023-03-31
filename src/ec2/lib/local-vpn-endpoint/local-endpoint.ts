import { IVpnGateway } from 'aws-cdk-lib/aws-ec2';
import { TransitGatewayLocalVpnEndpoint } from './transit-gateway';
import { VpnGatewayLocalVpnEndpoint } from './vpn-gateway';
import { ITransitGateway } from '../../transit-gateway';


/**
 * Provides options for specifying the local side of a VPN connection.
 */
export class VpnConnectionLocalEndpoint {
  public static fromTransitGateway(transitGateway: ITransitGateway): TransitGatewayLocalVpnEndpoint {
    return new TransitGatewayLocalVpnEndpoint(transitGateway);
  }

  //public static fromVpc(vpc: IVpc): {
  //  return new
  //}

  public static fromVpnGateway(vpnGateway: IVpnGateway): VpnGatewayLocalVpnEndpoint {
    return new VpnGatewayLocalVpnEndpoint(vpnGateway);
  }
}