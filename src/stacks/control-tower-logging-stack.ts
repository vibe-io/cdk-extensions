import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GuarddutyBucket } from '../s3-buckets/guardduty-bucket';
import { IKey } from 'aws-cdk-lib/aws-kms';


/**
* Configuration for ControlTowerLoggingStack.
*/
export interface ControlTowerLoggingStackProps extends StackProps {
  readonly encryptionKey?: IKey;
}

/**
 * Creates a Stack that deploys additional logging configuration for an AWS
 * Control Tower logging account.
 */
export class ControlTowerLoggingStack extends Stack {
  // Input properties
  public readonly encryptionKey?: IKey;

  // Resource properties
  public readonly guarddutyBucket: GuarddutyBucket;

  /**
   * Creates a new instance of the ControlTowerLoggingStack class.
   *
   * @param scope A CDK Construct that will serve as this stack's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  public constructor(scope?: Construct, id?: string, props: ControlTowerLoggingStackProps = {}) {
    super(scope, id, props);

    this.encryptionKey = props.encryptionKey;

    this.guarddutyBucket = new GuarddutyBucket(this, 'guardduty-bucket', {
      bucketName: `guardduty-${this.account}-${this.region}`,
      encryptionKey: this.encryptionKey,
    });
  }
}
