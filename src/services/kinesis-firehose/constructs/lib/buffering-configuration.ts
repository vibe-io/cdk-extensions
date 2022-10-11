import { Duration } from "aws-cdk-lib";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { IConstruct } from "constructs";
import { definedFieldsOrUndefined } from "../../../../utils/formatting";


interface BufferingConfigurationOptions {
    readonly interval?: Duration;
    readonly sizeInMb?: number;
}

export class BufferingConfiguration {
    public readonly interval?: Duration;
    public readonly sizeInMb?: number;

    public constructor(options: BufferingConfigurationOptions) {
        this.interval = options.interval;
        this.sizeInMb = options.sizeInMb;
    }

    public bind(_scope: IConstruct): CfnDeliveryStream.BufferingHintsProperty | undefined {
        return definedFieldsOrUndefined({
            intervalInSeconds: this.interval?.toSeconds(),
            sizeInMBs: this.sizeInMb
        });
    }
}
