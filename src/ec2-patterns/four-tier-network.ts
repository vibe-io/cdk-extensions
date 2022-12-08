import { DefaultInstanceTenancy, FlowLogResourceType, GatewayVpcEndpointOptions, NatProvider, SubnetSelection, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { IConstruct } from "constructs";
import { FlowLog, FlowLogFormat } from "../ec2/flow-log";
import { TieredSubnets } from "../ec2/lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";


export interface FlowLogOptions extends ec2.FlowLogOptions {
    readonly logFormatDefinition?: FlowLogFormat;
}

export interface FourTierNetworkProps {
    readonly availabilityZones?: string[];
    readonly cidr?: string;
    readonly defaultInstanceTenancy?: DefaultInstanceTenancy;
    readonly enableDnsHostnames?: boolean;
    readonly enableDnsSupport?: boolean;
    readonly flowLogs?: {[id: string]: FlowLogOptions},
    readonly gatewayEndpoints?: {[id: string]: GatewayVpcEndpointOptions};
    readonly maxAzs?: number;
    readonly natGatewayProvider?: NatProvider;
    readonly natGatewaySubnets?: SubnetSelection;
    readonly vpcName?: string;
}

export class FourTierNetwork extends Vpc {
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
                }
            ],
            vpcName: props?.vpcName
        });

        if (props?.flowLogs === undefined || Object.keys(props.flowLogs).length > 0) {
            const flowLogs = props?.flowLogs ?? {
              'flow-log-default': 
            }
        }
    }

    public addFlowLog(id: string, options?: FlowLogOptions): ec2.FlowLog {
      if (options?.logFormat && options.logFormatDefinition) {
        throw new Error([
          "Only one of 'logFormat' and 'logFormatDefinition' should be",
          'specified.'
        ].join(' '));
      }

      const format = options?.logFormat === undefined ? options?.logFormatDefinition : FlowLogFormat.fromTemplate(options.logFormat.map((x) => {
        return x.value
      }).join(' '))

      return new FlowLog(this, id, {
        ...options,
        resourceType: FlowLogResourceType.fromVpc(this),
        logFormat: format ?? FlowLogFormat.V5
      });
    }
}