/*import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DefaultInstanceTenancy, FlowLogDestination, FlowLogMaxAggregationInterval, FlowLogTrafficType } from 'aws-cdk-lib/aws-ec2';
import { FourTierNetwork, FourTierNetworkHub } from '..';
import { FlowLogFormat } from '../../ec2';
import { SharedPrincipal } from '../../ram';


test('default hub network should have standard defaults', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const hub = new FourTierNetworkHub(stack, 'hub');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: FourTierNetwork.DEFAULT_CIDR_RANGE,
    EnableDnsHostnames: true,
    EnableDnsSupport: true,
  });

  template.hasResourceProperties('AWS::EC2::FlowLog', {
    LogDestinationType: 's3',
    LogFormat: stack.resolve(FlowLogFormat.V5.template),
    ResourceId: stack.resolve(hub.vpcId),
    ResourceType: 'VPC',
    TrafficType: 'ALL',
  });
});

test('property values should be reflected in generated resources', () => {
  const resources = getCommonResources();
  const stack = resources.stack;

  const hub = new FourTierNetworkHub(stack, 'hub', {
    defaultInstanceTenancy: DefaultInstanceTenancy.DEDICATED,
    enableDnsHostnames: false,
    enableDnsSupport: false,
    flowLogs: {
      default: {
        destination: FlowLogDestination.toCloudWatchLogs(),
        logFormatDefinition: FlowLogFormat.V3,
        maxAggregationInterval: FlowLogMaxAggregationInterval.TEN_MINUTES,
        trafficType: FlowLogTrafficType.REJECT,
      },
    },
    vpcName: 'test-name',
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '192.168.0.0/16',
    EnableDnsHostnames: false,
    EnableDnsSupport: false,
    InstanceTenancy: 'dedicated',
    Tags: [
      {
        Key: 'Name',
        Value: 'test-name',
      },
    ],
  });

  template.hasResourceProperties('AWS::EC2::FlowLog', {
    LogDestinationType: 'cloud-watch-logs',
    LogFormat: stack.resolve(FlowLogFormat.V3.template),
    MaxAggregationInterval: 600,
    ResourceId: stack.resolve(hub.vpcId),
    ResourceType: 'VPC',
    TrafficType: 'REJECT',
  });
});

describe('transit gateway', () => {
  test('enabling transit gateway should create a transit gateway with reasonable defaults', () => {
    const resources = getCommonResources();
    const stack = resources.stack;

    const hub = new FourTierNetworkHub(stack, 'hub');
    const transitGateway = hub.enableTransitGateway();

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::TransitGateway', {
      AutoAcceptSharedAttachments: 'enable',
      DefaultRouteTableAssociation: 'enable',
      DefaultRouteTablePropagation: 'enable',
      DnsSupport: 'enable',
      MulticastSupport: 'disable',
      VpnEcmpSupport: 'disable',
    });

    template.hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: stack.resolve(hub.selectSubnets({
        onePerAz: true,
        subnetGroupName: 'dmz',
      }).subnetIds),
      TransitGatewayId: stack.resolve(transitGateway.transitGatewayId),
      VpcId: stack.resolve(hub.vpcId),
    });

    expect(hub.transitGateway).toBe(transitGateway);
  });

  test('enabling transit gateway with override should respect requested configuration', () => {
    const resources = getCommonResources();
    const stack = resources.stack;

    const hub = new FourTierNetworkHub(stack, 'hub');
    hub.enableTransitGateway({
      autoAcceptSharedAttachments: false,
      defaultRouteTableAssociation: false,
      defaultRouteTablePropagation: false,
      dnsSupport: false,
      multicastSupport: true,
      vpnEcmpSupport: true,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::TransitGateway', {
      AutoAcceptSharedAttachments: 'disable',
      DefaultRouteTableAssociation: 'disable',
      DefaultRouteTablePropagation: 'disable',
      DnsSupport: 'disable',
      MulticastSupport: 'enable',
      VpnEcmpSupport: 'enable',
    });
  });

  test('enabling transit gateway multiple times should throw an exception', () => {
    const resources = getCommonResources();
    const stack = resources.stack;

    const hub = new FourTierNetworkHub(stack, 'hub');
    hub.enableTransitGateway();

    expect(() => {
      hub.enableTransitGateway();
    }).toThrowError([
      `Transit gateway is already enabled for VPC ${hub.node.path}`,
    ].join(' '));
  });
});

describe('spoke networks', () => {
  test('spoke networks in the same account should produce reasonable defaults', () => {
    const stackProps = {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    };

    const app = new App();
    const hubStack = new Stack(app, 'hub-stack', stackProps);
    const spokeStack = new Stack(app, 'spoke-stack', stackProps);

    const hub = new FourTierNetworkHub(hubStack, 'hub');
    const spoke = hub.addSpoke(spokeStack, 'spoke');

    const template = Template.fromStack(spokeStack);

    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: FourTierNetwork.DEFAULT_CIDR_RANGE,
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });

    template.hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: spokeStack.resolve(spoke.selectSubnets({
        onePerAz: true,
        subnetGroupName: 'dmz',
      }).subnetIds),
      TransitGatewayId: spokeStack.resolve(hub.transitGateway?.transitGatewayId),
      VpcId: spokeStack.resolve(spoke.vpcId),
    });
  });

  test('spoke networks in the same account should respect passed properties', () => {
    const stackProps = {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    };

    const app = new App();
    const hubStack = new Stack(app, 'hub-stack', stackProps);
    const spokeStack = new Stack(app, 'spoke-stack', stackProps);

    const hub = new FourTierNetworkHub(hubStack, 'hub');
    const spoke = hub.addSpoke(spokeStack, 'spoke', {
      cidr: '192.168.0.0/16',
      defaultInstanceTenancy: DefaultInstanceTenancy.DEDICATED,
      enableDnsSupport: false,
      enableDnsHostnames: false,
      flowLogs: {
        default: {
          destination: FlowLogDestination.toCloudWatchLogs(),
          logFormatDefinition: FlowLogFormat.V3,
          maxAggregationInterval: FlowLogMaxAggregationInterval.TEN_MINUTES,
          trafficType: FlowLogTrafficType.REJECT,
        },
      },
      vpcName: 'test-name',
    });

    const template = Template.fromStack(spokeStack);

    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: '192.168.0.0/16',
      EnableDnsHostnames: false,
      EnableDnsSupport: false,
      InstanceTenancy: 'dedicated',
      Tags: [
        {
          Key: 'Name',
          Value: 'test-name',
        },
      ],
    });

    template.hasResourceProperties('AWS::EC2::FlowLog', {
      LogDestinationType: 'cloud-watch-logs',
      LogFormat: spokeStack.resolve(FlowLogFormat.V3.template),
      MaxAggregationInterval: 600,
      ResourceId: spokeStack.resolve(spoke.vpcId),
      ResourceType: 'VPC',
      TrafficType: 'REJECT',
    });

    template.hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: spokeStack.resolve(spoke.selectSubnets({
        onePerAz: true,
        subnetGroupName: 'dmz',
      }).subnetIds),
      TransitGatewayId: spokeStack.resolve(hub.transitGateway?.transitGatewayId),
      VpcId: spokeStack.resolve(spoke.vpcId),
    });
  });

  test('spoke networks in the same account should inherit basic hub configuration', () => {
    const stackProps = {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    };

    const app = new App();
    const hubStack = new Stack(app, 'hub-stack', stackProps);
    const spokeStack = new Stack(app, 'spoke-stack', stackProps);

    const hub = new FourTierNetworkHub(hubStack, 'hub', {
      defaultInstanceTenancy: DefaultInstanceTenancy.DEDICATED,
      enableDnsSupport: false,
      enableDnsHostnames: false,
      flowLogs: {
        default: {
          destination: FlowLogDestination.toCloudWatchLogs(),
          logFormatDefinition: FlowLogFormat.V3,
          maxAggregationInterval: FlowLogMaxAggregationInterval.TEN_MINUTES,
          trafficType: FlowLogTrafficType.REJECT,
        },
      },
    });
    const spoke = hub.addSpoke(spokeStack, 'spoke', {
      cidr: '192.168.0.0/16',
    });

    const template = Template.fromStack(spokeStack);

    template.hasResourceProperties('AWS::EC2::VPC', {
      EnableDnsHostnames: false,
      EnableDnsSupport: false,
      InstanceTenancy: 'dedicated',
    });

    template.hasResourceProperties('AWS::EC2::FlowLog', {
      LogDestinationType: 'cloud-watch-logs',
      LogFormat: spokeStack.resolve(FlowLogFormat.V3.template),
      MaxAggregationInterval: 600,
      ResourceId: spokeStack.resolve(spoke.vpcId),
      ResourceType: 'VPC',
      TrafficType: 'REJECT',
    });
  });

  test('spoke networks in a different account should produce reasonable defaults', () => {
    const app = new App();
    const hubStack = new Stack(app, 'hub-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    const spokeStack = new Stack(app, 'spoke-stack', {
      env: {
        account: '234567890123',
        region: 'us-east-1',
      },
    });

    const hub = new FourTierNetworkHub(hubStack, 'hub');
    const spoke = hub.addSpoke(spokeStack, 'spoke');

    const hubTemplate = Template.fromStack(hubStack);
    const spokeTemplate = Template.fromStack(spokeStack);

    hubTemplate.hasResourceProperties('AWS::RAM::ResourceShare', {
      Principals: [
        '234567890123',
      ],
      ResourceArns: [
        hubStack.resolve(hub.transitGateway?.transitGatewayArn),
      ],
    });

    spokeTemplate.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: FourTierNetwork.DEFAULT_CIDR_RANGE,
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });

    spokeTemplate.hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: spokeStack.resolve(spoke.selectSubnets({
        onePerAz: true,
        subnetGroupName: 'dmz',
      }).subnetIds),
      TransitGatewayId: spokeStack.resolve(hub.transitGateway?.transitGatewayId),
      VpcId: spokeStack.resolve(spoke.vpcId),
    });
  });

  test('customer sharing settings should be respected in the ram share', () => {
    const app = new App();
    const hubStack = new Stack(app, 'hub-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    const spokeStack = new Stack(app, 'spoke-stack', {
      env: {
        account: '234567890123',
        region: 'us-east-1',
      },
    });

    const hub = new FourTierNetworkHub(hubStack, 'hub', {
      sharing: {
        pricipals: [
          SharedPrincipal.fromAccountId('345678901234'),
        ],
      },
    });
    hub.addSpoke(spokeStack, 'spoke');

    const hubTemplate = Template.fromStack(hubStack);
    Template.fromStack(spokeStack);

    hubTemplate.hasResourceProperties('AWS::RAM::ResourceShare', {
      Principals: [
        '345678901234',
      ],
      ResourceArns: [
        hubStack.resolve(hub.transitGateway?.transitGatewayArn),
      ],
    });
  });
});


function getCommonResources() {
  const stack = new Stack(undefined, 'stack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  return {
    stack,
  };
}*/