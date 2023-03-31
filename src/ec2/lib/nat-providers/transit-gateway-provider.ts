import { ConfigureNatOptions, GatewayConfig, NatProvider, PrivateSubnet, RouterType } from 'aws-cdk-lib/aws-ec2';
import { ITransitGateway } from '../../transit-gateway';
import { TransitGatewayAttachment } from '../../transit-gateway-attachment';


export interface TransitGatewayNatProviderOptions {
  readonly transitGateway: ITransitGateway;
}

export class TransitGatewayNatProvider extends NatProvider {
  private readonly _configuredGateways: GatewayConfig[];
  private _transitGatewayAttachment?: TransitGatewayAttachment;

  public readonly transitGateway: ITransitGateway;

  public get configuredGateways(): GatewayConfig[] {
    return [...this._configuredGateways];
  }

  public get transitGatewayAttachment(): TransitGatewayAttachment | undefined {
    return this._transitGatewayAttachment;
  }


  public constructor(options: TransitGatewayNatProviderOptions) {
    super();

    this._configuredGateways = [];

    this.transitGateway = options.transitGateway;
  }

  public configureNat(options: ConfigureNatOptions): void {
    const transitGatewayAttachment = this.transitGateway.attachVpc(options.vpc, {
      subnets: {
        subnets: options.natSubnets,
      },
    });

    this._transitGatewayAttachment = transitGatewayAttachment;

    options.natSubnets.forEach((x) => {
      this._configuredGateways.push({
        az: x.availabilityZone,
        gatewayId: transitGatewayAttachment.transitGatewayAttachmentId,
      });
    });

    options.privateSubnets.forEach((x) => {
      this.configureSubnet(x);
    });
  }

  public configureSubnet(subnet: PrivateSubnet): void {
    if (this.transitGatewayAttachment !== undefined) {
      subnet.addRoute('DefaultRoute', {
        routerId: this.transitGateway.transitGatewayId,
        routerType: RouterType.TRANSIT_GATEWAY,
        enablesInternetConnectivity: true,
      });
    } else {
      throw new Error([
        "Cannot call 'configureSubnet' before on NAT provider calling",
        "'configureNat'.",
      ].join(' '));
    }
  }
}
