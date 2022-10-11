import { IFunction } from "aws-cdk-lib/aws-lambda";
import { DeliveryStreamProcessor, ProcessorType } from "./delivery-stream-processor";


export interface LambdaProcessorOptions {
    readonly lambdaFunction: IFunction;
}

export class LambdaProcessor extends DeliveryStreamProcessor {
    public readonly lambdaFunction: IFunction;

    public constructor(options: LambdaProcessorOptions) {
        super({
            processorType: ProcessorType.LAMBDA
        });

        this.lambdaFunction = options.lambdaFunction;

        this.addParameter('LambdaArn', this.lambdaFunction.functionArn);
    }
}
