import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DefaultInstanceTenancy, FlowLogTrafficType, GatewayVpcEndpointAwsService, InterfaceVpcEndpointAwsService, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CustomVpc, SubnetOptions } from '../src/ec2';
import { AvailabilityZones } from '../src/utils/availability-zones';
import { divideCidr } from '../src/utils/networking';

test('vpc.vpcId returns a token to the VPC ID', () => {
  const stack = getTestStack();
  const vpc = new CustomVpc(stack, 'TheVPC');
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('vpc.vpcArn returns a token to the VPC ID', () => {
  const stack = getTestStack();
  const vpc = new CustomVpc(stack, 'TheVPC');
  expect(stack.resolve(vpc.vpcArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ec2:us-east-1:123456789012:vpc/', { Ref: 'TheVPC92636AB0' }]] });
});

test('it uses the correct network range', () => {
  const stack = getTestStack();
  new CustomVpc(stack, 'TheVPC');
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: Vpc.DEFAULT_CIDR_RANGE,
    EnableDnsHostnames: true,
    EnableDnsSupport: true,
    InstanceTenancy: DefaultInstanceTenancy.DEFAULT,
  });
});

test('the Name tag is defaulted to path', () => {
  const stack = getTestStack();
  new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
      {
        tier: SubnetType.PUBLIC,
      },
    ),
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
  new CustomVpc(stack, 'TheVPC', {
    cidr: '192.168.0.0/16',
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
      const vpc = new CustomVpc(stack, 'TheVPC', {
        cidr: '192.168.0.0/16',
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

test('contains the correct number of subnets when all groups have equal subnets', () => {
  const stack = getTestStack();
  const vpc = new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
      {
        tier: SubnetType.PUBLIC,
      },
      {
        tier: SubnetType.PRIVATE_WITH_EGRESS,
      },
      {
        tier: SubnetType.PRIVATE_ISOLATED,
      },
    ),
  });
  const zones = stack.availabilityZones.length;
  expect(zones).toEqual(3);
  expect(vpc.publicSubnets.length).toEqual(zones);
  expect(vpc.privateSubnets.length).toEqual(zones);
  expect(vpc.isolatedSubnets.length).toEqual(zones);
  expect(vpc.subnets.length).toEqual(zones * 3);
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('contains the correct number of subnets when groups have different subnets', () => {
  const stack = getTestStack();
  const azs = AvailabilityZones.first(4);
  const vpc = new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', azs,
      {
        count: 3,
        tier: SubnetType.PUBLIC,
      },
      {
        count: 3,
        tier: SubnetType.PRIVATE_WITH_EGRESS,
      },
      {
        count: 4,
        tier: SubnetType.PRIVATE_ISOLATED,
      },
    ),
  });
  const zones = vpc.availabilityZones.length;

  expect(zones).toEqual(4);
  expect(vpc.publicSubnets.length).toEqual(3);
  expect(vpc.privateSubnets.length).toEqual(3);
  expect(vpc.isolatedSubnets.length).toEqual(4);
  expect(vpc.subnets.length).toEqual(10);
  expect(stack.resolve(vpc.vpcId)).toEqual({ Ref: 'TheVPC92636AB0' });
});

test('can refer to the internet gateway', () => {
  const stack = getTestStack();
  const vpc = new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
      {
        tier: SubnetType.PUBLIC,
      },
      {
        tier: SubnetType.PRIVATE_WITH_EGRESS,
      },
    ),
  });
  expect(stack.resolve(vpc.internetGatewayId)).toEqual({ Ref: 'TheVPCIGWFA25CC08' });
});

test('with only isolated subnets, the VPC should not contain an IGW or NAT Gateways', () => {
  const stack = getTestStack();
  new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
      {
        tier: SubnetType.PRIVATE_ISOLATED,
      },
    ),
  });
  Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 0);
  Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
    MapPublicIpOnLaunch: false,
  });
});

test('with no private subnets, the VPC should have an IGW but no NAT Gateways', () => {
  const stack = getTestStack();
  new CustomVpc(stack, 'TheVPC', {
    cidr: '10.0.0.0/16',
    subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
      {
        tier: SubnetType.PUBLIC,
      },
      {
        tier: SubnetType.PRIVATE_ISOLATED,
      },
    ),
  });
  Template.fromStack(stack).resourceCountIs('AWS::EC2::InternetGateway', 1);
  Template.fromStack(stack).resourceCountIs('AWS::EC2::NatGateway', 0);
});

describe('custom subnets', () => {
  test('adding a custom subnets should fail after referencing defaultAccessibility', () => {
    const stack = getTestStack();
    const azs = AvailabilityZones.first(2);
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: [
        {
          accessibility: SubnetType.PUBLIC,
          availabilityZone: azs[0],
          cidr: '10.0.0.0/17',
          groupName: 'public',
        },
      ],
    });

    expect(vpc.defaultAccessibility).toEqual(SubnetType.PUBLIC);
    expect(() => {
      vpc.addSubnet({
        accessibility: SubnetType.PRIVATE_WITH_EGRESS,
        availabilityZone: AvailabilityZones.first(1)[0],
        cidr: '10.0.128.0/17',
        groupName: 'public',
      });
    }).toThrow(/^Can't add a new subnet to a VPC after it has been locked.*$/);
  });

  test('adding a subnet after invoking selectSubnets should fail', () => {
    const stack = getTestStack();
    const azs = AvailabilityZones.first(2);
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: [
        {
          accessibility: SubnetType.PUBLIC,
          availabilityZone: azs[0],
          cidr: '10.0.0.0/17',
          groupName: 'public',
        },
      ],
    });

    expect(vpc.selectSubnets().subnets.length).toEqual(1);
    expect(() => {
      vpc.addSubnet({
        accessibility: SubnetType.PRIVATE_WITH_EGRESS,
        availabilityZone: AvailabilityZones.first(1)[0],
        cidr: '10.0.128.0/17',
        groupName: 'public',
      });
    }).toThrow(/^Can't add a new subnet to a VPC after it has been locked.*$/);
  });
});

describe('client vpn endpoint', () => {
  test('with a client vpn endpoint', () => {
    const stack = getTestStack();
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
    });

    // WHEN
    const selection = vpc.selectSubnets({ subnetGroupName: 'public0' });

    // THEN
    expect(selection.subnetIds).toEqual(vpc.publicSubnets.map(s => s.subnetId));
    expect(selection.availabilityZones.length).toEqual(3);
  });

  test('selecting default subnets in a VPC with only isolated subnets returns the isolateds', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
      ),
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
    const cidr = '10.0.0.0/16';
    const subnets = generateSubnets(cidr, AvailabilityZones.first(3),
      {
        tier: SubnetType.PUBLIC,
      },
      {
        tier: SubnetType.PRIVATE_WITH_EGRESS,
      },
      {
        tier: SubnetType.PRIVATE_ISOLATED,
      },
    );
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr,
      subnets,
    });
    const subnetNames = Array.from(new Set(subnets.map(x => x.groupName)));

    expect(() => {
      vpc.selectSubnets({ subnetGroupName: 'Toot' });
    }).toThrow(`There are no subnet groups with name 'Toot' in this VPC. Available names: ${subnetNames.join(',')}`);
  });

  test('select subnets with az restriction', () => {
    // GIVEN
    const stack = getTestStack();
    const numAzs = 3;
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(numAzs),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ),
    });

    // WHEN
    const selection = vpc.selectSubnets({ onePerAz: true });

    // THEN
    expect(selection.subnetIds.length).toEqual(numAzs);
    expect(selection.availabilityZones.length).toEqual(3);
    expect(selection.subnetIds[0]).toEqual(vpc.privateSubnets[0].subnetId);
  });

  test('select explicitly defined subnets', () => {
    // GIVEN
    const stack = getTestStack();
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', azs,
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          groupName: 'Public',
          tier: SubnetType.PUBLIC,
        },
        {
          groupName: 'Private',
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          groupName: 'Isolated',
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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
    const vpc = new CustomVpc(stack, 'VPC', {
      cidr: '10.0.0.0/16',
      subnets: generateSubnets('10.0.0.0/16', AvailabilityZones.first(3),
        {
          tier: SubnetType.PUBLIC,
        },
        {
          tier: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          tier: SubnetType.PRIVATE_ISOLATED,
        },
      ),
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


interface GenerateSubnetOptions {
  readonly azs?: string;
  readonly groupName?: string;
  readonly mapPublicIpOnLaunch?: boolean;
  readonly count?: number;
  readonly tier: SubnetType;
}

function generateSubnets(cidr: string, azs: string[], ...options: GenerateSubnetOptions[]): SubnetOptions[] {
  const groupCidrs = divideCidr(cidr, options.length);
  const incrementors: {[key: string]: number} = {
    isolated: 0,
    private: 0,
    public: 0,
  };

  const groupSubnets = options.map((group, gIdx) => {
    const groupAzs = group.azs ?? azs;
    const groupSupernet = groupCidrs[gIdx];
    const groupParts = group.count ?? 3;
    const subnetCidrs = divideCidr(groupSupernet, groupParts);

    let groupNamePrefix: string;
    if (group.tier === SubnetType.PUBLIC) {
      groupNamePrefix = 'public';
    } else if (group.tier === SubnetType.PRIVATE_ISOLATED) {
      groupNamePrefix = 'isolated';
    } else {
      groupNamePrefix = 'private';
    }

    const groupName = group.groupName ?? `${groupNamePrefix}${incrementors[groupNamePrefix]++}`;
    return Array.from(Array(groupParts).keys()).map((x): SubnetOptions => {
      return {
        accessibility: group.tier,
        availabilityZone: groupAzs[x % groupAzs.length],
        cidr: subnetCidrs[x],
        groupName: groupName,
      };
    });
  });

  return groupSubnets.reduce((prev, cur) => {
    return [...prev, ...cur];
  }, [] as SubnetOptions[]);;
}

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

function hasTags(expectedTags: Array<{Key: string; Value: string}>) {
  return {
    Properties: {
      Tags: Match.arrayWith(expectedTags),
    },
  };
}