import { Annotations, Aspects, Duration, Names, Resource, ResourceProps, Stage } from 'aws-cdk-lib';
import { HelmChart, ICluster } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct, IConstruct } from 'constructs';
import { ExternalSecret, SecretFieldReference } from './external-secret';
import { IExternalSecretProvider, ExternalSecretStore } from './external-secret-store';


/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretsOperatorProps extends ResourceProps {
  readonly cluster: ICluster;
  readonly createNamespace?: boolean;
  readonly name?: string;
  readonly namespace?: string;
}

export class ExternalSecretsOperator extends Resource implements IExternalSecretProvider {
  // Input properties
  public readonly cluster: ICluster;
  public readonly createNamespace?: boolean;
  public readonly name: string;
  public readonly namespace: string;

  // Resource properties
  public readonly defaultStore: ExternalSecretStore;
  public readonly helmChart: HelmChart;

  // Standard properties
  public readonly operatorName: string;


  constructor(scope: Construct, id: string, props: ExternalSecretsOperatorProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.createNamespace = props.createNamespace ?? true;
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61)}`;
    this.namespace = props.namespace ?? 'external-secrets';

    this.helmChart = new HelmChart(this, 'helm-chart', {
      cluster: this.cluster,
      chart: 'external-secrets',
      createNamespace: this.createNamespace,
      namespace: this.namespace,
      release: 'external-secrets-operator',
      repository: 'https://charts.external-secrets.io',
      timeout: Duration.minutes(15),
      values: {
        ['installCRDs']: true,
        ['webhook']: {
          ['port']: '9443',
        },
      },
      wait: true,
    });

    this.defaultStore = new ExternalSecretStore(this, 'default-store', {
      cluster: this.cluster,
      name: 'default',
      namespace: this.namespace,
    });

    const stage = Stage.of(this);
    if (stage) {
      Aspects.of(stage).add({
        visit: (node: IConstruct) => {
          if (node instanceof ExternalSecretStore && node.cluster === this.cluster) {
            node.node.addDependency(this.helmChart);
          }
        },
      });
    } else {
      Annotations.of(this).addWarning(`Failed to identify stage for ExternalSecretsOperator (${this.node.path}). Dependencies won't be set up. This could result deployment failures due to race conditions.`);
    }

    this.operatorName = this.name;
  }

  public addExternalSecret(secret: ISecret, fields?: SecretFieldReference[]): ExternalSecret {
    return this.defaultStore.addExternalSecret(secret, fields);
  }
}