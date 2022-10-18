import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { IConstruct } from 'constructs';

export interface BackupConfigurationResult {
  readonly s3BackupConfiguration: CfnDeliveryStream.S3DestinationConfigurationProperty;
  readonly s3BackupMode?: string;
}

export interface IDeliveryStreamBackupDestination {
  renderBackupConfiguration(scope: IConstruct, enabled?: boolean): BackupConfigurationResult;
}

export interface BackupConfigurationOptions {
  readonly destination: IDeliveryStreamBackupDestination;
  readonly enabled?: boolean;
}

export class BackupConfiguration {
  public readonly destination: IDeliveryStreamBackupDestination;
  public readonly enabled?: boolean;

  public constructor(options: BackupConfigurationOptions) {
    this.destination = options.destination;
    this.enabled = options.enabled;
  }

  public bind(scope: IConstruct): BackupConfigurationResult {
    return this.destination.renderBackupConfiguration(scope, this.enabled);
  }
}
