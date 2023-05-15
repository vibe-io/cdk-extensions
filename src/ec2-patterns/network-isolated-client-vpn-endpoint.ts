import { Fn, Resource, ResourceProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ClientVpnAuthorizationRule, ClientVpnAuthorizationRuleOptions, ClientVpnEndpoint, ClientVpnRoute, ClientVpnRouteTarget, ClientVpnUserBasedAuthentication, Connections, IClientVpnConnectionHandler, IClientVpnEndpoint, IConnectable, ISecurityGroup, ISubnet, IVpc, Peer, RouterType, Subnet, TransportProtocol, VpnPort } from 'aws-cdk-lib/aws-ec2';
import { ILogGroup, ILogStream } from 'aws-cdk-lib/aws-logs';
import { IConstruct, IDependable } from 'constructs';
import { ITransitGateway } from '../ec2';
import { IIpv4CidrAssignment, Ipv4CidrAssignment } from '../ec2/lib/cidr-assignment';
import { VpcCidrBlock } from '../ec2/vpc-cidr-block';


export interface AddAuthorizationRuleOptions extends ClientVpnAuthorizationRuleOptions {
  readonly scope?: IConstruct;
}

export interface AddMultiSubnetRouteOptions {
  readonly cidr: string;
  readonly description?: string;
  readonly scope?: IConstruct;
}

export interface NetworkIsolatedClientVpnEndpointProps extends ResourceProps {
  readonly authorizeAllUsersToVpcCidr?: boolean;
  readonly clientCertificate?: ICertificate;
  readonly clientConnectionHandler?: IClientVpnConnectionHandler;
  readonly clientLoginBanner?: string;
  readonly description?: string;
  readonly dnsServers?: string[];
  readonly logGroup?: ILogGroup;
  readonly logStream?: ILogStream;
  readonly logging?: boolean;
  readonly maxAzs?: number;
  readonly port?: VpnPort;
  readonly securityGroups?: ISecurityGroup[];
  readonly selfServicePortal?: boolean;
  readonly serverCertificate: ICertificate;
  readonly splitTunnel?: boolean;
  readonly subnetCidr: IIpv4CidrAssignment;
  readonly transitGateway?: ITransitGateway;
  readonly transportProtocol?: TransportProtocol;
  readonly userBasedAuthentication?: ClientVpnUserBasedAuthentication;
  readonly vpc: IVpc;
  readonly vpnCidr?: IIpv4CidrAssignment;
}

export class NetworkIsolatedClientVpnEndpoint extends Resource implements IClientVpnEndpoint, IConnectable {
  // Static properties
  public static readonly DEFAULT_VPN_CIDR: string = '172.16.29.0/22';

  // Internal properties
  private readonly _subnets: Subnet[];

  // Input properties
  public readonly authorizeAllUsersToVpcCidr?: boolean;
  public readonly clientCertificate?: ICertificate;
  public readonly clientConnectionHandler?: IClientVpnConnectionHandler;
  public readonly clientLoginBanner?: string;
  public readonly description?: string;
  public readonly dnsServers?: string[];
  public readonly logGroup?: ILogGroup;
  public readonly logStream?: ILogStream;
  public readonly logging?: boolean;
  public readonly maxAzs: number;
  public readonly port?: VpnPort;
  public readonly securityGroups?: ISecurityGroup[];
  public readonly selfServicePortal?: boolean;
  public readonly serverCertificate: ICertificate;
  public readonly splitTunnel?: boolean;
  public readonly transitGateway?: ITransitGateway;
  public readonly transportProtocol?: TransportProtocol;
  public readonly userBasedAuthentication?: ClientVpnUserBasedAuthentication;
  public readonly vpc: IVpc;
  public readonly vpnCidr: IIpv4CidrAssignment;

  // Resource properties
  public readonly clientVpnEndpoint: ClientVpnEndpoint;
  public readonly vpcCidrBlock: VpcCidrBlock;

  public get subnets(): ISubnet[] {
    return [...this._subnets];
  }

  // IClientVpnEndpoint properties
  public readonly endpointId: string;
  public readonly targetNetworksAssociated: IDependable;

  // IConnectable properties
  public readonly connections: Connections;


  public constructor(scope: IConstruct, id: string, props: NetworkIsolatedClientVpnEndpointProps) {
    super(scope, id, props);

    this._subnets = [];

    this.authorizeAllUsersToVpcCidr = props.authorizeAllUsersToVpcCidr;
    this.clientCertificate = props.clientCertificate;
    this.clientConnectionHandler = props.clientConnectionHandler;
    this.clientLoginBanner = props.clientLoginBanner;
    this.description = props.description;
    this.dnsServers = props.dnsServers;
    this.logGroup = props.logGroup;
    this.logStream = props.logStream;
    this.logging = props.logging ?? true;
    this.maxAzs = props.maxAzs ?? props.vpc.availabilityZones.length;
    this.port = props.port;
    this.securityGroups = props.securityGroups;
    this.selfServicePortal = props.selfServicePortal;
    this.serverCertificate = props.serverCertificate;
    this.splitTunnel = props.splitTunnel ?? true;
    this.transitGateway = props.transitGateway;
    this.transportProtocol = props.transportProtocol;
    this.userBasedAuthentication = props.userBasedAuthentication;
    this.vpc = props.vpc;
    this.vpnCidr = props.vpnCidr ?? Ipv4CidrAssignment.custom({
      cidr: NetworkIsolatedClientVpnEndpoint.DEFAULT_VPN_CIDR,
    });

    if (this.maxAzs > this.vpc.availabilityZones.length) {
      throw new Error([
        'When creating a network isolated client VPN the number of max',
        'availability zones must be less than or equal to the number of',
        'availability zones in the associated VPC.',
      ].join(' '));
    }

    this.vpcCidrBlock = new VpcCidrBlock(this, 'vpc-cidr-block', {
      cidrAssignment: props.subnetCidr,
      vpc: this.vpc,
    });

    for (let x = 0; x < this.maxAzs; x++) {
      const subnet = new Subnet(this, `subnet-az${x + 1}}`, {
        availabilityZone: this.vpc.availabilityZones[x],
        cidrBlock: this.maxAzs === 1 ?
          this.vpcCidrBlock.vpcCidrBlockCidr :
          Fn.select(x, Fn.cidr(this.vpcCidrBlock.vpcCidrBlockCidr, this.maxAzs, '4')),
        mapPublicIpOnLaunch: false,
        vpcId: this.vpc.vpcId,
      });
      subnet.node.addDependency(this.vpcCidrBlock);
      this._subnets.push(subnet);
    }

    if (this.transitGateway) {
      const transitGateway = this.transitGateway;

      this._subnets.forEach((subnet) => {
        for (let cidr of ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16']) {
          subnet.addRoute(`tgw-route-${cidr}`, {
            destinationCidrBlock: cidr,
            routerId: transitGateway.transitGatewayId,
            routerType: RouterType.TRANSIT_GATEWAY,
          });
        }
      });
    }

    const vpnCidr = this.vpnCidr.getCidr(this, 'vpn-cidr', {
      maxNetmask: 12,
      minNetmask: 22,
    });

    this.clientVpnEndpoint = new ClientVpnEndpoint(this, 'Resource', {
      authorizeAllUsersToVpcCidr: this.authorizeAllUsersToVpcCidr,
      cidr: vpnCidr.cidr,
      clientCertificateArn: this.clientCertificate?.certificateArn,
      clientConnectionHandler: this.clientConnectionHandler,
      description: this.description,
      dnsServers: this.dnsServers,
      logGroup: this.logGroup,
      logStream: this.logStream,
      logging: this.logging,
      port: this.port,
      securityGroups: this.securityGroups,
      selfServicePortal: this.selfServicePortal,
      serverCertificateArn: this.serverCertificate.certificateArn,
      splitTunnel: this.splitTunnel,
      transportProtocol: this.transportProtocol,
      userBasedAuthentication: this.userBasedAuthentication,
      vpc: this.vpc,
      vpcSubnets: {
        subnets: this.subnets,
      },
    });

    this.connections = new Connections({
      peer: Peer.ipv4(this.vpcCidrBlock.vpcCidrBlockCidr),
    });

    this.endpointId = this.clientVpnEndpoint.endpointId;
    this.targetNetworksAssociated = this.clientVpnEndpoint.targetNetworksAssociated;
  }

  public addAuthorizationRule(id: string, options: AddAuthorizationRuleOptions): ClientVpnAuthorizationRule {
    return options.scope ?
      new ClientVpnAuthorizationRule(options.scope, id, options) :
      this.clientVpnEndpoint.addAuthorizationRule(id, options);
  }

  public addMultiSubnetRoute(id: string, options: AddMultiSubnetRouteOptions): any {
    this.subnets.forEach((x, idx) => {
      const uid = `vpc-${id}-${(idx + 1).toString().padStart(2, '0')}`;
      if (!options.scope) {
        this.clientVpnEndpoint.addRoute(uid, {
          cidr: options.cidr,
          description: options.description,
          target: ClientVpnRouteTarget.subnet(x),
        });
      } else {
        new ClientVpnRoute(options.scope, uid, {
          cidr: options.cidr,
          clientVpnEndpoint: this.clientVpnEndpoint,
          description: options.description,
          target: ClientVpnRouteTarget.subnet(x),
        });
      }
    });
  }
}