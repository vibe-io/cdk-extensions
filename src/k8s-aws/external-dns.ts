import { Duration, Lazy, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { HelmChart, ICluster, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalDnsProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly domainFilter?: string[];
}

export class ExternalDns extends Resource {
  private readonly _domainFilter: string[] = [];

  // Input properties
  public readonly cluster: ICluster;

  public get domainFilter(): string[] {
    return [...this._domainFilter];
  }

  // Resource properties
  public readonly resource: HelmChart;
  public readonly serviceAccount: ServiceAccount;


  constructor(scope: Construct, id: string, props: ExternalDnsProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;

    this.serviceAccount = new ServiceAccount(this, 'service-account', {
      cluster: this.cluster,
      name: (Names.uniqueId(this) + 'sa').slice(-63).toLowerCase(),
      namespace: 'kube-system',
    });

    this.serviceAccount.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'route53:ListHostedZones',
        'route53:ListResourceRecordSets',
      ],
      effect: Effect.ALLOW,
      resources: [
        '*',
      ],
    }));

    this.serviceAccount.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'route53:ChangeResourceRecordSets',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.stack.formatArn({
          account: '',
          region: '',
          resource: 'hostedzone',
          resourceName: '*',
          service: 'route53',
        }),
      ],
    }));

    this.resource = new HelmChart(this, 'helm-chart', {
      cluster: this.cluster,
      chart: 'external-dns',
      namespace: 'kube-system',
      repository: 'https://kubernetes-sigs.github.io/external-dns/',
      timeout: Duration.minutes(15),
      values: {
        ['domainFilters']: Lazy.list({
          produce: () => {
            return this.domainFilter;
          },
        }),
        ['extraArgs']: [
          '--aws-zone-type=public',
        ],
        ['provider']: 'aws',
        ['publishService']: {
          ['enabled']: true,
        },
        ['registry']: 'txt',
        ['serviceAccount']: {
          ['create']: false,
          ['name']: this.serviceAccount.serviceAccountName,
        },
        ['txtOwnerId']: this.node.addr,
        ['txtPrefix']: 'edns.',
      },
      wait: true,
    });
  }

  public addDomainFilter(domain: string): ExternalDns {
    this._domainFilter.push(domain);
    return this;
  }
}