import { IResource, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnVPCCidrBlock, IVpc } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { AddressFamily, ICidrAssignment } from './lib/cidr-assignment';
import { VpcCidrBlockResolver } from './lib/custom-resources/vpc-cidr-block-resolver';


export interface IVpcCidrBlock extends IResource {
  readonly vpcCidrBlockAssociationId: string;
  readonly vpcCidrBlockCidr: string;
}

abstract class VpcCidrBlockBase extends Resource implements IVpcCidrBlock {
  public abstract readonly vpcCidrBlockAssociationId: string;
  public abstract readonly vpcCidrBlockCidr: string;
}

export interface VpcCidrBlockAttributes {
  readonly associationId: string;
  readonly cidr: string;
}

export interface VpcCidrBlockProps extends ResourceProps {
  readonly cidrAssignment: ICidrAssignment;
  readonly vpc: IVpc;
}

export class VpcCidrBlock extends VpcCidrBlockBase {
  public static fromVpcCidrBlockAttributes(scope: IConstruct, id: string, attrs: VpcCidrBlockAttributes): IVpcCidrBlock {
    class Import extends VpcCidrBlockBase {
      public readonly vpcCidrBlockAssociationId: string = attrs.associationId;
      public readonly vpcCidrBlockCidr: string = attrs.cidr;
    }

    return new Import(scope, id);
  }

  public readonly vpc: IVpc;

  public readonly resource: CfnVPCCidrBlock;

  public readonly vpcCidrBlockAddressFamily: string;
  public readonly vpcCidrBlockAssociationId: string;
  public readonly vpcCidrBlockCidr: string;


  public constructor(scope: IConstruct, id: string, props: VpcCidrBlockProps) {
    super(scope, id, props);

    this.vpc = props.vpc;

    const configuration = props.cidrAssignment.getCidrOrIpamConfiguration({});
    const family = configuration.cidrDetails?.family ?? configuration.ipamDetails?.family;

    if (!family) {
      throw new Error([
        'Failed to resolve CIDR assignment for VpcCidrBlock. Missing required',
        'configuration info for cidrDetails or ipamDetails.',
      ].join(' '));
    }

    this.resource = new CfnVPCCidrBlock(this, 'Resource', {
      amazonProvidedIpv6CidrBlock: family === AddressFamily.IPV6 ? configuration.ipamDetails?.amazonAllocated : undefined,
      cidrBlock: family === AddressFamily.IPV4 ? configuration.cidrDetails?.cidr : undefined,
      ipv4IpamPoolId: family === AddressFamily.IPV4 ? configuration.ipamDetails?.ipamPool?.ipamPoolId : undefined,
      ipv4NetmaskLength: family === AddressFamily.IPV4 ? configuration.ipamDetails?.netmask : undefined,
      ipv6CidrBlock: family === AddressFamily.IPV6 ? configuration.cidrDetails?.cidr : undefined,
      ipv6IpamPoolId: family === AddressFamily.IPV6 ? configuration.ipamDetails?.ipamPool?.ipamPoolId : undefined,
      ipv6NetmaskLength: family === AddressFamily.IPV6 ? configuration.ipamDetails?.netmask : undefined,
      //ipv6Pool: configuration.ipv6Pool,
      vpcId: this.vpc.vpcId,
    });

    this.vpcCidrBlockAddressFamily = family.toString();
    this.vpcCidrBlockAssociationId = this.resource.ref;
    this.vpcCidrBlockCidr = configuration.cidrDetails?.cidr ?? this.lookupCidrBlock();
  }

  private lookupCidrBlock(): string {
    const uid = 'resolver';
    const resolver = this.node.tryFindChild(uid) as VpcCidrBlockResolver ?? new VpcCidrBlockResolver(this, uid, {
      associationId: this.vpcCidrBlockAssociationId,
      vpcId: this.vpc.vpcId,
    });

    return resolver.cidrBlock;
  }
}
