import { Stack } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ClientVpnUserBasedAuthentication, DefaultInstanceTenancy, FlowLogResourceType, GatewayVpcEndpointOptions, IClientVpnConnectionHandler, NatProvider, SubnetSelection, SubnetType, TransportProtocol, Vpc, VpnConnectionOptions, VpnPort } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ILogGroup, ILogStream } from 'aws-cdk-lib/aws-logs';
import { IConstruct } from 'constructs';
import { IpAddressManager } from '.';
import { NetworkIsolatedClientVpnEndpoint } from './network-isolated-client-vpn-endpoint';
import { FlowLog, FlowLogFormat, IIpamPool, Ipv4CidrAssignment } from '../ec2';
import { TieredSubnets } from '../ec2/lib';
import { ICidrAssignment, IIpv4CidrAssignment } from '../ec2/lib/cidr-assignment';
import { IVpcCidrBlock, VpcCidrBlock } from '../ec2/vpc-cidr-block';


export interface AddCidrBlockOptions {
  readonly cidrAssignment: ICidrAssignment;
}

export interface AddIsolatedClientVpnEndpointOptions {
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
  readonly selfServicePortal?: boolean;
  readonly serverCertificate: ICertificate;
  readonly splitTunnel?: boolean;
  readonly subnetCidr?: IIpv4CidrAssignment;
  readonly transportProtocol?: TransportProtocol;
  readonly userBasedAuthentication?: ClientVpnUserBasedAuthentication;
  readonly vpnCidr?: IIpv4CidrAssignment;
}

export interface FlowLogOptions extends ec2.FlowLogOptions {
  readonly logFormatDefinition?: FlowLogFormat;
}

export interface FourTierNetworkProps {
  readonly addressManager?: IpAddressManager;
  readonly availabilityZones?: string[];
  readonly cidr?: IIpv4CidrAssignment;
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly flowLogs?: {[id: string]: FlowLogOptions};
  readonly gatewayEndpoints?: {[id: string]: GatewayVpcEndpointOptions};
  readonly maxAzs?: number;
  readonly natGateways?: number;
  readonly natGatewayProvider?: NatProvider;
  readonly natGatewaySubnets?: SubnetSelection;
  readonly vpcName?: string;
  readonly vpnConnections?: {[id: string]: VpnConnectionOptions};
  readonly vpnGateway?: boolean;
  readonly vpnGatewayAsn?: number;
  readonly vpnRoutePropagation?: SubnetSelection[];
}

export class FourTierNetwork extends Vpc {
  // Input properties
  public readonly addressManager?: IpAddressManager;
  public readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  public readonly enableDnsHostnames?: boolean;
  public readonly enableDnsSupport?: boolean;
  public readonly ipamPool?: IIpamPool;
  public readonly maxAzs?: number;
  public readonly netmask: number;
  public readonly vpcName?: string;


  public constructor(scope: IConstruct, id: string, props?: FourTierNetworkProps) {
    const allocatePool = () => {
      const scopeStack = Stack.of(scope);
      const addressManager = new IpAddressManager(scopeStack, 'address-manager');
      return addressManager.getVpcConfiguration(scopeStack, `${scope.node.addr}-${id}`);
    };

    const provider = props?.cidr ?? allocatePool();
    const ipAddresses = new TieredSubnets({
      provider: provider,
    });

    super(scope, id, {
      availabilityZones: props?.availabilityZones,
      defaultInstanceTenancy: props?.defaultInstanceTenancy,
      enableDnsHostnames: props?.enableDnsHostnames ?? true,
      enableDnsSupport: props?.enableDnsSupport ?? true,
      gatewayEndpoints: props?.gatewayEndpoints,
      ipAddresses: ipAddresses,
      maxAzs: props?.maxAzs,
      natGateways: props?.natGateways,
      natGatewayProvider: props?.natGatewayProvider,
      natGatewaySubnets: props?.natGatewaySubnets,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: 'data',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: 'dmz',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      vpcName: props?.vpcName,
      vpnConnections: props?.vpnConnections,
      vpnGateway: props?.vpnGateway,
      vpnGatewayAsn: props?.vpnGatewayAsn,
      vpnRoutePropagation: props?.vpnRoutePropagation,
    });

    this.ipamPool = ipAddresses.ipamPool;
    this.netmask = ipAddresses.netmask;

    this.addressManager = props?.addressManager;
    this.defaultInstanceTenancy = props?.defaultInstanceTenancy;
    this.enableDnsHostnames = props?.enableDnsHostnames;
    this.enableDnsSupport = props?.enableDnsSupport;
    this.maxAzs = props?.maxAzs;
    this.vpcName = props?.vpcName;

    if (props?.flowLogs === undefined || Object.keys(props.flowLogs).length > 0) {
      const flowLogs = props?.flowLogs ?? {
        'flow-log-default': {
          logFormatDefinition: FlowLogFormat.V5,
        },
      };

      Object.keys(flowLogs).forEach((x) => {
        this.addVpcFlowLog(x, flowLogs[x]);
      });
    }
  }

  public addCidrBlock(id: string, options: AddCidrBlockOptions): IVpcCidrBlock {
    return new VpcCidrBlock(this, `cidr-block-${id}`, {
      cidrAssignment: options.cidrAssignment,
      vpc: this,
    });
  }

  public addIsolatedClientVpnEndpoint(id: string, options: AddIsolatedClientVpnEndpointOptions): NetworkIsolatedClientVpnEndpoint {
    const defaultNetmask = 27 - Math.ceil(Math.log2(options.maxAzs ?? this.availabilityZones.length));
    const uid = `client-vpn-endpoint-${id}`;

    if (options.subnetCidr === undefined && this.ipamPool === undefined) {
      throw new Error([
        'When addind a VPN endpoint to a VPC that was not allocated using',
        "a 'subnetCidr' must be provided.",
      ].join(' '));
    }

    return new NetworkIsolatedClientVpnEndpoint(this, uid, {
      ...options,
      subnetCidr: options.subnetCidr ?? Ipv4CidrAssignment.ipamPool({
        pool: this.ipamPool!,
        netmask: defaultNetmask,
      }),
      vpc: this,
      vpnCidr: options.vpnCidr ?? this.addressManager?.getClientVpnConfiguration(this, uid),
    });
  }

  public addVpcFlowLog(id: string, options?: FlowLogOptions): ec2.FlowLog {
    if (options?.logFormat && options.logFormatDefinition) {
      throw new Error([
        "Only one of 'logFormat' and 'logFormatDefinition' should be",
        'specified.',
      ].join(' '));
    }

    const format = options?.logFormat === undefined ? options?.logFormatDefinition : FlowLogFormat.fromTemplate(options.logFormat.map((x) => {
      return x.value;
    }).join(' '));

    return new FlowLog(this, id, {
      ...options,
      resourceType: FlowLogResourceType.fromVpc(this),
      logFormat: format ?? FlowLogFormat.V5,
    });
  }
}