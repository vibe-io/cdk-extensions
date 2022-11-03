# K8S AWS Construct Library

Provides Kubernetes resources for integrating with AWS services.

## Fargate Logging

Fargate logging causes the output of pods running on EKS Farget to be sent to a logging service for storage and review.

By default, logs are written to CloudWatch Logs.

Enable Fargate logging on an EKS cluster:

```
declare const cluster: eks.FargateCluster;

const logger = new k8s_aws.FargateLogger(this, 'logger', {
    cluster: cluster,
    fargateProfiles: [
        cluster.defaultProfile
    ]
});
```

Permissions for sending logs to their configured destination are added to the Fargate profiles associated with the logger.

When adding new Fargate Profiles be sure to associate them with the logger to ensure they have sufficient permissions to write logs.

```
declare const profile: eks.FargateProfile;
declare const logger: k8s_aws.FargateLogger;

logger.addFargateProfile(profile);
```

Configure logging to write to a Kinesis Firehose delivery stream:

```
declare const cluster: eks.FargateCluster;
declare const deliveryStream: kinesis_hirehose.DeliveryStream;

const logger = new k8s_aws.FargateLogger(this, 'logger', {
    cluster: cluster,
    fargateProfiles: [
        cluster.defaultProfile
    ],
    outputs: [
        k8s_aws.FluentBitOutput.kinesisFirehose('*', deliveryStream);
    ]
});
```

Configure logging to write to a Kinesis data stream:

```
declare const cluster: eks.FargateCluster;
declare const stream: kinesis.Stream;

const logger = new k8s_aws.FargateLogger(this, 'logger', {
    cluster: cluster,
    fargateProfiles: [
        cluster.defaultProfile
    ],
    outputs: [
        k8s_aws.FluentBitOutput.kinesis('*', stream);
    ]
});
```

Configure logging to write to an OpenSearch domain:

```
declare const cluster: eks.FargateCluster;
declare const domain: opensearch.Domain;

const logger = new k8s_aws.FargateLogger(this, 'logger', {
    cluster: cluster,
    fargateProfiles: [
        cluster.defaultProfile
    ],
    outputs: [
        k8s_aws.FluentBitOutput.opensearch('*', domain);
    ]
});
```

Filter out log messages matching the AWS load balancer health check user agent:

```
declare const logger: k8s_aws.FargateLogger;

logger.addFilter(k8s_aws.FluentBitOutput.grep('*', '', true));
```

## Secrets Manager

Enable synchronization of specific secret between Secrets Manager and Kubernetes:

```
declare const cluster: eks.Cluster;

const operator = new k8s_aws.ExternalSecretsOperator(this, 'external-secrets', {
    cluster: cluster
});
```

To tell the external secrets operator to synchronise a secret:

```
declase const operator: k8s_aws.ExternalSecretsOperator;
declare const secret: secretsmanager.Secret;

operator.registerSecretsManagerSecret('sychronized-secret', secret);
```

Give the secret a human friendly name in Kubernetes:

```
declase const operator: k8s_aws.ExternalSecretsOperator;
declare const secret: secretsmanager.Secret;

operator.registerSecretsManagerSecret('sychronized-secret', secret, {
    name: 'database-secret'
});
```

Only import specific JSON keys from a secret:

```
declase const operator: k8s_aws.ExternalSecretsOperator;
declare const secret: secretsmanager.Secret;

operator.registerSecretsManagerSecret('sychronized-secret', secret, {
    fields: [
        { kubernetesKey: 'username' },
        { kubernetesKey: 'password' },
    ]
});
```

Map secret fields that need to be different between Secrets Manager and Kubernetes.

```
declase const operator: k8s_aws.ExternalSecretsOperator;
declare const secret: secretsmanager.Secret;

operator.registerSecretsManagerSecret('sychronized-secret', secret, {
    fields: [
        {
            kubernetesKey: 'user',
            remoteKey: 'username',
        },
        {
            kubernetesKey: 'pass',
            remoteKey: 'password'
        },
    ]
});
```