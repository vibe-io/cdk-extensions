import { Aspects } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { IConstruct } from 'constructs';


export enum DomainDiscovery {
  ALL = 'ALL',
  NONE = 'NONE',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export interface IDnsResolvable extends IConstruct {
  readonly domainDiscovery: DomainDiscovery;
  registerDomain(domain: Domain): void;
}

export interface DomainOptions {
  readonly certificate?: ICertificate;
  readonly subdomain?: string;
}

export class DomainManager {
  public static isDnsResolvable(node: IConstruct): node is IDnsResolvable {
    return (
      ((node as any).domainDiscovery !== undefined) &&
            ((node as any).registerDomain !== undefined)
    );
  }
}

export class Domain {
  public readonly certificate?: ICertificate;
  public readonly isPublic: boolean;
  public readonly subdomain?: string;
  public readonly zone: IHostedZone;
  public readonly zoneName: string;

  public get fqdn(): string {
    return this.subdomain ? `${this.subdomain}.${this.zoneName}` : this.zoneName;
  }


  public constructor(zone: IHostedZone, isPublic: boolean, options: DomainOptions={}) {
    this.certificate = options.certificate;
    this.isPublic = isPublic;
    this.subdomain = options.subdomain;
    this.zone = zone;
    this.zoneName = zone.zoneName;
  }

  public visit(node: IConstruct): void {
    if (DomainManager.isDnsResolvable(node) && this.shouldRegister(node)) {
      node.registerDomain(this);
    }
  }

  private shouldRegister(node: IDnsResolvable): boolean {
    if (node.domainDiscovery === DomainDiscovery.ALL) {
      return true;
    } else if (node.domainDiscovery === DomainDiscovery.PUBLIC && this.isPublic) {
      return true;
    } else if (node.domainDiscovery === DomainDiscovery.PRIVATE && !this.isPublic) {
      return true;
    } else {
      return false;
    }
  }
}


export class Domains {
  public static readonly ROOT: string = '::ROOT::';

  public static of(scope: IConstruct): Domains {
    return new Domains(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  public add(hostedZone: IHostedZone, isPublic: boolean, options: DomainOptions={}): void {
    Aspects.of(this.scope).add(new Domain(hostedZone, isPublic, options));
  }
}