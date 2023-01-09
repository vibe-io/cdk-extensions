import { Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { IExternalDnsRegistry } from '.';
import { ExternalDnsRegistryConfiguration } from './registry-base';


/**
 * An ExternalDNS registry that tracks DNS record ownership information using
 * AWS Service Discovery.
 *
 * @see [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html)
 */
export class AwsServiceDiscoveryRegistry implements IExternalDnsRegistry {
  /**
     * The type name of ExternalDNS registry.
     */
  public readonly registryType: string;

  /**
     * Creates a new instance of the AwsServiceDiscoveryRegistry class.
     */
  public constructor() {
    this.registryType = 'aws-sd';
  }

  /**
     * Generates an object with all the information needed to use the registry
     * in a given CDK scope.
     *
     * @param scope The CDK resource that is configuring ExternalDNS.
     * @returns A configuration object representing the implementation of this
     * registry.
     */
  public bind(scope: IConstruct): ExternalDnsRegistryConfiguration {
    return {
      permissions: [
        new PolicyStatement({
          actions: [
            'ec2:DescribeRegions',
            'ec2:DescribeVpcs',
            'route53:CreateHealthCheck',
            'route53:CreateHostedZone',
            'route53:ListHostedZonesByName',
            'servicediscovery:*',
          ],
          effect: Effect.ALLOW,
          resources: [
            '*',
          ],
        }),
        new PolicyStatement({
          actions: [
            'route53:DeleteHealthCheck',
            'route53:GetHealthCheck',
            'route53:UpdateHealthCheck',
          ],
          effect: Effect.ALLOW,
          resources: [
            Stack.of(scope).formatArn({
              account: '',
              region: '',
              resource: 'healthcheck',
              resourceName: '*',
              service: 'route53',
            }),
          ],
        }),
        new PolicyStatement({
          actions: [
            'route53:ChangeResourceRecordSets',
            'route53:GetHostedZone',
            'route53:DeleteHostedZone',
          ],
          effect: Effect.ALLOW,
          resources: [
            Stack.of(scope).formatArn({
              account: '',
              region: '',
              resource: 'hostedzone',
              resourceName: '*',
              service: 'route53',
            }),
          ],
        }),
      ],
      registryType: this.registryType,
    };
  }
}