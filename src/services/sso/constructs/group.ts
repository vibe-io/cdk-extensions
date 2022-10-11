import { Resource, ResourceProps } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { IdentityCenterPrincipalType, IIdentityCenterPrincipal } from "./lib/identity-center-principal";


export interface IGroup {
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

            public constructor(scope: IConstruct, id: string, props: ResourceProps = {}) {
                super(scope, id, props);
            }
        }

        return new Import(scope, id);
    }
}