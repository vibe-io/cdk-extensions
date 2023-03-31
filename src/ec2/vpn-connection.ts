import { Lazy, Resource, ResourceProps, SecretValue } from 'aws-cdk-lib';
import { MetricOptions, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { CfnVPNConnection, IVpnConnection } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ILocalVpnEndpoint, IRemoteVpnEndpoint } from '.';


/**
 * Represents a VPN protocol that can be used to establish a connection.
 */
export class VpnConnectionType {
  /**
   * The ipsec.1 VPN protocol.
   */
  public static readonly IPSEC_1: VpnConnectionType = VpnConnectionType.of('ipsec.1');

  /**
   * An escape hatch method that allows defining custom VPN protocols.
   *
   * @param name The name of the VPN protocol.
   * @returns A VpnConnectionType object representing the specified protocol.
   */
  public static of(name: string): VpnConnectionType {
    return new VpnConnectionType(name);
  }


  /**
   * Creates a new instance of the VpnConnectionType class.
   *
   * @param name The name of the VPN protocol.
   */
  private constructor(public readonly name: string) {}
}

export interface TunnelOptions {
  readonly preSharedKey?: SecretValue;
  readonly insideCidr?: string;
}

/**
 * Configuration for the VpnConnection resource.
 */
export interface VpnConnectionProps extends ResourceProps {
  readonly connectionType?: VpnConnectionType;
  readonly localEndpoint: ILocalVpnEndpoint;
  readonly remoteEndpoint: IRemoteVpnEndpoint;
  readonly staticRoutesOnly?: boolean;
  readonly tunnelConfigurations?: TunnelOptions[];
}

/**
 * Specifies a VPN connection between a virtual private gateway and a VPN
 * customer gateway or a transit gateway and a VPN customer gateway.
 */
export class VpnConnection extends Resource implements IVpnConnection {
  // Internal properties
  private readonly _tunnelConfigurations: TunnelOptions[];

  // Input properties
  public readonly connectionType: VpnConnectionType;
  public readonly localEndpoint: ILocalVpnEndpoint;
  public readonly remoteEndpoint: IRemoteVpnEndpoint;
  public readonly staticRoutesOnly?: boolean;

  public get tunnelConfigurations(): TunnelOptions[] {
    return [...this.tunnelConfigurations];
  }

  // Resource properties
  public readonly resource: CfnVPNConnection;

  // Standard properties
  public readonly vpnId: string;

  // IVpnConnection properties
  public readonly customerGatewayId: string;
  public readonly customerGatewayIp: string;
  public readonly customerGatewayAsn: number;


  /**
     * Creates a new instance of the TransitGatewayAttachment class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  public constructor(scope: Construct, id: string, props: VpnConnectionProps) {
    super(scope, id, props);

    this._tunnelConfigurations = [];

    this.connectionType = props.connectionType ?? VpnConnectionType.IPSEC_1;
    this.localEndpoint = props.localEndpoint;
    this.remoteEndpoint = props.remoteEndpoint;
    this.staticRoutesOnly = props.staticRoutesOnly;

    const localEndpointConfig = this.localEndpoint.bind(this);
    const remoteEndpointConfig = this.remoteEndpoint.bind(this);

    this.customerGatewayAsn = remoteEndpointConfig.customerGatewayAsn;
    this.customerGatewayId = remoteEndpointConfig.customerGatewayId;
    this.customerGatewayIp = remoteEndpointConfig.customerGatewayIp;

    const test = new ec2.VpnConnection(this, 'hello', {
      ip: '10.0.0.0',
      vpc: ec2.Vpc.fromLookup(this, 'test', {
        isDefault: true,
      }),
    });

    test.metricTunnelDataIn();

    this.resource = new CfnVPNConnection(this, 'Resource', {
      customerGatewayId: remoteEndpointConfig.customerGatewayId,
      staticRoutesOnly: this.staticRoutesOnly,
      transitGatewayId: localEndpointConfig.transitGatewayId,
      type: this.connectionType.name,
      vpnGatewayId: localEndpointConfig.vpnGatewayId,
      vpnTunnelOptionsSpecifications: Lazy.any(
        {
          produce: () => {
            this._tunnelConfigurations.map((x) => {
              return {
                preSharedKey: x.preSharedKey?.toString(),
                tunnelInsideCidr: x.insideCidr,
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
    });

    this.vpnId = this.resource.ref;
  }

  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/VPN',
      metricName: metricName,
      dimensionsMap: {
        VpnId: this.vpnId,
      },
      ...props,
    }).attachTo(this);
  }

  public metricTunnelState(props?: MetricOptions): Metric {
    return this.metric('TunnelState', {
      statistic: 'Average',
      ...props,
    });
  }

  public metricTunnelDataIn(props?: MetricOptions): Metric {
    return this.metric('TunnelDataIn', {
      statistic: 'Sum',
      ...props,
    });
  }

  public metricTunnelDataOut(props?: MetricOptions): Metric {
    return this.metric('TunnelDataOut', {
      statistic: 'Sum',
      ...props,
    });
  }

  public addTunnelConfiguration(options: TunnelOptions): void {
    if (this._tunnelConfigurations.length >= 2) {
      throw new Error('VPN connections support configuring at most 2 tunnels.');
    }

    this._tunnelConfigurations.push(options);
  }
}