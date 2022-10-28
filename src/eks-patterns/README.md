# Vibe-io CDK-Extensions EC2 Construct Library

The `cdk-extensions/eks-patterns` module contains higher-level Amazon EKS constructs which follow common architectural patterns. It constains:

* Cluster Integrated with Common AWS Services

## Cluster Integrated with Common AWS Services

To define an EKS cluster that comes pre-installed with common services many Kubernetes clusters running on AWS will use, instantiate one of the following:

* AwsIntegratedFargateCluster

```
declare const vpc: ec2.Vpc;
const cluster = new eks_patterns.AwsIntegratedFargateCluster(this, 'cluster', {
    version: eks.KubernetesVersion.V1_21,
    vpc: vpc,
    vpcSubnets: [
        {
            onePerAz: true,
            subnetGroupName: 'private'
        }
    ]
});
```

### Integrated Services

#### Route 53

Route 53 integration is provided by means of the [External DNS Kubernetes Add-on](https://github.com/kubernetes-sigs/external-dns). Services and ingresses in the cluster can be discovered and External DNS will manage appropriate DNS records in Route 53.

External DNS is enabled by default and must be explicitly disabled using:

```
const cluster = new eks_patterns.AwsIntegratedFargateCluster(this, 'cluster', {
    externalDnsOptions: {
        enabled: false,
    },
    version: eks.KubernetesVersion.V1_21,
});
```

#### Container Insights

Integration with Container Insights is implemented using [AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) as described in [this AWS blog post](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/).

This help you collect, aggregate, and visualize advanced metrics from your services running on EKS and Fargate.

Container Insights is enabled by default and must be explicitly disabled using:

```
const cluster = new eks_patterns.AwsIntegratedFargateCluster(this, 'cluster', {
    cloudWatchMonitoringOptions: {
        enabled: false,
    },
    version: eks.KubernetesVersion.V1_21,
});
```

#### CloudWatch Logs

CloudWatch Logs integration is provided using the [built-in log router provided by Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html).

Currently this will ship logs for all containers to a CloudWatch log group that can be filtered to find the pods for specific pods and services.

We plan to expand the functionality of this resource to expand log destinations and provide more advanced log filtering.

Container Insights is enabled by default and must be explicitly disabled using:

```
const cluster = new eks_patterns.AwsIntegratedFargateCluster(this, 'cluster', {
    fargateLogger: {
        enabled: false,
    },
    version: eks.KubernetesVersion.V1_21,
});
```

#### Secrets Manager

Integration to Secrets Manager is provided using the [External Secrets Operatore](https://external-secrets.io/) Kubernetes operator.

You can use it to configure links between Secrets Manager secrets (such as those created for RDS instances) and Kubernetes secrets which can be exposed to your pods as environment variables. Changes to the secret in Secrets Manager will automatically be synchronized into the secret in the EKS cluster.

Secrets Manager integration is enabled by default and must be explicitly disabled using:

```
const cluster = new eks_patterns.AwsIntegratedFargateCluster(this, 'cluster', {
    externalSecretsOptions: {
        enabled: false,
    },
    version: eks.KubernetesVersion.V1_21,
});
```