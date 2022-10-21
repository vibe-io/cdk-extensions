import { CfnRoute, ISubnet, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGateway } from '../ec2/transit-gateway';
import { TransitGatewayAttachment } from '../ec2/transit-gateway-attachment';
import { FourTierNetwork } from './four-tier-network';
import { TransitGatewayHubConfiguration } from './lib/transit-gateway-hub-configuration';


interface FourTierNetworkHubProps {
  /**
     * Controls whether a default set of ACL's should be added that restrict traffic flow through the
     * VPC to recommended patterns.
     *
     * @default true
     */
  readonly addDefaultAcls?: boolean;

  /**
     * The CIDR range that should be used when creating the VPC. Should be a
     * valid CIDR range within the RFC1918 address space. CIDR ranges should
     * not be repeated or overlap anywhere within the entire organization.
     *
     * @default FourTierNetwork.DEFAULT_CIDR_RANGE
     *
     * @see [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918)
     */
  readonly cidr?: string;

  /**
     * The name of the VPC to be created. This is primarily used for tagging and resource naming
     * purposed though could also be used in the discovery of resources and billing reports.
     */
  readonly name: string;

  /**
     * Configuration used for configuring a Transit Gateway that will be used to facilitate
     * cross-VPC and cross account networking within a region.
     *
     * When a configuration is specified a Transit Gateway will be created. Sharing can be
     * enabled to allow the Transit Gateway to be accessible to other AWS accounts or
     * organizations.
     */
  readonly transitGatewayHubConfiguration?: TransitGatewayHubConfiguration;
}

export class FourTierNetworkHub extends FourTierNetwork {
  public readonly transitGateway?: TransitGateway;
  public readonly transitGatewayAttachment?: TransitGatewayAttachment;


  public constructor(scope: Construct, id: string, props: FourTierNetworkHubProps) {
    super(scope, id, {
      ...props,
      privateNetworkType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    if (props.transitGatewayHubConfiguration) {
      const tgwConfig = props.transitGatewayHubConfiguration;

      this.transitGateway = new TransitGateway(this, 'transit-gateway', {
        autoAcceptSharedAttachments: tgwConfig.autoAcceptSharedAttachments,
        defaultRouteTableId: tgwConfig.defaultRouteTableId,
        name: props.name,
      });

      this.transitGatewayAttachment = this.transitGateway.attachVpc(this, {
        name: props.name,
        subnets: this.dmzTierSubnets,
      });

      this.transitGateway.defaultRouteTable?.addRoute({
        attachment: this.transitGatewayAttachment,
        cidr: '0.0.0.0/0',
      });

      if (tgwConfig.autoDiscovery || tgwConfig.principals) {
        this.transitGateway.enableSharing({
          allowExternalPrincipals: tgwConfig.allowExternal,
          autoDiscoverAccounts: tgwConfig.autoDiscovery,
          principals: tgwConfig.principals,
        });
      }
    }

    // If there is a Transit Gateway associated with us (either passed in or created above) then create a
    // Transit Gateway Attachment for the DMZ subnets and add VPC routes to subnet route tables directing
    // appropriate traffic to the Transit Gateway.
    if (this.transitGateway) {
      const tgwRfc1918Route = (x: ISubnet) => {
        for (let cidr of ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16']) {
          new CfnRoute(x, `tgw-route-${cidr}`, {
            destinationCidrBlock: cidr,
            routeTableId: x.routeTable.routeTableId,
            transitGatewayId: this.transitGateway!.transitGatewayId,
          }).node.addDependency(this.transitGatewayAttachment!);
        }
      };

      const tgwDefaultRoute = (x: ISubnet) => {
        new CfnRoute(x, 'tgw-route-default', {
          destinationCidrBlock: '0.0.0.0/0',
          routeTableId: x.routeTable.routeTableId,
          transitGatewayId: this.transitGateway!.transitGatewayId,
        }).node.addDependency(this.transitGatewayAttachment!);
      };

      this.publicSubnets.map(tgwRfc1918Route);
      this.privateSubnets.map(tgwRfc1918Route);
      this.isolatedSubnets.map(tgwDefaultRoute);
    }
  }
}