# K8S AWS Construct Library

Provides Kubernetes resources for integrating with AWS services.

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