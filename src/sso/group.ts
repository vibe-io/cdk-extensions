import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IdentityCenterPrincipalType, IIdentityCenterPrincipal } from './lib/identity-center-principal';


export interface IGroup {
  /**
   * A GUID identifier for a group object in IAM Identity Center are GUIDs (For example, f81d4fae-7dec-11d0-a765-00a0c91e6bf6).
   */
  readonly groupId: string;
}

export abstract class GroupBase extends Resource implements IGroup, IIdentityCenterPrincipal {
  // Standard properties
  readonly abstract groupId: string;
  readonly abstract principalId: string;
  readonly principalType: IdentityCenterPrincipalType;


  public constructor(scope: IConstruct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
    this.principalType = IdentityCenterPrincipalType.GROUP;
  }
}

export class Group {
  public static fromGroupId(scope: IConstruct, id: string, groupId: string): IGroup {
    class Import extends GroupBase {
      public readonly groupId: string = groupId;
      public readonly principalId: string = groupId;

      public constructor() {
        super(scope, id);
      }
    }

    return new Import();
  }
}