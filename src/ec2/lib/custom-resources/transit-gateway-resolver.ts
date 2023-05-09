import { join } from 'path';
import { CustomResource, Duration, NestedStack, Resource, Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { IConstruct } from 'constructs';


class TransitGatewayResolverProvider extends NestedStack {
  public static getOrCreate(scope: IConstruct) {
    const stack = Stack.of(scope);
    const uid = '@cdk-extensions/ec2.TransitGatewayResolverProvider';
    return stack.node.tryFindChild(uid) as TransitGatewayResolverProvider ?? new TransitGatewayResolverProvider(stack, uid);
  }

  /**
   * The custom resource provider to use for the custom resource.
   */
  public readonly provider: Provider;

  private constructor(scope: IConstruct, id: string) {
    super(scope, id);

    this.provider = new Provider(this, 'provider', {
      onEventHandler: new Function(this, 'event-handler', {
        code: Code.fromAsset(join(__dirname, 'transit-gateway-resolver')),
        description: 'Used to fetch Transit Gateway information for CDK.',
        handler: 'index.onEventHandler',
        initialPolicy: [
          new PolicyStatement({
            actions: [
              'ec2:DescribeTransitGateways',
            ],
            effect: Effect.ALLOW,
            resources: [
              '*',
            ],
          }),
        ],
        runtime: Runtime.NODEJS_18_X,
        timeout: Duration.minutes(5),
      }),
      logRetention: RetentionDays.TWO_WEEKS,
    });
  }
}

export interface TransitGatewayResolverProps {
  readonly transitGatewayId: string;
}

export class TransitGatewayResolver extends Resource {
  public static readonly RESOURCE_TYPE: string = 'Custom::CDKE-EC2-TransitGatewayResolver';

  public readonly defaultAssociationRouteTableId: string;
  public readonly defaultPropagationRouteTableId: string;


  public constructor(scope: IConstruct, id: string, props: TransitGatewayResolverProps) {
    super(scope, id);

    const resource = new CustomResource(this, 'Resource', {
      pascalCaseProperties: true,
      properties: props,
      resourceType: TransitGatewayResolver.RESOURCE_TYPE,
      serviceToken: TransitGatewayResolverProvider.getOrCreate(scope).provider.serviceToken,
    });

    this.defaultAssociationRouteTableId = resource.getAttString('DefaultAssociationRouteTableId');
    this.defaultPropagationRouteTableId = resource.getAttString('DefaultPropagationRouteTableId');
  }
}
