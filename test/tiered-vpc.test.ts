import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DefaultInstanceTenancy, FlowLogTrafficType, GatewayVpcEndpointAwsService, InterfaceVpcEndpointAwsService, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { TierConfiguration, TieredVpc } from '../src/ec2';
import { AvailabilityZones } from '../src/utils/availability-zones';

test('vpc.vpcId returns a token to the VPC ID', () => {
  const stack = getTestStack();
  const vpc = new TieredVpc(stack, 'TheVPC', {
    tiers: getCommonTiers(),
  });
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('vpc.vpcArn returns a token to the VPC ID', () => {
  const stack = getTestStack();
  const vpc = new TieredVpc(stack, 'TheVPC', {
    tiers: getCommonTiers(),
  });
  expect(stack.resolve(vpc.vpcArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:us-east-1:123456789012:vpc/', { Ref: 'TheVPC92636AB0' }]] });
});

test('it uses the correct network range', () => {
  const stack = getTestStack();
  new TieredVpc(stack, 'TheVPC', {
    tiers: getCommonTiers(),
  });
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: Vpc.DEFAULT_CIDR_RANGE,
    EnableDnsHostnames: true,
    EnableDnsSupport: true,
    InstanceTenancy: DefaultInstanceTenancy.DEFAULT,
  });
});

test('the Name tag is defaulted to path', () => {
  const stack = getTestStack();
  new TieredVpc(stack, 'TheVPC', {
    tiers: getCommonTiers(),
  });
  Template.fromStack(stack).hasResource('AWS::EC2::VPC',
    hasTags([{ Key: 'Name', Value: 'TestStack/TheVPC' }]),
  );
  Template.fromStack(stack).hasResource('AWS::EC2::InternetGateway',
    hasTags([{ Key: 'Name', Value: 'TestStack/TheVPC' }]),
  );
});

test('with all of the properties set, it successfully sets the correct VPC properties', () => {
  const stack = getTestStack();
  new TieredVpc(stack, 'TheVPC', {
    cidr: '192.168.0.0/16',
    tiers: getCommonTiers(),
    enableDnsHostnames: false,
    enableDnsSupport: false,
    defaultInstanceTenancy: DefaultInstanceTenancy.DEDICATED,
  });
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '192.168.0.0/16',
    EnableDnsHostnames: false,
    EnableDnsSupport: false,
    InstanceTenancy: DefaultInstanceTenancy.DEDICATED,
  });
});

describe('dns getters correspond to CFN properties', () => {
  const inputs = [
    { dnsSupport: false, dnsHostnames: false },
    // {dnsSupport: false, dnsHostnames: true} - this configuration is illegal so its not part of the permutations.
    { dnsSupport: true, dnsHostnames: false },
    { dnsSupport: true, dnsHostnames: true },
  ];

  for (const input of inputs) {
    test(`[dnsSupport=${input.dnsSupport},dnsHostnames=${input.dnsHostnames}]`, () => {
      const stack = getTestStack();
      const vpc = new TieredVpc(stack, 'TheVPC', {
        cidr: '192.168.0.0/16',
        tiers: getCommonTiers(),
        enableDnsHostnames: input.dnsHostnames,
        enableDnsSupport: input.dnsSupport,
        defaultInstanceTenancy: DefaultInstanceTenancy.DEDICATED,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '192.168.0.0/16',
        EnableDnsHostnames: input.dnsHostnames,
        EnableDnsSupport: input.dnsSupport,
        InstanceTenancy: DefaultInstanceTenancy.DEDICATED,
      });

      expect(input.dnsSupport).toEqual(vpc.dnsSupportEnabled);
      expect(input.dnsHostnames).toEqual(vpc.dnsHostnamesEnabled);
    });
  }
});

test('contains the correct number of subnets when availability zones is not passed', () => {
  const stack = getTestStack();
  const tiers = getCommonTiers();
  const vpc = new TieredVpc(stack, 'TheVPC', { tiers });
  const zones = vpc.availabilityZones.length;

  expect(zones).toEqual(3);
  expect(vpc.publicSubnets.length).toEqual(zones);
  expect(vpc.privateSubnets.length).toEqual(zones);
  expect(vpc.isolatedSubnets.length).toEqual(zones);
  expect(vpc.subnets.length).toEqual(zones * tiers.length);
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('contains the correct number of subnets when availability zones is passed', () => {
  const numZones = 2;
  const stack = getTestStack();
  const availabilityZones = AvailabilityZones.first(numZones);
  const tiers = getCommonTiers();
  const vpc = new TieredVpc(stack, 'TheVPC', { availabilityZones, tiers });
  const zones = vpc.availabilityZones.length;

  expect(zones).toEqual(numZones);
  expect(vpc.publicSubnets.length).toEqual(zones);
  expect(vpc.privateSubnets.length).toEqual(zones);
  expect(vpc.isolatedSubnets.length).toEqual(zones);
  expect(vpc.subnets.length).toEqual(zones * tiers.length);
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('can refer to the internet gateway', () => {
  const stack = getTestStack();
  const vpc = new TieredVpc(stack, 'TheVPC', {
    tiers: getCommonTiers(),
  });
  expect(stack.resolve(vpc.internetGatewayId)).toEqual({ Ref: 'TheVPCIGWFA25CC08' });
});

test('with only isolated subnets, the VPC should not contain an IGW or NAT Gateways', () => {
  const stack = getTestStack();
  new TieredVpc(stack, 'TheVPC', {
    tiers: [
      {
        accessibility: SubnetType.PRIVATE_ISOLATED,
        name: 'isolated',
      },
    ],
  });
  Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 0);
  Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
    MapPublicIpOnLaunch: false,
  });
});

test('with no private subnets, the VPC should have an IGW but no NAT Gateways', () => {
  const stack = getTestStack();
  new TieredVpc(stack, 'TheVPC', {
    tiers: [
      {
        accessibility: SubnetType.PUBLIC,
        name: 'public',
      },
      {
        accessibility: SubnetType.PRIVATE_ISOLATED,
        name: 'isolated',
      },
    ],
  });
  Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
  Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
});

describe('cdk compatibility', () => {
  test('validate cdk compatibility', () => {
    const theirStack = getTestStack();
    new Vpc(theirStack, 'VPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 4,
    });

    const ourStack = getTestStack();
    new TieredVpc(ourStack, 'VPC', {
      availabilityZones: ourStack.availabilityZones.slice(0, 4),
      cidr: '10.0.0.0/16',
      tiers: [
        {
          accessibility: SubnetType.PUBLIC,
          name: 'Public',
        },
        {
          accessibility: SubnetType.PRIVATE_WITH_EGRESS,
          name: 'Private',
        },
      ],
    });

    const theirTemplate = Template.fromStack(theirStack);
    const ourTemplate = Template.fromStack(ourStack);

    expect(ourTemplate).toEqual(theirTemplate);
  });
});

describe('client vpn endpoint', () => {
  test('with a client vpn endpoint', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });
    const cidr = '172.16.0.0/22';
    const serverCertificateArn = stack.formatArn({
      resource: 'certificate',
      resourceName: 'server-certificate',
      service: 'acm',
    });
    const clientCertificateArn = stack.formatArn({
      resource: 'certificate',
      resourceName: 'client-certificate',
      service: 'acm',
    });

    vpc.addClientVpnEndpoint('client-vpn', {
      cidr,
      serverCertificateArn,
      clientCertificateArn,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::ClientVpnEndpoint', {
      ClientCidrBlock: cidr,
      ServerCertificateArn: stack.resolve(serverCertificateArn),
    });
  });
});

describe('flow logs', () => {
  test('with a vpc flow log', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });
    vpc.addFlowLog('flow-log');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceId: stack.resolve(vpc.vpcId),
      ResourceType: 'VPC',
      TrafficType: FlowLogTrafficType.ALL,
    });
  });
});

describe('subnet selection', () => {
  test('selecting default subnets returns the private ones', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets();

    // THEN
    expect(selection.subnetIds).toEqual(vpc.privateSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('can select public subnets', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets({ subnetType: SubnetType.PUBLIC });

    // THEN
    expect(selection.subnetIds).toEqual(vpc.publicSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('can select isolated subnets', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_ISOLATED });

    // THEN
    expect(selection.subnetIds).toEqual(vpc.isolatedSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('can select subnets by name', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets({ subnetGroupName: 'public' });

    // THEN
    expect(selection.subnetIds).toEqual(vpc.publicSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('selecting default subnets in a VPC with only isolated subnets returns the isolateds', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: [
        {
          accessibility: SubnetType.PRIVATE_ISOLATED,
          name: 'isolated',
        },
      ],
    });

    // WHEN
    const selection = vpc.selectSubnets();

    // THEN
    expect(selection.subnetIds).toEqual(vpc.isolatedSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('selecting default subnets in a VPC with only public subnets returns the publics', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: [
        {
          accessibility: SubnetType.PUBLIC,
          name: 'public',
        },
      ],
    });

    // WHEN
    const selection = vpc.selectSubnets();

    // THEN
    expect(selection.subnetIds).toEqual(vpc.publicSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('selecting subnets by name fails if the name is unknown', () => {
    // GIVEN
    const stack = new Stack();
    const tiers = getCommonTiers();
    const vpc = new TieredVpc(stack, 'VPC', { tiers });
    const tierNames = tiers.map(x => x.name);

    expect(() => {
      vpc.selectSubnets({ subnetGroupName: 'Toot' });
    }).toThrow(`There are no subnet groups with name 'Toot' in this VPC. Available names: ${tierNames.join(',')}`);
  });

  test('select subnets with az restriction', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: [
        {
          accessibility: SubnetType.PUBLIC,
          name: 'public',
        },
        {
          accessibility: SubnetType.PRIVATE_WITH_EGRESS,
          name: 'private1',
        },
        {
          accessibility: SubnetType.PRIVATE_WITH_EGRESS,
          name: 'private2',
        },
      ],
    });

    // WHEN
    const selection = vpc.selectSubnets({ onePerAz: true });

    // THEN
    expect(selection.subnetIds.length).toEqual(3);
    expect(selection.availabilityZones.length).toEqual(3);
    expect(selection.subnetIds[0]).toEqual(vpc.privateSubnets[0].subnetId);
  });

  test('select explicitly defined subnets', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets({ subnets: [vpc.publicSubnets[0]] });

    // THEN
    expect(selection.subnetIds.length).toEqual(1);
    expect(selection.availabilityZones.length).toEqual(1);
    expect(selection.subnetIds[0]).toEqual(vpc.publicSubnets[0].subnetId);
  });

  test('select using explicit availability zones', () => {
    // GIVEN
    const stack = getTestStack();
    const azs = AvailabilityZones.first(3);
    const vpc = new TieredVpc(stack, 'VPC', {
      availabilityZones: azs,
      tiers: getCommonTiers(),
    });

    // WHEN
    const selection = vpc.selectSubnets({ availabilityZones: azs.slice(0, 2) });

    // THEN
    expect(selection.subnetIds.length).toEqual(2);
    expect(selection.availabilityZones.length).toEqual(2);
    expect(selection.subnetIds[0]).toEqual(vpc.privateSubnets[0].subnetId);
    expect(selection.subnetIds[1]).toEqual(vpc.privateSubnets[1].subnetId);
  });
});

describe('vpc endpoints', () => {
  test('with a gateway endpoint', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });
    vpc.addGatewayEndpoint('gateway-endpoint', {
      service: GatewayVpcEndpointAwsService.S3,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
      ServiceName: stack.resolve(GatewayVpcEndpointAwsService.S3.name),
      VpcEndpointType: 'Gateway',
      VpcId: stack.resolve(vpc.vpcId),
    });
  });

  test('with an interface endpoint', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });
    vpc.addInterfaceEndpoint('interface-endpoint', {
      service: InterfaceVpcEndpointAwsService.S3,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
      ServiceName: stack.resolve(InterfaceVpcEndpointAwsService.S3.name),
      VpcEndpointType: 'Interface',
      VpcId: stack.resolve(vpc.vpcId),
    });
  });
});

describe('vpn connections', () => {
  test('with a vpn connection', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    vpc.enableVpnGateway({
      type: 'ipsec.1',
    });

    vpc.addVpnConnection('vpn-connection', {
      asn: 65000,
      ip: '192.0.2.1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::CustomerGateway', {
      BgpAsn: 65000,
      IpAddress: '192.0.2.1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNConnection', {
      VpnGatewayId: stack.resolve(vpc.vpnGatewayId),
    });
  });
});

describe('vpn gateway', () => {
  test('with a vpn gateway', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: [
        {
          accessibility: SubnetType.PUBLIC,
          name: 'Public',
        },
        {
          accessibility: SubnetType.PRIVATE_WITH_EGRESS,
          name: 'Private',
        },
        {
          accessibility: SubnetType.PRIVATE_ISOLATED,
          name: 'Isolated',
        },
      ],
    });

    vpc.enableVpnGateway({
      amazonSideAsn: 65000,
      type: 'ipsec.1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
      AmazonSideAsn: 65000,
      Type: 'ipsec.1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
      VpnGatewayId: {
        Ref: 'VPCVpnGatewayB5ABAE68',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
      RouteTableIds: [
        {
          Ref: 'VPCPrivateSubnet1RouteTableBE8A6027',
        },
        {
          Ref: 'VPCPrivateSubnet2RouteTable0A19E10E',
        },
        {
          Ref: 'VPCPrivateSubnet3RouteTable192186F8',
        },
      ],
      VpnGatewayId: {
        Ref: 'VPCVpnGatewayB5ABAE68',
      },
    });

    expect(stack.resolve(vpc.vpnGatewayId)).toBeDefined();
  });

  test('enabling vpn gateway fails if attempted multiple times', () => {
    const stack = getTestStack();
    const vpc = new TieredVpc(stack, 'VPC', {
      tiers: getCommonTiers(),
    });

    vpc.enableVpnGateway({
      amazonSideAsn: 65000,
      type: 'ipsec.1',
    });

    expect(() => {
      vpc.enableVpnGateway({
        amazonSideAsn: 65000,
        type: 'ipsec.1',
      });
    }).toThrow('A VPN gateway is already enabled.');
  });
});


function getTestStack(): Stack {
  const stack = new Stack(undefined, 'TestStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  stack.node.setContext('availability-zones:account=123456789012:region=us-east-1', [
    'us-east-1a',
    'us-east-1b',
    'us-east-1c',
    'us-east-1d',
    'us-east-1e',
    'us-east-1f',
  ]);

  return stack;
}

function getCommonTiers(): TierConfiguration[] {
  return [
    {
      accessibility: SubnetType.PUBLIC,
      name: 'public',
    },
    {
      accessibility: SubnetType.PRIVATE_WITH_EGRESS,
      name: 'private',
    },
    {
      accessibility: SubnetType.PRIVATE_ISOLATED,
      name: 'data',
    },
  ];
}

function hasTags(expectedTags: Array<{Key: string; Value: string}>) {
  return {
    Properties: {
      Tags: Match.arrayWith(expectedTags),
    },
  };
}