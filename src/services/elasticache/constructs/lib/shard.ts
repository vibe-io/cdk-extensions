import { Lazy } from "aws-cdk-lib";
import { CfnReplicationGroup } from "aws-cdk-lib/aws-elasticache";
import { IConstruct } from "constructs";
import { Slot } from "./slot";


export interface ShardOptions {
    readonly nodeGroupId?: string;
    readonly primaryAvailabilityZone?: string;
    readonly replicaAvailabilityZones?: string[];
    readonly replicaCount?: number;
    readonly slots?: Slot[];
}

export class Shard {
    // Internal properties
    private readonly _replicaAvailabilityZones: string[] = [];
    private readonly _slots: Slot[] = [];

    // Input properties
    public readonly nodeGroupId?: string;
    public readonly primaryAvailabilityZone?: string;
    public readonly replicaCount?: number;

    // Standard accessors
    public get collapsible(): boolean {
        if (this.nodeGroupId !== undefined) {
            return false;
        }
        else if (this.primaryAvailabilityZone !== undefined) {
            return false;
        }
        else if (this.replicaAvailabilityZones !== undefined) {
            return false;
        }
        else if (this.slots !== undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    public get replicaAvailabilityZones(): string[] | undefined {
        return this._replicaAvailabilityZones.length ? this._replicaAvailabilityZones : undefined;
    }

    public get slots(): Slot[] | undefined {
        return this._slots.length ? this._slots : undefined;
    }


    public constructor(options: ShardOptions) {
        this.nodeGroupId = options.nodeGroupId;
        this.primaryAvailabilityZone = options.primaryAvailabilityZone;
        this.replicaCount = options.replicaCount;

        options.replicaAvailabilityZones?.forEach((x) => {
            this.addReplicaAvailabilityZone(x);
        });

        options.slots?.forEach((x) => {
            this.addSlot(x);
        });
    }

    public addReplicaAvailabilityZone(zone: string): Shard {
        this._replicaAvailabilityZones.push(zone);
        return this;
    }

    public addSlot(slot: Slot): Shard {
        this._slots.push(slot);
        return this;
    }

    public bind(_scope: IConstruct): CfnReplicationGroup.NodeGroupConfigurationProperty {
        return {
            nodeGroupId: this.nodeGroupId,
            primaryAvailabilityZone: this.primaryAvailabilityZone,
            replicaAvailabilityZones: Lazy.list(
                {
                    produce: () => {
                        return this.replicaAvailabilityZones;
                    }
                },
                {
                    omitEmpty: true
                }
            ),
            replicaCount: this.replicaCount,
            slots: Lazy.uncachedString({
                produce: () => {
                    if (!this.slots) {
                        return undefined;
                    }

                    return [
                        Array.from(Array(this._slots.length).keys()).join(','),
                        this.slots.join(',')
                    ].join(',');
                }
            })
        }
    }
}
