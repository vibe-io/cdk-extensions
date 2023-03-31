import { DefaultInstanceTenancy, FlowLogResourceType, GatewayVpcEndpointOptions, NatProvider, SubnetSelection, SubnetType, Vpc, VpnConnectionOptions } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { FlowLog, FlowLogFormat } from '../ec2';
import { TieredSubnets } from '../ec2/lib';


export interface FlowLogOptions extends ec2.FlowLogOptions {
  readonly logFormatDefinition?: FlowLogFormat;
}

export interface FourTierNetworkProps {
  readonly availabilityZones?: string[];
  readonly cidr?: string;
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
  public readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
  public readonly enableDnsHostnames?: boolean;
  public readonly enableDnsSupport?: boolean;
  public readonly maxAzs?: number;
  public readonly vpcName?: string;


  public constructor(scope: IConstruct, id: string, props?: FourTierNetworkProps) {
    super(scope, id, {
      availabilityZones: props?.availabilityZones,
      defaultInstanceTenancy: props?.defaultInstanceTenancy,
      enableDnsHostnames: props?.enableDnsHostnames ?? true,
      enableDnsSupport: props?.enableDnsSupport ?? true,
      gatewayEndpoints: props?.gatewayEndpoints,
      ipAddresses: new TieredSubnets({
        cidr: props?.cidr,
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
        this.addFlowLog(x, flowLogs[x]);
      });
    }
  }

  public addFlowLog(id: string, options?: FlowLogOptions): ec2.FlowLog {
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