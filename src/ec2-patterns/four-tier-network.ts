import { Annotations, Aspects, Tags } from 'aws-cdk-lib';
import { AclCidr, AclTraffic, Action, CommonNetworkAclEntryOptions, NetworkAcl, NetworkAclEntry, SubnetSelection, SubnetType, TrafficDirection, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { TieredVpc } from '../ec2/vpc';


export enum NetworkPosition {
  HUB = 'HUB',
  SPOKE = 'SPOKE'
}

export enum SubnetTier {
  DATA = 'data',
  DMZ = 'dmz',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

interface FourTierNetworkProps {
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
     * The accessibility of private subnets within the VPC.
     */
  readonly privateNetworkType: SubnetType;
}

export abstract class FourTierNetwork extends TieredVpc {
  /**
     * The default CIDR range for networks being created without a CIDR range
     * being specified.
     */
  public static readonly DEFAULT_CIDR_RANGE: string = Vpc.DEFAULT_CIDR_RANGE;


  /**
     * Internal value for keeping track of the state of the default network ACL
     * entries.
     *
     * Used to prevent the default entries from getting erroniously added
     * multiple times.
     *
     * @group Internal
     */
  public _defaultNaclsEnabled: boolean = false;


  /**
     * Controls whether a default set of ACL's should be added that restrict
     * traffic flow through the VPC to recommended patterns.
     *
     * @group Inputs
     */
  public readonly addDefaultAcls: boolean;

  /**
     * The name of the VPC to be created. This is primarily used for tagging and resource naming
     * purposed though could also be used in the discovery of resources and billing reports.
     *
     * @group Inputs
     */
  readonly name: string;


  /**
     * A selection that can be used to quickly select the subnets belonging to
     * the data subnet tier.
     *
     * The data subnet tier is intended for hosting services that provide the
     * data layer for the VPC's application infrastructure.
     *
     * This includes things like RDS instances, Elasticache clusters, and
     * PrivateLink endpoints for third party data based services such as
     * MongoDB Atlas.
     *
     * Access to this tier should be highly restricted. Ideally only to
     * services running running under the priavte subnet tier.
     */
  public dataTierSubnets: SubnetSelection;

  /**
     * A selection that can be used to quickly select the subnets belonging to
     * the dmz subnet tier.
     *
     * The dmz subnet tier is intended as an entrypoint to the VPC from other
     * internal networks connected via services like AWS Transit Gateway.
     *
     * This is the tier where Transit Gateway attachments are created. It's
     * network ACL's can be used to restrict access to specific parts of an
     * internal network.
     *
     * It can serve as a sort of psuedo public network where things like load
     * balancers can be deployed for services that should be exposed to your
     * entire internal network while not being publicly accessible.
     */
  public dmzTierSubnets: SubnetSelection;

  /**
      * A selection that can be used to quickly select the subnets belonging to
      * the private subnet tier.
      *
      * Subnets in the private tier are intended for running the business logic
      * and hosting the bulk of the services in the VPC.
      *
      * This includes thing like ECS instances, ECS tasks, EKS clusters, etc..
      */
  public privateTierSubnets: SubnetSelection;

  /**
     * A selection that can be used to quickly select the subnets belonging to
     * the public subnet tier.
     *
     * Subnets in the public tier are intended primarily for ingress and
     * egress traffic from the internet.
     *
     * Examples of resources that go in this tier are load balancers, api
     * gateways nat gateways, etc..
     *
     * It is generally not recommended to have business logic running in the
     * public subnets.
     */
  public publicTierSubnets: SubnetSelection;


  /**
     * Indicates whether the default set of Network ACL entries have been
     * enabled on this.VPC.
     *
     * When enabled these ACL's restrict traffic flow through the VPC to
     * recommended patterns.
     */
  public get defaultNaclsEnabled(): boolean {
    return this._defaultNaclsEnabled;
  }


  protected constructor(scope: Construct, id: string, props: FourTierNetworkProps) {
    super(scope, id, {
      tiers: [
        {
          accessibility: SubnetType.PUBLIC,
          name: 'public',
        },
        {
          accessibility: props.privateNetworkType,
          name: 'private',
        },
        {
          accessibility: props.privateNetworkType,
          name: 'data',
        },
        {
          accessibility: props.privateNetworkType,
          name: 'dmz',
        },
      ],
    });

    this.addDefaultAcls = props.addDefaultAcls ?? true;
    this.name = props.name;

    this.publicTierSubnets = { subnetGroupName: 'public' };
    this.privateTierSubnets = { subnetGroupName: 'private' };
    this.dataTierSubnets = { subnetGroupName: 'data' };
    this.dmzTierSubnets = { subnetGroupName: 'dmz' };

    // Create a network ACL for each tier.
    const nacls = Object.keys(this.tiers).map((x) => {
      const nacl = new NetworkAcl(this, `${x}-network-acl`, {
        subnetSelection: {
          subnetGroupName: x,
        },
        vpc: this,
      });

      Tags.of(nacl).add('Name', `${this.name}-${x}`);

      return nacl;
    });

    // If no ACL entries get added during the construct phase add some
    // default rules while applying aspects.
    nacls.forEach((nacl) => {
      Aspects.of(nacl).add({
        visit: (node: IConstruct) => {
          if (node === nacl) {
            const hasEntries = !!node.node.findAll().filter((x) => {
              return x instanceof NetworkAclEntry;
            }).length;

            if (!hasEntries) {
              nacl.addEntry('default-allow-all-ingress', {
                cidr: AclCidr.anyIpv4(),
                direction: TrafficDirection.INGRESS,
                ruleNumber: 100,
                traffic: AclTraffic.allTraffic(),
              });

              nacl.addEntry('default-allow-all-egress', {
                cidr: AclCidr.anyIpv4(),
                direction: TrafficDirection.EGRESS,
                ruleNumber: 100,
                traffic: AclTraffic.allTraffic(),
              });
            }
          }
        },
      });
    });

    // Add better tags to the subnets/
    this._subnetInfo.forEach((x) => {
      Tags.of(x.subnet).add('Name', `${this.name}-${x.groupName}-${x.subnet.availabilityZone}`);
    });

    if (props.addDefaultAcls ?? true) {
      this.enableDefaultAcls();
    }
  }

  /**
     * Add one or more NACL entries to the NACL associated with a specific tier of subnets.
     *
     * @param acl The tier of subnets that the added rules should apply to.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique within the context of 'scope'.
     * @param options The details describing the entry to be created.
     * @returns An array containing NACL entries that were created.
     */
  public addNetworkAclEntry(acl: SubnetTier, id: string, options: CommonNetworkAclEntryOptions): NetworkAclEntry {
    let nacl = this.node.tryFindChild(`${acl}-network-acl`) as NetworkAcl;
    return nacl.addEntry(id, options);
  }

  /**
     * Adds a default set of ACL entries that enforce the standard set of boundaries within the
     * VPC. These rules include:
     *
     * * Restrict private subnet access to only public and dmz subnets.
     * * Restrict data subnet access to only private subnets.
     * * Restict dmz subnets to local VPC traffic (with TGW traffic also entering here).
     *
     * Ephemeral ports are considered 1024-65535. This is not ideal as it exposes a lot of
     * sensitive services, such as databases.
     *
     * However, core AWS infrastructure components (such as Lambda and ELB's) ephemeral port
     * ranges starting at 1024 so we can't scope this down any further without the potential for
     * causing sponaneous and confusing issues when some traffic for some services get
     * unexpectedly dropped.
     *
     * For details on which AWS services use which ephemeral port ranges, see the Network ACL
     * [documentation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#nacl-ephemeral-ports) for configuring ephemeral ports.
     */
  public enableDefaultAcls(): void {
    if (this.defaultNaclsEnabled) {
      Annotations.of(this).addWarning([
        'Attempted to add default network ACL entries multiple times.',
        'Subsequent call will be ignored.',
      ].join(' '));
      return;
    }

    this._defaultNaclsEnabled = true;

    this.addNetworkAclEntry(SubnetTier.PUBLIC, 'common-allow-all-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.allTraffic(),
    });
    this.addNetworkAclEntry(SubnetTier.PUBLIC, 'common-allow-all-egress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.EGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.allTraffic(),
    });

    this.addNetworkAclEntry(SubnetTier.PRIVATE, 'common-allow-all-ephemeral-tcp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.tcpPortRange(1024, 65535),
    });
    this.addNetworkAclEntry(SubnetTier.PRIVATE, 'common-allow-all-ephemeral-udp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 201,
      traffic: AclTraffic.udpPortRange(1024, 65535),
    });
    this.selectSubnets(this.publicTierSubnets).subnets.forEach((x, idx) => {
      this.addNetworkAclEntry(SubnetTier.PRIVATE, `common-allow-public${idx.toString().padStart(2, '0')}-all-ingress`, {
        cidr: AclCidr.ipv4(x.ipv4CidrBlock),
        direction: TrafficDirection.INGRESS,
        ruleAction: Action.ALLOW,
        ruleNumber: 300 + idx,
        traffic: AclTraffic.allTraffic(),
      });
    });
    this.selectSubnets(this.privateTierSubnets).subnets.forEach((x, idx) => {
      this.addNetworkAclEntry(SubnetTier.PRIVATE, `common-allow-private${idx.toString().padStart(2, '0')}-all-ingress`, {
        cidr: AclCidr.ipv4(x.ipv4CidrBlock),
        direction: TrafficDirection.INGRESS,
        ruleAction: Action.ALLOW,
        ruleNumber: 400 + idx,
        traffic: AclTraffic.allTraffic(),
      });
    });
    this.selectSubnets(this.dataTierSubnets).subnets.forEach((x, idx) => {
      this.addNetworkAclEntry(SubnetTier.PRIVATE, `common-allow-dmz${idx.toString().padStart(2, '0')}-all-ingress`, {
        cidr: AclCidr.ipv4(x.ipv4CidrBlock),
        direction: TrafficDirection.INGRESS,
        ruleAction: Action.ALLOW,
        ruleNumber: 600 + idx,
        traffic: AclTraffic.allTraffic(),
      });
    });
    this.addNetworkAclEntry(SubnetTier.PRIVATE, 'common-allow-all-egress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.EGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.allTraffic(),
    });

    this.addNetworkAclEntry(SubnetTier.DATA, 'common-allow-all-ephemeral-tcp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.tcpPortRange(1024, 65535),
    });
    this.addNetworkAclEntry(SubnetTier.DATA, 'common-allow-all-ephemeral-udp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 201,
      traffic: AclTraffic.udpPortRange(1024, 65535),
    });
    this.selectSubnets(this.privateTierSubnets).subnets.forEach((x, idx) => {
      this.addNetworkAclEntry(SubnetTier.DATA, `common-allow-private${idx.toString().padStart(2, '0')}-all-ingress`, {
        cidr: AclCidr.ipv4(x.ipv4CidrBlock),
        direction: TrafficDirection.INGRESS,
        ruleAction: Action.ALLOW,
        ruleNumber: 400 + idx,
        traffic: AclTraffic.allTraffic(),
      });
    });
    this.selectSubnets(this.dataTierSubnets).subnets.forEach((x, idx) => {
      this.addNetworkAclEntry(SubnetTier.DATA, `common-allow-data${x.toString().padStart(2, '0')}-all-ingress`, {
        cidr: AclCidr.ipv4(x.ipv4CidrBlock),
        direction: TrafficDirection.INGRESS,
        ruleAction: Action.ALLOW,
        ruleNumber: 500 + idx,
        traffic: AclTraffic.allTraffic(),
      });
    });
    this.addNetworkAclEntry(SubnetTier.DATA, 'common-allow-all-egress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.EGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.allTraffic(),
    });

    this.addNetworkAclEntry(SubnetTier.DMZ, 'common-allow-all-ephemeral-tcp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.tcpPortRange(1024, 65535),
    });
    this.addNetworkAclEntry(SubnetTier.DMZ, 'common-allow-all-ephemeral-udp-ingress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 201,
      traffic: AclTraffic.udpPortRange(1024, 65535),
    });
    this.addNetworkAclEntry(SubnetTier.DMZ, 'common-allow-all-local-ingress', {
      cidr: AclCidr.ipv4(this.cidr),
      direction: TrafficDirection.INGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 210,
      traffic: AclTraffic.allTraffic(),
    });
    this.addNetworkAclEntry(SubnetTier.DMZ, 'common-allow-all-egress', {
      cidr: AclCidr.anyIpv4(),
      direction: TrafficDirection.EGRESS,
      ruleAction: Action.ALLOW,
      ruleNumber: 200,
      traffic: AclTraffic.allTraffic(),
    });
  }
}
