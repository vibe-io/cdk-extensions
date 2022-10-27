import { Duration, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { Cluster, HelmChart } from 'aws-cdk-lib/aws-eks';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { ExternalSecret } from './external-secret';
import { SecretsManagerSecretStore } from './secrets-manager-secret-store';
import { SsmSecretStore } from './ssm-secret-store';


export interface ExternalSecretOptions {
  readonly fields?: {[k8sKey: string]: string};
  readonly name?: string;
}

export interface NamespacedExternalSecretOptions extends ExternalSecretOptions {
  readonly namespace?: string;
}

/**
 * Configuration for the Inbound Resolver resource.
 */
export interface ExternalSecretsOperatorProps extends ResourceProps {
  readonly cluster: Cluster;
  readonly createNamespace?: boolean;
  readonly name?: string;
  readonly namespace?: string;
}

export class ExternalSecretsOperator extends Resource {
  // Static properties
  public static readonly DEFAULT_NAMESPACE: string = 'external-secrets';

  // Input properties
  public readonly cluster: Cluster;
  public readonly createNamespace?: boolean;
  public readonly name: string;
  public readonly namespace: string;

  // Resource properties
  public readonly resource: HelmChart;

  // Standard properties
  public readonly operatorName: string;


  constructor(scope: Construct, id: string, props: ExternalSecretsOperatorProps) {
    super(scope, id, {
      ...props,
    });

    this.cluster = props.cluster;
    this.createNamespace = props.createNamespace ?? true;
    this.name = props.name ?? `ss${Names.uniqueId(this).slice(-61)}`;
    this.namespace = props.namespace ?? ExternalSecretsOperator.DEFAULT_NAMESPACE;

    this.resource = new HelmChart(this, 'helm-chart', {
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

    this.operatorName = this.name;
  }

  public registerSecretsManagerSecret(id: string, secret: ISecret, options?: NamespacedExternalSecretOptions): ExternalSecret {
    const namespace = options?.namespace ?? 'default';
    const storeId = `store::${namespace}::secrets-manager`;
    const store = this.node.tryFindChild(storeId) as SecretsManagerSecretStore ?? new SecretsManagerSecretStore(this, storeId, {
      cluster: this.cluster,
      namespace: options?.namespace,
    });
    store.node.addDependency(this.resource);

    return store.addSecret(id, secret, options);
  }

  public registerSsmParameterSecret(id: string, parameter: IParameter, options?: NamespacedExternalSecretOptions): ExternalSecret {
    const namespace = options?.namespace ?? 'default';
    const storeId = `store::${namespace}::ssm`;
    const store = this.node.tryFindChild(storeId) as SsmSecretStore ?? new SsmSecretStore(this, storeId, {
      cluster: this.cluster,
      namespace: options?.namespace,
    });
    store.node.addDependency(this.resource);

    return store.addSecret(id, parameter, options);
  }
}