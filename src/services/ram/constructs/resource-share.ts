import { Aspects, Lazy, Names, Resource, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { CfnResourceShare } from 'aws-cdk-lib/aws-ram';
import { Construct, IConstruct } from 'constructs';
import { ISharedPrincipal, SharedPrincipal } from './lib/shared-principal';
import { ISharedResource } from './lib/shared-resource';


/**
 * Configuration for ResourceShare resource.
 */
export interface ResourceShareProps extends ResourceProps {
    readonly allowExternalPrincipals?: boolean;
    readonly autoDiscoverAccounts?: boolean;
    readonly name?: string;
    readonly principals?: ISharedPrincipal[];
    readonly resources?: ISharedResource[];
}

export class ResourceShare extends Resource {
    // Internal properties
    private _autoDiscovery: boolean = false;
    private readonly _principals: ISharedPrincipal[] = [];
    private readonly _resources: ISharedResource[] = [];

    // Input properties
    public readonly allowExternalPrincipals?: boolean;
    public readonly name: string;

    // Resource properties
    public readonly resource: CfnResourceShare;
    
    // Standard accessors
    public get autoDiscovery(): boolean {
        return this._autoDiscovery;
    }


    /**
     * Creates a new instance of the ResourceShare class.
     * 
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique 
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
    constructor(scope: Construct, id: string, props: ResourceShareProps = {}) {
        super(scope, id, props);

        this.allowExternalPrincipals = props.allowExternalPrincipals;
        this.name = props.name ?? Names.uniqueId(this);

        this.resource = new CfnResourceShare(this, 'Resource', {
            allowExternalPrincipals: this.allowExternalPrincipals,
            name: this.name,
            principals: Lazy.uncachedList({
                produce: () => {
                    return this._principals.map((x) => {
                        return x.bind(this);
                    });
                }
            }),
            resourceArns: Lazy.uncachedList({
                produce: () => {
                    return this._resources.map((x) => {
                        return x.bind(this);
                    });
                }
            })
        });
    }

    public addPrincipal(principal: ISharedPrincipal): void {
        this._principals.push(principal);
    }

    public addResource(resource: ISharedResource): void {
        this._resources.push(resource);
    }

    private autoDiscover(): void {
        const accounts = new Set(this.node.root.node.findAll().reduce((prev, cur) => {
            if (cur instanceof Stage && cur.account && !Token.isUnresolved(cur.account)) {
                prev.push(cur.account);
            }
            else if (cur instanceof Stack && !Token.isUnresolved(cur.account)) {
                prev.push(cur.account);
            }

            return prev;
        }, [] as string[]).filter((x) => {
            return x !== this.stack.account;
        }));

        accounts.forEach((x) => {
            this.addPrincipal(SharedPrincipal.fromAccountId(x));
        });
    }

    public enableAutoDiscovery(): void {
        if (!this.autoDiscovery) {
            Aspects.of(this).add({
                visit: (node: IConstruct) => {
                    if (node === this) {
                        this.autoDiscover();
                    }
                }
            })
            this._autoDiscovery = true;
        }
    }
}