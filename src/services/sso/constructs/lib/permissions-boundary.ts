import { IManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { CfnPermissionSet } from 'aws-cdk-lib/aws-sso';
import { IConstruct } from 'constructs';
import { ReferencedManagedPolicy, ReferenceOptions } from './referenced-managed-policy';


export abstract class PermissionsBoundary {
  public static fromManagedPolicy(policy: IManagedPolicy): ManagedPolicyPermissionsBoundary {
    return new ManagedPolicyPermissionsBoundary(policy);
  }

  public static fromReference(options: ReferenceOptions): ReferencedPermissionsBoundary {
    return new ReferencedPermissionsBoundary(options);
  }


  public abstract bind(scope: IConstruct): CfnPermissionSet.PermissionsBoundaryProperty;
}

export class ManagedPolicyPermissionsBoundary extends PermissionsBoundary {
  public readonly managedPolicy: IManagedPolicy;


  public constructor(policy: IManagedPolicy) {
    super();
    this.managedPolicy = policy;
  }

  public bind(_scope: IConstruct): CfnPermissionSet.PermissionsBoundaryProperty {
    return {
      managedPolicyArn: this.managedPolicy.managedPolicyArn,
    };
  }
}

export class ReferencedPermissionsBoundary extends PermissionsBoundary {
  public readonly referencedPolicy: typeof ReferencedManagedPolicy;


  public constructor(options: ReferenceOptions) {
    super();
    this.referencedPolicy = ReferencedManagedPolicy.of(options);
  }

  public bind(_scope: IConstruct): CfnPermissionSet.PermissionsBoundaryProperty {
    return {
      customerManagedPolicyReference: {
        name: this.referencedPolicy.policyName,
        path: this.referencedPolicy.policyPath,
      },
    };
  }
}
