# Vibe-io CDK Extensions Route 53 Resolver Library

The @cdk-extensions/route53resolver module contains constructs for configuration of Route 53 Resolvers controlling DNS resolution of inbound and outbound DNS queries. 

```ts nofixture
import * as route53resolver from 'cdk-extensions/route53resolver'
```

## Objective

The Route53Resolver module offers is used to manage the creation of inbound and outbound DNS resolvers and any related forwarding rules, allowing you to direct traffic to the appropriate resources inside and outside of your AWS network. Rules can be configured on inbound resolvers to send traffic to specific IP addresses and ports based on the domain name. Forwarding rules can be configured on outbound resolvers to direct traffic to your on-prem DNS resolvers, allowing your AWS resources to access local resources via domain name. 

## Important Constructs

### InboundResolver

The following code is an example of creating a new InboundResolver object. By default, the InboundResolver will allow all RFC1918 Cidr ranges to connect to it. You can override this by adding the `inboundCidrs` property and providing it a string array of alternate inbound Cidr ranges you wish to limit inbound access to.

``` ts
new InboundResolver(this, 'InboundResolver', {
    subnets: new SubnetSelection(this, 'InboundResolverSubnets', {
        subnets: this.mySubnetArray
    })
    vpc: this.vpc
})
```

### OutboundResolver

The following code is an example of creating a new OutboundResolver object. 

By default, the OutboundResolver will allow connection to all RFC1918 Cidr ranges. You can override this by adding the `outboundCidrs` property and providing it a string array of alternate inbound Cidr ranges you wish to limit inbound access to.

You can also provide the `organizationArn` property on creation to allow and rules added to the resolver to be shared among all accounts under the Organization using AWS Resource Access Manager. 

```ts
new OutboundResolver(this, 'OutboundResolver', {
    'subnets': new SubnetSelection(this, 'InboundResolverSubnets', {
        subnets: this.mySubnetArray
    })
    'vpc': vpc
})
```

### ResolverRule

The following code shows an example of creating a Resolver Rule that will forward queries for any subdomains of the domain name provided.  

```ts
new ResolverRule(this, 'ResolverRule', {
    domainName: 'example.com',
    resolverEndpoint: this.myOutboundResolver,
    ruleName: this.myResolverRule,
    ruleType: SYSTEM,
    targetIps: [
        new ResolverRuleTargetIp({
            address: '1.2.3.4'
        })
    ]
})
```

### ForwardResolverRule

The following code show an example of creation of a Forwarding Resolver Rule for forwarding queries for the domain name provided.

```ts
new ForwardResolverRule(this, 'ForwardRule', {
    domainName: 'example.com',
    resolverEndpoint: this.myOutboundResolver,
    ruleName: this.myForwardResolver,
    targetIps: [
        new ResolverRuleTargetIp({
            'address': '1.2.3.4'
        })
    ]
})
```

