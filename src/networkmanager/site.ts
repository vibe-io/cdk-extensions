import { Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnSite } from 'aws-cdk-lib/aws-networkmanager';
import { IConstruct } from 'constructs';
import { IGlobalNetwork } from './global-network';
import { definedFieldsOrUndefined } from '../utils/formatting';


export interface ISite {
  readonly siteArn: string;
  readonly siteId: string;
}

export interface SiteProps extends ResourceProps {
  readonly address?: string;
  readonly description?: string;
  readonly latitude?: string;
  readonly longitude?: string;
  readonly globalNetwork: IGlobalNetwork;
}

abstract class SiteBase extends Resource implements ISite {
  public abstract readonly siteArn: string;
  public abstract readonly siteId: string;
}

export class Site extends SiteBase {
  // Input properties
  readonly address?: string;
  readonly description?: string;
  readonly latitude?: string;
  readonly longitude?: string;
  readonly globalNetwork: IGlobalNetwork;

  // Resource properties
  public readonly resource?: CfnSite;

  public readonly siteArn: string;
  public readonly siteId: string;


  public constructor(scope: IConstruct, id: string, props: SiteProps) {
    super(scope, id, props);

    this.address = props.address;
    this.description = props.description;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.globalNetwork = props.globalNetwork;

    this.resource = new CfnSite(this, 'Resource', {
      description: this.description,
      globalNetworkId: this.globalNetwork.globalNetworkId,
      location: definedFieldsOrUndefined({
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
      }),
    });

    this.siteArn = this.resource.attrSiteArn;
    this.siteId = this.resource.attrSiteId;
  }
}