import { Fn, Resource, ResourceProps, Stack, Token } from "aws-cdk-lib";
import { IConstruct } from "constructs";


export interface IInstance {
    readonly instanceArn: string;
    readonly instanceId: string;
}

export abstract class InstanceBase extends Resource implements IInstance {
    readonly abstract instanceArn: string;
    readonly abstract instanceId: string;
}

export class Instance {
    public static fromArn(scope: IConstruct, id: string, arn: string): IInstance {
        class Import extends InstanceBase {
            public readonly instanceArn: string = arn;
            public readonly instanceId: string = Token.isUnresolved(arn) ? Fn.select(1, Fn.split('/', arn, 2)) : arn.split('/')[1];

            public constructor(scope: IConstruct, id: string, props: ResourceProps = {}) {
                super(scope, id, props);
            }
        }

        return new Import(scope, id);
    }

    public static fromInstanceId(scope: IConstruct, id: string, instanceId: string): IInstance {
        return Instance.fromArn(scope, id, Stack.of(scope).formatArn({
            account: '',
            region: '',
            resource: 'instance',
            resourceName: instanceId,
            service: 'sso'
        }));
    }
}