import { Annotations, IResolveContext, Lazy, Stack, Stage, Token } from "aws-cdk-lib";
import { IRole, IUser } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";


export interface ISharedPrincipal {
    bind(scope: IConstruct): string;
}

export class SharedPrincipal implements ISharedPrincipal {
    public static fromAccountId(account: string): SharedPrincipal {
        return new SharedPrincipal(account);
    }

    public static fromConstruct(construct: IConstruct): SharedPrincipal {
        return new SharedPrincipal(Lazy.uncachedString({
            produce: (context: IResolveContext) => {
                const stack = Stack.of(construct);

                if (Token.isUnresolved(stack.account)) {
                    return stack.account;
                }
                else {
                    Annotations.of(context.scope).addError([
                        `Failed to create resource share for stack '${stack.node.path}'. Only`,
                        'stacks with an account specified can be used in a resource share.'
                    ].join('.'))
                    return '<unknown-account>';
                }
            }
        }));
    }

    public static fromOrganizationArn(arn: string): SharedPrincipal {
        return new SharedPrincipal(arn);
    }

    public static fromOrganizationalUnitArn(arn: string): SharedPrincipal {
        return new SharedPrincipal(arn);
    }

    public static fromRole(role: IRole): SharedPrincipal {
        return new SharedPrincipal(role.roleArn);
    }

    public static fromStage(stage: Stage): SharedPrincipal {
        return new SharedPrincipal(Lazy.uncachedString({
            produce: (context: IResolveContext) => {
                if (stage.account) {
                    return stage.account;
                }
                else {
                    Annotations.of(context.scope).addError([
                        `Failed to create resource share for stage '${stage.node.path}'. Only`,
                        'stages with an account specified can be used in a resource share.'
                    ].join('.'))
                    return '<unknown-account>';
                }
            }
        }));
    }
    
    public static fromUser(user: IUser): SharedPrincipal {
        return new SharedPrincipal(user.userArn);
    }

    private readonly value: string;

    public bind(_scope: IConstruct): string {
        return this.value;
    }

    private constructor(value: string) {
        this.value = value;
    }
}