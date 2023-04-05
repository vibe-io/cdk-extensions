import { ArnFormat, IResolvable, IResource, Lazy, Resource, ResourceProps, Token } from 'aws-cdk-lib';
import { CfnIPAM, CfnIPAMResourceDiscovery } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { IIpam, Ipam, IpamProps } from './ipam';
import { IIpamResourceDiscoveryAssociation } from './ipam-resource-discovery-association';
import { ResourceImporter } from '../utils/importer';


/**
 * Represents an IPAM resource discovery in AWS.
 */
export interface IIpamResourceDiscovery extends IResource {
  /**
   * The resource discovery ARN.
   */
  readonly ipamResourceDiscoveryArn: string;

  /**
   * The resource discovery ID.
   */
  readonly ipamResourceDiscoveryId: string;

  /**
   * Defines if the resource discovery is the default. The default resource
   * discovery is the resource discovery automatically created when you create
   * an IPAM.
   */
  readonly ipamResourceDiscoveryIsDefault: IResolvable;

  /**
   * The owner ID.
   */
  readonly ipamResourceDiscoveryOwnerId: string;

  /**
   * The resource discovery Region.
   */
  readonly ipamResourceDiscoveryRegion: string;

  /**
   * The resource discovery's state.
   *
   * - create-in-progress - Resource discovery is being created.
   * - create-complete - Resource discovery creation is complete.
   * - create-failed - Resource discovery creation has failed.
   * - modify-in-progress - Resource discovery is being modified.
   * - modify-complete - Resource discovery modification is complete.
   * - modify-failed - Resource discovery modification has failed.
   * - delete-in-progress - Resource discovery is being deleted.
   * - delete-complete - Resource discovery deletion is complete.
   * - delete-failed - Resource discovery deletion has failed.
   * - isolate-in-progress - AWS account that created the resource discovery
   * has been removed and the resource discovery is being isolated.
   * - isolate-complete - Resource discovery isolation is complete.
   * - restore-in-progress - AWS account that created the resource discovery
   * and was isolated has been restored.
   */
  readonly ipamResourceDiscoveryState: string;

  addIpam(id: string, options: IpamProps): IIpam;
  associateIpam(ipam: IIpam): IIpamResourceDiscoveryAssociation;
}

abstract class IpamResourceDiscoveryBase extends Resource implements IIpamResourceDiscovery {
  public abstract readonly ipamResourceDiscoveryArn: string;
  public abstract readonly ipamResourceDiscoveryId: string;
  public abstract readonly ipamResourceDiscoveryIsDefault: IResolvable;
  public abstract readonly ipamResourceDiscoveryOwnerId: string;
  public abstract readonly ipamResourceDiscoveryRegion: string;
  public abstract readonly ipamResourceDiscoveryState: string;


  public addIpam(id: string, options: IpamProps): IIpam {
    const ipam = new Ipam(this, `ipam-${id}`, options);
    this.associateIpam(ipam);
    return ipam;
  }

  public associateIpam(ipam: IIpam): IIpamResourceDiscoveryAssociation {
    return ipam.associateResourceDiscovery(this);
  }
}

export interface IpamResourceDiscoveryAttributes {
  readonly isDefault?: boolean;
  readonly resourceDiscoveryArn?: string;
  readonly resourceDiscoveryId?: string;
  readonly ownerId?: string;
  readonly region?: string;
  readonly state?: string;
}

export interface IpamResourceDiscoveryProps extends ResourceProps {
  readonly description?: string;
}

export class IpamResourceDiscovery extends IpamResourceDiscoveryBase {
  /**
   * The format for Amazon Resource Names (ARN's) for IPAM resource discovery
   * resources.
   */
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  /**
   * Imports an existing IPAM resource discovery by specifying its Amazon
   * Resource Name (ARN).
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param ipamResourceDiscoveryArn The ARN of the existing IPAM resource
   * discovery to be imported.
   * @returns An object representing the imported IPAM resource discovery.
   */
  public static fromIpamResourceDiscoveryArn(scope: IConstruct, id: string, ipamResourceDiscoveryArn: string): IIpamResourceDiscovery {
    return IpamResourceDiscovery.fromIpamResourceDiscoveryAttributes(scope, id, {
      resourceDiscoveryArn: ipamResourceDiscoveryArn,
    });
  }

  /**
   * Imports an existing IPAM resource discovery by explicitly specifying its
   * attributes.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attrs The attributes of the existing IPAM resource discovery to be
   * imported.
   * @returns An object representing the imported IPAM resource discovery.
   */
  public static fromIpamResourceDiscoveryAttributes(
    scope: IConstruct,
    id: string,
    attrs: IpamResourceDiscoveryAttributes,
  ): IIpamResourceDiscovery {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: IpamResourceDiscovery.ARN_FORMAT,
      service: 'ec2',
      resource: 'ipam-resource-discovery',
    });

    const identities = importer.resolveIdentities(attrs.resourceDiscoveryArn, attrs.resourceDiscoveryId);
    const props = importer.resolveProperties({
      ipamResourceDiscoveryIsDefault: attrs.isDefault,
      ipamResourceDiscoveryOwnerId: attrs.ownerId,
      ipamResourceDiscoveryRegion: attrs.region,
      ipamResourceDiscoveryState: attrs.state,
    });

    class Import extends IpamResourceDiscoveryBase {
      public readonly ipamResourceDiscoveryArn: string = identities.arn;
      public readonly ipamResourceDiscoveryId: string = identities.id;
      public readonly ipamResourceDiscoveryIsDefault: IResolvable = Token.asAny(props.ipamResourceDiscoveryIsDefault);
      public readonly ipamResourceDiscoveryOwnerId: string = Token.asString(props.ipamResourceDiscoveryOwnerId);
      public readonly ipamResourceDiscoveryRegion: string = Token.asString(props.ipamResourceDiscoveryRegion);
      public readonly ipamResourceDiscoveryState: string = Token.asString(props.ipamResourceDiscoveryState);
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing IPAM resource discovery by explicitly specifying its
   * AWS generated ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param workspaceId The AWS generated ID of the existing IPAM resource
   * discovery to be imported.
   * @returns An object representing the imported IPAM resource discovery.
   */
  public static fromIpamResourceDiscoveryId(scope: IConstruct, id: string, ipamResourceDiscoveryId: string): IIpamResourceDiscovery {
    return IpamResourceDiscovery.fromIpamResourceDiscoveryAttributes(scope, id, {
      resourceDiscoveryId: ipamResourceDiscoveryId,
    });
  }

  // Internal properties
  private readonly _regions: string[];

  // Input properties
  public readonly description?: string;

  public get regions(): string[] {
    return [...this._regions];
  }

  // Resource properties
  public readonly resource: CfnIPAMResourceDiscovery;

  public readonly ipamResourceDiscoveryArn: string;
  public readonly ipamResourceDiscoveryId: string;
  public readonly ipamResourceDiscoveryIsDefault: IResolvable;
  public readonly ipamResourceDiscoveryOwnerId: string;
  public readonly ipamResourceDiscoveryRegion: string;
  public readonly ipamResourceDiscoveryState: string;


  public constructor(scope: IConstruct, id: string, props: IpamResourceDiscoveryProps = {}) {
    super(scope, id, props);

    this._regions = [];

    this.description = props.description;

    this.resource = new CfnIPAMResourceDiscovery(this, 'Resource', {
      description: this.description,
      operatingRegions: Lazy.uncachedAny(
        {
          produce: () => {
            return this._regions.map((x): CfnIPAM.IpamOperatingRegionProperty => {
              return {
                regionName: x,
              };
            });
          },
        },
        {
          omitEmptyArray: true,
        },
      ),
    });

    this.ipamResourceDiscoveryArn = this.resource.attrIpamResourceDiscoveryArn;
    this.ipamResourceDiscoveryId = this.resource.ref;
    this.ipamResourceDiscoveryIsDefault = this.resource.attrIsDefault;
    this.ipamResourceDiscoveryOwnerId = this.resource.attrOwnerId;
    this.ipamResourceDiscoveryRegion = this.resource.attrIpamResourceDiscoveryRegion;
    this.ipamResourceDiscoveryState = this.resource.attrState;
  }

  public addRegion(region: string): void {
    if (this._regions.includes(region)) {
      throw new Error([
        `Region '${region}' is already registered with IPAM`,
        `${this.node.path}.`,
      ].join(' '));
    }

    this._regions.push(region);
  }
}