import { Resource, ResourceProps } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IdentityCenterPrincipalType, IIdentityCenterPrincipal } from './lib/identity-center-principal';


export interface IUser {
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