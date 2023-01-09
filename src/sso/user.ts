import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IdentityCenterPrincipalType, IIdentityCenterPrincipal } from './lib/identity-center-principal';


export interface IUser {
  /**
   * A GUID identifier for a user object in IAM Identity Center (For example, f81d4fae-7dec-11d0-a765-00a0c91e6bf6).
   */
  readonly userId: string;
}

export abstract class UserBase extends Resource implements IUser, IIdentityCenterPrincipal {
  readonly abstract principalId: string;
  readonly principalType: IdentityCenterPrincipalType;
  readonly abstract userId: string;


  public constructor(scope: IConstruct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
    this.principalType = IdentityCenterPrincipalType.USER;
  }
}

export class User {
  public static fromUserId(scope: IConstruct, id: string, userId: string): IUser {
    class Import extends UserBase {
      public readonly principalId: string = userId;
      public readonly userId: string = userId;

      public constructor() {
        super(scope, id);
      }
    }

    return new Import();
  }
}