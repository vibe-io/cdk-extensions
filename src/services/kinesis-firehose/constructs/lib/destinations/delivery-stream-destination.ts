import { IRole } from "aws-cdk-lib/aws-iam";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { IConstruct } from "constructs";


export interface DeliveryStreamDestinationConfiguration {
    readonly amazonopensearchserviceDestinationConfiguration?: CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty;
    readonly elasticsearchDestinationConfiguration?: CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty;
    readonly extendedS3DestinationConfiguration?: CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty;
    readonly httpEndpointDestinationConfiguration?: CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty;
    readonly redshiftDestinationConfiguration?: CfnDeliveryStream.RedshiftDestinationConfigurationProperty;
    readonly s3DestinationConfiguration?: CfnDeliveryStream.S3DestinationConfigurationProperty;
    readonly splunkDestinationConfiguration?: CfnDeliveryStream.SplunkDestinationConfigurationProperty;
}

export abstract class DeliveryStreamDestination {
    public get role(): IRole | undefined {
        return undefined;
    };

    protected constructor() {}
    public abstract bind(scope: IConstruct): DeliveryStreamDestinationConfiguration;
}
