import { IResolvable, Lazy } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { Shard } from "./shard";


export interface BasicClusterOptions {
    readonly availabilityZones?: string[];
    readonly replicas?: number;
}

export interface SimpleShardingOptions {
    readonly replicas?: number;
    readonly shards?: number;
}

interface ClusteringConfiguration {
    readonly basicOptions?: BasicClusterOptions;
    readonly shards?: Shard[];
    readonly sharding: boolean;
}

export interface ReplicationGroupClusterConfiguration {
    readonly nodeGroupConfiguration?: IResolvable;
    readonly numCacheClusters?: number;
    readonly numNodeGroups?: number;
    readonly preferredCacheClusterAZs?: string[];
    readonly replicasPerNodeGroup?: number;
}

export class ClusterConfiguration {
    public static basic(options?: BasicClusterOptions): ClusterConfiguration {
        return new ClusterConfiguration({
            basicOptions: options,
            sharding: false
        })
    }

    public static complexSharding(...shards: Shard[]): ClusterConfiguration {
        const config = new ClusterConfiguration({
            sharding: true
        });

        shards.forEach((x) => {
            config.addShard(x);
        });

        return config;
    }

    public static simpleSharding(options?: SimpleShardingOptions): ClusterConfiguration {
        const config = new ClusterConfiguration({
            sharding: true
        });

        for (let i = 0; i < (options?.shards ?? 1); i++) {
            config.addShard(new Shard({
                replicaCount: options?.replicas
            }));
        }

        return config;
    }


    private readonly basicOptions?: BasicClusterOptions;
    private readonly sharding: boolean;
    private readonly shards: Shard[] = [];

    private constructor(configuration: ClusteringConfiguration) {
        this.basicOptions = {
            availabilityZones: configuration.basicOptions?.availabilityZones ?? [],
            replicas: configuration.basicOptions?.replicas ?? 0
        };
        this.sharding = configuration.sharding;

        if (this.sharding) {
            configuration.shards?.forEach((x) => {
                this.addShard(x);
            });
        }
    }

    public addAvailabilityZone(zone: string): ClusterConfiguration {
        if (this.sharding) {
            throw new Error([
                "Cannot add an availability zone to a sharded configuration.",
                "Toconfigure availability zones for sharded cluster, specify",
                "them on a per shard basis."
            ].join(' '));
        }

        this.basicOptions?.availabilityZones?.push(zone);
        return this;
    }

    public addShard(shard: Shard) {
        if (!this.sharding) {
            throw new Error("Cannot add a shard to basic configuration.");
        }

        this.shards.push(shard);
    }

    public bind(scope: IConstruct): ReplicationGroupClusterConfiguration {
        if (!this.sharding) {
            return {
                numCacheClusters: 1 + (this.basicOptions?.replicas ?? 0),
                preferredCacheClusterAZs: Lazy.list(
                    {
                        produce: () => {
                            return this.basicOptions?.availabilityZones
                        }
                    },
                    {
                        omitEmpty: true
                    }
                )
            }
        }
        else {
            return {
                nodeGroupConfiguration: Lazy.any(
                    {
                        produce: () => {
                            return !this.hasComplexSharding() ? undefined : this.shards.map((x) => {
                                return x.bind(scope);
                            })
                        }
                    },
                    {
                        omitEmptyArray: true
                    }
                ),
                numNodeGroups: Lazy.number({
                    produce: () => {
                        return !this.hasComplexSharding() ? Math.max(this.shards.length, 1) : undefined;
                    }
                }),
                replicasPerNodeGroup: Lazy.number({
                    produce: () => {
                        return !this.hasComplexSharding() ? this.shards[0].replicaCount : undefined;
                    }
                })
            }
        }
    }

    private hasComplexSharding(): boolean {
        if (!this.sharding) {
            return false;
        }
        else if (this.shards.length === 0) {
            return false;
        }
        else if (!this.shards.every((x) => {
            return x.collapsible;
        })) {
            return false
        }
        else if(!this.shards.every((x) => {
            return x.replicaCount == this.shards[0].replicaCount;
        })) {
            return false;
        }
        else {
            return true
        }
    }
}