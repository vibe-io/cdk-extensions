import { ResourceProps } from 'aws-cdk-lib';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { AwsSecretStore } from './aws-secret-store';
import { ExternalSecret } from './external-secret';
import { ExternalSecretOptions } from './external-secrets-operator';
import { SsmParameterReference } from './lib/ssm-parameter-reference';


/**
 * Configuration options for adding a new secret store resource.
 */
export interface SsmParameterSecretStoreProps extends ResourceProps {
  /**
   * The EKS cluster where the secret store should be created.
   */
  readonly cluster: ICluster;

  /**
   * A human friendly name for the secret store.
   */
  readonly name?: string;

  /**
   * The Kubernetes namespace where the secret store should be created.
   */
  readonly namespace?: string;
}

/**
 * A secret store that allows parameters from Systems Manager to be
 * synchronized into Kubernetes as Kubernetes secrets.
 */
export class SsmParameterSecretStore extends AwsSecretStore {
  /**
   * Creates a new instance of the SsmParameterSecretStore class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent
   * in the construct tree.
   * @param id A name to be associated with the resource and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  constructor(scope: Construct, id: string, props: SsmParameterSecretStoreProps) {
    super(scope, id, {
      ...props,
      service: 'ParameterStore',
    });

    this.serviceAccount.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'ssm:GetParameter*',
      ],
      effect: Effect.ALLOW,
      resources: [
        this.stack.formatArn({
          resource: 'parameter',
          resourceName: '*',
          service: 'ssm',
        }),
      ],
    }));
  }

  /**
   * Registers a new SSSM parameter to be synchronized into Kubernetes.
   *
   * @param id The ID of the secret import configuration in the CDK construct
   * tree.
   *
   * The configuration is placed under the SSM parameter it synchronizes and so
   * must be unique per secret.
   * @param parameter The SSM parameter to synchronize into Kubernetes.
   * @param options Configuration options for how the secret should be
   * synchronized.
   * @returns The external secret configuration that was added.
   */
  public addSecret(id: string, parameter: IParameter, options: ExternalSecretOptions = {}): ExternalSecret {
    const output = new ExternalSecret(parameter, `external-secret-${id}`, {
      cluster: this.cluster,
      name: options.name,
      namespace: this.namespace,
      secrets: [
        new SsmParameterReference(parameter, {
          fields: options.fields,
        }),
      ],
      secretStore: this,
    });

    if (this.stack === parameter.stack) {
      output.node.addDependency(this.manifest);
    }

    return output;
  }
}