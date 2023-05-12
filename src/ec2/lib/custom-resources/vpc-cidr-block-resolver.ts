import { CustomResource, Duration, NestedStack, Resource, Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { IConstruct } from 'constructs';
import { VpcCidrBlockResolverFunction } from './vpc-cidr-block-resolver-function';


class VpcCidrBlockResolverProvider extends NestedStack {
  public static getOrCreate(scope: IConstruct) {
    const stack = Stack.of(scope);
    const uid = '@cdk-extensions/ec2.VpcCidrBlockResolverProvider';
    return stack.node.tryFindChild(uid) as VpcCidrBlockResolverProvider ?? new VpcCidrBlockResolverProvider(stack, uid);
  }

  /**
   * The custom resource provider to use for the custom resource.
   */
  public readonly provider: Provider;

  private constructor(scope: IConstruct, id: string) {
    super(scope, id);

    this.provider = new Provider(this, 'provider', {
      onEventHandler: new VpcCidrBlockResolverFunction(this, 'event-handler', {
        description: 'Used to fetch VPC CIDR block information for CDK.',
        initialPolicy: [
          new PolicyStatement({
            actions: [
              'ec2:DescribeVpcs',
            ],
            effect: Effect.ALLOW,
            resources: [
              '*',
            ],
          }),
        ],
        timeout: Duration.minutes(5),
      }),
      logRetention: RetentionDays.TWO_WEEKS,
    });
  }
}

export interface VpcCidrBlockResolverProps {
  readonly associationId: string;
  readonly vpcId: string;
}

export class VpcCidrBlockResolver extends Resource {
  public static readonly RESOURCE_TYPE: string = 'Custom::CDKE-EC2-VpcCidrBlockResolver';

  public readonly cidrBlock: string;


  public constructor(scope: IConstruct, id: string, props: VpcCidrBlockResolverProps) {
    super(scope, id);

    const resource = new CustomResource(this, 'Resource', {
      pascalCaseProperties: true,
      properties: props,
      resourceType: VpcCidrBlockResolver.RESOURCE_TYPE,
      serviceToken: VpcCidrBlockResolverProvider.getOrCreate(scope).provider.serviceToken,
    });

    this.cidrBlock = resource.getAttString('CidrBlock');
  }
}