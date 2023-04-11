import { Stack } from 'aws-cdk-lib';
import { DefaultInstanceTenancy, FlowLogResourceType, GatewayVpcEndpointOptions, NatProvider, SubnetSelection, SubnetType, Vpc, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { IpAddressManager } from '.';
import { FlowLog, FlowLogFormat, IIpamPool } from '../ec2';
import { TieredSubnets } from '../ec2/lib';
import { ICidrProvider, CidrProvider } from '../ec2/lib/ip-addresses/network-provider';


export interface FlowLogOptions extends ec2.FlowLogOptions {
  readonly logFormatDefinition?: FlowLogFormat;
}

export interface FourTierNetworkProps {
  readonly availabilityZones?: string[];
  readonly cidr?: ICidrProvider;
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
      return addressManager.allocatePrivateNetwork(scopeStack, `${scope.node.addr}-${id}`);
    };

    const provider = props?.cidr ?? CidrProvider.ipamPool(allocatePool(), 16);

    super(scope, id, {
      availabilityZones: props?.availabilityZones,
      defaultInstanceTenancy: props?.defaultInstanceTenancy,
      enableDnsHostnames: props?.enableDnsHostnames ?? true,
      enableDnsSupport: props?.enableDnsSupport ?? true,
      gatewayEndpoints: props?.gatewayEndpoints,
      ipAddresses: new TieredSubnets({
        provider: provider,
      }),
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

    this.ipamPool = provider.ipamPool;
    this.netmask = provider.netmask;

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