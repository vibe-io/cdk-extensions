import { IConstruct } from "constructs";


export interface SeedDataConfiguration {
    readonly snapshotArns?: string[];
    readonly snapshotName?: string;
}

export class SeedData {
    public static fromS3(...arns: string[]): SeedData {
        return new SeedData({
            snapshotArns: arns
        });
    }

    public static fromSnapshot(name: string): SeedData {
        return new SeedData({
            snapshotName: name
        });
    }


    private config: SeedDataConfiguration;
    
    private constructor(config: SeedDataConfiguration) {
        this.config = config;
    }

    public bind(_scope: IConstruct): SeedDataConfiguration {
        return this.config;
    }
}
