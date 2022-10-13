# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Assignment <a name="Assignment" id="cdk-extensions.sso.Assignment"></a>

Assigns access to a Principal for a specified AWS account using a specified permission set.

#### Initializers <a name="Initializers" id="cdk-extensions.sso.Assignment.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.Assignment(scope: Construct, id: string, props: AssignmentProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.Assignment.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.sso.Assignment.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.sso.Assignment.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.sso.AssignmentProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.Assignment.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.Assignment.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.sso.Assignment.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.sso.AssignmentProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.Assignment.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.Assignment.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.Assignment.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.Assignment.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.Assignment.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.Assignment.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.Assignment.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.Assignment.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.Assignment.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Assignment.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.Assignment.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.Assignment.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Assignment.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.Assignment.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.Assignment.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Assignment.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.Assignment.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.Assignment.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.Assignment.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.Assignment.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.Assignment.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.Assignment.property.permissionSet">permissionSet</a></code> | <code>cdk-extensions.sso.IPermissionSet</code> | The permission set which governs the access being assigned. |
| <code><a href="#cdk-extensions.sso.Assignment.property.principal">principal</a></code> | <code>cdk-extensions.sso.IIdentityCenterPrincipal</code> | The IAM Identity Center principal you wish to grant permissions to. |
| <code><a href="#cdk-extensions.sso.Assignment.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_sso.CfnAssignment</code> | The underlying Assignment CloudFormation resource. |
| <code><a href="#cdk-extensions.sso.Assignment.property.target">target</a></code> | <code>cdk-extensions.sso.AssignmentTarget</code> | The resource you wish to grant the {@link principal} entity access to using the permissions defined in the {@link permissionSet}. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.Assignment.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.Assignment.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.Assignment.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.Assignment.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The IAM Identity Center instance under which the operation will be executed.

---

##### `permissionSet`<sup>Required</sup> <a name="permissionSet" id="cdk-extensions.sso.Assignment.property.permissionSet"></a>

```typescript
public readonly permissionSet: IPermissionSet;
```

- *Type:* cdk-extensions.sso.IPermissionSet

The permission set which governs the access being assigned.

The
permission set grants the {@link principal} permissions on
{@link target}.

---

##### `principal`<sup>Required</sup> <a name="principal" id="cdk-extensions.sso.Assignment.property.principal"></a>

```typescript
public readonly principal: IIdentityCenterPrincipal;
```

- *Type:* cdk-extensions.sso.IIdentityCenterPrincipal

The IAM Identity Center principal you wish to grant permissions to.

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.sso.Assignment.property.resource"></a>

```typescript
public readonly resource: CfnAssignment;
```

- *Type:* aws-cdk-lib.aws_sso.CfnAssignment

The underlying Assignment CloudFormation resource.

---

##### `target`<sup>Required</sup> <a name="target" id="cdk-extensions.sso.Assignment.property.target"></a>

```typescript
public readonly target: AssignmentTarget;
```

- *Type:* cdk-extensions.sso.AssignmentTarget

The resource you wish to grant the {@link principal} entity access to using the permissions defined in the {@link permissionSet}.

For example,
an AWS account.

---


### Connection <a name="Connection" id="cdk-extensions.glue.Connection"></a>

- *Implements:* aws-cdk-lib.aws_ec2.IConnectable

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Connection.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Connection(scope: Construct, id: string, props: ConnectionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Connection.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.ConnectionProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Connection.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Connection.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Connection.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.ConnectionProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Connection.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Connection.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Connection.addMatchCriteria">addMatchCriteria</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.addProperty">addProperty</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Connection.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Connection.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Connection.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addMatchCriteria` <a name="addMatchCriteria" id="cdk-extensions.glue.Connection.addMatchCriteria"></a>

```typescript
public addMatchCriteria(value: string): void
```

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Connection.addMatchCriteria.parameter.value"></a>

- *Type:* string

---

##### `addProperty` <a name="addProperty" id="cdk-extensions.glue.Connection.addProperty"></a>

```typescript
public addProperty(key: string, value: string): void
```

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Connection.addProperty.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Connection.addProperty.parameter.value"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Connection.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Connection.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Connection.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Connection.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Connection.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Connection.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Connection.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Connection.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Connection.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Connection.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Connection.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Connection.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Connection.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Connection.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Connection.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Connection.property.connectionArn">connectionArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.connectionName">connectionName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | The network connections associated with this resource. |
| <code><a href="#cdk-extensions.glue.Connection.property.connectionType">connectionType</a></code> | <code>cdk-extensions.glue.ConnectionType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnConnection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.SecurityGroup</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Connection.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Connection.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Connection.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Connection.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `connectionArn`<sup>Required</sup> <a name="connectionArn" id="cdk-extensions.glue.Connection.property.connectionArn"></a>

```typescript
public readonly connectionArn: string;
```

- *Type:* string

---

##### `connectionName`<sup>Required</sup> <a name="connectionName" id="cdk-extensions.glue.Connection.property.connectionName"></a>

```typescript
public readonly connectionName: string;
```

- *Type:* string

---

##### `connections`<sup>Required</sup> <a name="connections" id="cdk-extensions.glue.Connection.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

The network connections associated with this resource.

---

##### `connectionType`<sup>Required</sup> <a name="connectionType" id="cdk-extensions.glue.Connection.property.connectionType"></a>

```typescript
public readonly connectionType: ConnectionType;
```

- *Type:* cdk-extensions.glue.ConnectionType

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Connection.property.resource"></a>

```typescript
public readonly resource: CfnConnection;
```

- *Type:* aws-cdk-lib.aws_glue.CfnConnection

---

##### `securityGroups`<sup>Required</sup> <a name="securityGroups" id="cdk-extensions.glue.Connection.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Connection.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Connection.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="cdk-extensions.glue.Connection.property.securityGroup"></a>

```typescript
public readonly securityGroup: SecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.SecurityGroup

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="cdk-extensions.glue.Connection.property.subnets"></a>

```typescript
public readonly subnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="cdk-extensions.glue.Connection.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

---


### Crawler <a name="Crawler" id="cdk-extensions.glue.Crawler"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Crawler.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Crawler(scope: Construct, id: string, props: CrawlerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Crawler.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.glue.Crawler.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.glue.Crawler.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.CrawlerProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Crawler.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Crawler.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Crawler.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.CrawlerProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Crawler.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Crawler.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Crawler.addClassifier">addClassifier</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.addTarget">addTarget</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Crawler.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Crawler.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Crawler.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addClassifier` <a name="addClassifier" id="cdk-extensions.glue.Crawler.addClassifier"></a>

```typescript
public addClassifier(classifier: string): void
```

###### `classifier`<sup>Required</sup> <a name="classifier" id="cdk-extensions.glue.Crawler.addClassifier.parameter.classifier"></a>

- *Type:* string

---

##### `addTarget` <a name="addTarget" id="cdk-extensions.glue.Crawler.addTarget"></a>

```typescript
public addTarget(target: ICrawlerTarget): void
```

###### `target`<sup>Required</sup> <a name="target" id="cdk-extensions.glue.Crawler.addTarget.parameter.target"></a>

- *Type:* cdk-extensions.glue.ICrawlerTarget

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Crawler.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Crawler.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Crawler.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Crawler.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Crawler.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Crawler.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Crawler.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Crawler.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Crawler.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Crawler.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Crawler.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Crawler.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Crawler.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Crawler.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Crawler.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Crawler.property.crawlerArn">crawlerArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.crawlerName">crawlerName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnCrawler</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.configuration">configuration</a></code> | <code>cdk-extensions.glue.CrawlerConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.deleteBehavior">deleteBehavior</a></code> | <code>cdk-extensions.glue.DeleteBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.recrawlBehavior">recrawlBehavior</a></code> | <code>cdk-extensions.glue.RecrawlBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.scheduleExpression">scheduleExpression</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.securityConfiguration">securityConfiguration</a></code> | <code>cdk-extensions.glue.SecurityConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.tablePrefix">tablePrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Crawler.property.updateBehavior">updateBehavior</a></code> | <code>cdk-extensions.glue.UpdateBehavior</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Crawler.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Crawler.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Crawler.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `crawlerArn`<sup>Required</sup> <a name="crawlerArn" id="cdk-extensions.glue.Crawler.property.crawlerArn"></a>

```typescript
public readonly crawlerArn: string;
```

- *Type:* string

---

##### `crawlerName`<sup>Required</sup> <a name="crawlerName" id="cdk-extensions.glue.Crawler.property.crawlerName"></a>

```typescript
public readonly crawlerName: string;
```

- *Type:* string

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Crawler.property.resource"></a>

```typescript
public readonly resource: CfnCrawler;
```

- *Type:* aws-cdk-lib.aws_glue.CfnCrawler

---

##### `role`<sup>Required</sup> <a name="role" id="cdk-extensions.glue.Crawler.property.role"></a>

```typescript
public readonly role: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

---

##### `configuration`<sup>Optional</sup> <a name="configuration" id="cdk-extensions.glue.Crawler.property.configuration"></a>

```typescript
public readonly configuration: CrawlerConfiguration;
```

- *Type:* cdk-extensions.glue.CrawlerConfiguration

---

##### `database`<sup>Optional</sup> <a name="database" id="cdk-extensions.glue.Crawler.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `deleteBehavior`<sup>Optional</sup> <a name="deleteBehavior" id="cdk-extensions.glue.Crawler.property.deleteBehavior"></a>

```typescript
public readonly deleteBehavior: DeleteBehavior;
```

- *Type:* cdk-extensions.glue.DeleteBehavior

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Crawler.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Crawler.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `recrawlBehavior`<sup>Optional</sup> <a name="recrawlBehavior" id="cdk-extensions.glue.Crawler.property.recrawlBehavior"></a>

```typescript
public readonly recrawlBehavior: RecrawlBehavior;
```

- *Type:* cdk-extensions.glue.RecrawlBehavior

---

##### `scheduleExpression`<sup>Optional</sup> <a name="scheduleExpression" id="cdk-extensions.glue.Crawler.property.scheduleExpression"></a>

```typescript
public readonly scheduleExpression: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `securityConfiguration`<sup>Optional</sup> <a name="securityConfiguration" id="cdk-extensions.glue.Crawler.property.securityConfiguration"></a>

```typescript
public readonly securityConfiguration: SecurityConfiguration;
```

- *Type:* cdk-extensions.glue.SecurityConfiguration

---

##### `tablePrefix`<sup>Optional</sup> <a name="tablePrefix" id="cdk-extensions.glue.Crawler.property.tablePrefix"></a>

```typescript
public readonly tablePrefix: string;
```

- *Type:* string

---

##### `updateBehavior`<sup>Optional</sup> <a name="updateBehavior" id="cdk-extensions.glue.Crawler.property.updateBehavior"></a>

```typescript
public readonly updateBehavior: UpdateBehavior;
```

- *Type:* cdk-extensions.glue.UpdateBehavior

---


### Database <a name="Database" id="cdk-extensions.glue.Database"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Database.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Database(scope: Construct, id: string, props?: DatabaseProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Database.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.glue.Database.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.glue.Database.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.DatabaseProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Database.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Database.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.glue.Database.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.DatabaseProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Database.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Database.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Database.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Database.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Database.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Database.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Database.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Database.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Database.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Database.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Database.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Database.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Database.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Database.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Database.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Database.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Database.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Database.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Database.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Database.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Database.property.catalogArn">catalogArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.catalogId">catalogId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.databaseArn">databaseArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnDatabase</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Database.property.locationUri">locationUri</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Database.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Database.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Database.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `catalogArn`<sup>Required</sup> <a name="catalogArn" id="cdk-extensions.glue.Database.property.catalogArn"></a>

```typescript
public readonly catalogArn: string;
```

- *Type:* string

---

##### `catalogId`<sup>Required</sup> <a name="catalogId" id="cdk-extensions.glue.Database.property.catalogId"></a>

```typescript
public readonly catalogId: string;
```

- *Type:* string

---

##### `databaseArn`<sup>Required</sup> <a name="databaseArn" id="cdk-extensions.glue.Database.property.databaseArn"></a>

```typescript
public readonly databaseArn: string;
```

- *Type:* string

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-extensions.glue.Database.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.glue.Database.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Database.property.resource"></a>

```typescript
public readonly resource: CfnDatabase;
```

- *Type:* aws-cdk-lib.aws_glue.CfnDatabase

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Database.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `locationUri`<sup>Optional</sup> <a name="locationUri" id="cdk-extensions.glue.Database.property.locationUri"></a>

```typescript
public readonly locationUri: string;
```

- *Type:* string

---


### DeliveryStream <a name="DeliveryStream" id="cdk-extensions.kinesis_firehose.DeliveryStream"></a>

- *Implements:* cdk-extensions.kinesis_firehose.IDeliveryStream

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.DeliveryStream.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.DeliveryStream(scope: Construct, id: string, props: DeliveryStreamProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.grant">grant</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.grantPutRecords">grantPutRecords</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metric">metric</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Bytes">metricBackupToS3Bytes</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3DataFreshness">metricBackupToS3DataFreshness</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Records">metricBackupToS3Records</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingBytes">metricIncomingBytes</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingRecords">metricIncomingRecords</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.kinesis_firehose.DeliveryStream.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.kinesis_firehose.DeliveryStream.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.kinesis_firehose.DeliveryStream.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `grant` <a name="grant" id="cdk-extensions.kinesis_firehose.DeliveryStream.grant"></a>

```typescript
public grant(grantee: IGrantable, actions: string): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-extensions.kinesis_firehose.DeliveryStream.grant.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `actions`<sup>Required</sup> <a name="actions" id="cdk-extensions.kinesis_firehose.DeliveryStream.grant.parameter.actions"></a>

- *Type:* string

---

##### `grantPutRecords` <a name="grantPutRecords" id="cdk-extensions.kinesis_firehose.DeliveryStream.grantPutRecords"></a>

```typescript
public grantPutRecords(grantee: IGrantable): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-extensions.kinesis_firehose.DeliveryStream.grantPutRecords.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metric` <a name="metric" id="cdk-extensions.kinesis_firehose.DeliveryStream.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

###### `metricName`<sup>Required</sup> <a name="metricName" id="cdk-extensions.kinesis_firehose.DeliveryStream.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3Bytes` <a name="metricBackupToS3Bytes" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Bytes"></a>

```typescript
public metricBackupToS3Bytes(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Bytes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3DataFreshness` <a name="metricBackupToS3DataFreshness" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3DataFreshness"></a>

```typescript
public metricBackupToS3DataFreshness(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3DataFreshness.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3Records` <a name="metricBackupToS3Records" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Records"></a>

```typescript
public metricBackupToS3Records(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricBackupToS3Records.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricIncomingBytes` <a name="metricIncomingBytes" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingBytes"></a>

```typescript
public metricIncomingBytes(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingBytes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricIncomingRecords` <a name="metricIncomingRecords" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingRecords"></a>

```typescript
public metricIncomingRecords(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.DeliveryStream.metricIncomingRecords.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamArn">fromDeliveryStreamArn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes">fromDeliveryStreamAttributes</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamName">fromDeliveryStreamName</a></code> | *No description.* |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.kinesis_firehose.DeliveryStream.isConstruct"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.kinesis_firehose.DeliveryStream.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.kinesis_firehose.DeliveryStream.isOwnedResource"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.kinesis_firehose.DeliveryStream.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.kinesis_firehose.DeliveryStream.isResource"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.kinesis_firehose.DeliveryStream.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromDeliveryStreamArn` <a name="fromDeliveryStreamArn" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamArn"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.fromDeliveryStreamArn(scope: Construct, id: string, deliveryStreamArn: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamArn.parameter.id"></a>

- *Type:* string

---

###### `deliveryStreamArn`<sup>Required</sup> <a name="deliveryStreamArn" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamArn.parameter.deliveryStreamArn"></a>

- *Type:* string

---

##### `fromDeliveryStreamAttributes` <a name="fromDeliveryStreamAttributes" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes(scope: Construct, id: string, attrs: DeliveryStreamAttributes)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes.parameter.id"></a>

- *Type:* string

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamAttributes.parameter.attrs"></a>

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamAttributes

---

##### `fromDeliveryStreamName` <a name="fromDeliveryStreamName" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamName"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DeliveryStream.fromDeliveryStreamName(scope: Construct, id: string, deliveryStreamName: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamName.parameter.id"></a>

- *Type:* string

---

###### `deliveryStreamName`<sup>Required</sup> <a name="deliveryStreamName" id="cdk-extensions.kinesis_firehose.DeliveryStream.fromDeliveryStreamName.parameter.deliveryStreamName"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | The network connections associated with this resource. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.deliveryStreamArn">deliveryStreamArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.deliveryStreamName">deliveryStreamName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.destination">destination</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamDestination</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal to grant permissions to. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStream.property.streamType">streamType</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamType</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `connections`<sup>Required</sup> <a name="connections" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

The network connections associated with this resource.

---

##### `deliveryStreamArn`<sup>Required</sup> <a name="deliveryStreamArn" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.deliveryStreamArn"></a>

```typescript
public readonly deliveryStreamArn: string;
```

- *Type:* string

---

##### `deliveryStreamName`<sup>Required</sup> <a name="deliveryStreamName" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.deliveryStreamName"></a>

```typescript
public readonly deliveryStreamName: string;
```

- *Type:* string

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.destination"></a>

```typescript
public readonly destination: DeliveryStreamDestination;
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamDestination

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal to grant permissions to.

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.resource"></a>

```typescript
public readonly resource: CfnDeliveryStream;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `streamType`<sup>Optional</sup> <a name="streamType" id="cdk-extensions.kinesis_firehose.DeliveryStream.property.streamType"></a>

```typescript
public readonly streamType: DeliveryStreamType;
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamType

---


### FlowLog <a name="FlowLog" id="cdk-extensions.ec2.FlowLog"></a>

- *Implements:* aws-cdk-lib.aws_ec2.IFlowLog

#### Initializers <a name="Initializers" id="cdk-extensions.ec2.FlowLog.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

new ec2.FlowLog(scope: IConstruct, id: string, props: FlowLogProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLog.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.ec2.FlowLog.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.ec2.FlowLog.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.ec2.FlowLogProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ec2.FlowLog.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.ec2.FlowLog.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.ec2.FlowLog.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.ec2.FlowLogProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLog.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.ec2.FlowLog.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.ec2.FlowLog.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.ec2.FlowLog.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.ec2.FlowLog.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLog.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.ec2.FlowLog.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.ec2.FlowLog.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.ec2.FlowLog.isConstruct"></a>

```typescript
import { ec2 } from 'cdk-extensions'

ec2.FlowLog.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.ec2.FlowLog.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.ec2.FlowLog.isOwnedResource"></a>

```typescript
import { ec2 } from 'cdk-extensions'

ec2.FlowLog.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.ec2.FlowLog.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.ec2.FlowLog.isResource"></a>

```typescript
import { ec2 } from 'cdk-extensions'

ec2.FlowLog.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.ec2.FlowLog.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.destination">destination</a></code> | <code>cdk-extensions.ec2.FlowLogDestination</code> | The location where flow logs should be delivered. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.flowLogArn">flowLogArn</a></code> | <code>string</code> | The Amazon Resource Name (ARN) of the flow log. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.flowLogId">flowLogId</a></code> | <code>string</code> | The ID of the flow log. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.format">format</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | The fields to include in the flow log record, in the order in which they should appear. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_ec2.CfnFlowLog</code> | The underlying FlowLog CloudFormation resource. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.resourceType">resourceType</a></code> | <code>aws-cdk-lib.aws_ec2.FlowLogResourceType</code> | Details for the resource from which flow logs will be captured. |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.trafficType">trafficType</a></code> | <code>aws-cdk-lib.aws_ec2.FlowLogTrafficType</code> | The type of traffic to monitor (accepted traffic, rejected traffic, or all traffic). |
| <code><a href="#cdk-extensions.ec2.FlowLog.property.maxAggregationInterval">maxAggregationInterval</a></code> | <code>cdk-extensions.ec2.FlowLogAggregationInterval</code> | The maximum interval of time during which a flow of packets is captured and aggregated into a flow log record. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.ec2.FlowLog.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.ec2.FlowLog.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.ec2.FlowLog.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-extensions.ec2.FlowLog.property.destination"></a>

```typescript
public readonly destination: FlowLogDestination;
```

- *Type:* cdk-extensions.ec2.FlowLogDestination

The location where flow logs should be delivered.

> [[FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)]([FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype))

---

##### `flowLogArn`<sup>Required</sup> <a name="flowLogArn" id="cdk-extensions.ec2.FlowLog.property.flowLogArn"></a>

```typescript
public readonly flowLogArn: string;
```

- *Type:* string

The Amazon Resource Name (ARN) of the flow log.

---

##### `flowLogId`<sup>Required</sup> <a name="flowLogId" id="cdk-extensions.ec2.FlowLog.property.flowLogId"></a>

```typescript
public readonly flowLogId: string;
```

- *Type:* string

The ID of the flow log.

---

##### `format`<sup>Required</sup> <a name="format" id="cdk-extensions.ec2.FlowLog.property.format"></a>

```typescript
public readonly format: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

The fields to include in the flow log record, in the order in which they should appear.

For a list of available fields, see {@link FlowLogField}.

> [[FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)]([FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat))

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.ec2.FlowLog.property.resource"></a>

```typescript
public readonly resource: CfnFlowLog;
```

- *Type:* aws-cdk-lib.aws_ec2.CfnFlowLog

The underlying FlowLog CloudFormation resource.

> [[AWS::EC2::FlowLog](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html)]([AWS::EC2::FlowLog](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html))

---

##### `resourceType`<sup>Required</sup> <a name="resourceType" id="cdk-extensions.ec2.FlowLog.property.resourceType"></a>

```typescript
public readonly resourceType: FlowLogResourceType;
```

- *Type:* aws-cdk-lib.aws_ec2.FlowLogResourceType

Details for the resource from which flow logs will be captured.

> [[FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype)]([FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype))

---

##### `trafficType`<sup>Required</sup> <a name="trafficType" id="cdk-extensions.ec2.FlowLog.property.trafficType"></a>

```typescript
public readonly trafficType: FlowLogTrafficType;
```

- *Type:* aws-cdk-lib.aws_ec2.FlowLogTrafficType

The type of traffic to monitor (accepted traffic, rejected traffic, or all traffic).

> [[FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype)]([FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype))

---

##### `maxAggregationInterval`<sup>Optional</sup> <a name="maxAggregationInterval" id="cdk-extensions.ec2.FlowLog.property.maxAggregationInterval"></a>

```typescript
public readonly maxAggregationInterval: FlowLogAggregationInterval;
```

- *Type:* cdk-extensions.ec2.FlowLogAggregationInterval

The maximum interval of time during which a flow of packets is captured and aggregated into a flow log record.

> [[FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)]([FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval))

---


### GroupBase <a name="GroupBase" id="cdk-extensions.sso.GroupBase"></a>

- *Implements:* cdk-extensions.sso.IGroup, cdk-extensions.sso.IIdentityCenterPrincipal

#### Initializers <a name="Initializers" id="cdk-extensions.sso.GroupBase.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.GroupBase(scope: IConstruct, id: string, props?: ResourceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.GroupBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.GroupBase.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.GroupBase.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.ResourceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.GroupBase.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.GroupBase.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.sso.GroupBase.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.ResourceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.GroupBase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.GroupBase.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.GroupBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.GroupBase.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.GroupBase.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.GroupBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.GroupBase.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.GroupBase.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.GroupBase.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.GroupBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.GroupBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.GroupBase.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.GroupBase.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.GroupBase.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.GroupBase.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.GroupBase.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.GroupBase.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.GroupBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.GroupBase.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.GroupBase.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.GroupBase.property.groupId">groupId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.GroupBase.property.principalId">principalId</a></code> | <code>string</code> | The unique ID that identifies the entity withing IAM Identity Center. |
| <code><a href="#cdk-extensions.sso.GroupBase.property.principalType">principalType</a></code> | <code>cdk-extensions.sso.IdentityCenterPrincipalType</code> | The type of entity being represented. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.GroupBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.GroupBase.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.GroupBase.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `groupId`<sup>Required</sup> <a name="groupId" id="cdk-extensions.sso.GroupBase.property.groupId"></a>

```typescript
public readonly groupId: string;
```

- *Type:* string

---

##### `principalId`<sup>Required</sup> <a name="principalId" id="cdk-extensions.sso.GroupBase.property.principalId"></a>

```typescript
public readonly principalId: string;
```

- *Type:* string

The unique ID that identifies the entity withing IAM Identity Center.

---

##### `principalType`<sup>Required</sup> <a name="principalType" id="cdk-extensions.sso.GroupBase.property.principalType"></a>

```typescript
public readonly principalType: IdentityCenterPrincipalType;
```

- *Type:* cdk-extensions.sso.IdentityCenterPrincipalType

The type of entity being represented.

---


### InstanceAccessControlAttributeConfiguration <a name="InstanceAccessControlAttributeConfiguration" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration"></a>

Enables the attribute-based access control (ABAC) feature for the specified IAM Identity Center instance.

You can also specify new attributes to add to
your ABAC configuration during the enabling process. For more information
about ABAC, see [Attribute-Based Access Control](https://docs.aws.amazon.com/singlesignon/latest/userguide/abac.html) in the IAM Identity Center
User Guide.

#### Initializers <a name="Initializers" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.InstanceAccessControlAttributeConfiguration(scope: Construct, id: string, props: InstanceAccessControlAttributeConfigurationProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.addAttribute">addAttribute</a></code> | Adds a new ABAC attribute in the specified IAM Identity Center instance. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAttribute` <a name="addAttribute" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.addAttribute"></a>

```typescript
public addAttribute(key: string, sources: string): AccessControlAttribute
```

Adds a new ABAC attribute in the specified IAM Identity Center instance.

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.addAttribute.parameter.key"></a>

- *Type:* string

The name of the attribute associated with your identities in your identity source.

This is used to map a specified attribute in your
identity source with an attribute in IAM Identity Center.

---

###### `sources`<sup>Required</sup> <a name="sources" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.addAttribute.parameter.sources"></a>

- *Type:* string

The identity sources to use when mapping a specified attribute to IAM Identity Center.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceAccessControlAttributeConfiguration.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceAccessControlAttributeConfiguration.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceAccessControlAttributeConfiguration.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.attributes">attributes</a></code> | <code>cdk-extensions.sso.AccessControlAttribute[]</code> | Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The ARN of the IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_sso.CfnInstanceAccessControlAttributeConfiguration</code> | The underlying InstanceAccessControlAttributeConfiguration CloudFormation resource. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `attributes`<sup>Required</sup> <a name="attributes" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.attributes"></a>

```typescript
public readonly attributes: AccessControlAttribute[];
```

- *Type:* cdk-extensions.sso.AccessControlAttribute[]

Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance.

This array is readonly. Changes made to the
array will not be reflected in this resource. To add new attributes use
the `{@link addAttribute}` method.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The ARN of the IAM Identity Center instance under which the operation will be executed.

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.sso.InstanceAccessControlAttributeConfiguration.property.resource"></a>

```typescript
public readonly resource: CfnInstanceAccessControlAttributeConfiguration;
```

- *Type:* aws-cdk-lib.aws_sso.CfnInstanceAccessControlAttributeConfiguration

The underlying InstanceAccessControlAttributeConfiguration CloudFormation resource.

---


### InstanceBase <a name="InstanceBase" id="cdk-extensions.sso.InstanceBase"></a>

- *Implements:* cdk-extensions.sso.IInstance

#### Initializers <a name="Initializers" id="cdk-extensions.sso.InstanceBase.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.InstanceBase(scope: Construct, id: string, props?: ResourceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.InstanceBase.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.InstanceBase.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.ResourceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.InstanceBase.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.InstanceBase.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.sso.InstanceBase.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.ResourceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceBase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.InstanceBase.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.InstanceBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.InstanceBase.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.InstanceBase.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.InstanceBase.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.InstanceBase.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.InstanceBase.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.InstanceBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.InstanceBase.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceBase.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.InstanceBase.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.InstanceBase.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.InstanceBase.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.InstanceBase.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.InstanceBase.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.InstanceBase.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.InstanceBase.property.instanceArn">instanceArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.InstanceBase.property.instanceId">instanceId</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.InstanceBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.InstanceBase.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.InstanceBase.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `instanceArn`<sup>Required</sup> <a name="instanceArn" id="cdk-extensions.sso.InstanceBase.property.instanceArn"></a>

```typescript
public readonly instanceArn: string;
```

- *Type:* string

---

##### `instanceId`<sup>Required</sup> <a name="instanceId" id="cdk-extensions.sso.InstanceBase.property.instanceId"></a>

```typescript
public readonly instanceId: string;
```

- *Type:* string

---


### Job <a name="Job" id="cdk-extensions.glue.Job"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Job.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Job(scope: Construct, id: string, props: JobProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Job.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.JobProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Job.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Job.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Job.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.JobProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Job.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Job.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Job.addArgument">addArgument</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.addConnection">addConnection</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Job.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Job.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Job.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addArgument` <a name="addArgument" id="cdk-extensions.glue.Job.addArgument"></a>

```typescript
public addArgument(key: string, value: string): void
```

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Job.addArgument.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Job.addArgument.parameter.value"></a>

- *Type:* string

---

##### `addConnection` <a name="addConnection" id="cdk-extensions.glue.Job.addConnection"></a>

```typescript
public addConnection(connection: Connection): void
```

###### `connection`<sup>Required</sup> <a name="connection" id="cdk-extensions.glue.Job.addConnection.parameter.connection"></a>

- *Type:* cdk-extensions.glue.Connection

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Job.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Job.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Job.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Job.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Job.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Job.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Job.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Job.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Job.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Job.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Job.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Job.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Job.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Job.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Job.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Job.property.executable">executable</a></code> | <code>cdk-extensions.glue.JobExecutable</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.jobArn">jobArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.jobName">jobName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnJob</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.allocatedCapacity">allocatedCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.connections">connections</a></code> | <code>cdk-extensions.glue.Connection[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.continuousLogging">continuousLogging</a></code> | <code>cdk-extensions.glue.ContinuousLoggingProps</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.maxCapacity">maxCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.maxConcurrentRuns">maxConcurrentRuns</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.maxRetries">maxRetries</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.notifyDelayAfter">notifyDelayAfter</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.securityConfiguration">securityConfiguration</a></code> | <code>cdk-extensions.glue.SecurityConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.workerCount">workerCount</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Job.property.workerType">workerType</a></code> | <code>cdk-extensions.glue.WorkerType</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Job.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Job.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Job.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `executable`<sup>Required</sup> <a name="executable" id="cdk-extensions.glue.Job.property.executable"></a>

```typescript
public readonly executable: JobExecutable;
```

- *Type:* cdk-extensions.glue.JobExecutable

---

##### `jobArn`<sup>Required</sup> <a name="jobArn" id="cdk-extensions.glue.Job.property.jobArn"></a>

```typescript
public readonly jobArn: string;
```

- *Type:* string

---

##### `jobName`<sup>Required</sup> <a name="jobName" id="cdk-extensions.glue.Job.property.jobName"></a>

```typescript
public readonly jobName: string;
```

- *Type:* string

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Job.property.resource"></a>

```typescript
public readonly resource: CfnJob;
```

- *Type:* aws-cdk-lib.aws_glue.CfnJob

---

##### `role`<sup>Required</sup> <a name="role" id="cdk-extensions.glue.Job.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `allocatedCapacity`<sup>Optional</sup> <a name="allocatedCapacity" id="cdk-extensions.glue.Job.property.allocatedCapacity"></a>

```typescript
public readonly allocatedCapacity: number;
```

- *Type:* number

---

##### `connections`<sup>Optional</sup> <a name="connections" id="cdk-extensions.glue.Job.property.connections"></a>

```typescript
public readonly connections: Connection[];
```

- *Type:* cdk-extensions.glue.Connection[]

---

##### `continuousLogging`<sup>Optional</sup> <a name="continuousLogging" id="cdk-extensions.glue.Job.property.continuousLogging"></a>

```typescript
public readonly continuousLogging: ContinuousLoggingProps;
```

- *Type:* cdk-extensions.glue.ContinuousLoggingProps

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Job.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.glue.Job.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

---

##### `maxCapacity`<sup>Optional</sup> <a name="maxCapacity" id="cdk-extensions.glue.Job.property.maxCapacity"></a>

```typescript
public readonly maxCapacity: number;
```

- *Type:* number

---

##### `maxConcurrentRuns`<sup>Optional</sup> <a name="maxConcurrentRuns" id="cdk-extensions.glue.Job.property.maxConcurrentRuns"></a>

```typescript
public readonly maxConcurrentRuns: number;
```

- *Type:* number

---

##### `maxRetries`<sup>Optional</sup> <a name="maxRetries" id="cdk-extensions.glue.Job.property.maxRetries"></a>

```typescript
public readonly maxRetries: number;
```

- *Type:* number

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Job.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `notifyDelayAfter`<sup>Optional</sup> <a name="notifyDelayAfter" id="cdk-extensions.glue.Job.property.notifyDelayAfter"></a>

```typescript
public readonly notifyDelayAfter: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `securityConfiguration`<sup>Optional</sup> <a name="securityConfiguration" id="cdk-extensions.glue.Job.property.securityConfiguration"></a>

```typescript
public readonly securityConfiguration: SecurityConfiguration;
```

- *Type:* cdk-extensions.glue.SecurityConfiguration

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="cdk-extensions.glue.Job.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `workerCount`<sup>Optional</sup> <a name="workerCount" id="cdk-extensions.glue.Job.property.workerCount"></a>

```typescript
public readonly workerCount: number;
```

- *Type:* number

---

##### `workerType`<sup>Optional</sup> <a name="workerType" id="cdk-extensions.glue.Job.property.workerType"></a>

```typescript
public readonly workerType: WorkerType;
```

- *Type:* cdk-extensions.glue.WorkerType

---


### NamedQuery <a name="NamedQuery" id="cdk-extensions.athena.NamedQuery"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.athena.NamedQuery.Initializer"></a>

```typescript
import { athena } from 'cdk-extensions'

new athena.NamedQuery(scope: Construct, id: string, props: NamedQueryProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.athena.NamedQuery.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.athena.NamedQuery.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.athena.NamedQuery.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.athena.NamedQueryProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.athena.NamedQuery.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.athena.NamedQuery.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.athena.NamedQuery.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.athena.NamedQueryProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.athena.NamedQuery.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.athena.NamedQuery.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.athena.NamedQuery.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.athena.NamedQuery.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.athena.NamedQuery.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.athena.NamedQuery.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.athena.NamedQuery.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.athena.NamedQuery.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.athena.NamedQuery.isConstruct"></a>

```typescript
import { athena } from 'cdk-extensions'

athena.NamedQuery.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.athena.NamedQuery.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.athena.NamedQuery.isOwnedResource"></a>

```typescript
import { athena } from 'cdk-extensions'

athena.NamedQuery.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.athena.NamedQuery.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.athena.NamedQuery.isResource"></a>

```typescript
import { athena } from 'cdk-extensions'

athena.NamedQuery.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.athena.NamedQuery.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | The Glue database to which the query belongs. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.namedQueryId">namedQueryId</a></code> | <code>string</code> | The unique ID of the query. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.namedQueryName">namedQueryName</a></code> | <code>string</code> | The name of the query. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.queryString">queryString</a></code> | <code>string</code> | The SQL statements that make up the query. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_athena.CfnNamedQuery</code> | The underlying NamedQuery CloudFormation resource. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.description">description</a></code> | <code>string</code> | A human friendly description explaining the functionality of the query. |
| <code><a href="#cdk-extensions.athena.NamedQuery.property.name">name</a></code> | <code>string</code> | The name of the query. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.athena.NamedQuery.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.athena.NamedQuery.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.athena.NamedQuery.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.athena.NamedQuery.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

The Glue database to which the query belongs.

> [[NamedQuery Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database)]([NamedQuery Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database))

---

##### `namedQueryId`<sup>Required</sup> <a name="namedQueryId" id="cdk-extensions.athena.NamedQuery.property.namedQueryId"></a>

```typescript
public readonly namedQueryId: string;
```

- *Type:* string

The unique ID of the query.

---

##### `namedQueryName`<sup>Required</sup> <a name="namedQueryName" id="cdk-extensions.athena.NamedQuery.property.namedQueryName"></a>

```typescript
public readonly namedQueryName: string;
```

- *Type:* string

The name of the query.

---

##### `queryString`<sup>Required</sup> <a name="queryString" id="cdk-extensions.athena.NamedQuery.property.queryString"></a>

```typescript
public readonly queryString: string;
```

- *Type:* string

The SQL statements that make up the query.

> [[Athena SQL reference](https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html)]([Athena SQL reference](https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html))

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.athena.NamedQuery.property.resource"></a>

```typescript
public readonly resource: CfnNamedQuery;
```

- *Type:* aws-cdk-lib.aws_athena.CfnNamedQuery

The underlying NamedQuery CloudFormation resource.

> [[AWS::Athena::NamedQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html)]([AWS::Athena::NamedQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html))

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.athena.NamedQuery.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A human friendly description explaining the functionality of the query.

> [[NamedQuery Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description)]([NamedQuery Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description))

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.athena.NamedQuery.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the query.

> [[NamedQuery Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name)]([NamedQuery Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name))

---


### PermissionSet <a name="PermissionSet" id="cdk-extensions.sso.PermissionSet"></a>

- *Implements:* cdk-extensions.sso.IPermissionSet

Specifies a permission set within a specified IAM Identity Center instance.

#### Initializers <a name="Initializers" id="cdk-extensions.sso.PermissionSet.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.PermissionSet(scope: Construct, id: string, props: PermissionSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionSet.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.sso.PermissionSet.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.sso.PermissionSet.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.sso.PermissionSetProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.PermissionSet.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.PermissionSet.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.sso.PermissionSet.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.sso.PermissionSetProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionSet.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.PermissionSet.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.sso.PermissionSet.addCustomerManagedPolicy">addCustomerManagedPolicy</a></code> | Adds a custom managed policy to the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSet.addManagedPolicy">addManagedPolicy</a></code> | Adds a new Managed Policy to the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSet.addToPrincipalPolicy">addToPrincipalPolicy</a></code> | Adds a permission to the permission set's default policy document. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.PermissionSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.PermissionSet.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.PermissionSet.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addCustomerManagedPolicy` <a name="addCustomerManagedPolicy" id="cdk-extensions.sso.PermissionSet.addCustomerManagedPolicy"></a>

```typescript
public addCustomerManagedPolicy(options: ReferenceOptions): ReferencedManagedPolicy
```

Adds a custom managed policy to the permission set.

When using customer
managed policies it is required that a managed policy with a matching
name and path exist in any AWS account for which the permission set
will be assigned.

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.PermissionSet.addCustomerManagedPolicy.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

The configuration for the customer managed policy.

---

##### `addManagedPolicy` <a name="addManagedPolicy" id="cdk-extensions.sso.PermissionSet.addManagedPolicy"></a>

```typescript
public addManagedPolicy(policy: IManagedPolicy): PermissionSet
```

Adds a new Managed Policy to the permission set.

Only Managed Policies
created and maintained by AWS are supported. To add a custom Managed
Policy that you control use the {@link addCustomerManagedPolicy} method.

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.PermissionSet.addManagedPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

The AWS Managed Policy to associate with the Permission Set.

---

##### `addToPrincipalPolicy` <a name="addToPrincipalPolicy" id="cdk-extensions.sso.PermissionSet.addToPrincipalPolicy"></a>

```typescript
public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult
```

Adds a permission to the permission set's default policy document.

If there is no default policy attached to this permission set, it will be created.

###### `statement`<sup>Required</sup> <a name="statement" id="cdk-extensions.sso.PermissionSet.addToPrincipalPolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

The permission statement to add to the policy document.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.PermissionSet.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.PermissionSet.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cdk-extensions.sso.PermissionSet.fromArn">fromArn</a></code> | *No description.* |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.PermissionSet.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.PermissionSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.PermissionSet.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionSet.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.PermissionSet.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.PermissionSet.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionSet.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.PermissionSet.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromArn` <a name="fromArn" id="cdk-extensions.sso.PermissionSet.fromArn"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionSet.fromArn(scope: Construct, id: string, arn: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.PermissionSet.fromArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.PermissionSet.fromArn.parameter.id"></a>

- *Type:* string

---

###### `arn`<sup>Required</sup> <a name="arn" id="cdk-extensions.sso.PermissionSet.fromArn.parameter.arn"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The ARN of the IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.permissionSetArn">permissionSetArn</a></code> | <code>string</code> | The permission set ARN of the permission set, such as `arn:aws:sso:::permissionSet/ins-instanceid/ps-permissionsetid`. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_sso.CfnPermissionSet</code> | The underlying PermissionSet CloudFormation resource. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.description">description</a></code> | <code>string</code> | A user friendly description providing details about the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.name">name</a></code> | <code>string</code> | The name of the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.permissionsBoundary">permissionsBoundary</a></code> | <code>cdk-extensions.sso.PermissionsBoundary</code> | Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.relayState">relayState</a></code> | <code>string</code> | Used to redirect users within the application during the federation authentication process. |
| <code><a href="#cdk-extensions.sso.PermissionSet.property.sessionDuration">sessionDuration</a></code> | <code>aws-cdk-lib.Duration</code> | The length of time that the application user sessions are valid for. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.PermissionSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.PermissionSet.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.PermissionSet.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.PermissionSet.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The ARN of the IAM Identity Center instance under which the operation will be executed.

---

##### `permissionSetArn`<sup>Required</sup> <a name="permissionSetArn" id="cdk-extensions.sso.PermissionSet.property.permissionSetArn"></a>

```typescript
public readonly permissionSetArn: string;
```

- *Type:* string

The permission set ARN of the permission set, such as `arn:aws:sso:::permissionSet/ins-instanceid/ps-permissionsetid`.

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.sso.PermissionSet.property.resource"></a>

```typescript
public readonly resource: CfnPermissionSet;
```

- *Type:* aws-cdk-lib.aws_sso.CfnPermissionSet

The underlying PermissionSet CloudFormation resource.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.sso.PermissionSet.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A user friendly description providing details about the permission set.

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.sso.PermissionSet.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the permission set.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="cdk-extensions.sso.PermissionSet.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* cdk-extensions.sso.PermissionsBoundary

Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary.

Specify either
CustomerManagedPolicyReference to use the name and path of a customer
managed policy, or ManagedPolicyArn to use the ARN of an AWS managed
policy. A permissions boundary represents the maximum permissions that
any policy can grant your role. For more information, see [Permissions
boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for IAM entities in the AWS Identity and Access Management
User Guide.

---

##### `relayState`<sup>Optional</sup> <a name="relayState" id="cdk-extensions.sso.PermissionSet.property.relayState"></a>

```typescript
public readonly relayState: string;
```

- *Type:* string

Used to redirect users within the application during the federation authentication process.

For example, you can redirect users to a
specific page that is most applicable to their job after singing in to
an AWS account.

---

##### `sessionDuration`<sup>Optional</sup> <a name="sessionDuration" id="cdk-extensions.sso.PermissionSet.property.sessionDuration"></a>

```typescript
public readonly sessionDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration

The length of time that the application user sessions are valid for.

---


### ReferencedManagedPolicy <a name="ReferencedManagedPolicy" id="cdk-extensions.sso.ReferencedManagedPolicy"></a>

A managed policy that is referenced via IAM Identity Center.

#### Initializers <a name="Initializers" id="cdk-extensions.sso.ReferencedManagedPolicy.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.ReferencedManagedPolicy(scope: Construct, id: string, props?: ReferencedManagedPolicyProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.sso.ReferencedManagedPolicyProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique within the context of 'scope'.

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.sso.ReferencedManagedPolicy.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.sso.ReferencedManagedPolicyProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.addStatements">addStatements</a></code> | Adds a statement to the policy document. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.attachToGroup">attachToGroup</a></code> | Attaches this policy to a group. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.attachToRole">attachToRole</a></code> | Attaches this policy to a role. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.attachToUser">attachToUser</a></code> | Attaches this policy to a user. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.ReferencedManagedPolicy.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.ReferencedManagedPolicy.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.ReferencedManagedPolicy.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addStatements` <a name="addStatements" id="cdk-extensions.sso.ReferencedManagedPolicy.addStatements"></a>

```typescript
public addStatements(statement: PolicyStatement): void
```

Adds a statement to the policy document.

###### `statement`<sup>Required</sup> <a name="statement" id="cdk-extensions.sso.ReferencedManagedPolicy.addStatements.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `attachToGroup` <a name="attachToGroup" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToGroup"></a>

```typescript
public attachToGroup(group: IGroup): void
```

Attaches this policy to a group.

###### `group`<sup>Required</sup> <a name="group" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToGroup.parameter.group"></a>

- *Type:* aws-cdk-lib.aws_iam.IGroup

---

##### `attachToRole` <a name="attachToRole" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToRole"></a>

```typescript
public attachToRole(role: IRole): void
```

Attaches this policy to a role.

###### `role`<sup>Required</sup> <a name="role" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToRole.parameter.role"></a>

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `attachToUser` <a name="attachToUser" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToUser"></a>

```typescript
public attachToUser(user: IUser): void
```

Attaches this policy to a user.

###### `user`<sup>Required</sup> <a name="user" id="cdk-extensions.sso.ReferencedManagedPolicy.attachToUser.parameter.user"></a>

- *Type:* aws-cdk-lib.aws_iam.IUser

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.fromAwsManagedPolicyName">fromAwsManagedPolicyName</a></code> | Import a managed policy from one of the policies that AWS manages. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyArn">fromManagedPolicyArn</a></code> | Import an external managed policy by ARN. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyName">fromManagedPolicyName</a></code> | Import a customer managed policy from the managedPolicyName. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.of">of</a></code> | Dynamically generates a new class that can be used to create a managed policy that matches a reference in IAM Identity Center. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.ReferencedManagedPolicy.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.ReferencedManagedPolicy.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.ReferencedManagedPolicy.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.ReferencedManagedPolicy.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.ReferencedManagedPolicy.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.ReferencedManagedPolicy.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAwsManagedPolicyName` <a name="fromAwsManagedPolicyName" id="cdk-extensions.sso.ReferencedManagedPolicy.fromAwsManagedPolicyName"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.fromAwsManagedPolicyName(managedPolicyName: string)
```

Import a managed policy from one of the policies that AWS manages.

For this managed policy, you only need to know the name to be able to use it.

Some managed policy names start with "service-role/", some start with
"job-function/", and some don't start with anything. Include the
prefix when constructing this object.

###### `managedPolicyName`<sup>Required</sup> <a name="managedPolicyName" id="cdk-extensions.sso.ReferencedManagedPolicy.fromAwsManagedPolicyName.parameter.managedPolicyName"></a>

- *Type:* string

---

##### `fromManagedPolicyArn` <a name="fromManagedPolicyArn" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyArn"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.fromManagedPolicyArn(scope: Construct, id: string, managedPolicyArn: string)
```

Import an external managed policy by ARN.

For this managed policy, you only need to know the ARN to be able to use it.
This can be useful if you got the ARN from a CloudFormation Export.

If the imported Managed Policy ARN is a Token (such as a
`CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
managed policy has a `path` (like `arn:...:policy/AdminPolicy/AdminAllow`), the
`managedPolicyName` property will not resolve to the correct value. Instead it
will resolve to the first path component. We unfortunately cannot express
the correct calculation of the full path name as a CloudFormation
expression. In this scenario the Managed Policy ARN should be supplied without the
`path` in order to resolve the correct managed policy resource.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyArn.parameter.scope"></a>

- *Type:* constructs.Construct

construct scope.

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyArn.parameter.id"></a>

- *Type:* string

construct id.

---

###### `managedPolicyArn`<sup>Required</sup> <a name="managedPolicyArn" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyArn.parameter.managedPolicyArn"></a>

- *Type:* string

the ARN of the managed policy to import.

---

##### `fromManagedPolicyName` <a name="fromManagedPolicyName" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyName"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.fromManagedPolicyName(scope: Construct, id: string, managedPolicyName: string)
```

Import a customer managed policy from the managedPolicyName.

For this managed policy, you only need to know the name to be able to use it.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyName.parameter.id"></a>

- *Type:* string

---

###### `managedPolicyName`<sup>Required</sup> <a name="managedPolicyName" id="cdk-extensions.sso.ReferencedManagedPolicy.fromManagedPolicyName.parameter.managedPolicyName"></a>

- *Type:* string

---

##### `of` <a name="of" id="cdk-extensions.sso.ReferencedManagedPolicy.of"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedManagedPolicy.of(options: ReferenceOptions)
```

Dynamically generates a new class that can be used to create a managed policy that matches a reference in IAM Identity Center.

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.ReferencedManagedPolicy.of.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

The reference configuration used when registering a customer managed policy with a permission set in IAM Identity Center.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.description">description</a></code> | <code>string</code> | The description of this policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.document">document</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The policy document. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.managedPolicyArn">managedPolicyArn</a></code> | <code>string</code> | Returns the ARN of this managed policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.managedPolicyName">managedPolicyName</a></code> | <code>string</code> | The name of this policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.path">path</a></code> | <code>string</code> | The path of this policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.referencedName">referencedName</a></code> | <code>string</code> | The name of the managed policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.referencedPath">referencedPath</a></code> | <code>string</code> | The path for the managed policy. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.ReferencedManagedPolicy.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.ReferencedManagedPolicy.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.ReferencedManagedPolicy.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `description`<sup>Required</sup> <a name="description" id="cdk-extensions.sso.ReferencedManagedPolicy.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of this policy.

---

##### `document`<sup>Required</sup> <a name="document" id="cdk-extensions.sso.ReferencedManagedPolicy.property.document"></a>

```typescript
public readonly document: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The policy document.

---

##### `managedPolicyArn`<sup>Required</sup> <a name="managedPolicyArn" id="cdk-extensions.sso.ReferencedManagedPolicy.property.managedPolicyArn"></a>

```typescript
public readonly managedPolicyArn: string;
```

- *Type:* string

Returns the ARN of this managed policy.

---

##### `managedPolicyName`<sup>Required</sup> <a name="managedPolicyName" id="cdk-extensions.sso.ReferencedManagedPolicy.property.managedPolicyName"></a>

```typescript
public readonly managedPolicyName: string;
```

- *Type:* string

The name of this policy.

---

##### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.sso.ReferencedManagedPolicy.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string

The path of this policy.

---

##### `referencedName`<sup>Required</sup> <a name="referencedName" id="cdk-extensions.sso.ReferencedManagedPolicy.property.referencedName"></a>

```typescript
public readonly referencedName: string;
```

- *Type:* string

The name of the managed policy.

---

##### `referencedPath`<sup>Optional</sup> <a name="referencedPath" id="cdk-extensions.sso.ReferencedManagedPolicy.property.referencedPath"></a>

```typescript
public readonly referencedPath: string;
```

- *Type:* string

The path for the managed policy.

For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
Guide.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.policyName">policyName</a></code> | <code>string</code> | The name of the managed policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicy.property.policyPath">policyPath</a></code> | <code>string</code> | The path for the managed policy. |

---

##### `policyName`<sup>Required</sup> <a name="policyName" id="cdk-extensions.sso.ReferencedManagedPolicy.property.policyName"></a>

```typescript
public readonly policyName: string;
```

- *Type:* string

The name of the managed policy.

---

##### `policyPath`<sup>Optional</sup> <a name="policyPath" id="cdk-extensions.sso.ReferencedManagedPolicy.property.policyPath"></a>

```typescript
public readonly policyPath: string;
```

- *Type:* string

The path for the managed policy.

For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
Guide.

---

### ResourceShare <a name="ResourceShare" id="cdk-extensions.ram.ResourceShare"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.ram.ResourceShare.Initializer"></a>

```typescript
import { ram } from 'cdk-extensions'

new ram.ResourceShare(scope: Construct, id: string, props?: ResourceShareProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ram.ResourceShare.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.ram.ResourceShare.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.ram.ResourceShare.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.ram.ResourceShareProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ram.ResourceShare.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.ram.ResourceShare.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.ram.ResourceShare.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.ram.ResourceShareProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.ResourceShare.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.ram.ResourceShare.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.ram.ResourceShare.addPrincipal">addPrincipal</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShare.addResource">addResource</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShare.enableAutoDiscovery">enableAutoDiscovery</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.ram.ResourceShare.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.ram.ResourceShare.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.ram.ResourceShare.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addPrincipal` <a name="addPrincipal" id="cdk-extensions.ram.ResourceShare.addPrincipal"></a>

```typescript
public addPrincipal(principal: ISharedPrincipal): void
```

###### `principal`<sup>Required</sup> <a name="principal" id="cdk-extensions.ram.ResourceShare.addPrincipal.parameter.principal"></a>

- *Type:* cdk-extensions.ram.ISharedPrincipal

---

##### `addResource` <a name="addResource" id="cdk-extensions.ram.ResourceShare.addResource"></a>

```typescript
public addResource(resource: ISharedResource): void
```

###### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.ram.ResourceShare.addResource.parameter.resource"></a>

- *Type:* cdk-extensions.ram.ISharedResource

---

##### `enableAutoDiscovery` <a name="enableAutoDiscovery" id="cdk-extensions.ram.ResourceShare.enableAutoDiscovery"></a>

```typescript
public enableAutoDiscovery(): void
```

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.ResourceShare.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.ram.ResourceShare.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.ram.ResourceShare.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.ram.ResourceShare.isConstruct"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.ResourceShare.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.ram.ResourceShare.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.ram.ResourceShare.isOwnedResource"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.ResourceShare.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.ram.ResourceShare.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.ram.ResourceShare.isResource"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.ResourceShare.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.ram.ResourceShare.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.autoDiscovery">autoDiscovery</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_ram.CfnResourceShare</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShare.property.allowExternalPrincipals">allowExternalPrincipals</a></code> | <code>boolean</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.ram.ResourceShare.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.ram.ResourceShare.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.ram.ResourceShare.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `autoDiscovery`<sup>Required</sup> <a name="autoDiscovery" id="cdk-extensions.ram.ResourceShare.property.autoDiscovery"></a>

```typescript
public readonly autoDiscovery: boolean;
```

- *Type:* boolean

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.ram.ResourceShare.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.ram.ResourceShare.property.resource"></a>

```typescript
public readonly resource: CfnResourceShare;
```

- *Type:* aws-cdk-lib.aws_ram.CfnResourceShare

---

##### `allowExternalPrincipals`<sup>Optional</sup> <a name="allowExternalPrincipals" id="cdk-extensions.ram.ResourceShare.property.allowExternalPrincipals"></a>

```typescript
public readonly allowExternalPrincipals: boolean;
```

- *Type:* boolean

---


### SecurityConfiguration <a name="SecurityConfiguration" id="cdk-extensions.glue.SecurityConfiguration"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.SecurityConfiguration.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.SecurityConfiguration(scope: Construct, id: string, props: SecurityConfigurationProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.SecurityConfigurationProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.SecurityConfiguration.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.SecurityConfigurationProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.SecurityConfiguration.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.SecurityConfiguration.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.SecurityConfiguration.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.SecurityConfiguration.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.SecurityConfiguration.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.SecurityConfiguration.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.SecurityConfiguration.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.SecurityConfiguration.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.SecurityConfiguration.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.SecurityConfiguration.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.SecurityConfiguration.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.SecurityConfiguration.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.key">key</a></code> | <code>aws-cdk-lib.aws_kms.Key</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnSecurityConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.securityConfigurationName">securityConfigurationName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.cloudWatchEncryption">cloudWatchEncryption</a></code> | <code>cdk-extensions.glue.CloudWatchEncryption</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.jobBookmarksEncryption">jobBookmarksEncryption</a></code> | <code>cdk-extensions.glue.JobBookmarksEncryption</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfiguration.property.s3Encryption">s3Encryption</a></code> | <code>cdk-extensions.glue.S3Encryption</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.SecurityConfiguration.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.SecurityConfiguration.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.SecurityConfiguration.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.SecurityConfiguration.property.key"></a>

```typescript
public readonly key: Key;
```

- *Type:* aws-cdk-lib.aws_kms.Key

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.SecurityConfiguration.property.resource"></a>

```typescript
public readonly resource: CfnSecurityConfiguration;
```

- *Type:* aws-cdk-lib.aws_glue.CfnSecurityConfiguration

---

##### `securityConfigurationName`<sup>Required</sup> <a name="securityConfigurationName" id="cdk-extensions.glue.SecurityConfiguration.property.securityConfigurationName"></a>

```typescript
public readonly securityConfigurationName: string;
```

- *Type:* string

---

##### `cloudWatchEncryption`<sup>Optional</sup> <a name="cloudWatchEncryption" id="cdk-extensions.glue.SecurityConfiguration.property.cloudWatchEncryption"></a>

```typescript
public readonly cloudWatchEncryption: CloudWatchEncryption;
```

- *Type:* cdk-extensions.glue.CloudWatchEncryption

---

##### `jobBookmarksEncryption`<sup>Optional</sup> <a name="jobBookmarksEncryption" id="cdk-extensions.glue.SecurityConfiguration.property.jobBookmarksEncryption"></a>

```typescript
public readonly jobBookmarksEncryption: JobBookmarksEncryption;
```

- *Type:* cdk-extensions.glue.JobBookmarksEncryption

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.SecurityConfiguration.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `s3Encryption`<sup>Optional</sup> <a name="s3Encryption" id="cdk-extensions.glue.SecurityConfiguration.property.s3Encryption"></a>

```typescript
public readonly s3Encryption: S3Encryption;
```

- *Type:* cdk-extensions.glue.S3Encryption

---


### Table <a name="Table" id="cdk-extensions.glue.Table"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Table.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Table(scope: Construct, id: string, props: TableProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Table.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | A CDK Construct that will serve as this stack's parent in the construct tree. |
| <code><a href="#cdk-extensions.glue.Table.Initializer.parameter.id">id</a></code> | <code>string</code> | A name to be associated with the stack and used in resource naming. |
| <code><a href="#cdk-extensions.glue.Table.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.TableProps</code> | Arguments related to the configuration of the resource. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Table.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

A CDK Construct that will serve as this stack's parent in the construct tree.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Table.Initializer.parameter.id"></a>

- *Type:* string

A name to be associated with the stack and used in resource naming.

Must be unique
within the context of 'scope'.

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Table.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.TableProps

Arguments related to the configuration of the resource.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Table.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Table.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Table.addColumn">addColumn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.addParameter">addParameter</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.addPartitionKey">addPartitionKey</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.addSerdeParameter">addSerdeParameter</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.addStorageParameter">addStorageParameter</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Table.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Table.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Table.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addColumn` <a name="addColumn" id="cdk-extensions.glue.Table.addColumn"></a>

```typescript
public addColumn(column: Column): void
```

###### `column`<sup>Required</sup> <a name="column" id="cdk-extensions.glue.Table.addColumn.parameter.column"></a>

- *Type:* cdk-extensions.glue.Column

---

##### `addParameter` <a name="addParameter" id="cdk-extensions.glue.Table.addParameter"></a>

```typescript
public addParameter(key: string, value: string): void
```

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Table.addParameter.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Table.addParameter.parameter.value"></a>

- *Type:* string

---

##### `addPartitionKey` <a name="addPartitionKey" id="cdk-extensions.glue.Table.addPartitionKey"></a>

```typescript
public addPartitionKey(column: Column): void
```

###### `column`<sup>Required</sup> <a name="column" id="cdk-extensions.glue.Table.addPartitionKey.parameter.column"></a>

- *Type:* cdk-extensions.glue.Column

---

##### `addSerdeParameter` <a name="addSerdeParameter" id="cdk-extensions.glue.Table.addSerdeParameter"></a>

```typescript
public addSerdeParameter(key: string, value: string): void
```

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Table.addSerdeParameter.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Table.addSerdeParameter.parameter.value"></a>

- *Type:* string

---

##### `addStorageParameter` <a name="addStorageParameter" id="cdk-extensions.glue.Table.addStorageParameter"></a>

```typescript
public addStorageParameter(key: string, value: string): void
```

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Table.addStorageParameter.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.Table.addStorageParameter.parameter.value"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Table.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Table.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Table.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Table.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Table.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Table.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Table.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Table.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Table.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Table.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Table.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Table.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Table.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Table.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Table.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Table.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnTable</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.tableArn">tableArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.tableName">tableName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.compressed">compressed</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.dataFormat">dataFormat</a></code> | <code>cdk-extensions.glue.DataFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.location">location</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.owner">owner</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.retention">retention</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.serdeName">serdeName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.storedAsSubDirectories">storedAsSubDirectories</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.tableType">tableType</a></code> | <code>cdk-extensions.glue.TableType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.targetTable">targetTable</a></code> | <code>cdk-extensions.glue.Table</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.viewExpandedText">viewExpandedText</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Table.property.viewOriginalText">viewOriginalText</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Table.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Table.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Table.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.glue.Table.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Table.property.resource"></a>

```typescript
public readonly resource: CfnTable;
```

- *Type:* aws-cdk-lib.aws_glue.CfnTable

---

##### `tableArn`<sup>Required</sup> <a name="tableArn" id="cdk-extensions.glue.Table.property.tableArn"></a>

```typescript
public readonly tableArn: string;
```

- *Type:* string

---

##### `tableName`<sup>Required</sup> <a name="tableName" id="cdk-extensions.glue.Table.property.tableName"></a>

```typescript
public readonly tableName: string;
```

- *Type:* string

---

##### `compressed`<sup>Optional</sup> <a name="compressed" id="cdk-extensions.glue.Table.property.compressed"></a>

```typescript
public readonly compressed: boolean;
```

- *Type:* boolean

---

##### `dataFormat`<sup>Optional</sup> <a name="dataFormat" id="cdk-extensions.glue.Table.property.dataFormat"></a>

```typescript
public readonly dataFormat: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Table.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `location`<sup>Optional</sup> <a name="location" id="cdk-extensions.glue.Table.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Table.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `owner`<sup>Optional</sup> <a name="owner" id="cdk-extensions.glue.Table.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

---

##### `retention`<sup>Optional</sup> <a name="retention" id="cdk-extensions.glue.Table.property.retention"></a>

```typescript
public readonly retention: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `serdeName`<sup>Optional</sup> <a name="serdeName" id="cdk-extensions.glue.Table.property.serdeName"></a>

```typescript
public readonly serdeName: string;
```

- *Type:* string

---

##### `storedAsSubDirectories`<sup>Optional</sup> <a name="storedAsSubDirectories" id="cdk-extensions.glue.Table.property.storedAsSubDirectories"></a>

```typescript
public readonly storedAsSubDirectories: boolean;
```

- *Type:* boolean

---

##### `tableType`<sup>Optional</sup> <a name="tableType" id="cdk-extensions.glue.Table.property.tableType"></a>

```typescript
public readonly tableType: TableType;
```

- *Type:* cdk-extensions.glue.TableType

---

##### `targetTable`<sup>Optional</sup> <a name="targetTable" id="cdk-extensions.glue.Table.property.targetTable"></a>

```typescript
public readonly targetTable: Table;
```

- *Type:* cdk-extensions.glue.Table

---

##### `viewExpandedText`<sup>Optional</sup> <a name="viewExpandedText" id="cdk-extensions.glue.Table.property.viewExpandedText"></a>

```typescript
public readonly viewExpandedText: string;
```

- *Type:* string

---

##### `viewOriginalText`<sup>Optional</sup> <a name="viewOriginalText" id="cdk-extensions.glue.Table.property.viewOriginalText"></a>

```typescript
public readonly viewOriginalText: string;
```

- *Type:* string

---


### Trigger <a name="Trigger" id="cdk-extensions.glue.Trigger"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Trigger.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Trigger(scope: Construct, id: string, props: TriggerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Trigger.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.TriggerProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Trigger.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Trigger.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Trigger.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.TriggerProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Trigger.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Trigger.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Trigger.addAction">addAction</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.addPredicate">addPredicate</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Trigger.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Trigger.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Trigger.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAction` <a name="addAction" id="cdk-extensions.glue.Trigger.addAction"></a>

```typescript
public addAction(action: ITriggerAction): Trigger
```

###### `action`<sup>Required</sup> <a name="action" id="cdk-extensions.glue.Trigger.addAction.parameter.action"></a>

- *Type:* cdk-extensions.glue.ITriggerAction

---

##### `addPredicate` <a name="addPredicate" id="cdk-extensions.glue.Trigger.addPredicate"></a>

```typescript
public addPredicate(predicate: ITriggerPredicate): Trigger
```

###### `predicate`<sup>Required</sup> <a name="predicate" id="cdk-extensions.glue.Trigger.addPredicate.parameter.predicate"></a>

- *Type:* cdk-extensions.glue.ITriggerPredicate

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Trigger.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Trigger.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Trigger.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Trigger.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Trigger.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Trigger.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Trigger.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Trigger.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Trigger.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Trigger.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Trigger.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Trigger.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Trigger.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Trigger.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Trigger.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Trigger.property.predicateOperator">predicateOperator</a></code> | <code>cdk-extensions.glue.PredicateOperator</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnTrigger</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.type">type</a></code> | <code>cdk-extensions.glue.TriggerType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.workflowArn">workflowArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.workflowName">workflowName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.startOnCreation">startOnCreation</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Trigger.property.workflow">workflow</a></code> | <code>cdk-extensions.glue.Workflow</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Trigger.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Trigger.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Trigger.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `predicateOperator`<sup>Required</sup> <a name="predicateOperator" id="cdk-extensions.glue.Trigger.property.predicateOperator"></a>

```typescript
public readonly predicateOperator: PredicateOperator;
```

- *Type:* cdk-extensions.glue.PredicateOperator

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Trigger.property.resource"></a>

```typescript
public readonly resource: CfnTrigger;
```

- *Type:* aws-cdk-lib.aws_glue.CfnTrigger

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.glue.Trigger.property.type"></a>

```typescript
public readonly type: TriggerType;
```

- *Type:* cdk-extensions.glue.TriggerType

---

##### `workflowArn`<sup>Required</sup> <a name="workflowArn" id="cdk-extensions.glue.Trigger.property.workflowArn"></a>

```typescript
public readonly workflowArn: string;
```

- *Type:* string

---

##### `workflowName`<sup>Required</sup> <a name="workflowName" id="cdk-extensions.glue.Trigger.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Trigger.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Trigger.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cdk-extensions.glue.Trigger.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `startOnCreation`<sup>Optional</sup> <a name="startOnCreation" id="cdk-extensions.glue.Trigger.property.startOnCreation"></a>

```typescript
public readonly startOnCreation: boolean;
```

- *Type:* boolean

---

##### `workflow`<sup>Optional</sup> <a name="workflow" id="cdk-extensions.glue.Trigger.property.workflow"></a>

```typescript
public readonly workflow: Workflow;
```

- *Type:* cdk-extensions.glue.Workflow

---


### UserBase <a name="UserBase" id="cdk-extensions.sso.UserBase"></a>

- *Implements:* cdk-extensions.sso.IUser, cdk-extensions.sso.IIdentityCenterPrincipal

#### Initializers <a name="Initializers" id="cdk-extensions.sso.UserBase.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.UserBase(scope: IConstruct, id: string, props?: ResourceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.UserBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.UserBase.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.UserBase.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.ResourceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.UserBase.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.UserBase.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.sso.UserBase.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.ResourceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.UserBase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.sso.UserBase.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |

---

##### `toString` <a name="toString" id="cdk-extensions.sso.UserBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.sso.UserBase.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.UserBase.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.UserBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.sso.UserBase.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.sso.UserBase.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.sso.UserBase.isConstruct"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.UserBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.sso.UserBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.sso.UserBase.isOwnedResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.UserBase.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.UserBase.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.sso.UserBase.isResource"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.UserBase.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.sso.UserBase.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.UserBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.sso.UserBase.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.sso.UserBase.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.sso.UserBase.property.principalId">principalId</a></code> | <code>string</code> | The unique ID that identifies the entity withing IAM Identity Center. |
| <code><a href="#cdk-extensions.sso.UserBase.property.principalType">principalType</a></code> | <code>cdk-extensions.sso.IdentityCenterPrincipalType</code> | The type of entity being represented. |
| <code><a href="#cdk-extensions.sso.UserBase.property.userId">userId</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.sso.UserBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.sso.UserBase.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.sso.UserBase.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `principalId`<sup>Required</sup> <a name="principalId" id="cdk-extensions.sso.UserBase.property.principalId"></a>

```typescript
public readonly principalId: string;
```

- *Type:* string

The unique ID that identifies the entity withing IAM Identity Center.

---

##### `principalType`<sup>Required</sup> <a name="principalType" id="cdk-extensions.sso.UserBase.property.principalType"></a>

```typescript
public readonly principalType: IdentityCenterPrincipalType;
```

- *Type:* cdk-extensions.sso.IdentityCenterPrincipalType

The type of entity being represented.

---

##### `userId`<sup>Required</sup> <a name="userId" id="cdk-extensions.sso.UserBase.property.userId"></a>

```typescript
public readonly userId: string;
```

- *Type:* string

---


### Workflow <a name="Workflow" id="cdk-extensions.glue.Workflow"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Workflow.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Workflow(scope: Construct, id: string, props: WorkflowProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Workflow.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.WorkflowProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Workflow.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Workflow.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Workflow.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.WorkflowProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Workflow.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-extensions.glue.Workflow.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-extensions.glue.Workflow.addTrigger">addTrigger</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk-extensions.glue.Workflow.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-extensions.glue.Workflow.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.glue.Workflow.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addTrigger` <a name="addTrigger" id="cdk-extensions.glue.Workflow.addTrigger"></a>

```typescript
public addTrigger(id: string, options: TriggerOptions): Trigger
```

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.glue.Workflow.addTrigger.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.glue.Workflow.addTrigger.parameter.options"></a>

- *Type:* cdk-extensions.glue.TriggerOptions

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Workflow.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-extensions.glue.Workflow.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-extensions.glue.Workflow.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-extensions.glue.Workflow.isConstruct"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Workflow.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-extensions.glue.Workflow.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-extensions.glue.Workflow.isOwnedResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Workflow.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Workflow.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-extensions.glue.Workflow.isResource"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Workflow.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.glue.Workflow.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Workflow.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.glue.Workflow.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.glue.Workflow.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.glue.Workflow.property.resource">resource</a></code> | <code>aws-cdk-lib.aws_glue.CfnWorkflow</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.property.workflowArn">workflowArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.property.workflowName">workflowName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Workflow.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.glue.Workflow.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.glue.Workflow.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.glue.Workflow.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `resource`<sup>Required</sup> <a name="resource" id="cdk-extensions.glue.Workflow.property.resource"></a>

```typescript
public readonly resource: CfnWorkflow;
```

- *Type:* aws-cdk-lib.aws_glue.CfnWorkflow

---

##### `workflowArn`<sup>Required</sup> <a name="workflowArn" id="cdk-extensions.glue.Workflow.property.workflowArn"></a>

```typescript
public readonly workflowArn: string;
```

- *Type:* string

---

##### `workflowName`<sup>Required</sup> <a name="workflowName" id="cdk-extensions.glue.Workflow.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.Workflow.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Workflow.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


## Structs <a name="Structs" id="Structs"></a>

### AccessControlAttributeOptions <a name="AccessControlAttributeOptions" id="cdk-extensions.sso.AccessControlAttributeOptions"></a>

Configuration options for adding an ABAC attribute to IAM Identity Center.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.AccessControlAttributeOptions.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const accessControlAttributeOptions: sso.AccessControlAttributeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AccessControlAttributeOptions.property.name">name</a></code> | <code>string</code> | The name of the attribute associated with your identities in your identity source. |
| <code><a href="#cdk-extensions.sso.AccessControlAttributeOptions.property.sources">sources</a></code> | <code>string[]</code> | A list of identity sources to use when mapping a specified attribute to IAM Identity Center. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.AccessControlAttributeOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the attribute associated with your identities in your identity source.

This is used to map a specified attribute in your
identity source with an attribute in IAM Identity Center.

---

##### `sources`<sup>Optional</sup> <a name="sources" id="cdk-extensions.sso.AccessControlAttributeOptions.property.sources"></a>

```typescript
public readonly sources: string[];
```

- *Type:* string[]

A list of identity sources to use when mapping a specified attribute to IAM Identity Center.

---

### AppendDelimiterProcessorOptions <a name="AppendDelimiterProcessorOptions" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const appendDelimiterProcessorOptions: kinesis_firehose.AppendDelimiterProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions.property.delimiter">delimiter</a></code> | <code>string</code> | *No description.* |

---

##### `delimiter`<sup>Required</sup> <a name="delimiter" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions.property.delimiter"></a>

```typescript
public readonly delimiter: string;
```

- *Type:* string

---

### ArrayColumnProps <a name="ArrayColumnProps" id="cdk-extensions.glue.ArrayColumnProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.ArrayColumnProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const arrayColumnProps: glue.ArrayColumnProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ArrayColumnProps.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ArrayColumnProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ArrayColumnProps.property.data">data</a></code> | <code>cdk-extensions.glue.Column</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.ArrayColumnProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.ArrayColumnProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `data`<sup>Required</sup> <a name="data" id="cdk-extensions.glue.ArrayColumnProps.property.data"></a>

```typescript
public readonly data: Column;
```

- *Type:* cdk-extensions.glue.Column

---

### AssignmentProps <a name="AssignmentProps" id="cdk-extensions.sso.AssignmentProps"></a>

Configuration for Assignment resource.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.AssignmentProps.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const assignmentProps: sso.AssignmentProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.permissionSet">permissionSet</a></code> | <code>cdk-extensions.sso.IPermissionSet</code> | The permission set which governs the access being assigned. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.principal">principal</a></code> | <code>cdk-extensions.sso.IIdentityCenterPrincipal</code> | The IAM Identity Center principal you wish to grant permissions to. |
| <code><a href="#cdk-extensions.sso.AssignmentProps.property.target">target</a></code> | <code>cdk-extensions.sso.AssignmentTarget</code> | The resource you wish to grant the {@link principal} entity access to using the permissions defined in the {@link permissionSet}. |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.sso.AssignmentProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.sso.AssignmentProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.sso.AssignmentProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.sso.AssignmentProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.AssignmentProps.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The IAM Identity Center instance under which the operation will be executed.

---

##### `permissionSet`<sup>Required</sup> <a name="permissionSet" id="cdk-extensions.sso.AssignmentProps.property.permissionSet"></a>

```typescript
public readonly permissionSet: IPermissionSet;
```

- *Type:* cdk-extensions.sso.IPermissionSet

The permission set which governs the access being assigned.

The
permission set grants the {@link principal} permissions on
{@link target}.

---

##### `principal`<sup>Required</sup> <a name="principal" id="cdk-extensions.sso.AssignmentProps.property.principal"></a>

```typescript
public readonly principal: IIdentityCenterPrincipal;
```

- *Type:* cdk-extensions.sso.IIdentityCenterPrincipal

The IAM Identity Center principal you wish to grant permissions to.

---

##### `target`<sup>Required</sup> <a name="target" id="cdk-extensions.sso.AssignmentProps.property.target"></a>

```typescript
public readonly target: AssignmentTarget;
```

- *Type:* cdk-extensions.sso.AssignmentTarget

The resource you wish to grant the {@link principal} entity access to using the permissions defined in the {@link permissionSet}.

For example,
an AWS account.

---

### BackupConfigurationOptions <a name="BackupConfigurationOptions" id="cdk-extensions.kinesis_firehose.BackupConfigurationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.BackupConfigurationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const backupConfigurationOptions: kinesis_firehose.BackupConfigurationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfigurationOptions.property.destination">destination</a></code> | <code>cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfigurationOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-extensions.kinesis_firehose.BackupConfigurationOptions.property.destination"></a>

```typescript
public readonly destination: IDeliveryStreamBackupDestination;
```

- *Type:* cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.BackupConfigurationOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

### BackupConfigurationResult <a name="BackupConfigurationResult" id="cdk-extensions.kinesis_firehose.BackupConfigurationResult"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.BackupConfigurationResult.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const backupConfigurationResult: kinesis_firehose.BackupConfigurationResult = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfigurationResult.property.s3BackupConfiguration">s3BackupConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfigurationResult.property.s3BackupMode">s3BackupMode</a></code> | <code>string</code> | *No description.* |

---

##### `s3BackupConfiguration`<sup>Required</sup> <a name="s3BackupConfiguration" id="cdk-extensions.kinesis_firehose.BackupConfigurationResult.property.s3BackupConfiguration"></a>

```typescript
public readonly s3BackupConfiguration: S3DestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty

---

##### `s3BackupMode`<sup>Optional</sup> <a name="s3BackupMode" id="cdk-extensions.kinesis_firehose.BackupConfigurationResult.property.s3BackupMode"></a>

```typescript
public readonly s3BackupMode: string;
```

- *Type:* string

---

### BasicColumnProps <a name="BasicColumnProps" id="cdk-extensions.glue.BasicColumnProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.BasicColumnProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const basicColumnProps: glue.BasicColumnProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.BasicColumnProps.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.BasicColumnProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.BasicColumnProps.property.type">type</a></code> | <code>string</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.BasicColumnProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.BasicColumnProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.glue.BasicColumnProps.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

### BufferingConfigurationOptions <a name="BufferingConfigurationOptions" id="cdk-extensions.kinesis_firehose.BufferingConfigurationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.BufferingConfigurationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const bufferingConfigurationOptions: kinesis_firehose.BufferingConfigurationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfigurationOptions.property.interval">interval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfigurationOptions.property.sizeInMb">sizeInMb</a></code> | <code>number</code> | *No description.* |

---

##### `interval`<sup>Optional</sup> <a name="interval" id="cdk-extensions.kinesis_firehose.BufferingConfigurationOptions.property.interval"></a>

```typescript
public readonly interval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `sizeInMb`<sup>Optional</sup> <a name="sizeInMb" id="cdk-extensions.kinesis_firehose.BufferingConfigurationOptions.property.sizeInMb"></a>

```typescript
public readonly sizeInMb: number;
```

- *Type:* number

---

### CloudWatchEncryption <a name="CloudWatchEncryption" id="cdk-extensions.glue.CloudWatchEncryption"></a>

CloudWatch Logs encryption configuration.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.CloudWatchEncryption.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const cloudWatchEncryption: glue.CloudWatchEncryption = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.CloudWatchEncryption.property.mode">mode</a></code> | <code>cdk-extensions.glue.CloudWatchEncryptionMode</code> | Encryption mode. |
| <code><a href="#cdk-extensions.glue.CloudWatchEncryption.property.kmsKey">kmsKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The KMS key to be used to encrypt the data. |

---

##### `mode`<sup>Required</sup> <a name="mode" id="cdk-extensions.glue.CloudWatchEncryption.property.mode"></a>

```typescript
public readonly mode: CloudWatchEncryptionMode;
```

- *Type:* cdk-extensions.glue.CloudWatchEncryptionMode

Encryption mode.

---

##### `kmsKey`<sup>Optional</sup> <a name="kmsKey" id="cdk-extensions.glue.CloudWatchEncryption.property.kmsKey"></a>

```typescript
public readonly kmsKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey
- *Default:* A key will be created if one is not provided.

The KMS key to be used to encrypt the data.

---

### CloudWatchLoggingConfigurationOptions <a name="CloudWatchLoggingConfigurationOptions" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const cloudWatchLoggingConfigurationOptions: kinesis_firehose.CloudWatchLoggingConfigurationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.logStream">logStream</a></code> | <code>aws-cdk-lib.aws_logs.ILogStream</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

---

##### `logStream`<sup>Optional</sup> <a name="logStream" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions.property.logStream"></a>

```typescript
public readonly logStream: ILogStream;
```

- *Type:* aws-cdk-lib.aws_logs.ILogStream

---

### CodeConfig <a name="CodeConfig" id="cdk-extensions.glue.CodeConfig"></a>

Result of binding `Code` into a `Job`.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.CodeConfig.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const codeConfig: glue.CodeConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.CodeConfig.property.s3Location">s3Location</a></code> | <code>aws-cdk-lib.aws_s3.Location</code> | The location of the code in S3. |

---

##### `s3Location`<sup>Required</sup> <a name="s3Location" id="cdk-extensions.glue.CodeConfig.property.s3Location"></a>

```typescript
public readonly s3Location: Location;
```

- *Type:* aws-cdk-lib.aws_s3.Location

The location of the code in S3.

---

### ColumnProps <a name="ColumnProps" id="cdk-extensions.glue.ColumnProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.ColumnProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const columnProps: glue.ColumnProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ColumnProps.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ColumnProps.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.ColumnProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.ColumnProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

### CommonPartitioningOptions <a name="CommonPartitioningOptions" id="cdk-extensions.kinesis_firehose.CommonPartitioningOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.CommonPartitioningOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const commonPartitioningOptions: kinesis_firehose.CommonPartitioningOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CommonPartitioningOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CommonPartitioningOptions.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.CommonPartitioningOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.CommonPartitioningOptions.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

### ConnectionProps <a name="ConnectionProps" id="cdk-extensions.glue.ConnectionProps"></a>

Configuration for the Glue Workflow resource.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.ConnectionProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const connectionProps: glue.ConnectionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.connectionType">connectionType</a></code> | <code>cdk-extensions.glue.ConnectionType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.properties">properties</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.ConnectionProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.ConnectionProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.ConnectionProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.ConnectionProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `connectionType`<sup>Required</sup> <a name="connectionType" id="cdk-extensions.glue.ConnectionProps.property.connectionType"></a>

```typescript
public readonly connectionType: ConnectionType;
```

- *Type:* cdk-extensions.glue.ConnectionType

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.ConnectionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.ConnectionProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `properties`<sup>Optional</sup> <a name="properties" id="cdk-extensions.glue.ConnectionProps.property.properties"></a>

```typescript
public readonly properties: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="cdk-extensions.glue.ConnectionProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="cdk-extensions.glue.ConnectionProps.property.subnets"></a>

```typescript
public readonly subnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="cdk-extensions.glue.ConnectionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

---

### ContinuousLoggingProps <a name="ContinuousLoggingProps" id="cdk-extensions.glue.ContinuousLoggingProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.ContinuousLoggingProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const continuousLoggingProps: glue.ContinuousLoggingProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ContinuousLoggingProps.property.enabled">enabled</a></code> | <code>boolean</code> | Enable continouous logging. |
| <code><a href="#cdk-extensions.glue.ContinuousLoggingProps.property.conversionPattern">conversionPattern</a></code> | <code>string</code> | Apply the provided conversion pattern. |
| <code><a href="#cdk-extensions.glue.ContinuousLoggingProps.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | Specify a custom CloudWatch log group name. |
| <code><a href="#cdk-extensions.glue.ContinuousLoggingProps.property.logStreamPrefix">logStreamPrefix</a></code> | <code>string</code> | Specify a custom CloudWatch log stream prefix. |
| <code><a href="#cdk-extensions.glue.ContinuousLoggingProps.property.quiet">quiet</a></code> | <code>boolean</code> | Filter out non-useful Apache Spark driver/executor and Apache Hadoop YARN heartbeat log messages. |

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="cdk-extensions.glue.ContinuousLoggingProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

Enable continouous logging.

---

##### `conversionPattern`<sup>Optional</sup> <a name="conversionPattern" id="cdk-extensions.glue.ContinuousLoggingProps.property.conversionPattern"></a>

```typescript
public readonly conversionPattern: string;
```

- *Type:* string
- *Default:* `%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n`

Apply the provided conversion pattern.

This is a Log4j Conversion Pattern to customize driver and executor logs.

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.glue.ContinuousLoggingProps.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup
- *Default:* a log group is created with name `/aws-glue/jobs/logs-v2/`.

Specify a custom CloudWatch log group name.

---

##### `logStreamPrefix`<sup>Optional</sup> <a name="logStreamPrefix" id="cdk-extensions.glue.ContinuousLoggingProps.property.logStreamPrefix"></a>

```typescript
public readonly logStreamPrefix: string;
```

- *Type:* string
- *Default:* the job run ID.

Specify a custom CloudWatch log stream prefix.

---

##### `quiet`<sup>Optional</sup> <a name="quiet" id="cdk-extensions.glue.ContinuousLoggingProps.property.quiet"></a>

```typescript
public readonly quiet: boolean;
```

- *Type:* boolean
- *Default:* true

Filter out non-useful Apache Spark driver/executor and Apache Hadoop YARN heartbeat log messages.

---

### CrawlerConfiguration <a name="CrawlerConfiguration" id="cdk-extensions.glue.CrawlerConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.CrawlerConfiguration.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const crawlerConfiguration: glue.CrawlerConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.CrawlerConfiguration.property.partitionUpdateBehavior">partitionUpdateBehavior</a></code> | <code>cdk-extensions.glue.PartitionUpdateBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerConfiguration.property.tableGroupingPolicy">tableGroupingPolicy</a></code> | <code>cdk-extensions.glue.TableGroupingPolicy</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerConfiguration.property.tableLevel">tableLevel</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerConfiguration.property.tableUpdateBehavior">tableUpdateBehavior</a></code> | <code>cdk-extensions.glue.TableUpdateBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerConfiguration.property.version">version</a></code> | <code>cdk-extensions.glue.ConfigurationVersion</code> | *No description.* |

---

##### `partitionUpdateBehavior`<sup>Optional</sup> <a name="partitionUpdateBehavior" id="cdk-extensions.glue.CrawlerConfiguration.property.partitionUpdateBehavior"></a>

```typescript
public readonly partitionUpdateBehavior: PartitionUpdateBehavior;
```

- *Type:* cdk-extensions.glue.PartitionUpdateBehavior

---

##### `tableGroupingPolicy`<sup>Optional</sup> <a name="tableGroupingPolicy" id="cdk-extensions.glue.CrawlerConfiguration.property.tableGroupingPolicy"></a>

```typescript
public readonly tableGroupingPolicy: TableGroupingPolicy;
```

- *Type:* cdk-extensions.glue.TableGroupingPolicy

---

##### `tableLevel`<sup>Optional</sup> <a name="tableLevel" id="cdk-extensions.glue.CrawlerConfiguration.property.tableLevel"></a>

```typescript
public readonly tableLevel: number;
```

- *Type:* number

---

##### `tableUpdateBehavior`<sup>Optional</sup> <a name="tableUpdateBehavior" id="cdk-extensions.glue.CrawlerConfiguration.property.tableUpdateBehavior"></a>

```typescript
public readonly tableUpdateBehavior: TableUpdateBehavior;
```

- *Type:* cdk-extensions.glue.TableUpdateBehavior

---

##### `version`<sup>Optional</sup> <a name="version" id="cdk-extensions.glue.CrawlerConfiguration.property.version"></a>

```typescript
public readonly version: ConfigurationVersion;
```

- *Type:* cdk-extensions.glue.ConfigurationVersion

---

### CrawlerProps <a name="CrawlerProps" id="cdk-extensions.glue.CrawlerProps"></a>

Configuration for Crawlner.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.CrawlerProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const crawlerProps: glue.CrawlerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.classifiers">classifiers</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.configuration">configuration</a></code> | <code>cdk-extensions.glue.CrawlerConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.deleteBehavior">deleteBehavior</a></code> | <code>cdk-extensions.glue.DeleteBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.recrawlBehavior">recrawlBehavior</a></code> | <code>cdk-extensions.glue.RecrawlBehavior</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.scheduleExpression">scheduleExpression</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.securityConfiguration">securityConfiguration</a></code> | <code>cdk-extensions.glue.SecurityConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.tablePrefix">tablePrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.targets">targets</a></code> | <code>cdk-extensions.glue.ICrawlerTarget[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerProps.property.updateBehavior">updateBehavior</a></code> | <code>cdk-extensions.glue.UpdateBehavior</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.CrawlerProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.CrawlerProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.CrawlerProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.CrawlerProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `classifiers`<sup>Optional</sup> <a name="classifiers" id="cdk-extensions.glue.CrawlerProps.property.classifiers"></a>

```typescript
public readonly classifiers: string[];
```

- *Type:* string[]

---

##### `configuration`<sup>Optional</sup> <a name="configuration" id="cdk-extensions.glue.CrawlerProps.property.configuration"></a>

```typescript
public readonly configuration: CrawlerConfiguration;
```

- *Type:* cdk-extensions.glue.CrawlerConfiguration

---

##### `database`<sup>Optional</sup> <a name="database" id="cdk-extensions.glue.CrawlerProps.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `deleteBehavior`<sup>Optional</sup> <a name="deleteBehavior" id="cdk-extensions.glue.CrawlerProps.property.deleteBehavior"></a>

```typescript
public readonly deleteBehavior: DeleteBehavior;
```

- *Type:* cdk-extensions.glue.DeleteBehavior

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.CrawlerProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.CrawlerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `recrawlBehavior`<sup>Optional</sup> <a name="recrawlBehavior" id="cdk-extensions.glue.CrawlerProps.property.recrawlBehavior"></a>

```typescript
public readonly recrawlBehavior: RecrawlBehavior;
```

- *Type:* cdk-extensions.glue.RecrawlBehavior

---

##### `scheduleExpression`<sup>Optional</sup> <a name="scheduleExpression" id="cdk-extensions.glue.CrawlerProps.property.scheduleExpression"></a>

```typescript
public readonly scheduleExpression: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `securityConfiguration`<sup>Optional</sup> <a name="securityConfiguration" id="cdk-extensions.glue.CrawlerProps.property.securityConfiguration"></a>

```typescript
public readonly securityConfiguration: SecurityConfiguration;
```

- *Type:* cdk-extensions.glue.SecurityConfiguration

---

##### `tablePrefix`<sup>Optional</sup> <a name="tablePrefix" id="cdk-extensions.glue.CrawlerProps.property.tablePrefix"></a>

```typescript
public readonly tablePrefix: string;
```

- *Type:* string

---

##### `targets`<sup>Optional</sup> <a name="targets" id="cdk-extensions.glue.CrawlerProps.property.targets"></a>

```typescript
public readonly targets: ICrawlerTarget[];
```

- *Type:* cdk-extensions.glue.ICrawlerTarget[]

---

##### `updateBehavior`<sup>Optional</sup> <a name="updateBehavior" id="cdk-extensions.glue.CrawlerProps.property.updateBehavior"></a>

```typescript
public readonly updateBehavior: UpdateBehavior;
```

- *Type:* cdk-extensions.glue.UpdateBehavior

---

### CrawlerTargetCollection <a name="CrawlerTargetCollection" id="cdk-extensions.glue.CrawlerTargetCollection"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.CrawlerTargetCollection.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const crawlerTargetCollection: glue.CrawlerTargetCollection = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.CrawlerTargetCollection.property.catalogTargets">catalogTargets</a></code> | <code>aws-cdk-lib.aws_glue.CfnCrawler.CatalogTargetProperty[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerTargetCollection.property.dynamoDbTargets">dynamoDbTargets</a></code> | <code>aws-cdk-lib.aws_glue.CfnCrawler.DynamoDBTargetProperty[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerTargetCollection.property.jdbcTargets">jdbcTargets</a></code> | <code>aws-cdk-lib.aws_glue.CfnCrawler.JdbcTargetProperty[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.CrawlerTargetCollection.property.s3Targets">s3Targets</a></code> | <code>aws-cdk-lib.aws_glue.CfnCrawler.S3TargetProperty[]</code> | *No description.* |

---

##### `catalogTargets`<sup>Optional</sup> <a name="catalogTargets" id="cdk-extensions.glue.CrawlerTargetCollection.property.catalogTargets"></a>

```typescript
public readonly catalogTargets: CatalogTargetProperty[];
```

- *Type:* aws-cdk-lib.aws_glue.CfnCrawler.CatalogTargetProperty[]

---

##### `dynamoDbTargets`<sup>Optional</sup> <a name="dynamoDbTargets" id="cdk-extensions.glue.CrawlerTargetCollection.property.dynamoDbTargets"></a>

```typescript
public readonly dynamoDbTargets: DynamoDBTargetProperty[];
```

- *Type:* aws-cdk-lib.aws_glue.CfnCrawler.DynamoDBTargetProperty[]

---

##### `jdbcTargets`<sup>Optional</sup> <a name="jdbcTargets" id="cdk-extensions.glue.CrawlerTargetCollection.property.jdbcTargets"></a>

```typescript
public readonly jdbcTargets: JdbcTargetProperty[];
```

- *Type:* aws-cdk-lib.aws_glue.CfnCrawler.JdbcTargetProperty[]

---

##### `s3Targets`<sup>Optional</sup> <a name="s3Targets" id="cdk-extensions.glue.CrawlerTargetCollection.property.s3Targets"></a>

```typescript
public readonly s3Targets: S3TargetProperty[];
```

- *Type:* aws-cdk-lib.aws_glue.CfnCrawler.S3TargetProperty[]

---

### CustomProcessorOptions <a name="CustomProcessorOptions" id="cdk-extensions.kinesis_firehose.CustomProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.CustomProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const customProcessorOptions: kinesis_firehose.CustomProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessorOptions.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessorOptions.property.parameters">parameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.CustomProcessorOptions.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="cdk-extensions.kinesis_firehose.CustomProcessorOptions.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### DatabaseProps <a name="DatabaseProps" id="cdk-extensions.glue.DatabaseProps"></a>

Configuration for Database.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.DatabaseProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const databaseProps: glue.DatabaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.locationUri">locationUri</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.DatabaseProps.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.DatabaseProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.DatabaseProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.DatabaseProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.DatabaseProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.DatabaseProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `locationUri`<sup>Optional</sup> <a name="locationUri" id="cdk-extensions.glue.DatabaseProps.property.locationUri"></a>

```typescript
public readonly locationUri: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.DatabaseProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

### DataFormatConversionOptions <a name="DataFormatConversionOptions" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const dataFormatConversionOptions: kinesis_firehose.DataFormatConversionOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.inputFormat">inputFormat</a></code> | <code>cdk-extensions.kinesis_firehose.InputFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.outputFormat">outputFormat</a></code> | <code>cdk-extensions.kinesis_firehose.OutputFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.table">table</a></code> | <code>cdk-extensions.glue.Table</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.catalogId">catalogId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.region">region</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.version">version</a></code> | <code>cdk-extensions.kinesis_firehose.TableVersion</code> | *No description.* |

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `inputFormat`<sup>Required</sup> <a name="inputFormat" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.inputFormat"></a>

```typescript
public readonly inputFormat: InputFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.InputFormat

---

##### `outputFormat`<sup>Required</sup> <a name="outputFormat" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.outputFormat"></a>

```typescript
public readonly outputFormat: OutputFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.OutputFormat

---

##### `table`<sup>Required</sup> <a name="table" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* cdk-extensions.glue.Table

---

##### `catalogId`<sup>Optional</sup> <a name="catalogId" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.catalogId"></a>

```typescript
public readonly catalogId: string;
```

- *Type:* string

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `version`<sup>Optional</sup> <a name="version" id="cdk-extensions.kinesis_firehose.DataFormatConversionOptions.property.version"></a>

```typescript
public readonly version: TableVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.TableVersion

---

### DataFormatProps <a name="DataFormatProps" id="cdk-extensions.glue.DataFormatProps"></a>

Properties of a DataFormat instance.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.DataFormatProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const dataFormatProps: glue.DataFormatProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.DataFormatProps.property.inputFormat">inputFormat</a></code> | <code>cdk-extensions.glue.InputFormat</code> | `InputFormat` for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormatProps.property.outputFormat">outputFormat</a></code> | <code>cdk-extensions.glue.OutputFormat</code> | `OutputFormat` for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormatProps.property.serializationLibrary">serializationLibrary</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | Serialization library for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormatProps.property.classificationString">classificationString</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | Classification string given to tables with this data format. |

---

##### `inputFormat`<sup>Required</sup> <a name="inputFormat" id="cdk-extensions.glue.DataFormatProps.property.inputFormat"></a>

```typescript
public readonly inputFormat: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

`InputFormat` for this data format.

---

##### `outputFormat`<sup>Required</sup> <a name="outputFormat" id="cdk-extensions.glue.DataFormatProps.property.outputFormat"></a>

```typescript
public readonly outputFormat: OutputFormat;
```

- *Type:* cdk-extensions.glue.OutputFormat

`OutputFormat` for this data format.

---

##### `serializationLibrary`<sup>Required</sup> <a name="serializationLibrary" id="cdk-extensions.glue.DataFormatProps.property.serializationLibrary"></a>

```typescript
public readonly serializationLibrary: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

Serialization library for this data format.

---

##### `classificationString`<sup>Optional</sup> <a name="classificationString" id="cdk-extensions.glue.DataFormatProps.property.classificationString"></a>

```typescript
public readonly classificationString: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString
- *Default:* No classification is specified.

Classification string given to tables with this data format.

---

### DelimitedDeaggregationOptions <a name="DelimitedDeaggregationOptions" id="cdk-extensions.kinesis_firehose.DelimitedDeaggregationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DelimitedDeaggregationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const delimitedDeaggregationOptions: kinesis_firehose.DelimitedDeaggregationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DelimitedDeaggregationOptions.property.delimiter">delimiter</a></code> | <code>string</code> | *No description.* |

---

##### `delimiter`<sup>Required</sup> <a name="delimiter" id="cdk-extensions.kinesis_firehose.DelimitedDeaggregationOptions.property.delimiter"></a>

```typescript
public readonly delimiter: string;
```

- *Type:* string

---

### DeliveryStreamAttributes <a name="DeliveryStreamAttributes" id="cdk-extensions.kinesis_firehose.DeliveryStreamAttributes"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const deliveryStreamAttributes: kinesis_firehose.DeliveryStreamAttributes = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.deliveryStreamArn">deliveryStreamArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.deliveryStreamName">deliveryStreamName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |

---

##### `deliveryStreamArn`<sup>Optional</sup> <a name="deliveryStreamArn" id="cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.deliveryStreamArn"></a>

```typescript
public readonly deliveryStreamArn: string;
```

- *Type:* string

---

##### `deliveryStreamName`<sup>Optional</sup> <a name="deliveryStreamName" id="cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.deliveryStreamName"></a>

```typescript
public readonly deliveryStreamName: string;
```

- *Type:* string

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.DeliveryStreamAttributes.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

### DeliveryStreamDestinationConfiguration <a name="DeliveryStreamDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const deliveryStreamDestinationConfiguration: kinesis_firehose.DeliveryStreamDestinationConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.amazonopensearchserviceDestinationConfiguration">amazonopensearchserviceDestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.elasticsearchDestinationConfiguration">elasticsearchDestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.extendedS3DestinationConfiguration">extendedS3DestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.httpEndpointDestinationConfiguration">httpEndpointDestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.redshiftDestinationConfiguration">redshiftDestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.RedshiftDestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.s3DestinationConfiguration">s3DestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.splunkDestinationConfiguration">splunkDestinationConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.SplunkDestinationConfigurationProperty</code> | *No description.* |

---

##### `amazonopensearchserviceDestinationConfiguration`<sup>Optional</sup> <a name="amazonopensearchserviceDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.amazonopensearchserviceDestinationConfiguration"></a>

```typescript
public readonly amazonopensearchserviceDestinationConfiguration: AmazonopensearchserviceDestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty

---

##### `elasticsearchDestinationConfiguration`<sup>Optional</sup> <a name="elasticsearchDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.elasticsearchDestinationConfiguration"></a>

```typescript
public readonly elasticsearchDestinationConfiguration: ElasticsearchDestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty

---

##### `extendedS3DestinationConfiguration`<sup>Optional</sup> <a name="extendedS3DestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.extendedS3DestinationConfiguration"></a>

```typescript
public readonly extendedS3DestinationConfiguration: ExtendedS3DestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty

---

##### `httpEndpointDestinationConfiguration`<sup>Optional</sup> <a name="httpEndpointDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.httpEndpointDestinationConfiguration"></a>

```typescript
public readonly httpEndpointDestinationConfiguration: HttpEndpointDestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty

---

##### `redshiftDestinationConfiguration`<sup>Optional</sup> <a name="redshiftDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.redshiftDestinationConfiguration"></a>

```typescript
public readonly redshiftDestinationConfiguration: RedshiftDestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.RedshiftDestinationConfigurationProperty

---

##### `s3DestinationConfiguration`<sup>Optional</sup> <a name="s3DestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.s3DestinationConfiguration"></a>

```typescript
public readonly s3DestinationConfiguration: S3DestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty

---

##### `splunkDestinationConfiguration`<sup>Optional</sup> <a name="splunkDestinationConfiguration" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestinationConfiguration.property.splunkDestinationConfiguration"></a>

```typescript
public readonly splunkDestinationConfiguration: SplunkDestinationConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.SplunkDestinationConfigurationProperty

---

### DeliveryStreamProcessorOptions <a name="DeliveryStreamProcessorOptions" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const deliveryStreamProcessorOptions: kinesis_firehose.DeliveryStreamProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions.property.parameters">parameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### DeliveryStreamProps <a name="DeliveryStreamProps" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const deliveryStreamProps: kinesis_firehose.DeliveryStreamProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.destination">destination</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamDestination</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.streamType">streamType</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamType</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.destination"></a>

```typescript
public readonly destination: DeliveryStreamDestination;
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamDestination

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `streamType`<sup>Optional</sup> <a name="streamType" id="cdk-extensions.kinesis_firehose.DeliveryStreamProps.property.streamType"></a>

```typescript
public readonly streamType: DeliveryStreamType;
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamType

---

### DynamicPartitioningConfiguration <a name="DynamicPartitioningConfiguration" id="cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const dynamicPartitioningConfiguration: kinesis_firehose.DynamicPartitioningConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration.property.partitioningConfiguration">partitioningConfiguration</a></code> | <code>aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.DynamicPartitioningConfigurationProperty</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration.property.processors">processors</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]</code> | *No description.* |

---

##### `partitioningConfiguration`<sup>Required</sup> <a name="partitioningConfiguration" id="cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration.property.partitioningConfiguration"></a>

```typescript
public readonly partitioningConfiguration: DynamicPartitioningConfigurationProperty;
```

- *Type:* aws-cdk-lib.aws_kinesisfirehose.CfnDeliveryStream.DynamicPartitioningConfigurationProperty

---

##### `processors`<sup>Optional</sup> <a name="processors" id="cdk-extensions.kinesis_firehose.DynamicPartitioningConfiguration.property.processors"></a>

```typescript
public readonly processors: DeliveryStreamProcessor[];
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]

---

### ExtendedS3DestinationOptions <a name="ExtendedS3DestinationOptions" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const extendedS3DestinationOptions: kinesis_firehose.ExtendedS3DestinationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.compressionFormat">compressionFormat</a></code> | <code>cdk-extensions.kinesis_firehose.S3CompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.encryptionEnabled">encryptionEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.encryptionKey">encryptionKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.errorOutputPrefix">errorOutputPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.backupConfiguration">backupConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.BackupConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.dataFormatConversion">dataFormatConversion</a></code> | <code>cdk-extensions.kinesis_firehose.DataFormatConversion</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.dynamicPartitioning">dynamicPartitioning</a></code> | <code>cdk-extensions.kinesis_firehose.DynamicPartitioning</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.processorConfiguration">processorConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorConfiguration</code> | *No description.* |

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `compressionFormat`<sup>Optional</sup> <a name="compressionFormat" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.compressionFormat"></a>

```typescript
public readonly compressionFormat: S3CompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.S3CompressionFormat

---

##### `encryptionEnabled`<sup>Optional</sup> <a name="encryptionEnabled" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.encryptionEnabled"></a>

```typescript
public readonly encryptionEnabled: boolean;
```

- *Type:* boolean

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

---

##### `errorOutputPrefix`<sup>Optional</sup> <a name="errorOutputPrefix" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.errorOutputPrefix"></a>

```typescript
public readonly errorOutputPrefix: string;
```

- *Type:* string

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `backupConfiguration`<sup>Optional</sup> <a name="backupConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.backupConfiguration"></a>

```typescript
public readonly backupConfiguration: BackupConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BackupConfiguration

---

##### `dataFormatConversion`<sup>Optional</sup> <a name="dataFormatConversion" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.dataFormatConversion"></a>

```typescript
public readonly dataFormatConversion: DataFormatConversion;
```

- *Type:* cdk-extensions.kinesis_firehose.DataFormatConversion

---

##### `dynamicPartitioning`<sup>Optional</sup> <a name="dynamicPartitioning" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.dynamicPartitioning"></a>

```typescript
public readonly dynamicPartitioning: DynamicPartitioning;
```

- *Type:* cdk-extensions.kinesis_firehose.DynamicPartitioning

---

##### `processorConfiguration`<sup>Optional</sup> <a name="processorConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions.property.processorConfiguration"></a>

```typescript
public readonly processorConfiguration: ProcessorConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorConfiguration

---

### FlowLogDestinationConfig <a name="FlowLogDestinationConfig" id="cdk-extensions.ec2.FlowLogDestinationConfig"></a>

A configuration object providing the details necessary to set up log delivery to a given destination.

#### Initializer <a name="Initializer" id="cdk-extensions.ec2.FlowLogDestinationConfig.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

const flowLogDestinationConfig: ec2.FlowLogDestinationConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.destinationType">destinationType</a></code> | <code>aws-cdk-lib.aws_ec2.FlowLogDestinationType</code> | The type of destination for the flow log data. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | An S3 bucket where logs should be delivered. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.destinationOptions">destinationOptions</a></code> | <code>{[ key: string ]: any}</code> | Additional options that control the format and behavior of logs delivered to the destination. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | A CloudWatch LogGroup where logs should be delivered. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The ARN of the IAM role that allows Amazon EC2 to publish flow logs in your account. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestinationConfig.property.s3Path">s3Path</a></code> | <code>string</code> | An Amazon Resource Name (ARN) for the S3 destination where log files are to be delivered. |

---

##### `destinationType`<sup>Required</sup> <a name="destinationType" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.destinationType"></a>

```typescript
public readonly destinationType: FlowLogDestinationType;
```

- *Type:* aws-cdk-lib.aws_ec2.FlowLogDestinationType

The type of destination for the flow log data.

> [[FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)]([FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype))

---

##### `bucket`<sup>Optional</sup> <a name="bucket" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

An S3 bucket where logs should be delivered.

> [[FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)]([FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination))

---

##### `destinationOptions`<sup>Optional</sup> <a name="destinationOptions" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.destinationOptions"></a>

```typescript
public readonly destinationOptions: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}

Additional options that control the format and behavior of logs delivered to the destination.

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

A CloudWatch LogGroup where logs should be delivered.

> [[FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)]([FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination))

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

The ARN of the IAM role that allows Amazon EC2 to publish flow logs in your account.

> [[FlowLog DeliverLogsPermissionArn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-deliverlogspermissionarn)]([FlowLog DeliverLogsPermissionArn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-deliverlogspermissionarn))

---

##### `s3Path`<sup>Optional</sup> <a name="s3Path" id="cdk-extensions.ec2.FlowLogDestinationConfig.property.s3Path"></a>

```typescript
public readonly s3Path: string;
```

- *Type:* string

An Amazon Resource Name (ARN) for the S3 destination where log files are to be delivered.

If a custom prefix is being added the ARN should reflect that prefix.

> [[FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)]([FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination))

---

### FlowLogProps <a name="FlowLogProps" id="cdk-extensions.ec2.FlowLogProps"></a>

Configuration for the FlowLog class.

#### Initializer <a name="Initializer" id="cdk-extensions.ec2.FlowLogProps.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

const flowLogProps: ec2.FlowLogProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.resourceType">resourceType</a></code> | <code>aws-cdk-lib.aws_ec2.FlowLogResourceType</code> | Details for the resource from which flow logs will be captured. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.destination">destination</a></code> | <code>cdk-extensions.ec2.FlowLogDestination</code> | The location where flow logs should be delivered. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.format">format</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | The fields to include in the flow log record, in the order in which they should appear. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.maxAggregationInterval">maxAggregationInterval</a></code> | <code>cdk-extensions.ec2.FlowLogAggregationInterval</code> | The maximum interval of time during which a flow of packets is captured and aggregated into a flow log record. |
| <code><a href="#cdk-extensions.ec2.FlowLogProps.property.trafficType">trafficType</a></code> | <code>aws-cdk-lib.aws_ec2.FlowLogTrafficType</code> | The type of traffic to monitor (accepted traffic, rejected traffic, or all traffic). |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.ec2.FlowLogProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.ec2.FlowLogProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.ec2.FlowLogProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.ec2.FlowLogProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `resourceType`<sup>Required</sup> <a name="resourceType" id="cdk-extensions.ec2.FlowLogProps.property.resourceType"></a>

```typescript
public readonly resourceType: FlowLogResourceType;
```

- *Type:* aws-cdk-lib.aws_ec2.FlowLogResourceType

Details for the resource from which flow logs will be captured.

> [[FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype)]([FlowLog ResourceType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-resourcetype))

---

##### `destination`<sup>Optional</sup> <a name="destination" id="cdk-extensions.ec2.FlowLogProps.property.destination"></a>

```typescript
public readonly destination: FlowLogDestination;
```

- *Type:* cdk-extensions.ec2.FlowLogDestination

The location where flow logs should be delivered.

> [[FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype)]([FlowLog LogDestinationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestinationtype))

---

##### `format`<sup>Optional</sup> <a name="format" id="cdk-extensions.ec2.FlowLogProps.property.format"></a>

```typescript
public readonly format: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

The fields to include in the flow log record, in the order in which they should appear.

For a list of available fields, see {@link FlowLogField}.

> [[FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat)]([FlowLog LogFormat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logformat))

---

##### `maxAggregationInterval`<sup>Optional</sup> <a name="maxAggregationInterval" id="cdk-extensions.ec2.FlowLogProps.property.maxAggregationInterval"></a>

```typescript
public readonly maxAggregationInterval: FlowLogAggregationInterval;
```

- *Type:* cdk-extensions.ec2.FlowLogAggregationInterval

The maximum interval of time during which a flow of packets is captured and aggregated into a flow log record.

> [[FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval)]([FlowLog MaxAggregationInterval](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-maxaggregationinterval))

---

##### `trafficType`<sup>Optional</sup> <a name="trafficType" id="cdk-extensions.ec2.FlowLogProps.property.trafficType"></a>

```typescript
public readonly trafficType: FlowLogTrafficType;
```

- *Type:* aws-cdk-lib.aws_ec2.FlowLogTrafficType

The type of traffic to monitor (accepted traffic, rejected traffic, or all traffic).

> [[FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype)]([FlowLog TrafficType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-traffictype))

---

### FlowLogS3Options <a name="FlowLogS3Options" id="cdk-extensions.ec2.FlowLogS3Options"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.ec2.FlowLogS3Options.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

const flowLogS3Options: ec2.FlowLogS3Options = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogS3Options.property.fileFormat">fileFormat</a></code> | <code>cdk-extensions.ec2.FlowLogFileFormat</code> | The file format in which flow logs should be delivered to S3. |
| <code><a href="#cdk-extensions.ec2.FlowLogS3Options.property.hiveCompatiblePartitions">hiveCompatiblePartitions</a></code> | <code>boolean</code> | Controls the format of partitions ("folders") when the flow logs are delivered to S3. |
| <code><a href="#cdk-extensions.ec2.FlowLogS3Options.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | An optional prefix that will be added to the start of all flow log files delivered to the S3 bucket. |
| <code><a href="#cdk-extensions.ec2.FlowLogS3Options.property.perHourPartition">perHourPartition</a></code> | <code>boolean</code> | Indicates whether to partition the flow log per hour. |

---

##### `fileFormat`<sup>Optional</sup> <a name="fileFormat" id="cdk-extensions.ec2.FlowLogS3Options.property.fileFormat"></a>

```typescript
public readonly fileFormat: FlowLogFileFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFileFormat

The file format in which flow logs should be delivered to S3.

> [[Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)]([Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path))

---

##### `hiveCompatiblePartitions`<sup>Optional</sup> <a name="hiveCompatiblePartitions" id="cdk-extensions.ec2.FlowLogS3Options.property.hiveCompatiblePartitions"></a>

```typescript
public readonly hiveCompatiblePartitions: boolean;
```

- *Type:* boolean

Controls the format of partitions ("folders") when the flow logs are delivered to S3.

By default, flow logs are delivered partitioned such that each part of
the S3 path represents a values pertaining to details of the log.

When hive compatible partitions are enabled, partitions will be
structured such that keys declaring the partition name are added at
each level.

An example of standard partitioning:
```
/us-east-1/2020/03/08/log.tar.gz
```

An example with Hive compatible partitions:
```
/region=us-east-1/year=2020/month=03/day=08/log.tar.gz
```

> [[AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/optimize-performance-and-reduce-costs-for-network-analytics-with-vpc-flow-logs-in-apache-parquet-format/)]([AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/optimize-performance-and-reduce-costs-for-network-analytics-with-vpc-flow-logs-in-apache-parquet-format/))

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.ec2.FlowLogS3Options.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

An optional prefix that will be added to the start of all flow log files delivered to the S3 bucket.

> [[FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination)]([FlowLog LogDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2-flowlog-logdestination))

---

##### `perHourPartition`<sup>Optional</sup> <a name="perHourPartition" id="cdk-extensions.ec2.FlowLogS3Options.property.perHourPartition"></a>

```typescript
public readonly perHourPartition: boolean;
```

- *Type:* boolean

Indicates whether to partition the flow log per hour.

By default, flow logs are partitioned (organized into S3 "folders") by
day.

Setting this to true will add an extra layer of directories splitting
flow log files by the hour in which they were delivered.

> [[Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)]([Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path))

---

### HiveJsonInputSerDeOptions <a name="HiveJsonInputSerDeOptions" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const hiveJsonInputSerDeOptions: kinesis_firehose.HiveJsonInputSerDeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions.property.timestampFormats">timestampFormats</a></code> | <code>string[]</code> | *No description.* |

---

##### `timestampFormats`<sup>Optional</sup> <a name="timestampFormats" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions.property.timestampFormats"></a>

```typescript
public readonly timestampFormats: string[];
```

- *Type:* string[]

---

### HttpEndpointDestinationOptions <a name="HttpEndpointDestinationOptions" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const httpEndpointDestinationOptions: kinesis_firehose.HttpEndpointDestinationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.accessKey">accessKey</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.backupConfiguration">backupConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.BackupConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.commonAttributes">commonAttributes</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.contentEncoding">contentEncoding</a></code> | <code>cdk-extensions.kinesis_firehose.ContentEncoding</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.endpointName">endpointName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.processorConfiguration">processorConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.retryDuration">retryDuration</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `accessKey`<sup>Optional</sup> <a name="accessKey" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.accessKey"></a>

```typescript
public readonly accessKey: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

---

##### `backupConfiguration`<sup>Optional</sup> <a name="backupConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.backupConfiguration"></a>

```typescript
public readonly backupConfiguration: BackupConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BackupConfiguration

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `commonAttributes`<sup>Optional</sup> <a name="commonAttributes" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.commonAttributes"></a>

```typescript
public readonly commonAttributes: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `contentEncoding`<sup>Optional</sup> <a name="contentEncoding" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.contentEncoding"></a>

```typescript
public readonly contentEncoding: ContentEncoding;
```

- *Type:* cdk-extensions.kinesis_firehose.ContentEncoding

---

##### `endpointName`<sup>Optional</sup> <a name="endpointName" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.endpointName"></a>

```typescript
public readonly endpointName: string;
```

- *Type:* string

---

##### `processorConfiguration`<sup>Optional</sup> <a name="processorConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.processorConfiguration"></a>

```typescript
public readonly processorConfiguration: ProcessorConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorConfiguration

---

##### `retryDuration`<sup>Optional</sup> <a name="retryDuration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions.property.retryDuration"></a>

```typescript
public readonly retryDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

### InstanceAccessControlAttributeConfigurationProps <a name="InstanceAccessControlAttributeConfigurationProps" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps"></a>

Configuration for InstanceAccessControlAttributeConfiguration resource.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const instanceAccessControlAttributeConfigurationProps: sso.InstanceAccessControlAttributeConfigurationProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The ARN of the IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.attributeMapping">attributeMapping</a></code> | <code>{[ key: string ]: string[]}</code> | Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance. |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The ARN of the IAM Identity Center instance under which the operation will be executed.

---

##### `attributeMapping`<sup>Optional</sup> <a name="attributeMapping" id="cdk-extensions.sso.InstanceAccessControlAttributeConfigurationProps.property.attributeMapping"></a>

```typescript
public readonly attributeMapping: {[ key: string ]: string[]};
```

- *Type:* {[ key: string ]: string[]}

Lists the attributes that are configured for ABAC in the specified IAM Identity Center instance.

---

### JdbcTargetOptions <a name="JdbcTargetOptions" id="cdk-extensions.glue.JdbcTargetOptions"></a>

Configuration for Crawler JDBC target.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.JdbcTargetOptions.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const jdbcTargetOptions: glue.JdbcTargetOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JdbcTargetOptions.property.exclusions">exclusions</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JdbcTargetOptions.property.paths">paths</a></code> | <code>string[]</code> | *No description.* |

---

##### `exclusions`<sup>Optional</sup> <a name="exclusions" id="cdk-extensions.glue.JdbcTargetOptions.property.exclusions"></a>

```typescript
public readonly exclusions: string[];
```

- *Type:* string[]

---

##### `paths`<sup>Optional</sup> <a name="paths" id="cdk-extensions.glue.JdbcTargetOptions.property.paths"></a>

```typescript
public readonly paths: string[];
```

- *Type:* string[]

---

### JobBookmarksEncryption <a name="JobBookmarksEncryption" id="cdk-extensions.glue.JobBookmarksEncryption"></a>

Job bookmarks encryption configuration.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.JobBookmarksEncryption.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const jobBookmarksEncryption: glue.JobBookmarksEncryption = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JobBookmarksEncryption.property.mode">mode</a></code> | <code>cdk-extensions.glue.JobBookmarksEncryptionMode</code> | Encryption mode. |
| <code><a href="#cdk-extensions.glue.JobBookmarksEncryption.property.kmsKey">kmsKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The KMS key to be used to encrypt the data. |

---

##### `mode`<sup>Required</sup> <a name="mode" id="cdk-extensions.glue.JobBookmarksEncryption.property.mode"></a>

```typescript
public readonly mode: JobBookmarksEncryptionMode;
```

- *Type:* cdk-extensions.glue.JobBookmarksEncryptionMode

Encryption mode.

---

##### `kmsKey`<sup>Optional</sup> <a name="kmsKey" id="cdk-extensions.glue.JobBookmarksEncryption.property.kmsKey"></a>

```typescript
public readonly kmsKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey
- *Default:* A key will be created if one is not provided.

The KMS key to be used to encrypt the data.

---

### JobExecutableConfig <a name="JobExecutableConfig" id="cdk-extensions.glue.JobExecutableConfig"></a>

Result of binding a `JobExecutable` into a `Job`.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.JobExecutableConfig.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const jobExecutableConfig: glue.JobExecutableConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.glueVersion">glueVersion</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.language">language</a></code> | <code>cdk-extensions.glue.JobLanguage</code> | The language of the job (Scala or Python). |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.script">script</a></code> | <code>cdk-extensions.glue.Code</code> | The script that is executed by a job. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.type">type</a></code> | <code>cdk-extensions.glue.JobType</code> | Specify the type of the job whether it's an Apache Spark ETL or streaming one or if it's a Python shell job. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.className">className</a></code> | <code>string</code> | The Scala class that serves as the entry point for the job. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.extraFiles">extraFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.extraJars">extraJars</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.extraJarsFirst">extraJarsFirst</a></code> | <code>boolean</code> | Setting this value to true prioritizes the customer's extra JAR files in the classpath. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.extraPythonFiles">extraPythonFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Python files that AWS Glue adds to the Python path before executing your script. |
| <code><a href="#cdk-extensions.glue.JobExecutableConfig.property.pythonVersion">pythonVersion</a></code> | <code>cdk-extensions.glue.PythonVersion</code> | The Python version to use. |

---

##### `glueVersion`<sup>Required</sup> <a name="glueVersion" id="cdk-extensions.glue.JobExecutableConfig.property.glueVersion"></a>

```typescript
public readonly glueVersion: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version.

> [https://docs.aws.amazon.com/glue/latest/dg/release-notes.html](https://docs.aws.amazon.com/glue/latest/dg/release-notes.html)

---

##### `language`<sup>Required</sup> <a name="language" id="cdk-extensions.glue.JobExecutableConfig.property.language"></a>

```typescript
public readonly language: JobLanguage;
```

- *Type:* cdk-extensions.glue.JobLanguage

The language of the job (Scala or Python).

> [`--job-language` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--job-language` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `script`<sup>Required</sup> <a name="script" id="cdk-extensions.glue.JobExecutableConfig.property.script"></a>

```typescript
public readonly script: Code;
```

- *Type:* cdk-extensions.glue.Code

The script that is executed by a job.

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.glue.JobExecutableConfig.property.type"></a>

```typescript
public readonly type: JobType;
```

- *Type:* cdk-extensions.glue.JobType

Specify the type of the job whether it's an Apache Spark ETL or streaming one or if it's a Python shell job.

---

##### `className`<sup>Optional</sup> <a name="className" id="cdk-extensions.glue.JobExecutableConfig.property.className"></a>

```typescript
public readonly className: string;
```

- *Type:* string
- *Default:* no scala className specified

The Scala class that serves as the entry point for the job.

This applies only if your the job langauage is Scala.

> [`--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraFiles`<sup>Optional</sup> <a name="extraFiles" id="cdk-extensions.glue.JobExecutableConfig.property.extraFiles"></a>

```typescript
public readonly extraFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* no extra files specified.

Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.

> [`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJars`<sup>Optional</sup> <a name="extraJars" id="cdk-extensions.glue.JobExecutableConfig.property.extraJars"></a>

```typescript
public readonly extraJars: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* no extra jars specified.

Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script.

> [`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJarsFirst`<sup>Optional</sup> <a name="extraJarsFirst" id="cdk-extensions.glue.JobExecutableConfig.property.extraJarsFirst"></a>

```typescript
public readonly extraJarsFirst: boolean;
```

- *Type:* boolean
- *Default:* extra jars are not prioritized.

Setting this value to true prioritizes the customer's extra JAR files in the classpath.

> [`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraPythonFiles`<sup>Optional</sup> <a name="extraPythonFiles" id="cdk-extensions.glue.JobExecutableConfig.property.extraPythonFiles"></a>

```typescript
public readonly extraPythonFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* no extra python files specified.

Additional Python files that AWS Glue adds to the Python path before executing your script.

> [`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `pythonVersion`<sup>Optional</sup> <a name="pythonVersion" id="cdk-extensions.glue.JobExecutableConfig.property.pythonVersion"></a>

```typescript
public readonly pythonVersion: PythonVersion;
```

- *Type:* cdk-extensions.glue.PythonVersion
- *Default:* no python version specified

The Python version to use.

---

### JobProps <a name="JobProps" id="cdk-extensions.glue.JobProps"></a>

Configuration for the Glue Job resource.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.JobProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const jobProps: glue.JobProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JobProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.JobProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.JobProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.JobProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.JobProps.property.executable">executable</a></code> | <code>cdk-extensions.glue.JobExecutable</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.allocatedCapacity">allocatedCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.connections">connections</a></code> | <code>cdk-extensions.glue.Connection[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.continuousLogging">continuousLogging</a></code> | <code>cdk-extensions.glue.ContinuousLoggingProps</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.defaultArguments">defaultArguments</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.enableProfilingMetrics">enableProfilingMetrics</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.maxCapacity">maxCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.maxConcurrentRuns">maxConcurrentRuns</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.maxRetries">maxRetries</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.notifyDelayAfter">notifyDelayAfter</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.securityConfiguration">securityConfiguration</a></code> | <code>cdk-extensions.glue.SecurityConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.workerCount">workerCount</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JobProps.property.workerType">workerType</a></code> | <code>cdk-extensions.glue.WorkerType</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.JobProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.JobProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.JobProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.JobProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `executable`<sup>Required</sup> <a name="executable" id="cdk-extensions.glue.JobProps.property.executable"></a>

```typescript
public readonly executable: JobExecutable;
```

- *Type:* cdk-extensions.glue.JobExecutable

---

##### `allocatedCapacity`<sup>Optional</sup> <a name="allocatedCapacity" id="cdk-extensions.glue.JobProps.property.allocatedCapacity"></a>

```typescript
public readonly allocatedCapacity: number;
```

- *Type:* number

---

##### `connections`<sup>Optional</sup> <a name="connections" id="cdk-extensions.glue.JobProps.property.connections"></a>

```typescript
public readonly connections: Connection[];
```

- *Type:* cdk-extensions.glue.Connection[]

---

##### `continuousLogging`<sup>Optional</sup> <a name="continuousLogging" id="cdk-extensions.glue.JobProps.property.continuousLogging"></a>

```typescript
public readonly continuousLogging: ContinuousLoggingProps;
```

- *Type:* cdk-extensions.glue.ContinuousLoggingProps

---

##### `defaultArguments`<sup>Optional</sup> <a name="defaultArguments" id="cdk-extensions.glue.JobProps.property.defaultArguments"></a>

```typescript
public readonly defaultArguments: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.JobProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `enableProfilingMetrics`<sup>Optional</sup> <a name="enableProfilingMetrics" id="cdk-extensions.glue.JobProps.property.enableProfilingMetrics"></a>

```typescript
public readonly enableProfilingMetrics: boolean;
```

- *Type:* boolean

---

##### `maxCapacity`<sup>Optional</sup> <a name="maxCapacity" id="cdk-extensions.glue.JobProps.property.maxCapacity"></a>

```typescript
public readonly maxCapacity: number;
```

- *Type:* number

---

##### `maxConcurrentRuns`<sup>Optional</sup> <a name="maxConcurrentRuns" id="cdk-extensions.glue.JobProps.property.maxConcurrentRuns"></a>

```typescript
public readonly maxConcurrentRuns: number;
```

- *Type:* number

---

##### `maxRetries`<sup>Optional</sup> <a name="maxRetries" id="cdk-extensions.glue.JobProps.property.maxRetries"></a>

```typescript
public readonly maxRetries: number;
```

- *Type:* number

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.JobProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `notifyDelayAfter`<sup>Optional</sup> <a name="notifyDelayAfter" id="cdk-extensions.glue.JobProps.property.notifyDelayAfter"></a>

```typescript
public readonly notifyDelayAfter: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.glue.JobProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `securityConfiguration`<sup>Optional</sup> <a name="securityConfiguration" id="cdk-extensions.glue.JobProps.property.securityConfiguration"></a>

```typescript
public readonly securityConfiguration: SecurityConfiguration;
```

- *Type:* cdk-extensions.glue.SecurityConfiguration

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="cdk-extensions.glue.JobProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `workerCount`<sup>Optional</sup> <a name="workerCount" id="cdk-extensions.glue.JobProps.property.workerCount"></a>

```typescript
public readonly workerCount: number;
```

- *Type:* number

---

##### `workerType`<sup>Optional</sup> <a name="workerType" id="cdk-extensions.glue.JobProps.property.workerType"></a>

```typescript
public readonly workerType: WorkerType;
```

- *Type:* cdk-extensions.glue.WorkerType

---

### JsonPartitioningOptions <a name="JsonPartitioningOptions" id="cdk-extensions.kinesis_firehose.JsonPartitioningOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.JsonPartitioningOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const jsonPartitioningOptions: kinesis_firehose.JsonPartitioningOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.partitions">partitions</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `partitions`<sup>Required</sup> <a name="partitions" id="cdk-extensions.kinesis_firehose.JsonPartitioningOptions.property.partitions"></a>

```typescript
public readonly partitions: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### LambdaPartitioningOptions <a name="LambdaPartitioningOptions" id="cdk-extensions.kinesis_firehose.LambdaPartitioningOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const lambdaPartitioningOptions: kinesis_firehose.LambdaPartitioningOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="cdk-extensions.kinesis_firehose.LambdaPartitioningOptions.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

### LambdaProcessorOptions <a name="LambdaProcessorOptions" id="cdk-extensions.kinesis_firehose.LambdaProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.LambdaProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const lambdaProcessorOptions: kinesis_firehose.LambdaProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaProcessorOptions.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="cdk-extensions.kinesis_firehose.LambdaProcessorOptions.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

### MetadataExtractionProcessorOptions <a name="MetadataExtractionProcessorOptions" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const metadataExtractionProcessorOptions: kinesis_firehose.MetadataExtractionProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions.property.query">query</a></code> | <code>cdk-extensions.kinesis_firehose.MetaDataExtractionQuery</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions.property.engine">engine</a></code> | <code>cdk-extensions.kinesis_firehose.JsonParsingEngine</code> | *No description.* |

---

##### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions.property.query"></a>

```typescript
public readonly query: MetaDataExtractionQuery;
```

- *Type:* cdk-extensions.kinesis_firehose.MetaDataExtractionQuery

---

##### `engine`<sup>Optional</sup> <a name="engine" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions.property.engine"></a>

```typescript
public readonly engine: JsonParsingEngine;
```

- *Type:* cdk-extensions.kinesis_firehose.JsonParsingEngine

---

### NamedQueryProps <a name="NamedQueryProps" id="cdk-extensions.athena.NamedQueryProps"></a>

Configuration for Database.

#### Initializer <a name="Initializer" id="cdk-extensions.athena.NamedQueryProps.Initializer"></a>

```typescript
import { athena } from 'cdk-extensions'

const namedQueryProps: athena.NamedQueryProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | The Glue database to which the query belongs. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.queryString">queryString</a></code> | <code>string</code> | The SQL statements that make up the query. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.description">description</a></code> | <code>string</code> | A human friendly description explaining the functionality of the query. |
| <code><a href="#cdk-extensions.athena.NamedQueryProps.property.name">name</a></code> | <code>string</code> | The name of the query. |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.athena.NamedQueryProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.athena.NamedQueryProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.athena.NamedQueryProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.athena.NamedQueryProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.athena.NamedQueryProps.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

The Glue database to which the query belongs.

> [[NamedQuery Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database)]([NamedQuery Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database))

---

##### `queryString`<sup>Required</sup> <a name="queryString" id="cdk-extensions.athena.NamedQueryProps.property.queryString"></a>

```typescript
public readonly queryString: string;
```

- *Type:* string

The SQL statements that make up the query.

> [[Athena SQL reference](https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html)]([Athena SQL reference](https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html))

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.athena.NamedQueryProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A human friendly description explaining the functionality of the query.

> [[NamedQuery Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description)]([NamedQuery Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description))

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.athena.NamedQueryProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the query.

> [[NamedQuery Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name)]([NamedQuery Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name))

---

### OpenxJsonInputSerDeOptions <a name="OpenxJsonInputSerDeOptions" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const openxJsonInputSerDeOptions: kinesis_firehose.OpenxJsonInputSerDeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.caseInsensitive">caseInsensitive</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.columnKeyMappings">columnKeyMappings</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.convertDotsToUnderscores">convertDotsToUnderscores</a></code> | <code>boolean</code> | *No description.* |

---

##### `caseInsensitive`<sup>Optional</sup> <a name="caseInsensitive" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.caseInsensitive"></a>

```typescript
public readonly caseInsensitive: boolean;
```

- *Type:* boolean

---

##### `columnKeyMappings`<sup>Optional</sup> <a name="columnKeyMappings" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.columnKeyMappings"></a>

```typescript
public readonly columnKeyMappings: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `convertDotsToUnderscores`<sup>Optional</sup> <a name="convertDotsToUnderscores" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions.property.convertDotsToUnderscores"></a>

```typescript
public readonly convertDotsToUnderscores: boolean;
```

- *Type:* boolean

---

### OrcOutputSerDeOptions <a name="OrcOutputSerDeOptions" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const orcOutputSerDeOptions: kinesis_firehose.OrcOutputSerDeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.blockSizeBytes">blockSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.bloomFilterColumns">bloomFilterColumns</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.bloomFilterFalsePositiveProbability">bloomFilterFalsePositiveProbability</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.compression">compression</a></code> | <code>cdk-extensions.kinesis_firehose.OrcCompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.dictionaryKeyThreshold">dictionaryKeyThreshold</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.enablePadding">enablePadding</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.formatVersion">formatVersion</a></code> | <code>cdk-extensions.kinesis_firehose.OrcFormatVersion</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.paddingTolerance">paddingTolerance</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.rowIndexStride">rowIndexStride</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.stripeSizeBytes">stripeSizeBytes</a></code> | <code>number</code> | *No description.* |

---

##### `blockSizeBytes`<sup>Optional</sup> <a name="blockSizeBytes" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.blockSizeBytes"></a>

```typescript
public readonly blockSizeBytes: number;
```

- *Type:* number

---

##### `bloomFilterColumns`<sup>Optional</sup> <a name="bloomFilterColumns" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.bloomFilterColumns"></a>

```typescript
public readonly bloomFilterColumns: string[];
```

- *Type:* string[]

---

##### `bloomFilterFalsePositiveProbability`<sup>Optional</sup> <a name="bloomFilterFalsePositiveProbability" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.bloomFilterFalsePositiveProbability"></a>

```typescript
public readonly bloomFilterFalsePositiveProbability: number;
```

- *Type:* number

---

##### `compression`<sup>Optional</sup> <a name="compression" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.compression"></a>

```typescript
public readonly compression: OrcCompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.OrcCompressionFormat

---

##### `dictionaryKeyThreshold`<sup>Optional</sup> <a name="dictionaryKeyThreshold" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.dictionaryKeyThreshold"></a>

```typescript
public readonly dictionaryKeyThreshold: number;
```

- *Type:* number

---

##### `enablePadding`<sup>Optional</sup> <a name="enablePadding" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.enablePadding"></a>

```typescript
public readonly enablePadding: boolean;
```

- *Type:* boolean

---

##### `formatVersion`<sup>Optional</sup> <a name="formatVersion" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.formatVersion"></a>

```typescript
public readonly formatVersion: OrcFormatVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.OrcFormatVersion

---

##### `paddingTolerance`<sup>Optional</sup> <a name="paddingTolerance" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.paddingTolerance"></a>

```typescript
public readonly paddingTolerance: number;
```

- *Type:* number

---

##### `rowIndexStride`<sup>Optional</sup> <a name="rowIndexStride" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.rowIndexStride"></a>

```typescript
public readonly rowIndexStride: number;
```

- *Type:* number

---

##### `stripeSizeBytes`<sup>Optional</sup> <a name="stripeSizeBytes" id="cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions.property.stripeSizeBytes"></a>

```typescript
public readonly stripeSizeBytes: number;
```

- *Type:* number

---

### ParquetOutputSerDeOptions <a name="ParquetOutputSerDeOptions" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const parquetOutputSerDeOptions: kinesis_firehose.ParquetOutputSerDeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.blockSizeBytes">blockSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.compression">compression</a></code> | <code>cdk-extensions.kinesis_firehose.ParquetCompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.enableDictionaryCompression">enableDictionaryCompression</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.maxPaddingBytes">maxPaddingBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.pageSizeBytes">pageSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.writerVersion">writerVersion</a></code> | <code>cdk-extensions.kinesis_firehose.ParquetWriterVersion</code> | *No description.* |

---

##### `blockSizeBytes`<sup>Optional</sup> <a name="blockSizeBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.blockSizeBytes"></a>

```typescript
public readonly blockSizeBytes: number;
```

- *Type:* number

---

##### `compression`<sup>Optional</sup> <a name="compression" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.compression"></a>

```typescript
public readonly compression: ParquetCompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.ParquetCompressionFormat

---

##### `enableDictionaryCompression`<sup>Optional</sup> <a name="enableDictionaryCompression" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.enableDictionaryCompression"></a>

```typescript
public readonly enableDictionaryCompression: boolean;
```

- *Type:* boolean

---

##### `maxPaddingBytes`<sup>Optional</sup> <a name="maxPaddingBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.maxPaddingBytes"></a>

```typescript
public readonly maxPaddingBytes: number;
```

- *Type:* number

---

##### `pageSizeBytes`<sup>Optional</sup> <a name="pageSizeBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.pageSizeBytes"></a>

```typescript
public readonly pageSizeBytes: number;
```

- *Type:* number

---

##### `writerVersion`<sup>Optional</sup> <a name="writerVersion" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions.property.writerVersion"></a>

```typescript
public readonly writerVersion: ParquetWriterVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.ParquetWriterVersion

---

### PermissionSetProps <a name="PermissionSetProps" id="cdk-extensions.sso.PermissionSetProps"></a>

Configuration for PermissionSet resource.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.PermissionSetProps.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const permissionSetProps: sso.PermissionSetProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.instance">instance</a></code> | <code>cdk-extensions.sso.IInstance</code> | The ARN of the IAM Identity Center instance under which the operation will be executed. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.description">description</a></code> | <code>string</code> | A user friendly description providing details about the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.inlinePolicies">inlinePolicies</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}</code> | Adds inline policy documents that will be embedded in the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.managedPolicies">managedPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | A list of the IAM managed policies that you want to attach to the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.name">name</a></code> | <code>string</code> | The name of the permission set. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>cdk-extensions.sso.PermissionsBoundary</code> | Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.relayState">relayState</a></code> | <code>string</code> | Used to redirect users within the application during the federation authentication process. |
| <code><a href="#cdk-extensions.sso.PermissionSetProps.property.sessionDuration">sessionDuration</a></code> | <code>aws-cdk-lib.Duration</code> | The length of time that the application user sessions are valid for. |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.sso.PermissionSetProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.sso.PermissionSetProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.sso.PermissionSetProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.sso.PermissionSetProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-extensions.sso.PermissionSetProps.property.instance"></a>

```typescript
public readonly instance: IInstance;
```

- *Type:* cdk-extensions.sso.IInstance

The ARN of the IAM Identity Center instance under which the operation will be executed.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.sso.PermissionSetProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A user friendly description providing details about the permission set.

---

##### `inlinePolicies`<sup>Optional</sup> <a name="inlinePolicies" id="cdk-extensions.sso.PermissionSetProps.property.inlinePolicies"></a>

```typescript
public readonly inlinePolicies: {[ key: string ]: PolicyDocument};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_iam.PolicyDocument}

Adds inline policy documents that will be embedded in the permission set.

---

##### `managedPolicies`<sup>Optional</sup> <a name="managedPolicies" id="cdk-extensions.sso.PermissionSetProps.property.managedPolicies"></a>

```typescript
public readonly managedPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]

A list of the IAM managed policies that you want to attach to the permission set.

Managed policies specified here must be AWS managed.
To reference custom managed policies use the {@link PermissionSet.addCustomerManagedPolicy}
method.

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.sso.PermissionSetProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the permission set.

---

##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="cdk-extensions.sso.PermissionSetProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* cdk-extensions.sso.PermissionsBoundary

Specifies the configuration of the AWS managed or customer managed policy that you want to set as a permissions boundary.

Specify either
CustomerManagedPolicyReference to use the name and path of a customer
managed policy, or ManagedPolicyArn to use the ARN of an AWS managed
policy. A permissions boundary represents the maximum permissions that
any policy can grant your role. For more information, see [Permissions
boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for IAM entities in the AWS Identity and Access Management
User Guide.

---

##### `relayState`<sup>Optional</sup> <a name="relayState" id="cdk-extensions.sso.PermissionSetProps.property.relayState"></a>

```typescript
public readonly relayState: string;
```

- *Type:* string

Used to redirect users within the application during the federation authentication process.

For example, you can redirect users to a
specific page that is most applicable to their job after singing in to
an AWS account.

---

##### `sessionDuration`<sup>Optional</sup> <a name="sessionDuration" id="cdk-extensions.sso.PermissionSetProps.property.sessionDuration"></a>

```typescript
public readonly sessionDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration

The length of time that the application user sessions are valid for.

---

### ProcessorConfigurationOptions <a name="ProcessorConfigurationOptions" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const processorConfigurationOptions: kinesis_firehose.ProcessorConfigurationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions.property.processors">processors</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `processors`<sup>Optional</sup> <a name="processors" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions.property.processors"></a>

```typescript
public readonly processors: DeliveryStreamProcessor[];
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]

---

### ProcessorConfigurationResult <a name="ProcessorConfigurationResult" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationResult"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationResult.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const processorConfigurationResult: kinesis_firehose.ProcessorConfigurationResult = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfigurationResult.property.processors">processors</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfigurationResult.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |

---

##### `processors`<sup>Required</sup> <a name="processors" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationResult.property.processors"></a>

```typescript
public readonly processors: DeliveryStreamProcessor[];
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.ProcessorConfigurationResult.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

### PythonShellExecutableProps <a name="PythonShellExecutableProps" id="cdk-extensions.glue.PythonShellExecutableProps"></a>

Props for creating a Python shell job executable.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.PythonShellExecutableProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const pythonShellExecutableProps: glue.PythonShellExecutableProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.PythonShellExecutableProps.property.glueVersion">glueVersion</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version. |
| <code><a href="#cdk-extensions.glue.PythonShellExecutableProps.property.pythonVersion">pythonVersion</a></code> | <code>cdk-extensions.glue.PythonVersion</code> | The Python version to use. |
| <code><a href="#cdk-extensions.glue.PythonShellExecutableProps.property.script">script</a></code> | <code>cdk-extensions.glue.Code</code> | The script that executes a job. |
| <code><a href="#cdk-extensions.glue.PythonShellExecutableProps.property.extraFiles">extraFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it. |
| <code><a href="#cdk-extensions.glue.PythonShellExecutableProps.property.extraPythonFiles">extraPythonFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Python files that AWS Glue adds to the Python path before executing your script. |

---

##### `glueVersion`<sup>Required</sup> <a name="glueVersion" id="cdk-extensions.glue.PythonShellExecutableProps.property.glueVersion"></a>

```typescript
public readonly glueVersion: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version.

> [https://docs.aws.amazon.com/glue/latest/dg/release-notes.html](https://docs.aws.amazon.com/glue/latest/dg/release-notes.html)

---

##### `pythonVersion`<sup>Required</sup> <a name="pythonVersion" id="cdk-extensions.glue.PythonShellExecutableProps.property.pythonVersion"></a>

```typescript
public readonly pythonVersion: PythonVersion;
```

- *Type:* cdk-extensions.glue.PythonVersion

The Python version to use.

---

##### `script`<sup>Required</sup> <a name="script" id="cdk-extensions.glue.PythonShellExecutableProps.property.script"></a>

```typescript
public readonly script: Code;
```

- *Type:* cdk-extensions.glue.Code

The script that executes a job.

---

##### `extraFiles`<sup>Optional</sup> <a name="extraFiles" id="cdk-extensions.glue.PythonShellExecutableProps.property.extraFiles"></a>

```typescript
public readonly extraFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* [] - no extra files are copied to the working directory

Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.

Only individual files are supported, directories are not supported.

> [`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraPythonFiles`<sup>Optional</sup> <a name="extraPythonFiles" id="cdk-extensions.glue.PythonShellExecutableProps.property.extraPythonFiles"></a>

```typescript
public readonly extraPythonFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* no extra python files and argument is not set

Additional Python files that AWS Glue adds to the Python path before executing your script.

Only individual files are supported, directories are not supported.

> [`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

### PythonSparkJobExecutableProps <a name="PythonSparkJobExecutableProps" id="cdk-extensions.glue.PythonSparkJobExecutableProps"></a>

Props for creating a Python Spark (ETL or Streaming) job executable.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.PythonSparkJobExecutableProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const pythonSparkJobExecutableProps: glue.PythonSparkJobExecutableProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.glueVersion">glueVersion</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.pythonVersion">pythonVersion</a></code> | <code>cdk-extensions.glue.PythonVersion</code> | The Python version to use. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.script">script</a></code> | <code>cdk-extensions.glue.Code</code> | The script that executes a job. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraFiles">extraFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraJars">extraJars</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script. Only individual files are supported, directories are not supported. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraJarsFirst">extraJarsFirst</a></code> | <code>boolean</code> | Setting this value to true prioritizes the customer's extra JAR files in the classpath. |
| <code><a href="#cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraPythonFiles">extraPythonFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Python files that AWS Glue adds to the Python path before executing your script. |

---

##### `glueVersion`<sup>Required</sup> <a name="glueVersion" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.glueVersion"></a>

```typescript
public readonly glueVersion: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version.

> [https://docs.aws.amazon.com/glue/latest/dg/release-notes.html](https://docs.aws.amazon.com/glue/latest/dg/release-notes.html)

---

##### `pythonVersion`<sup>Required</sup> <a name="pythonVersion" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.pythonVersion"></a>

```typescript
public readonly pythonVersion: PythonVersion;
```

- *Type:* cdk-extensions.glue.PythonVersion

The Python version to use.

---

##### `script`<sup>Required</sup> <a name="script" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.script"></a>

```typescript
public readonly script: Code;
```

- *Type:* cdk-extensions.glue.Code

The script that executes a job.

---

##### `extraFiles`<sup>Optional</sup> <a name="extraFiles" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraFiles"></a>

```typescript
public readonly extraFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* [] - no extra files are copied to the working directory

Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.

Only individual files are supported, directories are not supported.

> [`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJars`<sup>Optional</sup> <a name="extraJars" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraJars"></a>

```typescript
public readonly extraJars: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* [] - no extra jars are added to the classpath

Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script. Only individual files are supported, directories are not supported.

> [`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJarsFirst`<sup>Optional</sup> <a name="extraJarsFirst" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraJarsFirst"></a>

```typescript
public readonly extraJarsFirst: boolean;
```

- *Type:* boolean
- *Default:* false - priority is not given to user-provided jars

Setting this value to true prioritizes the customer's extra JAR files in the classpath.

> [`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraPythonFiles`<sup>Optional</sup> <a name="extraPythonFiles" id="cdk-extensions.glue.PythonSparkJobExecutableProps.property.extraPythonFiles"></a>

```typescript
public readonly extraPythonFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* no extra python files and argument is not set

Additional Python files that AWS Glue adds to the Python path before executing your script.

Only individual files are supported, directories are not supported.

> [`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-py-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

### RecordDeaggregationProcessorOptions <a name="RecordDeaggregationProcessorOptions" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const recordDeaggregationProcessorOptions: kinesis_firehose.RecordDeaggregationProcessorOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions.property.subRecordType">subRecordType</a></code> | <code>cdk-extensions.kinesis_firehose.SubRecordType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions.property.delimiter">delimiter</a></code> | <code>string</code> | *No description.* |

---

##### `subRecordType`<sup>Required</sup> <a name="subRecordType" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions.property.subRecordType"></a>

```typescript
public readonly subRecordType: SubRecordType;
```

- *Type:* cdk-extensions.kinesis_firehose.SubRecordType

---

##### `delimiter`<sup>Optional</sup> <a name="delimiter" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions.property.delimiter"></a>

```typescript
public readonly delimiter: string;
```

- *Type:* string

---

### ReferencedManagedPolicyProps <a name="ReferencedManagedPolicyProps" id="cdk-extensions.sso.ReferencedManagedPolicyProps"></a>

Represents configuration options when creating a managed policy from a class generated when adding a custom policy reference.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.ReferencedManagedPolicyProps.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const referencedManagedPolicyProps: sso.ReferencedManagedPolicyProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.description">description</a></code> | <code>string</code> | A friendly description of the policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.document">document</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The policy document that you want to use as the content for the new policy. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.groups">groups</a></code> | <code>aws-cdk-lib.aws_iam.IGroup[]</code> | The groups to attach the policy to. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.roles">roles</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | The roles to attach the policy to. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.statements">statements</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | Initial set of permissions to add to this policy document. |
| <code><a href="#cdk-extensions.sso.ReferencedManagedPolicyProps.property.users">users</a></code> | <code>aws-cdk-lib.aws_iam.IUser[]</code> | The users to attach the policy to. |

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A friendly description of the policy.

Typically used to store information about the permissions defined in the
policy. For example, "Grants access to production DynamoDB tables."

The policy description is immutable. After a value is assigned, it
cannot be changed.

---

##### `document`<sup>Optional</sup> <a name="document" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.document"></a>

```typescript
public readonly document: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The policy document that you want to use as the content for the new policy.

---

##### `groups`<sup>Optional</sup> <a name="groups" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.groups"></a>

```typescript
public readonly groups: IGroup[];
```

- *Type:* aws-cdk-lib.aws_iam.IGroup[]

The groups to attach the policy to.

When creating managed policies that will be referenced by IAM identity
center it is possible to associate them with other resources such as
users, groups, and roles. However, this is typically not done as IAM
Identity Center will handle configuring associations in the background.

---

##### `roles`<sup>Optional</sup> <a name="roles" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.roles"></a>

```typescript
public readonly roles: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

The roles to attach the policy to.

When creating managed policies that will be referenced by IAM identity
center it is possible to associate them with other resources such as
users, groups, and roles. However, this is typically not done as IAM
Identity Center will handle configuring associations in the background.

---

##### `statements`<sup>Optional</sup> <a name="statements" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.statements"></a>

```typescript
public readonly statements: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

Initial set of permissions to add to this policy document.

---

##### `users`<sup>Optional</sup> <a name="users" id="cdk-extensions.sso.ReferencedManagedPolicyProps.property.users"></a>

```typescript
public readonly users: IUser[];
```

- *Type:* aws-cdk-lib.aws_iam.IUser[]

The users to attach the policy to.

When creating managed policies that will be referenced by IAM identity
center it is possible to associate them with other resources such as
users, groups, and roles. However, this is typically not done as IAM
Identity Center will handle configuring associations in the background.

---

### ReferenceOptions <a name="ReferenceOptions" id="cdk-extensions.sso.ReferenceOptions"></a>

Configuration options for creating a referenced customer managed policy.

#### Initializer <a name="Initializer" id="cdk-extensions.sso.ReferenceOptions.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

const referenceOptions: sso.ReferenceOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferenceOptions.property.name">name</a></code> | <code>string</code> | The name of the customer managed policy. |
| <code><a href="#cdk-extensions.sso.ReferenceOptions.property.path">path</a></code> | <code>string</code> | The path for the policy. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.ReferenceOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the customer managed policy.

---

##### `path`<sup>Optional</sup> <a name="path" id="cdk-extensions.sso.ReferenceOptions.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string
- *Default:* '/''

The path for the policy.

For more information about paths, see [IAM identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) in the IAM User
Guide.

This parameter is optional. If it is not included, it defaults to a slash (/).

This parameter allows a string of characters consisting of either a
forward slash (/) by itself or a string that must begin and end with
forward slashes. In addition, it can contain any ASCII character from
the ! (`\u0021`) through the DEL character (`\u007F`), including most
punctuation characters, digits, and upper and lowercased letters.

---

### ResourceShareProps <a name="ResourceShareProps" id="cdk-extensions.ram.ResourceShareProps"></a>

Configuration for ResourceShare resource.

#### Initializer <a name="Initializer" id="cdk-extensions.ram.ResourceShareProps.Initializer"></a>

```typescript
import { ram } from 'cdk-extensions'

const resourceShareProps: ram.ResourceShareProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.allowExternalPrincipals">allowExternalPrincipals</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.autoDiscoverAccounts">autoDiscoverAccounts</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.principals">principals</a></code> | <code>cdk-extensions.ram.ISharedPrincipal[]</code> | *No description.* |
| <code><a href="#cdk-extensions.ram.ResourceShareProps.property.resources">resources</a></code> | <code>cdk-extensions.ram.ISharedResource[]</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.ram.ResourceShareProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.ram.ResourceShareProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.ram.ResourceShareProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.ram.ResourceShareProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `allowExternalPrincipals`<sup>Optional</sup> <a name="allowExternalPrincipals" id="cdk-extensions.ram.ResourceShareProps.property.allowExternalPrincipals"></a>

```typescript
public readonly allowExternalPrincipals: boolean;
```

- *Type:* boolean

---

##### `autoDiscoverAccounts`<sup>Optional</sup> <a name="autoDiscoverAccounts" id="cdk-extensions.ram.ResourceShareProps.property.autoDiscoverAccounts"></a>

```typescript
public readonly autoDiscoverAccounts: boolean;
```

- *Type:* boolean

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.ram.ResourceShareProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `principals`<sup>Optional</sup> <a name="principals" id="cdk-extensions.ram.ResourceShareProps.property.principals"></a>

```typescript
public readonly principals: ISharedPrincipal[];
```

- *Type:* cdk-extensions.ram.ISharedPrincipal[]

---

##### `resources`<sup>Optional</sup> <a name="resources" id="cdk-extensions.ram.ResourceShareProps.property.resources"></a>

```typescript
public readonly resources: ISharedResource[];
```

- *Type:* cdk-extensions.ram.ISharedResource[]

---

### S3DestinationOptions <a name="S3DestinationOptions" id="cdk-extensions.kinesis_firehose.S3DestinationOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

const s3DestinationOptions: kinesis_firehose.S3DestinationOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.compressionFormat">compressionFormat</a></code> | <code>cdk-extensions.kinesis_firehose.S3CompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.encryptionEnabled">encryptionEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.encryptionKey">encryptionKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.errorOutputPrefix">errorOutputPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3DestinationOptions.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `compressionFormat`<sup>Optional</sup> <a name="compressionFormat" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.compressionFormat"></a>

```typescript
public readonly compressionFormat: S3CompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.S3CompressionFormat

---

##### `encryptionEnabled`<sup>Optional</sup> <a name="encryptionEnabled" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.encryptionEnabled"></a>

```typescript
public readonly encryptionEnabled: boolean;
```

- *Type:* boolean

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

---

##### `errorOutputPrefix`<sup>Optional</sup> <a name="errorOutputPrefix" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.errorOutputPrefix"></a>

```typescript
public readonly errorOutputPrefix: string;
```

- *Type:* string

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.S3DestinationOptions.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

### S3Encryption <a name="S3Encryption" id="cdk-extensions.glue.S3Encryption"></a>

S3 encryption configuration.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.S3Encryption.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const s3Encryption: glue.S3Encryption = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.S3Encryption.property.mode">mode</a></code> | <code>cdk-extensions.glue.S3EncryptionMode</code> | Encryption mode. |
| <code><a href="#cdk-extensions.glue.S3Encryption.property.kmsKey">kmsKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The KMS key to be used to encrypt the data. |

---

##### `mode`<sup>Required</sup> <a name="mode" id="cdk-extensions.glue.S3Encryption.property.mode"></a>

```typescript
public readonly mode: S3EncryptionMode;
```

- *Type:* cdk-extensions.glue.S3EncryptionMode

Encryption mode.

---

##### `kmsKey`<sup>Optional</sup> <a name="kmsKey" id="cdk-extensions.glue.S3Encryption.property.kmsKey"></a>

```typescript
public readonly kmsKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey
- *Default:* no kms key if mode = S3_MANAGED. A key will be created if one is not provided and mode = KMS.

The KMS key to be used to encrypt the data.

---

### S3TargetOptions <a name="S3TargetOptions" id="cdk-extensions.glue.S3TargetOptions"></a>

Configuration for Crawler S3 target.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.S3TargetOptions.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const s3TargetOptions: glue.S3TargetOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.S3TargetOptions.property.connection">connection</a></code> | <code>cdk-extensions.glue.Connection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3TargetOptions.property.exclusions">exclusions</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3TargetOptions.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3TargetOptions.property.sampleSize">sampleSize</a></code> | <code>string</code> | *No description.* |

---

##### `connection`<sup>Optional</sup> <a name="connection" id="cdk-extensions.glue.S3TargetOptions.property.connection"></a>

```typescript
public readonly connection: Connection;
```

- *Type:* cdk-extensions.glue.Connection

---

##### `exclusions`<sup>Optional</sup> <a name="exclusions" id="cdk-extensions.glue.S3TargetOptions.property.exclusions"></a>

```typescript
public readonly exclusions: string[];
```

- *Type:* string[]

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.glue.S3TargetOptions.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---

##### `sampleSize`<sup>Optional</sup> <a name="sampleSize" id="cdk-extensions.glue.S3TargetOptions.property.sampleSize"></a>

```typescript
public readonly sampleSize: string;
```

- *Type:* string

---

### ScalaJobExecutableProps <a name="ScalaJobExecutableProps" id="cdk-extensions.glue.ScalaJobExecutableProps"></a>

Props for creating a Scala Spark (ETL or Streaming) job executable.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.ScalaJobExecutableProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const scalaJobExecutableProps: glue.ScalaJobExecutableProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.className">className</a></code> | <code>string</code> | The fully qualified Scala class name that serves as the entry point for the job. |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.glueVersion">glueVersion</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version. |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.script">script</a></code> | <code>cdk-extensions.glue.Code</code> | The script that executes a job. |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.extraFiles">extraFiles</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it. |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.extraJars">extraJars</a></code> | <code>cdk-extensions.glue.Code[]</code> | Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script. Only individual files are supported, directories are not supported. |
| <code><a href="#cdk-extensions.glue.ScalaJobExecutableProps.property.extraJarsFirst">extraJarsFirst</a></code> | <code>boolean</code> | Setting this value to true prioritizes the customer's extra JAR files in the classpath. |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.ScalaJobExecutableProps.property.className"></a>

```typescript
public readonly className: string;
```

- *Type:* string

The fully qualified Scala class name that serves as the entry point for the job.

> [`--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--class` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `glueVersion`<sup>Required</sup> <a name="glueVersion" id="cdk-extensions.glue.ScalaJobExecutableProps.property.glueVersion"></a>

```typescript
public readonly glueVersion: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version.

> [https://docs.aws.amazon.com/glue/latest/dg/release-notes.html](https://docs.aws.amazon.com/glue/latest/dg/release-notes.html)

---

##### `script`<sup>Required</sup> <a name="script" id="cdk-extensions.glue.ScalaJobExecutableProps.property.script"></a>

```typescript
public readonly script: Code;
```

- *Type:* cdk-extensions.glue.Code

The script that executes a job.

---

##### `extraFiles`<sup>Optional</sup> <a name="extraFiles" id="cdk-extensions.glue.ScalaJobExecutableProps.property.extraFiles"></a>

```typescript
public readonly extraFiles: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* [] - no extra files are copied to the working directory

Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.

Only individual files are supported, directories are not supported.

> [`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-files` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJars`<sup>Optional</sup> <a name="extraJars" id="cdk-extensions.glue.ScalaJobExecutableProps.property.extraJars"></a>

```typescript
public readonly extraJars: Code[];
```

- *Type:* cdk-extensions.glue.Code[]
- *Default:* [] - no extra jars are added to the classpath

Additional Java .jar files that AWS Glue adds to the Java classpath before executing your script. Only individual files are supported, directories are not supported.

> [`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--extra-jars` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

##### `extraJarsFirst`<sup>Optional</sup> <a name="extraJarsFirst" id="cdk-extensions.glue.ScalaJobExecutableProps.property.extraJarsFirst"></a>

```typescript
public readonly extraJarsFirst: boolean;
```

- *Type:* boolean
- *Default:* false - priority is not given to user-provided jars

Setting this value to true prioritizes the customer's extra JAR files in the classpath.

> [`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html](`--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)

---

### SecurityConfigurationProps <a name="SecurityConfigurationProps" id="cdk-extensions.glue.SecurityConfigurationProps"></a>

Configuration for the Glue SecurityConfiguration resource.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.SecurityConfigurationProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const securityConfigurationProps: glue.SecurityConfigurationProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.cloudWatchEncryption">cloudWatchEncryption</a></code> | <code>cdk-extensions.glue.CloudWatchEncryption</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.jobBookmarksEncryption">jobBookmarksEncryption</a></code> | <code>cdk-extensions.glue.JobBookmarksEncryption</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SecurityConfigurationProps.property.s3Encryption">s3Encryption</a></code> | <code>cdk-extensions.glue.S3Encryption</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.SecurityConfigurationProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.SecurityConfigurationProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.SecurityConfigurationProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.SecurityConfigurationProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `cloudWatchEncryption`<sup>Optional</sup> <a name="cloudWatchEncryption" id="cdk-extensions.glue.SecurityConfigurationProps.property.cloudWatchEncryption"></a>

```typescript
public readonly cloudWatchEncryption: CloudWatchEncryption;
```

- *Type:* cdk-extensions.glue.CloudWatchEncryption

---

##### `jobBookmarksEncryption`<sup>Optional</sup> <a name="jobBookmarksEncryption" id="cdk-extensions.glue.SecurityConfigurationProps.property.jobBookmarksEncryption"></a>

```typescript
public readonly jobBookmarksEncryption: JobBookmarksEncryption;
```

- *Type:* cdk-extensions.glue.JobBookmarksEncryption

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.SecurityConfigurationProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `s3Encryption`<sup>Optional</sup> <a name="s3Encryption" id="cdk-extensions.glue.SecurityConfigurationProps.property.s3Encryption"></a>

```typescript
public readonly s3Encryption: S3Encryption;
```

- *Type:* cdk-extensions.glue.S3Encryption

---

### StructColumnProps <a name="StructColumnProps" id="cdk-extensions.glue.StructColumnProps"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.StructColumnProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const structColumnProps: glue.StructColumnProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.StructColumnProps.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.StructColumnProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.StructColumnProps.property.data">data</a></code> | <code>cdk-extensions.glue.Column[]</code> | *No description.* |

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.StructColumnProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.StructColumnProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `data`<sup>Optional</sup> <a name="data" id="cdk-extensions.glue.StructColumnProps.property.data"></a>

```typescript
public readonly data: Column[];
```

- *Type:* cdk-extensions.glue.Column[]

---

### TableProps <a name="TableProps" id="cdk-extensions.glue.TableProps"></a>

Configuration for Table.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.TableProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const tableProps: glue.TableProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.TableProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TableProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.TableProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.TableProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TableProps.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.columns">columns</a></code> | <code>cdk-extensions.glue.Column[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.compressed">compressed</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.dataFormat">dataFormat</a></code> | <code>cdk-extensions.glue.DataFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.location">location</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.owner">owner</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.parameters">parameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.partitionKeys">partitionKeys</a></code> | <code>cdk-extensions.glue.Column[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.retention">retention</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.serdeName">serdeName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.serdeParameters">serdeParameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.storageParameters">storageParameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.storedAsSubDirectories">storedAsSubDirectories</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.tableType">tableType</a></code> | <code>cdk-extensions.glue.TableType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.targetTable">targetTable</a></code> | <code>cdk-extensions.glue.Table</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.viewExpandedText">viewExpandedText</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableProps.property.viewOriginalText">viewOriginalText</a></code> | <code>string</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.TableProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.TableProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.TableProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.TableProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.glue.TableProps.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `columns`<sup>Optional</sup> <a name="columns" id="cdk-extensions.glue.TableProps.property.columns"></a>

```typescript
public readonly columns: Column[];
```

- *Type:* cdk-extensions.glue.Column[]

---

##### `compressed`<sup>Optional</sup> <a name="compressed" id="cdk-extensions.glue.TableProps.property.compressed"></a>

```typescript
public readonly compressed: boolean;
```

- *Type:* boolean

---

##### `dataFormat`<sup>Optional</sup> <a name="dataFormat" id="cdk-extensions.glue.TableProps.property.dataFormat"></a>

```typescript
public readonly dataFormat: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.TableProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `location`<sup>Optional</sup> <a name="location" id="cdk-extensions.glue.TableProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.TableProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `owner`<sup>Optional</sup> <a name="owner" id="cdk-extensions.glue.TableProps.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="cdk-extensions.glue.TableProps.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `partitionKeys`<sup>Optional</sup> <a name="partitionKeys" id="cdk-extensions.glue.TableProps.property.partitionKeys"></a>

```typescript
public readonly partitionKeys: Column[];
```

- *Type:* cdk-extensions.glue.Column[]

---

##### `retention`<sup>Optional</sup> <a name="retention" id="cdk-extensions.glue.TableProps.property.retention"></a>

```typescript
public readonly retention: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `serdeName`<sup>Optional</sup> <a name="serdeName" id="cdk-extensions.glue.TableProps.property.serdeName"></a>

```typescript
public readonly serdeName: string;
```

- *Type:* string

---

##### `serdeParameters`<sup>Optional</sup> <a name="serdeParameters" id="cdk-extensions.glue.TableProps.property.serdeParameters"></a>

```typescript
public readonly serdeParameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `storageParameters`<sup>Optional</sup> <a name="storageParameters" id="cdk-extensions.glue.TableProps.property.storageParameters"></a>

```typescript
public readonly storageParameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `storedAsSubDirectories`<sup>Optional</sup> <a name="storedAsSubDirectories" id="cdk-extensions.glue.TableProps.property.storedAsSubDirectories"></a>

```typescript
public readonly storedAsSubDirectories: boolean;
```

- *Type:* boolean

---

##### `tableType`<sup>Optional</sup> <a name="tableType" id="cdk-extensions.glue.TableProps.property.tableType"></a>

```typescript
public readonly tableType: TableType;
```

- *Type:* cdk-extensions.glue.TableType

---

##### `targetTable`<sup>Optional</sup> <a name="targetTable" id="cdk-extensions.glue.TableProps.property.targetTable"></a>

```typescript
public readonly targetTable: Table;
```

- *Type:* cdk-extensions.glue.Table

---

##### `viewExpandedText`<sup>Optional</sup> <a name="viewExpandedText" id="cdk-extensions.glue.TableProps.property.viewExpandedText"></a>

```typescript
public readonly viewExpandedText: string;
```

- *Type:* string

---

##### `viewOriginalText`<sup>Optional</sup> <a name="viewOriginalText" id="cdk-extensions.glue.TableProps.property.viewOriginalText"></a>

```typescript
public readonly viewOriginalText: string;
```

- *Type:* string

---

### TriggerOptions <a name="TriggerOptions" id="cdk-extensions.glue.TriggerOptions"></a>

#### Initializer <a name="Initializer" id="cdk-extensions.glue.TriggerOptions.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const triggerOptions: glue.TriggerOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.type">type</a></code> | <code>cdk-extensions.glue.TriggerType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.actions">actions</a></code> | <code>cdk-extensions.glue.ITriggerAction[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.predicateConditions">predicateConditions</a></code> | <code>cdk-extensions.glue.ITriggerPredicate[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.predicateOperator">predicateOperator</a></code> | <code>cdk-extensions.glue.PredicateOperator</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerOptions.property.startOnCreation">startOnCreation</a></code> | <code>boolean</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.TriggerOptions.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.TriggerOptions.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.TriggerOptions.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.TriggerOptions.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.glue.TriggerOptions.property.type"></a>

```typescript
public readonly type: TriggerType;
```

- *Type:* cdk-extensions.glue.TriggerType

---

##### `actions`<sup>Optional</sup> <a name="actions" id="cdk-extensions.glue.TriggerOptions.property.actions"></a>

```typescript
public readonly actions: ITriggerAction[];
```

- *Type:* cdk-extensions.glue.ITriggerAction[]

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.TriggerOptions.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.TriggerOptions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `predicateConditions`<sup>Optional</sup> <a name="predicateConditions" id="cdk-extensions.glue.TriggerOptions.property.predicateConditions"></a>

```typescript
public readonly predicateConditions: ITriggerPredicate[];
```

- *Type:* cdk-extensions.glue.ITriggerPredicate[]

---

##### `predicateOperator`<sup>Optional</sup> <a name="predicateOperator" id="cdk-extensions.glue.TriggerOptions.property.predicateOperator"></a>

```typescript
public readonly predicateOperator: PredicateOperator;
```

- *Type:* cdk-extensions.glue.PredicateOperator

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cdk-extensions.glue.TriggerOptions.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `startOnCreation`<sup>Optional</sup> <a name="startOnCreation" id="cdk-extensions.glue.TriggerOptions.property.startOnCreation"></a>

```typescript
public readonly startOnCreation: boolean;
```

- *Type:* boolean

---

### TriggerProps <a name="TriggerProps" id="cdk-extensions.glue.TriggerProps"></a>

Configuration for the Glue Trigger resource.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.TriggerProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const triggerProps: glue.TriggerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.type">type</a></code> | <code>cdk-extensions.glue.TriggerType</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.actions">actions</a></code> | <code>cdk-extensions.glue.ITriggerAction[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.predicateConditions">predicateConditions</a></code> | <code>cdk-extensions.glue.ITriggerPredicate[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.predicateOperator">predicateOperator</a></code> | <code>cdk-extensions.glue.PredicateOperator</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.startOnCreation">startOnCreation</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerProps.property.workflow">workflow</a></code> | <code>cdk-extensions.glue.Workflow</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.TriggerProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.TriggerProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.TriggerProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.TriggerProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.glue.TriggerProps.property.type"></a>

```typescript
public readonly type: TriggerType;
```

- *Type:* cdk-extensions.glue.TriggerType

---

##### `actions`<sup>Optional</sup> <a name="actions" id="cdk-extensions.glue.TriggerProps.property.actions"></a>

```typescript
public readonly actions: ITriggerAction[];
```

- *Type:* cdk-extensions.glue.ITriggerAction[]

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.TriggerProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.TriggerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `predicateConditions`<sup>Optional</sup> <a name="predicateConditions" id="cdk-extensions.glue.TriggerProps.property.predicateConditions"></a>

```typescript
public readonly predicateConditions: ITriggerPredicate[];
```

- *Type:* cdk-extensions.glue.ITriggerPredicate[]

---

##### `predicateOperator`<sup>Optional</sup> <a name="predicateOperator" id="cdk-extensions.glue.TriggerProps.property.predicateOperator"></a>

```typescript
public readonly predicateOperator: PredicateOperator;
```

- *Type:* cdk-extensions.glue.PredicateOperator

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cdk-extensions.glue.TriggerProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `startOnCreation`<sup>Optional</sup> <a name="startOnCreation" id="cdk-extensions.glue.TriggerProps.property.startOnCreation"></a>

```typescript
public readonly startOnCreation: boolean;
```

- *Type:* boolean

---

##### `workflow`<sup>Optional</sup> <a name="workflow" id="cdk-extensions.glue.TriggerProps.property.workflow"></a>

```typescript
public readonly workflow: Workflow;
```

- *Type:* cdk-extensions.glue.Workflow

---

### WorkflowProps <a name="WorkflowProps" id="cdk-extensions.glue.WorkflowProps"></a>

Configuration for the Glue Workflow resource.

#### Initializer <a name="Initializer" id="cdk-extensions.glue.WorkflowProps.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

const workflowProps: glue.WorkflowProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.WorkflowProps.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-extensions.glue.WorkflowProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-extensions.glue.WorkflowProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-extensions.glue.WorkflowProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
   CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.glue.WorkflowProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-extensions.glue.WorkflowProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.WorkflowProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

## Classes <a name="Classes" id="Classes"></a>

### AccessControlAttribute <a name="AccessControlAttribute" id="cdk-extensions.sso.AccessControlAttribute"></a>

Represents and ABAC attribute in IAM Identity Center.

These are IAM Identity Center identity store attributes that you can
configure for use in attributes-based access control (ABAC). You can create
permissions policies that determine who can access your AWS resources based
upon the configured attribute values. When you enable ABAC and specify
`AccessControlAttributes`, IAM Identity Center passes the attribute values
of the authenticated user into IAM for use in policy evaluation.

#### Initializers <a name="Initializers" id="cdk-extensions.sso.AccessControlAttribute.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.AccessControlAttribute(options: AccessControlAttributeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AccessControlAttribute.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.sso.AccessControlAttributeOptions</code> | The configuration settings to use when configuring the attribute. |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.AccessControlAttribute.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.sso.AccessControlAttributeOptions

The configuration settings to use when configuring the attribute.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.AccessControlAttribute.addSource">addSource</a></code> | Adds an identity source to use when mapping the attribute to IAM Identity Center. |
| <code><a href="#cdk-extensions.sso.AccessControlAttribute.bind">bind</a></code> | Generates the raw CloudFormation configuration that this attribute represents within the context of a given scope. |

---

##### `addSource` <a name="addSource" id="cdk-extensions.sso.AccessControlAttribute.addSource"></a>

```typescript
public addSource(source: string): AccessControlAttribute
```

Adds an identity source to use when mapping the attribute to IAM Identity Center.

###### `source`<sup>Required</sup> <a name="source" id="cdk-extensions.sso.AccessControlAttribute.addSource.parameter.source"></a>

- *Type:* string

The source to add.

---

##### `bind` <a name="bind" id="cdk-extensions.sso.AccessControlAttribute.bind"></a>

```typescript
public bind(scope: IConstruct): AccessControlAttributeProperty
```

Generates the raw CloudFormation configuration that this attribute represents within the context of a given scope.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.AccessControlAttribute.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

The construct managing the access control attribute configuration that will consume details of this attribute.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AccessControlAttribute.property.name">name</a></code> | <code>string</code> | The name of the attribute associated with your identities in your identity source. |
| <code><a href="#cdk-extensions.sso.AccessControlAttribute.property.sources">sources</a></code> | <code>string[]</code> | A list of identity sources to use when mapping a specified attribute to IAM Identity Center. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.AccessControlAttribute.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the attribute associated with your identities in your identity source.

This is used to map a specified attribute in your
identity source with an attribute in IAM Identity Center.

---

##### `sources`<sup>Required</sup> <a name="sources" id="cdk-extensions.sso.AccessControlAttribute.property.sources"></a>

```typescript
public readonly sources: string[];
```

- *Type:* string[]

A list of identity sources to use when mapping a specified attribute to IAM Identity Center.

Note that the array is readonly and changes made
to it will not be reflected when generating ABAC attribute
configuration. To add a source to the attribute use the {@link addSource}
method.

---


### AppendDelimiterProcessor <a name="AppendDelimiterProcessor" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.AppendDelimiterProcessor(options: AppendDelimiterProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.AppendDelimiterProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.property.delimiter">delimiter</a></code> | <code>string</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `delimiter`<sup>Required</sup> <a name="delimiter" id="cdk-extensions.kinesis_firehose.AppendDelimiterProcessor.property.delimiter"></a>

```typescript
public readonly delimiter: string;
```

- *Type:* string

---


### ArrayColumn <a name="ArrayColumn" id="cdk-extensions.glue.ArrayColumn"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.ArrayColumn.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.ArrayColumn(props: ArrayColumnProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ArrayColumn.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.ArrayColumnProps</code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.ArrayColumn.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.ArrayColumnProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ArrayColumn.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.ArrayColumn.bind"></a>

```typescript
public bind(scope: IConstruct): ColumnProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.ArrayColumn.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ArrayColumn.property.typeString">typeString</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ArrayColumn.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ArrayColumn.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `typeString`<sup>Required</sup> <a name="typeString" id="cdk-extensions.glue.ArrayColumn.property.typeString"></a>

```typescript
public readonly typeString: string;
```

- *Type:* string

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.ArrayColumn.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.ArrayColumn.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### AssetCode <a name="AssetCode" id="cdk-extensions.glue.AssetCode"></a>

Job Code from a local file.

#### Initializers <a name="Initializers" id="cdk-extensions.glue.AssetCode.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.AssetCode(path: string, options?: AssetOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.AssetCode.Initializer.parameter.path">path</a></code> | <code>string</code> | The path to the Code file. |
| <code><a href="#cdk-extensions.glue.AssetCode.Initializer.parameter.options">options</a></code> | <code>aws-cdk-lib.AssetOptions</code> | *No description.* |

---

##### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.glue.AssetCode.Initializer.parameter.path"></a>

- *Type:* string

The path to the Code file.

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.glue.AssetCode.Initializer.parameter.options"></a>

- *Type:* aws-cdk-lib.AssetOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.AssetCode.bind">bind</a></code> | Called when the Job is initialized to allow this object to bind. |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.AssetCode.bind"></a>

```typescript
public bind(scope: Construct, grantable: IGrantable): CodeConfig
```

Called when the Job is initialized to allow this object to bind.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.AssetCode.bind.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `grantable`<sup>Required</sup> <a name="grantable" id="cdk-extensions.glue.AssetCode.bind.parameter.grantable"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.AssetCode.fromAsset">fromAsset</a></code> | Job code from a local disk path. |
| <code><a href="#cdk-extensions.glue.AssetCode.fromBucket">fromBucket</a></code> | Job code as an S3 object. |

---

##### `fromAsset` <a name="fromAsset" id="cdk-extensions.glue.AssetCode.fromAsset"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.AssetCode.fromAsset(path: string, options?: AssetOptions)
```

Job code from a local disk path.

###### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.glue.AssetCode.fromAsset.parameter.path"></a>

- *Type:* string

code file (not a directory).

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.glue.AssetCode.fromAsset.parameter.options"></a>

- *Type:* aws-cdk-lib.AssetOptions

---

##### `fromBucket` <a name="fromBucket" id="cdk-extensions.glue.AssetCode.fromBucket"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.AssetCode.fromBucket(bucket: IBucket, key: string)
```

Job code as an S3 object.

###### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.AssetCode.fromBucket.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket.

---

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.AssetCode.fromBucket.parameter.key"></a>

- *Type:* string

The object key.

---



### AssignmentTarget <a name="AssignmentTarget" id="cdk-extensions.sso.AssignmentTarget"></a>

Represents a resource that can have permissions granted for using IAM Identity Center such as an AWS account.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentTarget.awsAccount">awsAccount</a></code> | Creates an assignment target that represents an AWS account. |
| <code><a href="#cdk-extensions.sso.AssignmentTarget.of">of</a></code> | An escape hatch method that allows specifying a custom target for an assignment in the event new target options are added and the provided methods for configuring targets are yet to catch up. |

---

##### `awsAccount` <a name="awsAccount" id="cdk-extensions.sso.AssignmentTarget.awsAccount"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.AssignmentTarget.awsAccount(accountId: string)
```

Creates an assignment target that represents an AWS account.

###### `accountId`<sup>Required</sup> <a name="accountId" id="cdk-extensions.sso.AssignmentTarget.awsAccount.parameter.accountId"></a>

- *Type:* string

The ID of the AWS account for which permissions should be granted.

---

##### `of` <a name="of" id="cdk-extensions.sso.AssignmentTarget.of"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.AssignmentTarget.of(targetType: AssignmentTargetType, targetId: string)
```

An escape hatch method that allows specifying a custom target for an assignment in the event new target options are added and the provided methods for configuring targets are yet to catch up.

It is recommended that the provided static methods be used whenever
possible for configuring assignment targets instead of calling `of`.

###### `targetType`<sup>Required</sup> <a name="targetType" id="cdk-extensions.sso.AssignmentTarget.of.parameter.targetType"></a>

- *Type:* cdk-extensions.sso.AssignmentTargetType

The entity type for which permissions will be granted.

---

###### `targetId`<sup>Required</sup> <a name="targetId" id="cdk-extensions.sso.AssignmentTarget.of.parameter.targetId"></a>

- *Type:* string

The unique identifier specifying the entity for which permissions will be granted.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentTarget.property.targetId">targetId</a></code> | <code>string</code> | The unique identifier for the resource for which permissions will be granted. |
| <code><a href="#cdk-extensions.sso.AssignmentTarget.property.targetType">targetType</a></code> | <code>cdk-extensions.sso.AssignmentTargetType</code> | The type of resource for which permissions will be granted. |

---

##### `targetId`<sup>Required</sup> <a name="targetId" id="cdk-extensions.sso.AssignmentTarget.property.targetId"></a>

```typescript
public readonly targetId: string;
```

- *Type:* string

The unique identifier for the resource for which permissions will be granted.

---

##### `targetType`<sup>Required</sup> <a name="targetType" id="cdk-extensions.sso.AssignmentTarget.property.targetType"></a>

```typescript
public readonly targetType: AssignmentTargetType;
```

- *Type:* cdk-extensions.sso.AssignmentTargetType

The type of resource for which permissions will be granted.

---


### AssignmentTargetType <a name="AssignmentTargetType" id="cdk-extensions.sso.AssignmentTargetType"></a>

Provides a wrapper around the accepted values for the IAM Identity Center [Assignment.TargetType attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-targettype).

Accepted values are provided as static properties that can be used when
configuring an assignment.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentTargetType.of">of</a></code> | An escape hatch method that allows specifying a custom target type in the even more options are added and the provided static types are yet to catch up. |

---

##### `of` <a name="of" id="cdk-extensions.sso.AssignmentTargetType.of"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.AssignmentTargetType.of(name: string)
```

An escape hatch method that allows specifying a custom target type in the even more options are added and the provided static types are yet to catch up.

It is recommended that the provided static types be used when possible
instead of calling `of`.

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.AssignmentTargetType.of.parameter.name"></a>

- *Type:* string

The name of the assignment target type.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentTargetType.property.name">name</a></code> | <code>string</code> | The name describing the type of target. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.AssignmentTargetType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name describing the type of target.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.AssignmentTargetType.property.AWS_ACCOUNT">AWS_ACCOUNT</a></code> | <code>cdk-extensions.sso.AssignmentTargetType</code> | An AWS account. |

---

##### `AWS_ACCOUNT`<sup>Required</sup> <a name="AWS_ACCOUNT" id="cdk-extensions.sso.AssignmentTargetType.property.AWS_ACCOUNT"></a>

```typescript
public readonly AWS_ACCOUNT: AssignmentTargetType;
```

- *Type:* cdk-extensions.sso.AssignmentTargetType

An AWS account.

---

### BackupConfiguration <a name="BackupConfiguration" id="cdk-extensions.kinesis_firehose.BackupConfiguration"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.BackupConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.BackupConfiguration(options: BackupConfigurationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfiguration.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.BackupConfigurationOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.BackupConfiguration.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.BackupConfigurationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfiguration.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.BackupConfiguration.bind"></a>

```typescript
public bind(scope: IConstruct): BackupConfigurationResult
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.BackupConfiguration.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfiguration.property.destination">destination</a></code> | <code>cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.BackupConfiguration.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-extensions.kinesis_firehose.BackupConfiguration.property.destination"></a>

```typescript
public readonly destination: IDeliveryStreamBackupDestination;
```

- *Type:* cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.BackupConfiguration.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---


### BasicColumn <a name="BasicColumn" id="cdk-extensions.glue.BasicColumn"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.BasicColumn.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.BasicColumn(props: BasicColumnProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.BasicColumn.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.BasicColumnProps</code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.BasicColumn.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.BasicColumnProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.BasicColumn.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.BasicColumn.bind"></a>

```typescript
public bind(scope: IConstruct): ColumnProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.BasicColumn.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.BasicColumn.property.typeString">typeString</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.BasicColumn.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.BasicColumn.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `typeString`<sup>Required</sup> <a name="typeString" id="cdk-extensions.glue.BasicColumn.property.typeString"></a>

```typescript
public readonly typeString: string;
```

- *Type:* string

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.BasicColumn.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.BasicColumn.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### BufferingConfiguration <a name="BufferingConfiguration" id="cdk-extensions.kinesis_firehose.BufferingConfiguration"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.BufferingConfiguration(options: BufferingConfigurationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfiguration.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfigurationOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfigurationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfiguration.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.bind"></a>

```typescript
public bind(_scope: IConstruct): BufferingHintsProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfiguration.property.interval">interval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.BufferingConfiguration.property.sizeInMb">sizeInMb</a></code> | <code>number</code> | *No description.* |

---

##### `interval`<sup>Optional</sup> <a name="interval" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.property.interval"></a>

```typescript
public readonly interval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `sizeInMb`<sup>Optional</sup> <a name="sizeInMb" id="cdk-extensions.kinesis_firehose.BufferingConfiguration.property.sizeInMb"></a>

```typescript
public readonly sizeInMb: number;
```

- *Type:* number

---


### ClassificationString <a name="ClassificationString" id="cdk-extensions.glue.ClassificationString"></a>

Classification string given to tables with this data format.

> [https://docs.aws.amazon.com/glue/latest/dg/add-classifier.html#classifier-built-in](https://docs.aws.amazon.com/glue/latest/dg/add-classifier.html#classifier-built-in)

#### Initializers <a name="Initializers" id="cdk-extensions.glue.ClassificationString.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.ClassificationString(value: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ClassificationString.Initializer.parameter.value">value</a></code> | <code>string</code> | *No description.* |

---

##### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.ClassificationString.Initializer.parameter.value"></a>

- *Type:* string

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.value">value</a></code> | <code>string</code> | *No description.* |

---

##### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.glue.ClassificationString.property.value"></a>

```typescript
public readonly value: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.AVRO">AVRO</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.CSV">CSV</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.JSON">JSON</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.ORC">ORC</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.PARQUET">PARQUET</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ClassificationString.property.XML">XML</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | *No description.* |

---

##### `AVRO`<sup>Required</sup> <a name="AVRO" id="cdk-extensions.glue.ClassificationString.property.AVRO"></a>

```typescript
public readonly AVRO: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-avro](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-avro)

---

##### `CSV`<sup>Required</sup> <a name="CSV" id="cdk-extensions.glue.ClassificationString.property.CSV"></a>

```typescript
public readonly CSV: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-csv](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-csv)

---

##### `JSON`<sup>Required</sup> <a name="JSON" id="cdk-extensions.glue.ClassificationString.property.JSON"></a>

```typescript
public readonly JSON: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-json](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-json)

---

##### `ORC`<sup>Required</sup> <a name="ORC" id="cdk-extensions.glue.ClassificationString.property.ORC"></a>

```typescript
public readonly ORC: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-orc](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-orc)

---

##### `PARQUET`<sup>Required</sup> <a name="PARQUET" id="cdk-extensions.glue.ClassificationString.property.PARQUET"></a>

```typescript
public readonly PARQUET: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-parquet](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-parquet)

---

##### `XML`<sup>Required</sup> <a name="XML" id="cdk-extensions.glue.ClassificationString.property.XML"></a>

```typescript
public readonly XML: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

> [https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-xml](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-xml)

---

### CloudWatchLoggingConfiguration <a name="CloudWatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.CloudWatchLoggingConfiguration(options: CloudWatchLoggingConfigurationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfigurationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.bind"></a>

```typescript
public bind(scope: IConstruct): CloudWatchLoggingOptionsProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.logStream">logStream</a></code> | <code>aws-cdk-lib.aws_logs.ILogStream</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

---

##### `logStream`<sup>Optional</sup> <a name="logStream" id="cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration.property.logStream"></a>

```typescript
public readonly logStream: ILogStream;
```

- *Type:* aws-cdk-lib.aws_logs.ILogStream

---


### Code <a name="Code" id="cdk-extensions.glue.Code"></a>

Represents a Glue Job's Code assets (an asset can be a scripts, a jar, a python file or any other file).

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Code.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Code()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Code.bind">bind</a></code> | Called when the Job is initialized to allow this object to bind. |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.Code.bind"></a>

```typescript
public bind(scope: Construct, grantable: IGrantable): CodeConfig
```

Called when the Job is initialized to allow this object to bind.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Code.bind.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `grantable`<sup>Required</sup> <a name="grantable" id="cdk-extensions.glue.Code.bind.parameter.grantable"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Code.fromAsset">fromAsset</a></code> | Job code from a local disk path. |
| <code><a href="#cdk-extensions.glue.Code.fromBucket">fromBucket</a></code> | Job code as an S3 object. |

---

##### `fromAsset` <a name="fromAsset" id="cdk-extensions.glue.Code.fromAsset"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Code.fromAsset(path: string, options?: AssetOptions)
```

Job code from a local disk path.

###### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.glue.Code.fromAsset.parameter.path"></a>

- *Type:* string

code file (not a directory).

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.glue.Code.fromAsset.parameter.options"></a>

- *Type:* aws-cdk-lib.AssetOptions

---

##### `fromBucket` <a name="fromBucket" id="cdk-extensions.glue.Code.fromBucket"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.Code.fromBucket(bucket: IBucket, key: string)
```

Job code as an S3 object.

###### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.Code.fromBucket.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket.

---

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.Code.fromBucket.parameter.key"></a>

- *Type:* string

The object key.

---



### Column <a name="Column" id="cdk-extensions.glue.Column"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.Column.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.Column(props: ColumnProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Column.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.ColumnProps</code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.Column.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.ColumnProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.Column.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.Column.bind"></a>

```typescript
public bind(scope: IConstruct): ColumnProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.Column.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.Column.property.typeString">typeString</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Column.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.Column.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `typeString`<sup>Required</sup> <a name="typeString" id="cdk-extensions.glue.Column.property.typeString"></a>

```typescript
public readonly typeString: string;
```

- *Type:* string

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.Column.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.Column.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### CustomProcessor <a name="CustomProcessor" id="cdk-extensions.kinesis_firehose.CustomProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.CustomProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.CustomProcessor(options: CustomProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.CustomProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.CustomProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.CustomProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessor.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessor.addParameter">addParameter</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.CustomProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.CustomProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

##### `addParameter` <a name="addParameter" id="cdk-extensions.kinesis_firehose.CustomProcessor.addParameter"></a>

```typescript
public addParameter(name: string, value: string): void
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.CustomProcessor.addParameter.parameter.name"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.kinesis_firehose.CustomProcessor.addParameter.parameter.value"></a>

- *Type:* string

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.CustomProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.CustomProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---


### DataFormat <a name="DataFormat" id="cdk-extensions.glue.DataFormat"></a>

Defines the input/output formats and ser/de for a single DataFormat.

#### Initializers <a name="Initializers" id="cdk-extensions.glue.DataFormat.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.DataFormat(props: DataFormatProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.DataFormat.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.DataFormatProps</code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.DataFormat.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.DataFormatProps

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.DataFormat.property.inputFormat">inputFormat</a></code> | <code>cdk-extensions.glue.InputFormat</code> | `InputFormat` for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.outputFormat">outputFormat</a></code> | <code>cdk-extensions.glue.OutputFormat</code> | `OutputFormat` for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.serializationLibrary">serializationLibrary</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | Serialization library for this data format. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.classificationString">classificationString</a></code> | <code>cdk-extensions.glue.ClassificationString</code> | Classification string given to tables with this data format. |

---

##### `inputFormat`<sup>Required</sup> <a name="inputFormat" id="cdk-extensions.glue.DataFormat.property.inputFormat"></a>

```typescript
public readonly inputFormat: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

`InputFormat` for this data format.

---

##### `outputFormat`<sup>Required</sup> <a name="outputFormat" id="cdk-extensions.glue.DataFormat.property.outputFormat"></a>

```typescript
public readonly outputFormat: OutputFormat;
```

- *Type:* cdk-extensions.glue.OutputFormat

`OutputFormat` for this data format.

---

##### `serializationLibrary`<sup>Required</sup> <a name="serializationLibrary" id="cdk-extensions.glue.DataFormat.property.serializationLibrary"></a>

```typescript
public readonly serializationLibrary: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

Serialization library for this data format.

---

##### `classificationString`<sup>Optional</sup> <a name="classificationString" id="cdk-extensions.glue.DataFormat.property.classificationString"></a>

```typescript
public readonly classificationString: ClassificationString;
```

- *Type:* cdk-extensions.glue.ClassificationString

Classification string given to tables with this data format.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.DataFormat.property.APACHE_LOGS">APACHE_LOGS</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for Apache Web Server Logs. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.AVRO">AVRO</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for Apache Avro. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.CLOUDTRAIL_LOGS">CLOUDTRAIL_LOGS</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for CloudTrail logs stored on S3. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.CSV">CSV</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for CSV Files. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.JSON">JSON</a></code> | <code>cdk-extensions.glue.DataFormat</code> | Stored as plain text files in JSON format. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.LOGSTASH">LOGSTASH</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for Logstash Logs, using the GROK SerDe. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.ORC">ORC</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for Apache ORC (Optimized Row Columnar). |
| <code><a href="#cdk-extensions.glue.DataFormat.property.PARQUET">PARQUET</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for Apache Parquet. |
| <code><a href="#cdk-extensions.glue.DataFormat.property.TSV">TSV</a></code> | <code>cdk-extensions.glue.DataFormat</code> | DataFormat for TSV (Tab-Separated Values). |

---

##### `APACHE_LOGS`<sup>Required</sup> <a name="APACHE_LOGS" id="cdk-extensions.glue.DataFormat.property.APACHE_LOGS"></a>

```typescript
public readonly APACHE_LOGS: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for Apache Web Server Logs.

Also works for CloudFront logs

> [https://docs.aws.amazon.com/athena/latest/ug/apache.html](https://docs.aws.amazon.com/athena/latest/ug/apache.html)

---

##### `AVRO`<sup>Required</sup> <a name="AVRO" id="cdk-extensions.glue.DataFormat.property.AVRO"></a>

```typescript
public readonly AVRO: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for Apache Avro.

> [https://docs.aws.amazon.com/athena/latest/ug/avro.html](https://docs.aws.amazon.com/athena/latest/ug/avro.html)

---

##### `CLOUDTRAIL_LOGS`<sup>Required</sup> <a name="CLOUDTRAIL_LOGS" id="cdk-extensions.glue.DataFormat.property.CLOUDTRAIL_LOGS"></a>

```typescript
public readonly CLOUDTRAIL_LOGS: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for CloudTrail logs stored on S3.

> [https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html](https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html)

---

##### `CSV`<sup>Required</sup> <a name="CSV" id="cdk-extensions.glue.DataFormat.property.CSV"></a>

```typescript
public readonly CSV: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for CSV Files.

> [https://docs.aws.amazon.com/athena/latest/ug/csv.html](https://docs.aws.amazon.com/athena/latest/ug/csv.html)

---

##### `JSON`<sup>Required</sup> <a name="JSON" id="cdk-extensions.glue.DataFormat.property.JSON"></a>

```typescript
public readonly JSON: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

Stored as plain text files in JSON format.

Uses OpenX Json SerDe for serialization and deseralization.

> [https://docs.aws.amazon.com/athena/latest/ug/json.html](https://docs.aws.amazon.com/athena/latest/ug/json.html)

---

##### `LOGSTASH`<sup>Required</sup> <a name="LOGSTASH" id="cdk-extensions.glue.DataFormat.property.LOGSTASH"></a>

```typescript
public readonly LOGSTASH: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for Logstash Logs, using the GROK SerDe.

> [https://docs.aws.amazon.com/athena/latest/ug/grok.html](https://docs.aws.amazon.com/athena/latest/ug/grok.html)

---

##### `ORC`<sup>Required</sup> <a name="ORC" id="cdk-extensions.glue.DataFormat.property.ORC"></a>

```typescript
public readonly ORC: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for Apache ORC (Optimized Row Columnar).

> [https://docs.aws.amazon.com/athena/latest/ug/orc.html](https://docs.aws.amazon.com/athena/latest/ug/orc.html)

---

##### `PARQUET`<sup>Required</sup> <a name="PARQUET" id="cdk-extensions.glue.DataFormat.property.PARQUET"></a>

```typescript
public readonly PARQUET: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for Apache Parquet.

> [https://docs.aws.amazon.com/athena/latest/ug/parquet.html](https://docs.aws.amazon.com/athena/latest/ug/parquet.html)

---

##### `TSV`<sup>Required</sup> <a name="TSV" id="cdk-extensions.glue.DataFormat.property.TSV"></a>

```typescript
public readonly TSV: DataFormat;
```

- *Type:* cdk-extensions.glue.DataFormat

DataFormat for TSV (Tab-Separated Values).

> [https://docs.aws.amazon.com/athena/latest/ug/lazy-simple-serde.html](https://docs.aws.amazon.com/athena/latest/ug/lazy-simple-serde.html)

---

### DataFormatConversion <a name="DataFormatConversion" id="cdk-extensions.kinesis_firehose.DataFormatConversion"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.DataFormatConversion.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.DataFormatConversion(options: DataFormatConversionOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.DataFormatConversionOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.DataFormatConversion.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.DataFormatConversionOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.DataFormatConversion.bind"></a>

```typescript
public bind(scope: IConstruct): DataFormatConversionConfigurationProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DataFormatConversion.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.database">database</a></code> | <code>cdk-extensions.glue.Database</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.inputFormat">inputFormat</a></code> | <code>cdk-extensions.kinesis_firehose.InputFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.outputFormat">outputFormat</a></code> | <code>cdk-extensions.kinesis_firehose.OutputFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.table">table</a></code> | <code>cdk-extensions.glue.Table</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.catalogId">catalogId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.region">region</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DataFormatConversion.property.version">version</a></code> | <code>cdk-extensions.kinesis_firehose.TableVersion</code> | *No description.* |

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.database"></a>

```typescript
public readonly database: Database;
```

- *Type:* cdk-extensions.glue.Database

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `inputFormat`<sup>Required</sup> <a name="inputFormat" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.inputFormat"></a>

```typescript
public readonly inputFormat: InputFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.InputFormat

---

##### `outputFormat`<sup>Required</sup> <a name="outputFormat" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.outputFormat"></a>

```typescript
public readonly outputFormat: OutputFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.OutputFormat

---

##### `table`<sup>Required</sup> <a name="table" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* cdk-extensions.glue.Table

---

##### `catalogId`<sup>Optional</sup> <a name="catalogId" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.catalogId"></a>

```typescript
public readonly catalogId: string;
```

- *Type:* string

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `version`<sup>Optional</sup> <a name="version" id="cdk-extensions.kinesis_firehose.DataFormatConversion.property.version"></a>

```typescript
public readonly version: TableVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.TableVersion

---


### DeliveryStreamDestination <a name="DeliveryStreamDestination" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestination"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestination.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.DeliveryStreamDestination()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestination.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestination.bind"></a>

```typescript
public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamDestination.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.DeliveryStreamDestination.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---


### DeliveryStreamProcessor <a name="DeliveryStreamProcessor" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.DeliveryStreamProcessor(options: DeliveryStreamProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.DeliveryStreamProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---


### DynamicPartitioning <a name="DynamicPartitioning" id="cdk-extensions.kinesis_firehose.DynamicPartitioning"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.DynamicPartitioning(options: CommonPartitioningOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.CommonPartitioningOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.CommonPartitioningOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.bind"></a>

```typescript
public bind(_scope: IConstruct): DynamicPartitioningConfiguration
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.fromJson">fromJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.fromLambda">fromLambda</a></code> | *No description.* |

---

##### `fromJson` <a name="fromJson" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.fromJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DynamicPartitioning.fromJson(options: JsonPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.fromJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.JsonPartitioningOptions

---

##### `fromLambda` <a name="fromLambda" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.fromLambda"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.DynamicPartitioning.fromLambda(options: LambdaPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.fromLambda.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.LambdaPartitioningOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DynamicPartitioning.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.DynamicPartitioning.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


### ExtendedS3Destination <a name="ExtendedS3Destination" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.ExtendedS3Destination(bucket: IBucket, options?: ExtendedS3DestinationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.Initializer.parameter.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.Initializer.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ExtendedS3DestinationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.renderBackupConfiguration">renderBackupConfiguration</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.addProcessor">addProcessor</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.bind"></a>

```typescript
public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `renderBackupConfiguration` <a name="renderBackupConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.renderBackupConfiguration"></a>

```typescript
public renderBackupConfiguration(scope: IConstruct, enabled?: boolean): BackupConfigurationResult
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.renderBackupConfiguration.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.renderBackupConfiguration.parameter.enabled"></a>

- *Type:* boolean

---

##### `addProcessor` <a name="addProcessor" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.addProcessor"></a>

```typescript
public addProcessor(processor: DeliveryStreamProcessor): ExtendedS3Destination
```

###### `processor`<sup>Required</sup> <a name="processor" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.addProcessor.parameter.processor"></a>

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.compressionFormat">compressionFormat</a></code> | <code>cdk-extensions.kinesis_firehose.S3CompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.encryptionEnabled">encryptionEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.encryptionKey">encryptionKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.errorOutputPrefix">errorOutputPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processingEnabled">processingEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processors">processors</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.backupConfiguration">backupConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.BackupConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.dataFormatConversion">dataFormatConversion</a></code> | <code>cdk-extensions.kinesis_firehose.DataFormatConversion</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.dynamicPartitioning">dynamicPartitioning</a></code> | <code>cdk-extensions.kinesis_firehose.DynamicPartitioning</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processorConfiguration">processorConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorConfiguration</code> | *No description.* |

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `compressionFormat`<sup>Optional</sup> <a name="compressionFormat" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.compressionFormat"></a>

```typescript
public readonly compressionFormat: S3CompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.S3CompressionFormat

---

##### `encryptionEnabled`<sup>Optional</sup> <a name="encryptionEnabled" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.encryptionEnabled"></a>

```typescript
public readonly encryptionEnabled: boolean;
```

- *Type:* boolean

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

---

##### `errorOutputPrefix`<sup>Optional</sup> <a name="errorOutputPrefix" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.errorOutputPrefix"></a>

```typescript
public readonly errorOutputPrefix: string;
```

- *Type:* string

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---

##### `processingEnabled`<sup>Required</sup> <a name="processingEnabled" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processingEnabled"></a>

```typescript
public readonly processingEnabled: boolean;
```

- *Type:* boolean

---

##### `processors`<sup>Required</sup> <a name="processors" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processors"></a>

```typescript
public readonly processors: DeliveryStreamProcessor[];
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]

---

##### `backupConfiguration`<sup>Optional</sup> <a name="backupConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.backupConfiguration"></a>

```typescript
public readonly backupConfiguration: BackupConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BackupConfiguration

---

##### `dataFormatConversion`<sup>Optional</sup> <a name="dataFormatConversion" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.dataFormatConversion"></a>

```typescript
public readonly dataFormatConversion: DataFormatConversion;
```

- *Type:* cdk-extensions.kinesis_firehose.DataFormatConversion

---

##### `dynamicPartitioning`<sup>Optional</sup> <a name="dynamicPartitioning" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.dynamicPartitioning"></a>

```typescript
public readonly dynamicPartitioning: DynamicPartitioning;
```

- *Type:* cdk-extensions.kinesis_firehose.DynamicPartitioning

---

##### `processorConfiguration`<sup>Optional</sup> <a name="processorConfiguration" id="cdk-extensions.kinesis_firehose.ExtendedS3Destination.property.processorConfiguration"></a>

```typescript
public readonly processorConfiguration: ProcessorConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorConfiguration

---


### FlowLogDestination <a name="FlowLogDestination" id="cdk-extensions.ec2.FlowLogDestination"></a>

- *Implements:* cdk-extensions.ec2.ILogDestination

Represents a resource that can act as a deliver endpoint for captured flow logs.

#### Initializers <a name="Initializers" id="cdk-extensions.ec2.FlowLogDestination.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

new ec2.FlowLogDestination()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogDestination.bind">bind</a></code> | Returns a configuration object with all the fields and resources needed to configure a flow log to write to the destination. |

---

##### `bind` <a name="bind" id="cdk-extensions.ec2.FlowLogDestination.bind"></a>

```typescript
public bind(scope: IConstruct): FlowLogDestinationConfig
```

Returns a configuration object with all the fields and resources needed to configure a flow log to write to the destination.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ec2.FlowLogDestination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

The CDK Construct that will be consuming the configuration and using it to configure a flow log.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogDestination.toCloudWatchLogs">toCloudWatchLogs</a></code> | Represents a CloudWatch log group that will serve as the endpoint where flow logs should be delivered. |
| <code><a href="#cdk-extensions.ec2.FlowLogDestination.toS3">toS3</a></code> | Represents a CloudWatch log group that will serve as the endpoint where flow logs should be delivered. |

---

##### `toCloudWatchLogs` <a name="toCloudWatchLogs" id="cdk-extensions.ec2.FlowLogDestination.toCloudWatchLogs"></a>

```typescript
import { ec2 } from 'cdk-extensions'

ec2.FlowLogDestination.toCloudWatchLogs(logGroup?: ILogGroup, role?: IRole)
```

Represents a CloudWatch log group that will serve as the endpoint where flow logs should be delivered.

> [[Publish flow logs to CloudWatch Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html)]([Publish flow logs to CloudWatch Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html))

###### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-extensions.ec2.FlowLogDestination.toCloudWatchLogs.parameter.logGroup"></a>

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

The CloudWatch LogGroup where flow logs should be delivered.

---

###### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.ec2.FlowLogDestination.toCloudWatchLogs.parameter.role"></a>

- *Type:* aws-cdk-lib.aws_iam.IRole

An IAM role that allows Amazon EC2 to publish flow logs to a CloudWatch Logs log group in your account.

---

##### `toS3` <a name="toS3" id="cdk-extensions.ec2.FlowLogDestination.toS3"></a>

```typescript
import { ec2 } from 'cdk-extensions'

ec2.FlowLogDestination.toS3(bucket?: IBucket, options?: FlowLogS3Options)
```

Represents a CloudWatch log group that will serve as the endpoint where flow logs should be delivered.

> [[Publish flow logs to Amazon S3](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html)]([Publish flow logs to Amazon S3](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html))

###### `bucket`<sup>Optional</sup> <a name="bucket" id="cdk-extensions.ec2.FlowLogDestination.toS3.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 Bucket where flow logs should be delivered.

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.ec2.FlowLogDestination.toS3.parameter.options"></a>

- *Type:* cdk-extensions.ec2.FlowLogS3Options

Configuration options controlling how flow logs will be written to S3.

---



### FlowLogField <a name="FlowLogField" id="cdk-extensions.ec2.FlowLogField"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.ec2.FlowLogField.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

new ec2.FlowLogField(name: string, type: FlowLogDataType)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogField.Initializer.parameter.name">name</a></code> | <code>string</code> | The name of the Flow Log field, as it should be used when building a format string. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.Initializer.parameter.type">type</a></code> | <code>cdk-extensions.ec2.FlowLogDataType</code> | The data type of the field as it would appear in Parquet. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.ec2.FlowLogField.Initializer.parameter.name"></a>

- *Type:* string

The name of the Flow Log field, as it should be used when building a format string.

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.ec2.FlowLogField.Initializer.parameter.type"></a>

- *Type:* cdk-extensions.ec2.FlowLogDataType

The data type of the field as it would appear in Parquet.

For information on the type for various files, see documentation on the
[available fields](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html#flow-logs-fields).

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.name">name</a></code> | <code>string</code> | The name of the Flow Log field, as it should be used when building a format string. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.type">type</a></code> | <code>cdk-extensions.ec2.FlowLogDataType</code> | The data type of the field as it would appear in Parquet. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.ec2.FlowLogField.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Flow Log field, as it should be used when building a format string.

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-extensions.ec2.FlowLogField.property.type"></a>

```typescript
public readonly type: FlowLogDataType;
```

- *Type:* cdk-extensions.ec2.FlowLogDataType

The data type of the field as it would appear in Parquet.

For
information on the type for various files, see documentation on the
[available fields](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html#flow-logs-fields).

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.ACCOUNT_ID">ACCOUNT_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The AWS account ID of the owner of the source network interface for which traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.ACTION">ACTION</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The action that is associated with the traffic:. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.AZ_ID">AZ_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the Availability Zone that contains the network interface for which traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.BYTES">BYTES</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The number of bytes transferred during the flow. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.DSTADDR">DSTADDR</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The destination address for outgoing traffic, or the IPv4 or IPv6 address of the network interface for incoming traffic on the network interface. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.DSTPORT">DSTPORT</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The destination port of the traffic. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.END">END</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The time, in Unix seconds, when the last packet of the flow was received within the aggregation interval. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.FLOW_DIRECTION">FLOW_DIRECTION</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The direction of the flow with respect to the interface where traffic is captured. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.INSTANCE_ID">INSTANCE_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the instance that's associated with network interface for which the traffic is recorded, if the instance is owned by you. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.INTERFACE_ID">INTERFACE_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the network interface for which the traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.LOG_STATUS">LOG_STATUS</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The logging status of the flow log:. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PACKETS">PACKETS</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The number of packets transferred during the flow. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PKT_DST_AWS_SERVICE">PKT_DST_AWS_SERVICE</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The name of the subset of IP address ranges for the pkt-dstaddr field, if the destination IP address is for an AWS service. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PKT_DSTADDR">PKT_DSTADDR</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The packet-level (original) destination IP address for the traffic. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PKT_SRC_AWS_SERVICE">PKT_SRC_AWS_SERVICE</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The name of the subset of IP address ranges for the pkt-srcaddr field, if the source IP address is for an AWS service. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PKT_SRCADDR">PKT_SRCADDR</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The packet-level (original) source IP address of the traffic. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.PROTOCOL">PROTOCOL</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The IANA protocol number of the traffic. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.REGION">REGION</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The Region that contains the network interface for which traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.SRCADDR">SRCADDR</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The source address for incoming traffic, or the IPv4 or IPv6 address of the network interface for outgoing traffic on the network interface. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.SRCPORT">SRCPORT</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The source port of the traffic. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.START">START</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The time, in Unix seconds, when the first packet of the flow was received within the aggregation interval. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.SUBLOCATION_ID">SUBLOCATION_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the sublocation that contains the network interface for which traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.SUBLOCATION_TYPE">SUBLOCATION_TYPE</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The type of sublocation that's returned in the sublocation-id field. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.SUBNET_ID">SUBNET_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the subnet that contains the network interface for which the traffic is recorded. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.TCP_FLAGS">TCP_FLAGS</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The bitmask value for the following TCP flags:. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.TRAFFIC_PATH">TRAFFIC_PATH</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The path that egress traffic takes to the destination. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.TYPE">TYPE</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The type of traffic. The possible values are: IPv4 \| IPv6 \| EFA. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.VERSION">VERSION</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The VPC Flow Logs version. |
| <code><a href="#cdk-extensions.ec2.FlowLogField.property.VPC_ID">VPC_ID</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The ID of the VPC that contains the network interface for which the traffic is recorded. |

---

##### `ACCOUNT_ID`<sup>Required</sup> <a name="ACCOUNT_ID" id="cdk-extensions.ec2.FlowLogField.property.ACCOUNT_ID"></a>

```typescript
public readonly ACCOUNT_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The AWS account ID of the owner of the source network interface for which traffic is recorded.

If the network interface is created by an
AWS service, for example when creating a VPC endpoint or Network Load
Balancer, the record might display unknown for this field.

---

##### `ACTION`<sup>Required</sup> <a name="ACTION" id="cdk-extensions.ec2.FlowLogField.property.ACTION"></a>

```typescript
public readonly ACTION: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The action that is associated with the traffic:.

ACCEPT: The recorded traffic was permitted by the security groups and
network ACLs.
REJECT: The recorded traffic was not permitted by the security groups
or network ACLs.

---

##### `AZ_ID`<sup>Required</sup> <a name="AZ_ID" id="cdk-extensions.ec2.FlowLogField.property.AZ_ID"></a>

```typescript
public readonly AZ_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the Availability Zone that contains the network interface for which traffic is recorded.

If the traffic is from a sublocation, the
record displays a '-' symbol for this field.

---

##### `BYTES`<sup>Required</sup> <a name="BYTES" id="cdk-extensions.ec2.FlowLogField.property.BYTES"></a>

```typescript
public readonly BYTES: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The number of bytes transferred during the flow.

---

##### `DSTADDR`<sup>Required</sup> <a name="DSTADDR" id="cdk-extensions.ec2.FlowLogField.property.DSTADDR"></a>

```typescript
public readonly DSTADDR: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The destination address for outgoing traffic, or the IPv4 or IPv6 address of the network interface for incoming traffic on the network interface.

The IPv4 address of the network interface is always its
private IPv4 address.

See also:
{@link FlowLogField.PKT_DSTADDR | PKT_DSTADDR}

---

##### `DSTPORT`<sup>Required</sup> <a name="DSTPORT" id="cdk-extensions.ec2.FlowLogField.property.DSTPORT"></a>

```typescript
public readonly DSTPORT: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The destination port of the traffic.

---

##### `END`<sup>Required</sup> <a name="END" id="cdk-extensions.ec2.FlowLogField.property.END"></a>

```typescript
public readonly END: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The time, in Unix seconds, when the last packet of the flow was received within the aggregation interval.

This might be up to 60
seconds after the packet was transmitted or received on the network
interface.

---

##### `FLOW_DIRECTION`<sup>Required</sup> <a name="FLOW_DIRECTION" id="cdk-extensions.ec2.FlowLogField.property.FLOW_DIRECTION"></a>

```typescript
public readonly FLOW_DIRECTION: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The direction of the flow with respect to the interface where traffic is captured.

The possible values are: ingress | egress.

---

##### `INSTANCE_ID`<sup>Required</sup> <a name="INSTANCE_ID" id="cdk-extensions.ec2.FlowLogField.property.INSTANCE_ID"></a>

```typescript
public readonly INSTANCE_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the instance that's associated with network interface for which the traffic is recorded, if the instance is owned by you.

Returns
a '-' symbol for a requester-managed network interface; for example,
the network interface for a NAT gateway.

See also:
[Request-managed ENI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/requester-managed-eni.html)

---

##### `INTERFACE_ID`<sup>Required</sup> <a name="INTERFACE_ID" id="cdk-extensions.ec2.FlowLogField.property.INTERFACE_ID"></a>

```typescript
public readonly INTERFACE_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the network interface for which the traffic is recorded.

---

##### `LOG_STATUS`<sup>Required</sup> <a name="LOG_STATUS" id="cdk-extensions.ec2.FlowLogField.property.LOG_STATUS"></a>

```typescript
public readonly LOG_STATUS: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The logging status of the flow log:.

OK: Data is logging normally to the chosen destinations.
NODATA: There was no network traffic to or from the network interface
during the aggregation interval.
SKIPDATA — Some flow log records were skipped during the aggregation
interval. This might be because of an internal capacity constraint, or
an internal error.

---

##### `PACKETS`<sup>Required</sup> <a name="PACKETS" id="cdk-extensions.ec2.FlowLogField.property.PACKETS"></a>

```typescript
public readonly PACKETS: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The number of packets transferred during the flow.

---

##### `PKT_DST_AWS_SERVICE`<sup>Required</sup> <a name="PKT_DST_AWS_SERVICE" id="cdk-extensions.ec2.FlowLogField.property.PKT_DST_AWS_SERVICE"></a>

```typescript
public readonly PKT_DST_AWS_SERVICE: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The name of the subset of IP address ranges for the pkt-dstaddr field, if the destination IP address is for an AWS service.

For a list of
possible values, see the {@link FlowLogField.PKT_SRC_AWS_SERVICE | PKT_SRC_AWS_SERVICE} field.

---

##### `PKT_DSTADDR`<sup>Required</sup> <a name="PKT_DSTADDR" id="cdk-extensions.ec2.FlowLogField.property.PKT_DSTADDR"></a>

```typescript
public readonly PKT_DSTADDR: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The packet-level (original) destination IP address for the traffic.

Use
this field with the dstaddr field to distinguish between the IP address
of an intermediate layer through which traffic flows, and the final
destination IP address of the traffic. For example, when traffic flows
through a network interface for a NAT gateway, or where the IP address
of a pod in Amazon EKS is different from the IP address of the network
interface of the instance node on which the pod is running (for
communication within a VPC).

See also:
[Flow Log Example NAT](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-nat)

---

##### `PKT_SRC_AWS_SERVICE`<sup>Required</sup> <a name="PKT_SRC_AWS_SERVICE" id="cdk-extensions.ec2.FlowLogField.property.PKT_SRC_AWS_SERVICE"></a>

```typescript
public readonly PKT_SRC_AWS_SERVICE: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The name of the subset of IP address ranges for the pkt-srcaddr field, if the source IP address is for an AWS service.

The possible values
are: AMAZON | AMAZON_APPFLOW | AMAZON_CONNECT | API_GATEWAY |
CHIME_MEETINGS | CHIME_VOICECONNECTOR | CLOUD9 | CLOUDFRONT |
CODEBUILD | DYNAMODB | EBS | EC2 | EC2_INSTANCE_CONNECT |
GLOBALACCELERATOR | KINESIS_VIDEO_STREAMS | ROUTE53 |
ROUTE53_HEALTHCHECKS | ROUTE53_HEALTHCHECKS_PUBLISHING |
ROUTE53_RESOLVER | S3 | WORKSPACES_GATEWAYS.

---

##### `PKT_SRCADDR`<sup>Required</sup> <a name="PKT_SRCADDR" id="cdk-extensions.ec2.FlowLogField.property.PKT_SRCADDR"></a>

```typescript
public readonly PKT_SRCADDR: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The packet-level (original) source IP address of the traffic.

Use this
field with the srcaddr field to distinguish between the IP address of
an intermediate layer through which traffic flows, and the original
source IP address of the traffic. For example, when traffic flows
through a network interface for a NAT gateway, or where the IP address
of a pod in Amazon EKS is different from the IP address of the network
interface of the instance node on which the pod is running (for
communication within a VPC).

See also:
[Flow Log Example NAT](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-nat)

---

##### `PROTOCOL`<sup>Required</sup> <a name="PROTOCOL" id="cdk-extensions.ec2.FlowLogField.property.PROTOCOL"></a>

```typescript
public readonly PROTOCOL: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The IANA protocol number of the traffic.

See also:
[Assigned Internet Protocol Numbers](http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml).

---

##### `REGION`<sup>Required</sup> <a name="REGION" id="cdk-extensions.ec2.FlowLogField.property.REGION"></a>

```typescript
public readonly REGION: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The Region that contains the network interface for which traffic is recorded.

---

##### `SRCADDR`<sup>Required</sup> <a name="SRCADDR" id="cdk-extensions.ec2.FlowLogField.property.SRCADDR"></a>

```typescript
public readonly SRCADDR: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The source address for incoming traffic, or the IPv4 or IPv6 address of the network interface for outgoing traffic on the network interface.

The IPv4 address of the network interface is always its private IPv4
address.

See also:
{@link FlowLogField.PKT_SRCADDR | PKT_SRCADDR}

---

##### `SRCPORT`<sup>Required</sup> <a name="SRCPORT" id="cdk-extensions.ec2.FlowLogField.property.SRCPORT"></a>

```typescript
public readonly SRCPORT: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The source port of the traffic.

---

##### `START`<sup>Required</sup> <a name="START" id="cdk-extensions.ec2.FlowLogField.property.START"></a>

```typescript
public readonly START: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The time, in Unix seconds, when the first packet of the flow was received within the aggregation interval.

This might be up to 60
seconds after the packet was transmitted or received on the network
interface.

---

##### `SUBLOCATION_ID`<sup>Required</sup> <a name="SUBLOCATION_ID" id="cdk-extensions.ec2.FlowLogField.property.SUBLOCATION_ID"></a>

```typescript
public readonly SUBLOCATION_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the sublocation that contains the network interface for which traffic is recorded.

If the traffic is not from a sublocation, the
record displays a '-' symbol for this field.

---

##### `SUBLOCATION_TYPE`<sup>Required</sup> <a name="SUBLOCATION_TYPE" id="cdk-extensions.ec2.FlowLogField.property.SUBLOCATION_TYPE"></a>

```typescript
public readonly SUBLOCATION_TYPE: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The type of sublocation that's returned in the sublocation-id field.

The possible values are: wavelength | outpost | localzone. If the
traffic is not from a sublocation, the record displays a '-' symbol
for this field.

See also:
[Wavelength](https://aws.amazon.com/wavelength/)
[Outposts](https://docs.aws.amazon.com/outposts/latest/userguide/)
[Local Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-local-zones)

---

##### `SUBNET_ID`<sup>Required</sup> <a name="SUBNET_ID" id="cdk-extensions.ec2.FlowLogField.property.SUBNET_ID"></a>

```typescript
public readonly SUBNET_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the subnet that contains the network interface for which the traffic is recorded.

---

##### `TCP_FLAGS`<sup>Required</sup> <a name="TCP_FLAGS" id="cdk-extensions.ec2.FlowLogField.property.TCP_FLAGS"></a>

```typescript
public readonly TCP_FLAGS: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The bitmask value for the following TCP flags:.

FIN: 1
SYN: 2
RST: 4
PSH: 8
ACK: 16
SYN-ACK: 18
URG: 32

When a flow log entry consists of only ACK packets, the flag value is
0, not 16.

TCP flags can be OR-ed during the aggregation interval. For short
connections, the flags might be set on the same line in the flow log
record, for example, 19 for SYN-ACK and FIN, and 3 for SYN and FIN.

See also:
[TCP Segment Structure](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_segment_structure)
[TCP Flag Sequence](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html#flow-log-example-tcp-flag)

---

##### `TRAFFIC_PATH`<sup>Required</sup> <a name="TRAFFIC_PATH" id="cdk-extensions.ec2.FlowLogField.property.TRAFFIC_PATH"></a>

```typescript
public readonly TRAFFIC_PATH: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The path that egress traffic takes to the destination.

To determine
whether the traffic is egress traffic, check the flow-direction field.
The possible values are as follows. If none of the values apply, the
field is set to -.

1: Through another resource in the same VPC
2: Through an internet gateway or a gateway VPC endpoint
3: Through a virtual private gateway
4: Through an intra-region VPC peering connection
5: Through an inter-region VPC peering connection
6: Through a local gateway
7: Through a gateway VPC endpoint (Nitro-based instances only)
8: Through an internet gateway (Nitro-based instances only)

---

##### `TYPE`<sup>Required</sup> <a name="TYPE" id="cdk-extensions.ec2.FlowLogField.property.TYPE"></a>

```typescript
public readonly TYPE: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The type of traffic. The possible values are: IPv4 | IPv6 | EFA.

See also:
[Elastic Fabric Adapter](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html)

---

##### `VERSION`<sup>Required</sup> <a name="VERSION" id="cdk-extensions.ec2.FlowLogField.property.VERSION"></a>

```typescript
public readonly VERSION: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The VPC Flow Logs version.

If you use the default format, the version
is 2. If you use a custom format, the version is the highest version
among the specified fields. For example, if you specify only fields
from version 2, the version is 2. If you specify a mixture of fields
from versions 2, 3, and 4, the version is 4.

---

##### `VPC_ID`<sup>Required</sup> <a name="VPC_ID" id="cdk-extensions.ec2.FlowLogField.property.VPC_ID"></a>

```typescript
public readonly VPC_ID: FlowLogField;
```

- *Type:* cdk-extensions.ec2.FlowLogField

The ID of the VPC that contains the network interface for which the traffic is recorded.

---

### FlowLogFormat <a name="FlowLogFormat" id="cdk-extensions.ec2.FlowLogFormat"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.ec2.FlowLogFormat.Initializer"></a>

```typescript
import { ec2 } from 'cdk-extensions'

new ec2.FlowLogFormat(fields: FlowLogField)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.Initializer.parameter.fields">fields</a></code> | <code>cdk-extensions.ec2.FlowLogField</code> | The fields that should be included in the flow log output. |

---

##### `fields`<sup>Required</sup> <a name="fields" id="cdk-extensions.ec2.FlowLogFormat.Initializer.parameter.fields"></a>

- *Type:* cdk-extensions.ec2.FlowLogField

The fields that should be included in the flow log output.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.addField">addField</a></code> | Adds a new field to the flow log output. |

---

##### `addField` <a name="addField" id="cdk-extensions.ec2.FlowLogFormat.addField"></a>

```typescript
public addField(field: FlowLogField): void
```

Adds a new field to the flow log output.

New fields are added at the
end of a log entry after all the other fields that came before it.

###### `field`<sup>Required</sup> <a name="field" id="cdk-extensions.ec2.FlowLogFormat.addField.parameter.field"></a>

- *Type:* cdk-extensions.ec2.FlowLogField

The field to add to the FlowLogFormat.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.fields">fields</a></code> | <code>cdk-extensions.ec2.FlowLogField[]</code> | The fields that make up the flow log format, in the order that they should appear in the log entries. |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.template">template</a></code> | <code>string</code> | The rendered format string in the format expected by AWS when creating a new Flow Log. |

---

##### `fields`<sup>Required</sup> <a name="fields" id="cdk-extensions.ec2.FlowLogFormat.property.fields"></a>

```typescript
public readonly fields: FlowLogField[];
```

- *Type:* cdk-extensions.ec2.FlowLogField[]

The fields that make up the flow log format, in the order that they should appear in the log entries.

---

##### `template`<sup>Required</sup> <a name="template" id="cdk-extensions.ec2.FlowLogFormat.property.template"></a>

```typescript
public readonly template: string;
```

- *Type:* string

The rendered format string in the format expected by AWS when creating a new Flow Log.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.V2">V2</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | The basic set of fields included in most flow logs. |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.V3">V3</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | Includes all the fields available in V2. |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.V4">V4</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | Includes all the fields available in V3. |
| <code><a href="#cdk-extensions.ec2.FlowLogFormat.property.V5">V5</a></code> | <code>cdk-extensions.ec2.FlowLogFormat</code> | Includes all the fields available in V4. |

---

##### `V2`<sup>Required</sup> <a name="V2" id="cdk-extensions.ec2.FlowLogFormat.property.V2"></a>

```typescript
public readonly V2: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

The basic set of fields included in most flow logs.

This is the default
format that is used when new flow logs are created without specifying a
custom format.

---

##### `V3`<sup>Required</sup> <a name="V3" id="cdk-extensions.ec2.FlowLogFormat.property.V3"></a>

```typescript
public readonly V3: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

Includes all the fields available in V2.

Adds fields to help identify
AWS resources associated with traffic as well as fields that give
greater visibility into protocol specific details.

---

##### `V4`<sup>Required</sup> <a name="V4" id="cdk-extensions.ec2.FlowLogFormat.property.V4"></a>

```typescript
public readonly V4: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

Includes all the fields available in V3.

Adds fields for identifying
the region and availabilty zone associated with flows, as well as
details related to extended zones such as Wavelength, Outputs, and
Local Zones.

---

##### `V5`<sup>Required</sup> <a name="V5" id="cdk-extensions.ec2.FlowLogFormat.property.V5"></a>

```typescript
public readonly V5: FlowLogFormat;
```

- *Type:* cdk-extensions.ec2.FlowLogFormat

Includes all the fields available in V4.

Adds fields to help identify
related AWS services and improve visibility into packet routing.

---

### GlueVersion <a name="GlueVersion" id="cdk-extensions.glue.GlueVersion"></a>


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.GlueVersion.of">of</a></code> | Custom Glue version. |

---

##### `of` <a name="of" id="cdk-extensions.glue.GlueVersion.of"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.GlueVersion.of(version: string)
```

Custom Glue version.

###### `version`<sup>Required</sup> <a name="version" id="cdk-extensions.glue.GlueVersion.of.parameter.version"></a>

- *Type:* string

custom version.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.GlueVersion.property.name">name</a></code> | <code>string</code> | The name of this GlueVersion, as expected by Job resource. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.glue.GlueVersion.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of this GlueVersion, as expected by Job resource.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.GlueVersion.property.V0_9">V0_9</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version using Spark 2.2.1 and Python 2.7. |
| <code><a href="#cdk-extensions.glue.GlueVersion.property.V1_0">V1_0</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version using Spark 2.4.3, Python 2.7 and Python 3.6. |
| <code><a href="#cdk-extensions.glue.GlueVersion.property.V2_0">V2_0</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version using Spark 2.4.3 and Python 3.7. |
| <code><a href="#cdk-extensions.glue.GlueVersion.property.V3_0">V3_0</a></code> | <code>cdk-extensions.glue.GlueVersion</code> | Glue version using Spark 3.1.1 and Python 3.7. |

---

##### `V0_9`<sup>Required</sup> <a name="V0_9" id="cdk-extensions.glue.GlueVersion.property.V0_9"></a>

```typescript
public readonly V0_9: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version using Spark 2.2.1 and Python 2.7.

---

##### `V1_0`<sup>Required</sup> <a name="V1_0" id="cdk-extensions.glue.GlueVersion.property.V1_0"></a>

```typescript
public readonly V1_0: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version using Spark 2.4.3, Python 2.7 and Python 3.6.

---

##### `V2_0`<sup>Required</sup> <a name="V2_0" id="cdk-extensions.glue.GlueVersion.property.V2_0"></a>

```typescript
public readonly V2_0: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version using Spark 2.4.3 and Python 3.7.

---

##### `V3_0`<sup>Required</sup> <a name="V3_0" id="cdk-extensions.glue.GlueVersion.property.V3_0"></a>

```typescript
public readonly V3_0: GlueVersion;
```

- *Type:* cdk-extensions.glue.GlueVersion

Glue version using Spark 3.1.1 and Python 3.7.

---

### Group <a name="Group" id="cdk-extensions.sso.Group"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.Group.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.Group()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.Group.fromGroupId">fromGroupId</a></code> | *No description.* |

---

##### `fromGroupId` <a name="fromGroupId" id="cdk-extensions.sso.Group.fromGroupId"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Group.fromGroupId(scope: IConstruct, id: string, groupId: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.Group.fromGroupId.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.Group.fromGroupId.parameter.id"></a>

- *Type:* string

---

###### `groupId`<sup>Required</sup> <a name="groupId" id="cdk-extensions.sso.Group.fromGroupId.parameter.groupId"></a>

- *Type:* string

---



### HiveJsonInputSerDe <a name="HiveJsonInputSerDe" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.HiveJsonInputSerDe(options?: HiveJsonInputSerDeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions</code> | *No description.* |

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.addTimestampFormat">addTimestampFormat</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.bind"></a>

```typescript
public bind(_scope: IConstruct): InputFormatConfigurationProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

##### `addTimestampFormat` <a name="addTimestampFormat" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.addTimestampFormat"></a>

```typescript
public addTimestampFormat(format: string): HiveJsonInputSerDe
```

###### `format`<sup>Required</sup> <a name="format" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.addTimestampFormat.parameter.format"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.hiveJson">hiveJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.openxJson">openxJson</a></code> | *No description.* |

---

##### `hiveJson` <a name="hiveJson" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.hiveJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.HiveJsonInputSerDe.hiveJson(options: HiveJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.hiveJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions

---

##### `openxJson` <a name="openxJson" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.openxJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.HiveJsonInputSerDe.openxJson(options: OpenxJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.HiveJsonInputSerDe.openxJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions

---



### HttpEndpointDestination <a name="HttpEndpointDestination" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.HttpEndpointDestination(url: string, options?: HttpEndpointDestinationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.Initializer.parameter.url">url</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions</code> | *No description.* |

---

##### `url`<sup>Required</sup> <a name="url" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.Initializer.parameter.url"></a>

- *Type:* string

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.HttpEndpointDestinationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.addCommonAttribute">addCommonAttribute</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.addProcessor">addProcessor</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.bind"></a>

```typescript
public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `addCommonAttribute` <a name="addCommonAttribute" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.addCommonAttribute"></a>

```typescript
public addCommonAttribute(name: string, value: string): HttpEndpointDestination
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.addCommonAttribute.parameter.name"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.addCommonAttribute.parameter.value"></a>

- *Type:* string

---

##### `addProcessor` <a name="addProcessor" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.addProcessor"></a>

```typescript
public addProcessor(processor: DeliveryStreamProcessor): HttpEndpointDestination
```

###### `processor`<sup>Required</sup> <a name="processor" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.addProcessor.parameter.processor"></a>

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.endpointUrl">endpointUrl</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.processingEnabled">processingEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.accessKey">accessKey</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.backupConfiguration">backupConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.BackupConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.commonAttributes">commonAttributes</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.contentEncoding">contentEncoding</a></code> | <code>cdk-extensions.kinesis_firehose.ContentEncoding</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.endpointName">endpointName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.processorConfiguration">processorConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.retryDuration">retryDuration</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `endpointUrl`<sup>Required</sup> <a name="endpointUrl" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.endpointUrl"></a>

```typescript
public readonly endpointUrl: string;
```

- *Type:* string

---

##### `processingEnabled`<sup>Required</sup> <a name="processingEnabled" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.processingEnabled"></a>

```typescript
public readonly processingEnabled: boolean;
```

- *Type:* boolean

---

##### `accessKey`<sup>Optional</sup> <a name="accessKey" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.accessKey"></a>

```typescript
public readonly accessKey: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

---

##### `backupConfiguration`<sup>Optional</sup> <a name="backupConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.backupConfiguration"></a>

```typescript
public readonly backupConfiguration: BackupConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BackupConfiguration

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `commonAttributes`<sup>Optional</sup> <a name="commonAttributes" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.commonAttributes"></a>

```typescript
public readonly commonAttributes: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `contentEncoding`<sup>Optional</sup> <a name="contentEncoding" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.contentEncoding"></a>

```typescript
public readonly contentEncoding: ContentEncoding;
```

- *Type:* cdk-extensions.kinesis_firehose.ContentEncoding

---

##### `endpointName`<sup>Optional</sup> <a name="endpointName" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.endpointName"></a>

```typescript
public readonly endpointName: string;
```

- *Type:* string

---

##### `processorConfiguration`<sup>Optional</sup> <a name="processorConfiguration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.processorConfiguration"></a>

```typescript
public readonly processorConfiguration: ProcessorConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorConfiguration

---

##### `retryDuration`<sup>Optional</sup> <a name="retryDuration" id="cdk-extensions.kinesis_firehose.HttpEndpointDestination.property.retryDuration"></a>

```typescript
public readonly retryDuration: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


### IdentityCenterPrincipalType <a name="IdentityCenterPrincipalType" id="cdk-extensions.sso.IdentityCenterPrincipalType"></a>

Provides a wrapper around the accepted values for the IAM Identity Center [Assignment.PrincipalType attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-assignment.html#cfn-sso-assignment-principaltype).

Accepted values are provided as static properties that can be used when
configuring an assignment.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.IdentityCenterPrincipalType.of">of</a></code> | An escape hatch method that allows specifying a custom principal types in the even more options are added and the provided static types are yet to catch up. |

---

##### `of` <a name="of" id="cdk-extensions.sso.IdentityCenterPrincipalType.of"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.IdentityCenterPrincipalType.of(name: string)
```

An escape hatch method that allows specifying a custom principal types in the even more options are added and the provided static types are yet to catch up.

It is recommended that the provided static types be used when possible
instead of calling `of`.

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.IdentityCenterPrincipalType.of.parameter.name"></a>

- *Type:* string

The name for a type of IAM Identity Center Principal.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IdentityCenterPrincipalType.property.name">name</a></code> | <code>string</code> | The name for a type of IAM Identity Center Principal. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.sso.IdentityCenterPrincipalType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name for a type of IAM Identity Center Principal.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IdentityCenterPrincipalType.property.GROUP">GROUP</a></code> | <code>cdk-extensions.sso.IdentityCenterPrincipalType</code> | An IAM Identity Center group. |
| <code><a href="#cdk-extensions.sso.IdentityCenterPrincipalType.property.USER">USER</a></code> | <code>cdk-extensions.sso.IdentityCenterPrincipalType</code> | An IAM Identity Center user. |

---

##### `GROUP`<sup>Required</sup> <a name="GROUP" id="cdk-extensions.sso.IdentityCenterPrincipalType.property.GROUP"></a>

```typescript
public readonly GROUP: IdentityCenterPrincipalType;
```

- *Type:* cdk-extensions.sso.IdentityCenterPrincipalType

An IAM Identity Center group.

---

##### `USER`<sup>Required</sup> <a name="USER" id="cdk-extensions.sso.IdentityCenterPrincipalType.property.USER"></a>

```typescript
public readonly USER: IdentityCenterPrincipalType;
```

- *Type:* cdk-extensions.sso.IdentityCenterPrincipalType

An IAM Identity Center user.

---

### InputFormat <a name="InputFormat" id="cdk-extensions.glue.InputFormat"></a>

Absolute class name of the Hadoop `InputFormat` to use when reading table files.

#### Initializers <a name="Initializers" id="cdk-extensions.glue.InputFormat.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.InputFormat(className: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.InputFormat.Initializer.parameter.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.InputFormat.Initializer.parameter.className"></a>

- *Type:* string

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.InputFormat.property.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.InputFormat.property.className"></a>

```typescript
public readonly className: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.InputFormat.property.AVRO">AVRO</a></code> | <code>cdk-extensions.glue.InputFormat</code> | InputFormat for Avro files. |
| <code><a href="#cdk-extensions.glue.InputFormat.property.CLOUDTRAIL">CLOUDTRAIL</a></code> | <code>cdk-extensions.glue.InputFormat</code> | InputFormat for Cloudtrail Logs. |
| <code><a href="#cdk-extensions.glue.InputFormat.property.ORC">ORC</a></code> | <code>cdk-extensions.glue.InputFormat</code> | InputFormat for Orc files. |
| <code><a href="#cdk-extensions.glue.InputFormat.property.PARQUET">PARQUET</a></code> | <code>cdk-extensions.glue.InputFormat</code> | InputFormat for Parquet files. |
| <code><a href="#cdk-extensions.glue.InputFormat.property.TEXT">TEXT</a></code> | <code>cdk-extensions.glue.InputFormat</code> | An InputFormat for plain text files. |

---

##### `AVRO`<sup>Required</sup> <a name="AVRO" id="cdk-extensions.glue.InputFormat.property.AVRO"></a>

```typescript
public readonly AVRO: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

InputFormat for Avro files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerInputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerInputFormat.html)

---

##### `CLOUDTRAIL`<sup>Required</sup> <a name="CLOUDTRAIL" id="cdk-extensions.glue.InputFormat.property.CLOUDTRAIL"></a>

```typescript
public readonly CLOUDTRAIL: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

InputFormat for Cloudtrail Logs.

> [https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html](https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html)

---

##### `ORC`<sup>Required</sup> <a name="ORC" id="cdk-extensions.glue.InputFormat.property.ORC"></a>

```typescript
public readonly ORC: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

InputFormat for Orc files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcInputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcInputFormat.html)

---

##### `PARQUET`<sup>Required</sup> <a name="PARQUET" id="cdk-extensions.glue.InputFormat.property.PARQUET"></a>

```typescript
public readonly PARQUET: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

InputFormat for Parquet files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetInputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetInputFormat.html)

---

##### `TEXT`<sup>Required</sup> <a name="TEXT" id="cdk-extensions.glue.InputFormat.property.TEXT"></a>

```typescript
public readonly TEXT: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

An InputFormat for plain text files.

Files are broken into lines. Either linefeed or
carriage-return are used to signal end of line. Keys are the position in the file, and
values are the line of text.
JSON & CSV files are examples of this InputFormat

> [https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapred/TextInputFormat.html](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapred/TextInputFormat.html)

---

### InputFormat <a name="InputFormat" id="cdk-extensions.kinesis_firehose.InputFormat"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.InputFormat.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.InputFormat()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.InputFormat.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.InputFormat.bind"></a>

```typescript
public bind(scope: IConstruct): InputFormatConfigurationProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.InputFormat.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.InputFormat.hiveJson">hiveJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.InputFormat.openxJson">openxJson</a></code> | *No description.* |

---

##### `hiveJson` <a name="hiveJson" id="cdk-extensions.kinesis_firehose.InputFormat.hiveJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.InputFormat.hiveJson(options: HiveJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.InputFormat.hiveJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions

---

##### `openxJson` <a name="openxJson" id="cdk-extensions.kinesis_firehose.InputFormat.openxJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.InputFormat.openxJson(options: OpenxJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.InputFormat.openxJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions

---



### Instance <a name="Instance" id="cdk-extensions.sso.Instance"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.Instance.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.Instance()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.Instance.fromArn">fromArn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.sso.Instance.fromInstanceId">fromInstanceId</a></code> | *No description.* |

---

##### `fromArn` <a name="fromArn" id="cdk-extensions.sso.Instance.fromArn"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Instance.fromArn(scope: IConstruct, id: string, arn: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.Instance.fromArn.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.Instance.fromArn.parameter.id"></a>

- *Type:* string

---

###### `arn`<sup>Required</sup> <a name="arn" id="cdk-extensions.sso.Instance.fromArn.parameter.arn"></a>

- *Type:* string

---

##### `fromInstanceId` <a name="fromInstanceId" id="cdk-extensions.sso.Instance.fromInstanceId"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.Instance.fromInstanceId(scope: IConstruct, id: string, instanceId: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.Instance.fromInstanceId.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.Instance.fromInstanceId.parameter.id"></a>

- *Type:* string

---

###### `instanceId`<sup>Required</sup> <a name="instanceId" id="cdk-extensions.sso.Instance.fromInstanceId.parameter.instanceId"></a>

- *Type:* string

---



### JdbcTarget <a name="JdbcTarget" id="cdk-extensions.glue.JdbcTarget"></a>

- *Implements:* cdk-extensions.glue.ICrawlerTarget

#### Initializers <a name="Initializers" id="cdk-extensions.glue.JdbcTarget.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.JdbcTarget(connection: Connection, options: JdbcTargetOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JdbcTarget.Initializer.parameter.connection">connection</a></code> | <code>cdk-extensions.glue.Connection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JdbcTarget.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.glue.JdbcTargetOptions</code> | *No description.* |

---

##### `connection`<sup>Required</sup> <a name="connection" id="cdk-extensions.glue.JdbcTarget.Initializer.parameter.connection"></a>

- *Type:* cdk-extensions.glue.Connection

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.glue.JdbcTarget.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.glue.JdbcTargetOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JdbcTarget.addExclusion">addExclusion</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JdbcTarget.addPath">addPath</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.JdbcTarget.bind">bind</a></code> | *No description.* |

---

##### `addExclusion` <a name="addExclusion" id="cdk-extensions.glue.JdbcTarget.addExclusion"></a>

```typescript
public addExclusion(exclusion: string): void
```

###### `exclusion`<sup>Required</sup> <a name="exclusion" id="cdk-extensions.glue.JdbcTarget.addExclusion.parameter.exclusion"></a>

- *Type:* string

---

##### `addPath` <a name="addPath" id="cdk-extensions.glue.JdbcTarget.addPath"></a>

```typescript
public addPath(path: string): void
```

###### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.glue.JdbcTarget.addPath.parameter.path"></a>

- *Type:* string

---

##### `bind` <a name="bind" id="cdk-extensions.glue.JdbcTarget.bind"></a>

```typescript
public bind(_crawler: Crawler): CrawlerTargetCollection
```

###### `_crawler`<sup>Required</sup> <a name="_crawler" id="cdk-extensions.glue.JdbcTarget.bind.parameter._crawler"></a>

- *Type:* cdk-extensions.glue.Crawler

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JdbcTarget.property.connection">connection</a></code> | <code>cdk-extensions.glue.Connection</code> | *No description.* |

---

##### `connection`<sup>Required</sup> <a name="connection" id="cdk-extensions.glue.JdbcTarget.property.connection"></a>

```typescript
public readonly connection: Connection;
```

- *Type:* cdk-extensions.glue.Connection

---


### JobExecutable <a name="JobExecutable" id="cdk-extensions.glue.JobExecutable"></a>

The executable properties related to the Glue job's GlueVersion, JobType and code.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JobExecutable.bind">bind</a></code> | Called during Job initialization to get JobExecutableConfig. |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.JobExecutable.bind"></a>

```typescript
public bind(): JobExecutableConfig
```

Called during Job initialization to get JobExecutableConfig.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JobExecutable.of">of</a></code> | Create a custom JobExecutable. |
| <code><a href="#cdk-extensions.glue.JobExecutable.pythonEtl">pythonEtl</a></code> | Create Python executable props for Apache Spark ETL job. |
| <code><a href="#cdk-extensions.glue.JobExecutable.pythonShell">pythonShell</a></code> | Create Python executable props for python shell jobs. |
| <code><a href="#cdk-extensions.glue.JobExecutable.pythonStreaming">pythonStreaming</a></code> | Create Python executable props for Apache Spark Streaming job. |
| <code><a href="#cdk-extensions.glue.JobExecutable.scalaEtl">scalaEtl</a></code> | Create Scala executable props for Apache Spark ETL job. |
| <code><a href="#cdk-extensions.glue.JobExecutable.scalaStreaming">scalaStreaming</a></code> | Create Scala executable props for Apache Spark Streaming job. |

---

##### `of` <a name="of" id="cdk-extensions.glue.JobExecutable.of"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.of(config: JobExecutableConfig)
```

Create a custom JobExecutable.

###### `config`<sup>Required</sup> <a name="config" id="cdk-extensions.glue.JobExecutable.of.parameter.config"></a>

- *Type:* cdk-extensions.glue.JobExecutableConfig

custom job executable configuration.

---

##### `pythonEtl` <a name="pythonEtl" id="cdk-extensions.glue.JobExecutable.pythonEtl"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.pythonEtl(props: PythonSparkJobExecutableProps)
```

Create Python executable props for Apache Spark ETL job.

###### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.JobExecutable.pythonEtl.parameter.props"></a>

- *Type:* cdk-extensions.glue.PythonSparkJobExecutableProps

Python Apache Spark Job props.

---

##### `pythonShell` <a name="pythonShell" id="cdk-extensions.glue.JobExecutable.pythonShell"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.pythonShell(props: PythonShellExecutableProps)
```

Create Python executable props for python shell jobs.

###### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.JobExecutable.pythonShell.parameter.props"></a>

- *Type:* cdk-extensions.glue.PythonShellExecutableProps

Python Shell Job props.

---

##### `pythonStreaming` <a name="pythonStreaming" id="cdk-extensions.glue.JobExecutable.pythonStreaming"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.pythonStreaming(props: PythonSparkJobExecutableProps)
```

Create Python executable props for Apache Spark Streaming job.

###### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.JobExecutable.pythonStreaming.parameter.props"></a>

- *Type:* cdk-extensions.glue.PythonSparkJobExecutableProps

Python Apache Spark Job props.

---

##### `scalaEtl` <a name="scalaEtl" id="cdk-extensions.glue.JobExecutable.scalaEtl"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.scalaEtl(props: ScalaJobExecutableProps)
```

Create Scala executable props for Apache Spark ETL job.

###### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.JobExecutable.scalaEtl.parameter.props"></a>

- *Type:* cdk-extensions.glue.ScalaJobExecutableProps

Scala Apache Spark Job props.

---

##### `scalaStreaming` <a name="scalaStreaming" id="cdk-extensions.glue.JobExecutable.scalaStreaming"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobExecutable.scalaStreaming(props: ScalaJobExecutableProps)
```

Create Scala executable props for Apache Spark Streaming job.

###### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.JobExecutable.scalaStreaming.parameter.props"></a>

- *Type:* cdk-extensions.glue.ScalaJobExecutableProps

Scala Apache Spark Job props.

---



### JobType <a name="JobType" id="cdk-extensions.glue.JobType"></a>

The job type.

If you need to use a JobType that doesn't exist as a static member, you
can instantiate a `JobType` object, e.g: `JobType.of('other name')`.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JobType.of">of</a></code> | Custom type name. |

---

##### `of` <a name="of" id="cdk-extensions.glue.JobType.of"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.JobType.of(name: string)
```

Custom type name.

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.glue.JobType.of.parameter.name"></a>

- *Type:* string

type name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JobType.property.name">name</a></code> | <code>string</code> | The name of this JobType, as expected by Job resource. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.glue.JobType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of this JobType, as expected by Job resource.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.JobType.property.ETL">ETL</a></code> | <code>cdk-extensions.glue.JobType</code> | Command for running a Glue ETL job. |
| <code><a href="#cdk-extensions.glue.JobType.property.PYTHON_SHELL">PYTHON_SHELL</a></code> | <code>cdk-extensions.glue.JobType</code> | Command for running a Glue python shell job. |
| <code><a href="#cdk-extensions.glue.JobType.property.STREAMING">STREAMING</a></code> | <code>cdk-extensions.glue.JobType</code> | Command for running a Glue streaming job. |

---

##### `ETL`<sup>Required</sup> <a name="ETL" id="cdk-extensions.glue.JobType.property.ETL"></a>

```typescript
public readonly ETL: JobType;
```

- *Type:* cdk-extensions.glue.JobType

Command for running a Glue ETL job.

---

##### `PYTHON_SHELL`<sup>Required</sup> <a name="PYTHON_SHELL" id="cdk-extensions.glue.JobType.property.PYTHON_SHELL"></a>

```typescript
public readonly PYTHON_SHELL: JobType;
```

- *Type:* cdk-extensions.glue.JobType

Command for running a Glue python shell job.

---

##### `STREAMING`<sup>Required</sup> <a name="STREAMING" id="cdk-extensions.glue.JobType.property.STREAMING"></a>

```typescript
public readonly STREAMING: JobType;
```

- *Type:* cdk-extensions.glue.JobType

Command for running a Glue streaming job.

---

### JsonPartitioningSource <a name="JsonPartitioningSource" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.JsonPartitioningSource(options: JsonPartitioningOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.JsonPartitioningOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.JsonPartitioningOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.addPartition">addPartition</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.bind"></a>

```typescript
public bind(scope: IConstruct): DynamicPartitioningConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `addPartition` <a name="addPartition" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.addPartition"></a>

```typescript
public addPartition(name: string, query: string): void
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.addPartition.parameter.name"></a>

- *Type:* string

---

###### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.addPartition.parameter.query"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromJson">fromJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromLambda">fromLambda</a></code> | *No description.* |

---

##### `fromJson` <a name="fromJson" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.JsonPartitioningSource.fromJson(options: JsonPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.JsonPartitioningOptions

---

##### `fromLambda` <a name="fromLambda" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromLambda"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.JsonPartitioningSource.fromLambda(options: LambdaPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.fromLambda.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.LambdaPartitioningOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonPartitioningSource.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.JsonPartitioningSource.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


### JsonQuery <a name="JsonQuery" id="cdk-extensions.kinesis_firehose.JsonQuery"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.JsonQuery.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.JsonQuery(fields?: {[ key: string ]: string})
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonQuery.Initializer.parameter.fields">fields</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `fields`<sup>Optional</sup> <a name="fields" id="cdk-extensions.kinesis_firehose.JsonQuery.Initializer.parameter.fields"></a>

- *Type:* {[ key: string ]: string}

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonQuery.render">render</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonQuery.addField">addField</a></code> | *No description.* |

---

##### `render` <a name="render" id="cdk-extensions.kinesis_firehose.JsonQuery.render"></a>

```typescript
public render(): string
```

##### `addField` <a name="addField" id="cdk-extensions.kinesis_firehose.JsonQuery.addField"></a>

```typescript
public addField(name: string, query: string): JsonQuery
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.JsonQuery.addField.parameter.name"></a>

- *Type:* string

---

###### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.JsonQuery.addField.parameter.query"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonQuery.jq">jq</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonQuery.of">of</a></code> | *No description.* |

---

##### `jq` <a name="jq" id="cdk-extensions.kinesis_firehose.JsonQuery.jq"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.JsonQuery.jq(fields: {[ key: string ]: string})
```

###### `fields`<sup>Required</sup> <a name="fields" id="cdk-extensions.kinesis_firehose.JsonQuery.jq.parameter.fields"></a>

- *Type:* {[ key: string ]: string}

---

##### `of` <a name="of" id="cdk-extensions.kinesis_firehose.JsonQuery.of"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.JsonQuery.of(query: string)
```

###### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.JsonQuery.of.parameter.query"></a>

- *Type:* string

---



### LambdaPartitioningSource <a name="LambdaPartitioningSource" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.LambdaPartitioningSource(options: LambdaPartitioningOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.LambdaPartitioningOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.LambdaPartitioningOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.bind"></a>

```typescript
public bind(scope: IConstruct): DynamicPartitioningConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromJson">fromJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromLambda">fromLambda</a></code> | *No description.* |

---

##### `fromJson` <a name="fromJson" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.LambdaPartitioningSource.fromJson(options: JsonPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.JsonPartitioningOptions

---

##### `fromLambda` <a name="fromLambda" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromLambda"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.LambdaPartitioningSource.fromLambda(options: LambdaPartitioningOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.fromLambda.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.LambdaPartitioningOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.retryInterval">retryInterval</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `retryInterval`<sup>Optional</sup> <a name="retryInterval" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.retryInterval"></a>

```typescript
public readonly retryInterval: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="cdk-extensions.kinesis_firehose.LambdaPartitioningSource.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### LambdaProcessor <a name="LambdaProcessor" id="cdk-extensions.kinesis_firehose.LambdaProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.LambdaProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.LambdaProcessor(options: LambdaProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.LambdaProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.LambdaProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.LambdaProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaProcessor.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.LambdaProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.LambdaProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.LambdaProcessor.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.LambdaProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="cdk-extensions.kinesis_firehose.LambdaProcessor.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### ManagedPolicyPermissionsBoundary <a name="ManagedPolicyPermissionsBoundary" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.ManagedPolicyPermissionsBoundary(policy: IManagedPolicy)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ManagedPolicyPermissionsBoundary.Initializer.parameter.policy">policy</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | *No description.* |

---

##### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.Initializer.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ManagedPolicyPermissionsBoundary.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.bind"></a>

```typescript
public bind(_scope: IConstruct): PermissionsBoundaryProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromManagedPolicy">fromManagedPolicy</a></code> | *No description.* |
| <code><a href="#cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromReference">fromReference</a></code> | *No description.* |

---

##### `fromManagedPolicy` <a name="fromManagedPolicy" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromManagedPolicy"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ManagedPolicyPermissionsBoundary.fromManagedPolicy(policy: IManagedPolicy)
```

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromManagedPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

---

##### `fromReference` <a name="fromReference" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromReference"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ManagedPolicyPermissionsBoundary.fromReference(options: ReferenceOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.fromReference.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ManagedPolicyPermissionsBoundary.property.managedPolicy">managedPolicy</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy</code> | *No description.* |

---

##### `managedPolicy`<sup>Required</sup> <a name="managedPolicy" id="cdk-extensions.sso.ManagedPolicyPermissionsBoundary.property.managedPolicy"></a>

```typescript
public readonly managedPolicy: IManagedPolicy;
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

---


### MetadataExtractionProcessor <a name="MetadataExtractionProcessor" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.MetadataExtractionProcessor(options: MetadataExtractionProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.MetadataExtractionProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.engine">engine</a></code> | <code>cdk-extensions.kinesis_firehose.JsonParsingEngine</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.query">query</a></code> | <code>cdk-extensions.kinesis_firehose.MetaDataExtractionQuery</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `engine`<sup>Required</sup> <a name="engine" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.engine"></a>

```typescript
public readonly engine: JsonParsingEngine;
```

- *Type:* cdk-extensions.kinesis_firehose.JsonParsingEngine

---

##### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.MetadataExtractionProcessor.property.query"></a>

```typescript
public readonly query: MetaDataExtractionQuery;
```

- *Type:* cdk-extensions.kinesis_firehose.MetaDataExtractionQuery

---


### MetaDataExtractionQuery <a name="MetaDataExtractionQuery" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.MetaDataExtractionQuery(query: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.Initializer.parameter.query">query</a></code> | <code>string</code> | *No description.* |

---

##### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.Initializer.parameter.query"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.render">render</a></code> | *No description.* |

---

##### `render` <a name="render" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.render"></a>

```typescript
public render(): string
```

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.jq">jq</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.of">of</a></code> | *No description.* |

---

##### `jq` <a name="jq" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.jq"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.MetaDataExtractionQuery.jq(fields: {[ key: string ]: string})
```

###### `fields`<sup>Required</sup> <a name="fields" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.jq.parameter.fields"></a>

- *Type:* {[ key: string ]: string}

---

##### `of` <a name="of" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.of"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.MetaDataExtractionQuery.of(query: string)
```

###### `query`<sup>Required</sup> <a name="query" id="cdk-extensions.kinesis_firehose.MetaDataExtractionQuery.of.parameter.query"></a>

- *Type:* string

---



### OpenxJsonInputSerDe <a name="OpenxJsonInputSerDe" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.OpenxJsonInputSerDe(options?: OpenxJsonInputSerDeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions</code> | *No description.* |

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.addColumnKeyMapping">addColumnKeyMapping</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.bind"></a>

```typescript
public bind(_scope: IConstruct): InputFormatConfigurationProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

##### `addColumnKeyMapping` <a name="addColumnKeyMapping" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.addColumnKeyMapping"></a>

```typescript
public addColumnKeyMapping(columnName: string, jsonKey: string): OpenxJsonInputSerDe
```

###### `columnName`<sup>Required</sup> <a name="columnName" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.addColumnKeyMapping.parameter.columnName"></a>

- *Type:* string

---

###### `jsonKey`<sup>Required</sup> <a name="jsonKey" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.addColumnKeyMapping.parameter.jsonKey"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.hiveJson">hiveJson</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.openxJson">openxJson</a></code> | *No description.* |

---

##### `hiveJson` <a name="hiveJson" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.hiveJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OpenxJsonInputSerDe.hiveJson(options: HiveJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.hiveJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.HiveJsonInputSerDeOptions

---

##### `openxJson` <a name="openxJson" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.openxJson"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OpenxJsonInputSerDe.openxJson(options: OpenxJsonInputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.openxJson.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OpenxJsonInputSerDeOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.property.caseInsensitive">caseInsensitive</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.property.convertDotsToUnderscores">convertDotsToUnderscores</a></code> | <code>boolean</code> | *No description.* |

---

##### `caseInsensitive`<sup>Optional</sup> <a name="caseInsensitive" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.property.caseInsensitive"></a>

```typescript
public readonly caseInsensitive: boolean;
```

- *Type:* boolean

---

##### `convertDotsToUnderscores`<sup>Optional</sup> <a name="convertDotsToUnderscores" id="cdk-extensions.kinesis_firehose.OpenxJsonInputSerDe.property.convertDotsToUnderscores"></a>

```typescript
public readonly convertDotsToUnderscores: boolean;
```

- *Type:* boolean

---


### OrcOutputSerDe <a name="OrcOutputSerDe" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.OrcOutputSerDe(options?: OrcOutputSerDeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions</code> | *No description.* |

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.addBloomFilterColumn">addBloomFilterColumn</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.bind"></a>

```typescript
public bind(_scope: IConstruct): OutputFormatConfigurationProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

##### `addBloomFilterColumn` <a name="addBloomFilterColumn" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.addBloomFilterColumn"></a>

```typescript
public addBloomFilterColumn(column: string): OrcOutputSerDe
```

###### `column`<sup>Required</sup> <a name="column" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.addBloomFilterColumn.parameter.column"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.orc">orc</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.parquet">parquet</a></code> | *No description.* |

---

##### `orc` <a name="orc" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.orc"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OrcOutputSerDe.orc(options: OrcOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.orc.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions

---

##### `parquet` <a name="parquet" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.parquet"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OrcOutputSerDe.parquet(options: ParquetOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.parquet.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.blockSizeBytes">blockSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.bloomFilterColumns">bloomFilterColumns</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.bloomFilterFalsePositiveProbability">bloomFilterFalsePositiveProbability</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.compression">compression</a></code> | <code>cdk-extensions.kinesis_firehose.OrcCompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.dictionaryKeyThreshold">dictionaryKeyThreshold</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.enablePadding">enablePadding</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.formatVersion">formatVersion</a></code> | <code>cdk-extensions.kinesis_firehose.OrcFormatVersion</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.paddingTolerance">paddingTolerance</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.rowIndexStride">rowIndexStride</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.stripeSizeBytes">stripeSizeBytes</a></code> | <code>number</code> | *No description.* |

---

##### `blockSizeBytes`<sup>Optional</sup> <a name="blockSizeBytes" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.blockSizeBytes"></a>

```typescript
public readonly blockSizeBytes: number;
```

- *Type:* number

---

##### `bloomFilterColumns`<sup>Optional</sup> <a name="bloomFilterColumns" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.bloomFilterColumns"></a>

```typescript
public readonly bloomFilterColumns: string[];
```

- *Type:* string[]

---

##### `bloomFilterFalsePositiveProbability`<sup>Optional</sup> <a name="bloomFilterFalsePositiveProbability" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.bloomFilterFalsePositiveProbability"></a>

```typescript
public readonly bloomFilterFalsePositiveProbability: number;
```

- *Type:* number

---

##### `compression`<sup>Optional</sup> <a name="compression" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.compression"></a>

```typescript
public readonly compression: OrcCompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.OrcCompressionFormat

---

##### `dictionaryKeyThreshold`<sup>Optional</sup> <a name="dictionaryKeyThreshold" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.dictionaryKeyThreshold"></a>

```typescript
public readonly dictionaryKeyThreshold: number;
```

- *Type:* number

---

##### `enablePadding`<sup>Optional</sup> <a name="enablePadding" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.enablePadding"></a>

```typescript
public readonly enablePadding: boolean;
```

- *Type:* boolean

---

##### `formatVersion`<sup>Optional</sup> <a name="formatVersion" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.formatVersion"></a>

```typescript
public readonly formatVersion: OrcFormatVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.OrcFormatVersion

---

##### `paddingTolerance`<sup>Optional</sup> <a name="paddingTolerance" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.paddingTolerance"></a>

```typescript
public readonly paddingTolerance: number;
```

- *Type:* number

---

##### `rowIndexStride`<sup>Optional</sup> <a name="rowIndexStride" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.rowIndexStride"></a>

```typescript
public readonly rowIndexStride: number;
```

- *Type:* number

---

##### `stripeSizeBytes`<sup>Optional</sup> <a name="stripeSizeBytes" id="cdk-extensions.kinesis_firehose.OrcOutputSerDe.property.stripeSizeBytes"></a>

```typescript
public readonly stripeSizeBytes: number;
```

- *Type:* number

---


### OutputFormat <a name="OutputFormat" id="cdk-extensions.glue.OutputFormat"></a>

Absolute class name of the Hadoop `OutputFormat` to use when writing table files.

#### Initializers <a name="Initializers" id="cdk-extensions.glue.OutputFormat.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.OutputFormat(className: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.OutputFormat.Initializer.parameter.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.OutputFormat.Initializer.parameter.className"></a>

- *Type:* string

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.OutputFormat.property.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.OutputFormat.property.className"></a>

```typescript
public readonly className: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.OutputFormat.property.AVRO">AVRO</a></code> | <code>cdk-extensions.glue.InputFormat</code> | OutputFormat for Avro files. |
| <code><a href="#cdk-extensions.glue.OutputFormat.property.HIVE_IGNORE_KEY_TEXT">HIVE_IGNORE_KEY_TEXT</a></code> | <code>cdk-extensions.glue.OutputFormat</code> | Writes text data with a null key (value only). |
| <code><a href="#cdk-extensions.glue.OutputFormat.property.ORC">ORC</a></code> | <code>cdk-extensions.glue.InputFormat</code> | OutputFormat for Orc files. |
| <code><a href="#cdk-extensions.glue.OutputFormat.property.PARQUET">PARQUET</a></code> | <code>cdk-extensions.glue.OutputFormat</code> | OutputFormat for Parquet files. |

---

##### `AVRO`<sup>Required</sup> <a name="AVRO" id="cdk-extensions.glue.OutputFormat.property.AVRO"></a>

```typescript
public readonly AVRO: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

OutputFormat for Avro files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerOutputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerOutputFormat.html)

---

##### `HIVE_IGNORE_KEY_TEXT`<sup>Required</sup> <a name="HIVE_IGNORE_KEY_TEXT" id="cdk-extensions.glue.OutputFormat.property.HIVE_IGNORE_KEY_TEXT"></a>

```typescript
public readonly HIVE_IGNORE_KEY_TEXT: OutputFormat;
```

- *Type:* cdk-extensions.glue.OutputFormat

Writes text data with a null key (value only).

> [https://hive.apache.org/javadocs/r2.2.0/api/org/apache/hadoop/hive/ql/io/HiveIgnoreKeyTextOutputFormat.html](https://hive.apache.org/javadocs/r2.2.0/api/org/apache/hadoop/hive/ql/io/HiveIgnoreKeyTextOutputFormat.html)

---

##### `ORC`<sup>Required</sup> <a name="ORC" id="cdk-extensions.glue.OutputFormat.property.ORC"></a>

```typescript
public readonly ORC: InputFormat;
```

- *Type:* cdk-extensions.glue.InputFormat

OutputFormat for Orc files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcOutputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcOutputFormat.html)

---

##### `PARQUET`<sup>Required</sup> <a name="PARQUET" id="cdk-extensions.glue.OutputFormat.property.PARQUET"></a>

```typescript
public readonly PARQUET: OutputFormat;
```

- *Type:* cdk-extensions.glue.OutputFormat

OutputFormat for Parquet files.

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetOutputFormat.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetOutputFormat.html)

---

### OutputFormat <a name="OutputFormat" id="cdk-extensions.kinesis_firehose.OutputFormat"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.OutputFormat.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.OutputFormat()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OutputFormat.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.OutputFormat.bind"></a>

```typescript
public bind(scope: IConstruct): OutputFormatConfigurationProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.OutputFormat.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OutputFormat.orc">orc</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OutputFormat.parquet">parquet</a></code> | *No description.* |

---

##### `orc` <a name="orc" id="cdk-extensions.kinesis_firehose.OutputFormat.orc"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OutputFormat.orc(options: OrcOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OutputFormat.orc.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions

---

##### `parquet` <a name="parquet" id="cdk-extensions.kinesis_firehose.OutputFormat.parquet"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.OutputFormat.parquet(options: ParquetOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.OutputFormat.parquet.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions

---



### ParquetOutputSerDe <a name="ParquetOutputSerDe" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.ParquetOutputSerDe(options?: ParquetOutputSerDeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions</code> | *No description.* |

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.bind"></a>

```typescript
public bind(_scope: IConstruct): OutputFormatConfigurationProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.orc">orc</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.parquet">parquet</a></code> | *No description.* |

---

##### `orc` <a name="orc" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.orc"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.ParquetOutputSerDe.orc(options: OrcOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.orc.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.OrcOutputSerDeOptions

---

##### `parquet` <a name="parquet" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.parquet"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.ParquetOutputSerDe.parquet(options: ParquetOutputSerDeOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.parquet.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ParquetOutputSerDeOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.blockSizeBytes">blockSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.compression">compression</a></code> | <code>cdk-extensions.kinesis_firehose.ParquetCompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.enableDictionaryCompression">enableDictionaryCompression</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.maxPaddingBytes">maxPaddingBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.pageSizeBytes">pageSizeBytes</a></code> | <code>number</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.writerVersion">writerVersion</a></code> | <code>cdk-extensions.kinesis_firehose.ParquetWriterVersion</code> | *No description.* |

---

##### `blockSizeBytes`<sup>Optional</sup> <a name="blockSizeBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.blockSizeBytes"></a>

```typescript
public readonly blockSizeBytes: number;
```

- *Type:* number

---

##### `compression`<sup>Optional</sup> <a name="compression" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.compression"></a>

```typescript
public readonly compression: ParquetCompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.ParquetCompressionFormat

---

##### `enableDictionaryCompression`<sup>Optional</sup> <a name="enableDictionaryCompression" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.enableDictionaryCompression"></a>

```typescript
public readonly enableDictionaryCompression: boolean;
```

- *Type:* boolean

---

##### `maxPaddingBytes`<sup>Optional</sup> <a name="maxPaddingBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.maxPaddingBytes"></a>

```typescript
public readonly maxPaddingBytes: number;
```

- *Type:* number

---

##### `pageSizeBytes`<sup>Optional</sup> <a name="pageSizeBytes" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.pageSizeBytes"></a>

```typescript
public readonly pageSizeBytes: number;
```

- *Type:* number

---

##### `writerVersion`<sup>Optional</sup> <a name="writerVersion" id="cdk-extensions.kinesis_firehose.ParquetOutputSerDe.property.writerVersion"></a>

```typescript
public readonly writerVersion: ParquetWriterVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.ParquetWriterVersion

---


### PermissionsBoundary <a name="PermissionsBoundary" id="cdk-extensions.sso.PermissionsBoundary"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.PermissionsBoundary.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.PermissionsBoundary()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionsBoundary.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.sso.PermissionsBoundary.bind"></a>

```typescript
public bind(scope: IConstruct): PermissionsBoundaryProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.PermissionsBoundary.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.PermissionsBoundary.fromManagedPolicy">fromManagedPolicy</a></code> | *No description.* |
| <code><a href="#cdk-extensions.sso.PermissionsBoundary.fromReference">fromReference</a></code> | *No description.* |

---

##### `fromManagedPolicy` <a name="fromManagedPolicy" id="cdk-extensions.sso.PermissionsBoundary.fromManagedPolicy"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionsBoundary.fromManagedPolicy(policy: IManagedPolicy)
```

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.PermissionsBoundary.fromManagedPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

---

##### `fromReference` <a name="fromReference" id="cdk-extensions.sso.PermissionsBoundary.fromReference"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.PermissionsBoundary.fromReference(options: ReferenceOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.PermissionsBoundary.fromReference.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

---



### ProcessorConfiguration <a name="ProcessorConfiguration" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.ProcessorConfiguration(options: ProcessorConfigurationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfiguration.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.ProcessorConfigurationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfiguration.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorConfigurationResult
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfiguration.property.enabled">enabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorConfiguration.property.processors">processors</a></code> | <code>cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]</code> | *No description.* |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

---

##### `processors`<sup>Optional</sup> <a name="processors" id="cdk-extensions.kinesis_firehose.ProcessorConfiguration.property.processors"></a>

```typescript
public readonly processors: DeliveryStreamProcessor[];
```

- *Type:* cdk-extensions.kinesis_firehose.DeliveryStreamProcessor[]

---


### ProcessorType <a name="ProcessorType" id="cdk-extensions.kinesis_firehose.ProcessorType"></a>


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.of">of</a></code> | *No description.* |

---

##### `of` <a name="of" id="cdk-extensions.kinesis_firehose.ProcessorType.of"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.ProcessorType.of(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.ProcessorType.of.parameter.name"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.property.name">name</a></code> | <code>string</code> | The name of the processor to apply to the delivery stream. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.ProcessorType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the processor to apply to the delivery stream.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.property.APPEND_DELIMITER_TO_RECORD">APPEND_DELIMITER_TO_RECORD</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.property.LAMBDA">LAMBDA</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.property.METADATA_EXTRACTION">METADATA_EXTRACTION</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ProcessorType.property.RECORD_DEAGGREGATION">RECORD_DEAGGREGATION</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |

---

##### `APPEND_DELIMITER_TO_RECORD`<sup>Required</sup> <a name="APPEND_DELIMITER_TO_RECORD" id="cdk-extensions.kinesis_firehose.ProcessorType.property.APPEND_DELIMITER_TO_RECORD"></a>

```typescript
public readonly APPEND_DELIMITER_TO_RECORD: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `LAMBDA`<sup>Required</sup> <a name="LAMBDA" id="cdk-extensions.kinesis_firehose.ProcessorType.property.LAMBDA"></a>

```typescript
public readonly LAMBDA: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `METADATA_EXTRACTION`<sup>Required</sup> <a name="METADATA_EXTRACTION" id="cdk-extensions.kinesis_firehose.ProcessorType.property.METADATA_EXTRACTION"></a>

```typescript
public readonly METADATA_EXTRACTION: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `RECORD_DEAGGREGATION`<sup>Required</sup> <a name="RECORD_DEAGGREGATION" id="cdk-extensions.kinesis_firehose.ProcessorType.property.RECORD_DEAGGREGATION"></a>

```typescript
public readonly RECORD_DEAGGREGATION: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

### RecordDeaggregationProcessor <a name="RecordDeaggregationProcessor" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.RecordDeaggregationProcessor(options: RecordDeaggregationProcessorOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.RecordDeaggregationProcessorOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.bind"></a>

```typescript
public bind(_scope: IConstruct): ProcessorProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.delimited">delimited</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.json">json</a></code> | *No description.* |

---

##### `delimited` <a name="delimited" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.delimited"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.RecordDeaggregationProcessor.delimited(options: DelimitedDeaggregationOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.delimited.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.DelimitedDeaggregationOptions

---

##### `json` <a name="json" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.json"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.RecordDeaggregationProcessor.json()
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.processorType">processorType</a></code> | <code>cdk-extensions.kinesis_firehose.ProcessorType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.subRecordType">subRecordType</a></code> | <code>cdk-extensions.kinesis_firehose.SubRecordType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.delimiter">delimiter</a></code> | <code>string</code> | *No description.* |

---

##### `processorType`<sup>Required</sup> <a name="processorType" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.processorType"></a>

```typescript
public readonly processorType: ProcessorType;
```

- *Type:* cdk-extensions.kinesis_firehose.ProcessorType

---

##### `subRecordType`<sup>Required</sup> <a name="subRecordType" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.subRecordType"></a>

```typescript
public readonly subRecordType: SubRecordType;
```

- *Type:* cdk-extensions.kinesis_firehose.SubRecordType

---

##### `delimiter`<sup>Optional</sup> <a name="delimiter" id="cdk-extensions.kinesis_firehose.RecordDeaggregationProcessor.property.delimiter"></a>

```typescript
public readonly delimiter: string;
```

- *Type:* string

---


### ReferencedPermissionsBoundary <a name="ReferencedPermissionsBoundary" id="cdk-extensions.sso.ReferencedPermissionsBoundary"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.ReferencedPermissionsBoundary.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.ReferencedPermissionsBoundary(options: ReferenceOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedPermissionsBoundary.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.sso.ReferenceOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.ReferencedPermissionsBoundary.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedPermissionsBoundary.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.sso.ReferencedPermissionsBoundary.bind"></a>

```typescript
public bind(_scope: IConstruct): PermissionsBoundaryProperty
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.sso.ReferencedPermissionsBoundary.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedPermissionsBoundary.fromManagedPolicy">fromManagedPolicy</a></code> | *No description.* |
| <code><a href="#cdk-extensions.sso.ReferencedPermissionsBoundary.fromReference">fromReference</a></code> | *No description.* |

---

##### `fromManagedPolicy` <a name="fromManagedPolicy" id="cdk-extensions.sso.ReferencedPermissionsBoundary.fromManagedPolicy"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedPermissionsBoundary.fromManagedPolicy(policy: IManagedPolicy)
```

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-extensions.sso.ReferencedPermissionsBoundary.fromManagedPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy

---

##### `fromReference` <a name="fromReference" id="cdk-extensions.sso.ReferencedPermissionsBoundary.fromReference"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.ReferencedPermissionsBoundary.fromReference(options: ReferenceOptions)
```

###### `options`<sup>Required</sup> <a name="options" id="cdk-extensions.sso.ReferencedPermissionsBoundary.fromReference.parameter.options"></a>

- *Type:* cdk-extensions.sso.ReferenceOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.ReferencedPermissionsBoundary.property.referencedPolicy">referencedPolicy</a></code> | <code>cdk-extensions.sso.ReferencedManagedPolicy</code> | *No description.* |

---

##### `referencedPolicy`<sup>Required</sup> <a name="referencedPolicy" id="cdk-extensions.sso.ReferencedPermissionsBoundary.property.referencedPolicy"></a>

```typescript
public readonly referencedPolicy: ReferencedManagedPolicy;
```

- *Type:* cdk-extensions.sso.ReferencedManagedPolicy

---


### S3Code <a name="S3Code" id="cdk-extensions.glue.S3Code"></a>

Glue job Code from an S3 bucket.

#### Initializers <a name="Initializers" id="cdk-extensions.glue.S3Code.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.S3Code(bucket: IBucket, key: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.S3Code.Initializer.parameter.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Code.Initializer.parameter.key">key</a></code> | <code>string</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.S3Code.Initializer.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.S3Code.Initializer.parameter.key"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.S3Code.bind">bind</a></code> | Called when the Job is initialized to allow this object to bind. |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.S3Code.bind"></a>

```typescript
public bind(_scope: Construct, grantable: IGrantable): CodeConfig
```

Called when the Job is initialized to allow this object to bind.

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.glue.S3Code.bind.parameter._scope"></a>

- *Type:* constructs.Construct

---

###### `grantable`<sup>Required</sup> <a name="grantable" id="cdk-extensions.glue.S3Code.bind.parameter.grantable"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.S3Code.fromAsset">fromAsset</a></code> | Job code from a local disk path. |
| <code><a href="#cdk-extensions.glue.S3Code.fromBucket">fromBucket</a></code> | Job code as an S3 object. |

---

##### `fromAsset` <a name="fromAsset" id="cdk-extensions.glue.S3Code.fromAsset"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.S3Code.fromAsset(path: string, options?: AssetOptions)
```

Job code from a local disk path.

###### `path`<sup>Required</sup> <a name="path" id="cdk-extensions.glue.S3Code.fromAsset.parameter.path"></a>

- *Type:* string

code file (not a directory).

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.glue.S3Code.fromAsset.parameter.options"></a>

- *Type:* aws-cdk-lib.AssetOptions

---

##### `fromBucket` <a name="fromBucket" id="cdk-extensions.glue.S3Code.fromBucket"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.S3Code.fromBucket(bucket: IBucket, key: string)
```

Job code as an S3 object.

###### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.S3Code.fromBucket.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket.

---

###### `key`<sup>Required</sup> <a name="key" id="cdk-extensions.glue.S3Code.fromBucket.parameter.key"></a>

- *Type:* string

The object key.

---



### S3Destination <a name="S3Destination" id="cdk-extensions.kinesis_firehose.S3Destination"></a>

- *Implements:* cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination

#### Initializers <a name="Initializers" id="cdk-extensions.kinesis_firehose.S3Destination.Initializer"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

new kinesis_firehose.S3Destination(bucket: IBucket, options?: S3DestinationOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.Initializer.parameter.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.kinesis_firehose.S3DestinationOptions</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.kinesis_firehose.S3Destination.Initializer.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.kinesis_firehose.S3Destination.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.kinesis_firehose.S3DestinationOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.renderBackupConfiguration">renderBackupConfiguration</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.kinesis_firehose.S3Destination.bind"></a>

```typescript
public bind(scope: IConstruct): DeliveryStreamDestinationConfiguration
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.S3Destination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `renderBackupConfiguration` <a name="renderBackupConfiguration" id="cdk-extensions.kinesis_firehose.S3Destination.renderBackupConfiguration"></a>

```typescript
public renderBackupConfiguration(scope: IConstruct, enabled?: boolean): BackupConfigurationResult
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.S3Destination.renderBackupConfiguration.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.S3Destination.renderBackupConfiguration.parameter.enabled"></a>

- *Type:* boolean

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.buffering">buffering</a></code> | <code>cdk-extensions.kinesis_firehose.BufferingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.cloudwatchLoggingConfiguration">cloudwatchLoggingConfiguration</a></code> | <code>cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.compressionFormat">compressionFormat</a></code> | <code>cdk-extensions.kinesis_firehose.S3CompressionFormat</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.encryptionEnabled">encryptionEnabled</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.encryptionKey">encryptionKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.errorOutputPrefix">errorOutputPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3Destination.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-extensions.kinesis_firehose.S3Destination.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.kinesis_firehose.S3Destination.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `buffering`<sup>Optional</sup> <a name="buffering" id="cdk-extensions.kinesis_firehose.S3Destination.property.buffering"></a>

```typescript
public readonly buffering: BufferingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.BufferingConfiguration

---

##### `cloudwatchLoggingConfiguration`<sup>Optional</sup> <a name="cloudwatchLoggingConfiguration" id="cdk-extensions.kinesis_firehose.S3Destination.property.cloudwatchLoggingConfiguration"></a>

```typescript
public readonly cloudwatchLoggingConfiguration: CloudWatchLoggingConfiguration;
```

- *Type:* cdk-extensions.kinesis_firehose.CloudWatchLoggingConfiguration

---

##### `compressionFormat`<sup>Optional</sup> <a name="compressionFormat" id="cdk-extensions.kinesis_firehose.S3Destination.property.compressionFormat"></a>

```typescript
public readonly compressionFormat: S3CompressionFormat;
```

- *Type:* cdk-extensions.kinesis_firehose.S3CompressionFormat

---

##### `encryptionEnabled`<sup>Optional</sup> <a name="encryptionEnabled" id="cdk-extensions.kinesis_firehose.S3Destination.property.encryptionEnabled"></a>

```typescript
public readonly encryptionEnabled: boolean;
```

- *Type:* boolean

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey" id="cdk-extensions.kinesis_firehose.S3Destination.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

---

##### `errorOutputPrefix`<sup>Optional</sup> <a name="errorOutputPrefix" id="cdk-extensions.kinesis_firehose.S3Destination.property.errorOutputPrefix"></a>

```typescript
public readonly errorOutputPrefix: string;
```

- *Type:* string

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.kinesis_firehose.S3Destination.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---


### S3Target <a name="S3Target" id="cdk-extensions.glue.S3Target"></a>

- *Implements:* cdk-extensions.glue.ICrawlerTarget

#### Initializers <a name="Initializers" id="cdk-extensions.glue.S3Target.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.S3Target(bucket: IBucket, options?: S3TargetOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.S3Target.Initializer.parameter.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.Initializer.parameter.options">options</a></code> | <code>cdk-extensions.glue.S3TargetOptions</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.S3Target.Initializer.parameter.bucket"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `options`<sup>Optional</sup> <a name="options" id="cdk-extensions.glue.S3Target.Initializer.parameter.options"></a>

- *Type:* cdk-extensions.glue.S3TargetOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.S3Target.addExclusion">addExclusion</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.bind">bind</a></code> | *No description.* |

---

##### `addExclusion` <a name="addExclusion" id="cdk-extensions.glue.S3Target.addExclusion"></a>

```typescript
public addExclusion(exclusion: string): void
```

###### `exclusion`<sup>Required</sup> <a name="exclusion" id="cdk-extensions.glue.S3Target.addExclusion.parameter.exclusion"></a>

- *Type:* string

---

##### `bind` <a name="bind" id="cdk-extensions.glue.S3Target.bind"></a>

```typescript
public bind(crawler: Crawler): CrawlerTargetCollection
```

###### `crawler`<sup>Required</sup> <a name="crawler" id="cdk-extensions.glue.S3Target.bind.parameter.crawler"></a>

- *Type:* cdk-extensions.glue.Crawler

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.S3Target.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.property.connection">connection</a></code> | <code>cdk-extensions.glue.Connection</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.property.exclusions">exclusions</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.property.keyPrefix">keyPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.S3Target.property.sampleSize">sampleSize</a></code> | <code>string</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cdk-extensions.glue.S3Target.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `connection`<sup>Optional</sup> <a name="connection" id="cdk-extensions.glue.S3Target.property.connection"></a>

```typescript
public readonly connection: Connection;
```

- *Type:* cdk-extensions.glue.Connection

---

##### `exclusions`<sup>Optional</sup> <a name="exclusions" id="cdk-extensions.glue.S3Target.property.exclusions"></a>

```typescript
public readonly exclusions: string[];
```

- *Type:* string[]

---

##### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="cdk-extensions.glue.S3Target.property.keyPrefix"></a>

```typescript
public readonly keyPrefix: string;
```

- *Type:* string

---

##### `sampleSize`<sup>Optional</sup> <a name="sampleSize" id="cdk-extensions.glue.S3Target.property.sampleSize"></a>

```typescript
public readonly sampleSize: string;
```

- *Type:* string

---


### SerializationLibrary <a name="SerializationLibrary" id="cdk-extensions.glue.SerializationLibrary"></a>

Serialization library to use when serializing/deserializing (SerDe) table records.

> [https://cwiki.apache.org/confluence/display/Hive/SerDe](https://cwiki.apache.org/confluence/display/Hive/SerDe)

#### Initializers <a name="Initializers" id="cdk-extensions.glue.SerializationLibrary.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.SerializationLibrary(className: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.Initializer.parameter.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.SerializationLibrary.Initializer.parameter.className"></a>

- *Type:* string

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.className">className</a></code> | <code>string</code> | *No description.* |

---

##### `className`<sup>Required</sup> <a name="className" id="cdk-extensions.glue.SerializationLibrary.property.className"></a>

```typescript
public readonly className: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.AVRO">AVRO</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.CLOUDTRAIL">CLOUDTRAIL</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.GROK">GROK</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.HIVE_JSON">HIVE_JSON</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.LAZY_SIMPLE">LAZY_SIMPLE</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.OPEN_CSV">OPEN_CSV</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.OPENX_JSON">OPENX_JSON</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.ORC">ORC</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.PARQUET">PARQUET</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.SerializationLibrary.property.REGEXP">REGEXP</a></code> | <code>cdk-extensions.glue.SerializationLibrary</code> | *No description.* |

---

##### `AVRO`<sup>Required</sup> <a name="AVRO" id="cdk-extensions.glue.SerializationLibrary.property.AVRO"></a>

```typescript
public readonly AVRO: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/avro/AvroSerDe.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/avro/AvroSerDe.html)

---

##### `CLOUDTRAIL`<sup>Required</sup> <a name="CLOUDTRAIL" id="cdk-extensions.glue.SerializationLibrary.property.CLOUDTRAIL"></a>

```typescript
public readonly CLOUDTRAIL: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html](https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html)

---

##### `GROK`<sup>Required</sup> <a name="GROK" id="cdk-extensions.glue.SerializationLibrary.property.GROK"></a>

```typescript
public readonly GROK: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://docs.aws.amazon.com/athena/latest/ug/grok.html](https://docs.aws.amazon.com/athena/latest/ug/grok.html)

---

##### `HIVE_JSON`<sup>Required</sup> <a name="HIVE_JSON" id="cdk-extensions.glue.SerializationLibrary.property.HIVE_JSON"></a>

```typescript
public readonly HIVE_JSON: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hive/hcatalog/data/JsonSerDe.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hive/hcatalog/data/JsonSerDe.html)

---

##### `LAZY_SIMPLE`<sup>Required</sup> <a name="LAZY_SIMPLE" id="cdk-extensions.glue.SerializationLibrary.property.LAZY_SIMPLE"></a>

```typescript
public readonly LAZY_SIMPLE: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/lazy/LazySimpleSerDe.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/lazy/LazySimpleSerDe.html)

---

##### `OPEN_CSV`<sup>Required</sup> <a name="OPEN_CSV" id="cdk-extensions.glue.SerializationLibrary.property.OPEN_CSV"></a>

```typescript
public readonly OPEN_CSV: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/OpenCSVSerde.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/OpenCSVSerde.html)

---

##### `OPENX_JSON`<sup>Required</sup> <a name="OPENX_JSON" id="cdk-extensions.glue.SerializationLibrary.property.OPENX_JSON"></a>

```typescript
public readonly OPENX_JSON: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://github.com/rcongiu/Hive-JSON-Serde](https://github.com/rcongiu/Hive-JSON-Serde)

---

##### `ORC`<sup>Required</sup> <a name="ORC" id="cdk-extensions.glue.SerializationLibrary.property.ORC"></a>

```typescript
public readonly ORC: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcSerde.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcSerde.html)

---

##### `PARQUET`<sup>Required</sup> <a name="PARQUET" id="cdk-extensions.glue.SerializationLibrary.property.PARQUET"></a>

```typescript
public readonly PARQUET: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/serde/ParquetHiveSerDe.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/serde/ParquetHiveSerDe.html)

---

##### `REGEXP`<sup>Required</sup> <a name="REGEXP" id="cdk-extensions.glue.SerializationLibrary.property.REGEXP"></a>

```typescript
public readonly REGEXP: SerializationLibrary;
```

- *Type:* cdk-extensions.glue.SerializationLibrary

> [https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/RegexSerDe.html](https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/RegexSerDe.html)

---

### SharedPrincipal <a name="SharedPrincipal" id="cdk-extensions.ram.SharedPrincipal"></a>

- *Implements:* cdk-extensions.ram.ISharedPrincipal

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.ram.SharedPrincipal.bind"></a>

```typescript
public bind(_scope: IConstruct): string
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.ram.SharedPrincipal.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromAccountId">fromAccountId</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromConstruct">fromConstruct</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromOrganizationalUnitArn">fromOrganizationalUnitArn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromOrganizationArn">fromOrganizationArn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromRole">fromRole</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromStage">fromStage</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedPrincipal.fromUser">fromUser</a></code> | *No description.* |

---

##### `fromAccountId` <a name="fromAccountId" id="cdk-extensions.ram.SharedPrincipal.fromAccountId"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromAccountId(account: string)
```

###### `account`<sup>Required</sup> <a name="account" id="cdk-extensions.ram.SharedPrincipal.fromAccountId.parameter.account"></a>

- *Type:* string

---

##### `fromConstruct` <a name="fromConstruct" id="cdk-extensions.ram.SharedPrincipal.fromConstruct"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromConstruct(construct: IConstruct)
```

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-extensions.ram.SharedPrincipal.fromConstruct.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromOrganizationalUnitArn` <a name="fromOrganizationalUnitArn" id="cdk-extensions.ram.SharedPrincipal.fromOrganizationalUnitArn"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromOrganizationalUnitArn(arn: string)
```

###### `arn`<sup>Required</sup> <a name="arn" id="cdk-extensions.ram.SharedPrincipal.fromOrganizationalUnitArn.parameter.arn"></a>

- *Type:* string

---

##### `fromOrganizationArn` <a name="fromOrganizationArn" id="cdk-extensions.ram.SharedPrincipal.fromOrganizationArn"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromOrganizationArn(arn: string)
```

###### `arn`<sup>Required</sup> <a name="arn" id="cdk-extensions.ram.SharedPrincipal.fromOrganizationArn.parameter.arn"></a>

- *Type:* string

---

##### `fromRole` <a name="fromRole" id="cdk-extensions.ram.SharedPrincipal.fromRole"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromRole(role: IRole)
```

###### `role`<sup>Required</sup> <a name="role" id="cdk-extensions.ram.SharedPrincipal.fromRole.parameter.role"></a>

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `fromStage` <a name="fromStage" id="cdk-extensions.ram.SharedPrincipal.fromStage"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromStage(stage: Stage)
```

###### `stage`<sup>Required</sup> <a name="stage" id="cdk-extensions.ram.SharedPrincipal.fromStage.parameter.stage"></a>

- *Type:* aws-cdk-lib.Stage

---

##### `fromUser` <a name="fromUser" id="cdk-extensions.ram.SharedPrincipal.fromUser"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedPrincipal.fromUser(user: IUser)
```

###### `user`<sup>Required</sup> <a name="user" id="cdk-extensions.ram.SharedPrincipal.fromUser.parameter.user"></a>

- *Type:* aws-cdk-lib.aws_iam.IUser

---



### SharedResource <a name="SharedResource" id="cdk-extensions.ram.SharedResource"></a>

- *Implements:* cdk-extensions.ram.ISharedResource

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.SharedResource.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.ram.SharedResource.bind"></a>

```typescript
public bind(_scope: IConstruct): string
```

###### `_scope`<sup>Required</sup> <a name="_scope" id="cdk-extensions.ram.SharedResource.bind.parameter._scope"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.SharedResource.fromArn">fromArn</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedResource.fromProject">fromProject</a></code> | *No description.* |
| <code><a href="#cdk-extensions.ram.SharedResource.fromSubnet">fromSubnet</a></code> | *No description.* |

---

##### `fromArn` <a name="fromArn" id="cdk-extensions.ram.SharedResource.fromArn"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedResource.fromArn(arn: string)
```

###### `arn`<sup>Required</sup> <a name="arn" id="cdk-extensions.ram.SharedResource.fromArn.parameter.arn"></a>

- *Type:* string

---

##### `fromProject` <a name="fromProject" id="cdk-extensions.ram.SharedResource.fromProject"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedResource.fromProject(project: IProject)
```

###### `project`<sup>Required</sup> <a name="project" id="cdk-extensions.ram.SharedResource.fromProject.parameter.project"></a>

- *Type:* aws-cdk-lib.aws_codebuild.IProject

---

##### `fromSubnet` <a name="fromSubnet" id="cdk-extensions.ram.SharedResource.fromSubnet"></a>

```typescript
import { ram } from 'cdk-extensions'

ram.SharedResource.fromSubnet(subnet: ISubnet)
```

###### `subnet`<sup>Required</sup> <a name="subnet" id="cdk-extensions.ram.SharedResource.fromSubnet.parameter.subnet"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISubnet

---



### StructColumn <a name="StructColumn" id="cdk-extensions.glue.StructColumn"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.glue.StructColumn.Initializer"></a>

```typescript
import { glue } from 'cdk-extensions'

new glue.StructColumn(props: StructColumnProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.StructColumn.Initializer.parameter.props">props</a></code> | <code>cdk-extensions.glue.StructColumnProps</code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-extensions.glue.StructColumn.Initializer.parameter.props"></a>

- *Type:* cdk-extensions.glue.StructColumnProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.StructColumn.bind">bind</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.StructColumn.addColumn">addColumn</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.StructColumn.bind"></a>

```typescript
public bind(scope: IConstruct): ColumnProperty
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.glue.StructColumn.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `addColumn` <a name="addColumn" id="cdk-extensions.glue.StructColumn.addColumn"></a>

```typescript
public addColumn(column: Column): void
```

###### `column`<sup>Required</sup> <a name="column" id="cdk-extensions.glue.StructColumn.addColumn.parameter.column"></a>

- *Type:* cdk-extensions.glue.Column

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.StructColumn.property.typeString">typeString</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.StructColumn.property.comment">comment</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.glue.StructColumn.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `typeString`<sup>Required</sup> <a name="typeString" id="cdk-extensions.glue.StructColumn.property.typeString"></a>

```typescript
public readonly typeString: string;
```

- *Type:* string

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-extensions.glue.StructColumn.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk-extensions.glue.StructColumn.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### SubRecordType <a name="SubRecordType" id="cdk-extensions.kinesis_firehose.SubRecordType"></a>


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.SubRecordType.of">of</a></code> | *No description.* |

---

##### `of` <a name="of" id="cdk-extensions.kinesis_firehose.SubRecordType.of"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.SubRecordType.of(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.SubRecordType.of.parameter.name"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.SubRecordType.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.kinesis_firehose.SubRecordType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.SubRecordType.property.DELIMITED">DELIMITED</a></code> | <code>cdk-extensions.kinesis_firehose.SubRecordType</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.SubRecordType.property.JSON">JSON</a></code> | <code>cdk-extensions.kinesis_firehose.SubRecordType</code> | *No description.* |

---

##### `DELIMITED`<sup>Required</sup> <a name="DELIMITED" id="cdk-extensions.kinesis_firehose.SubRecordType.property.DELIMITED"></a>

```typescript
public readonly DELIMITED: SubRecordType;
```

- *Type:* cdk-extensions.kinesis_firehose.SubRecordType

---

##### `JSON`<sup>Required</sup> <a name="JSON" id="cdk-extensions.kinesis_firehose.SubRecordType.property.JSON"></a>

```typescript
public readonly JSON: SubRecordType;
```

- *Type:* cdk-extensions.kinesis_firehose.SubRecordType

---

### TableVersion <a name="TableVersion" id="cdk-extensions.kinesis_firehose.TableVersion"></a>


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.TableVersion.fixed">fixed</a></code> | *No description.* |

---

##### `fixed` <a name="fixed" id="cdk-extensions.kinesis_firehose.TableVersion.fixed"></a>

```typescript
import { kinesis_firehose } from 'cdk-extensions'

kinesis_firehose.TableVersion.fixed(version: number)
```

###### `version`<sup>Required</sup> <a name="version" id="cdk-extensions.kinesis_firehose.TableVersion.fixed.parameter.version"></a>

- *Type:* number

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.TableVersion.property.version">version</a></code> | <code>string</code> | *No description.* |

---

##### `version`<sup>Required</sup> <a name="version" id="cdk-extensions.kinesis_firehose.TableVersion.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.TableVersion.property.LATEST">LATEST</a></code> | <code>cdk-extensions.kinesis_firehose.TableVersion</code> | *No description.* |

---

##### `LATEST`<sup>Required</sup> <a name="LATEST" id="cdk-extensions.kinesis_firehose.TableVersion.property.LATEST"></a>

```typescript
public readonly LATEST: TableVersion;
```

- *Type:* cdk-extensions.kinesis_firehose.TableVersion

---

### User <a name="User" id="cdk-extensions.sso.User"></a>

#### Initializers <a name="Initializers" id="cdk-extensions.sso.User.Initializer"></a>

```typescript
import { sso } from 'cdk-extensions'

new sso.User()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.sso.User.fromUserId">fromUserId</a></code> | *No description.* |

---

##### `fromUserId` <a name="fromUserId" id="cdk-extensions.sso.User.fromUserId"></a>

```typescript
import { sso } from 'cdk-extensions'

sso.User.fromUserId(scope: IConstruct, id: string, userId: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.sso.User.fromUserId.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-extensions.sso.User.fromUserId.parameter.id"></a>

- *Type:* string

---

###### `userId`<sup>Required</sup> <a name="userId" id="cdk-extensions.sso.User.fromUserId.parameter.userId"></a>

- *Type:* string

---



### WorkerType <a name="WorkerType" id="cdk-extensions.glue.WorkerType"></a>

The type of predefined worker that is allocated when a job runs.

If you need to use a WorkerType that doesn't exist as a static member, you
can instantiate a `WorkerType` object, e.g: `WorkerType.of('other type')`.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.WorkerType.of">of</a></code> | Custom worker type. |

---

##### `of` <a name="of" id="cdk-extensions.glue.WorkerType.of"></a>

```typescript
import { glue } from 'cdk-extensions'

glue.WorkerType.of(workerType: string)
```

Custom worker type.

###### `workerType`<sup>Required</sup> <a name="workerType" id="cdk-extensions.glue.WorkerType.of.parameter.workerType"></a>

- *Type:* string

custom worker type.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.WorkerType.property.name">name</a></code> | <code>string</code> | The name of this WorkerType, as expected by Job resource. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-extensions.glue.WorkerType.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of this WorkerType, as expected by Job resource.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.glue.WorkerType.property.G_1X">G_1X</a></code> | <code>cdk-extensions.glue.WorkerType</code> | Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. |
| <code><a href="#cdk-extensions.glue.WorkerType.property.G_2X">G_2X</a></code> | <code>cdk-extensions.glue.WorkerType</code> | Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. |
| <code><a href="#cdk-extensions.glue.WorkerType.property.STANDARD">STANDARD</a></code> | <code>cdk-extensions.glue.WorkerType</code> | Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker. |

---

##### `G_1X`<sup>Required</sup> <a name="G_1X" id="cdk-extensions.glue.WorkerType.property.G_1X"></a>

```typescript
public readonly G_1X: WorkerType;
```

- *Type:* cdk-extensions.glue.WorkerType

Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker.

Suitable for memory-intensive jobs.

---

##### `G_2X`<sup>Required</sup> <a name="G_2X" id="cdk-extensions.glue.WorkerType.property.G_2X"></a>

```typescript
public readonly G_2X: WorkerType;
```

- *Type:* cdk-extensions.glue.WorkerType

Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker.

Suitable for memory-intensive jobs.

---

##### `STANDARD`<sup>Required</sup> <a name="STANDARD" id="cdk-extensions.glue.WorkerType.property.STANDARD"></a>

```typescript
public readonly STANDARD: WorkerType;
```

- *Type:* cdk-extensions.glue.WorkerType

Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.

---

## Protocols <a name="Protocols" id="Protocols"></a>

### ICrawlerTarget <a name="ICrawlerTarget" id="cdk-extensions.glue.ICrawlerTarget"></a>

- *Implemented By:* cdk-extensions.glue.JdbcTarget, cdk-extensions.glue.S3Target, cdk-extensions.glue.ICrawlerTarget

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ICrawlerTarget.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.ICrawlerTarget.bind"></a>

```typescript
public bind(crawler: Crawler): CrawlerTargetCollection
```

###### `crawler`<sup>Required</sup> <a name="crawler" id="cdk-extensions.glue.ICrawlerTarget.bind.parameter.crawler"></a>

- *Type:* cdk-extensions.glue.Crawler

---


### IDeliveryStream <a name="IDeliveryStream" id="cdk-extensions.kinesis_firehose.IDeliveryStream"></a>

- *Extends:* aws-cdk-lib.IResource, aws-cdk-lib.aws_iam.IGrantable, aws-cdk-lib.aws_ec2.IConnectable

- *Implemented By:* cdk-extensions.kinesis_firehose.DeliveryStream, cdk-extensions.kinesis_firehose.IDeliveryStream

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.grant">grant</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.grantPutRecords">grantPutRecords</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metric">metric</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Bytes">metricBackupToS3Bytes</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3DataFreshness">metricBackupToS3DataFreshness</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Records">metricBackupToS3Records</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingBytes">metricIncomingBytes</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingRecords">metricIncomingRecords</a></code> | *No description.* |

---

##### `grant` <a name="grant" id="cdk-extensions.kinesis_firehose.IDeliveryStream.grant"></a>

```typescript
public grant(grantee: IGrantable, actions: string): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-extensions.kinesis_firehose.IDeliveryStream.grant.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `actions`<sup>Required</sup> <a name="actions" id="cdk-extensions.kinesis_firehose.IDeliveryStream.grant.parameter.actions"></a>

- *Type:* string

---

##### `grantPutRecords` <a name="grantPutRecords" id="cdk-extensions.kinesis_firehose.IDeliveryStream.grantPutRecords"></a>

```typescript
public grantPutRecords(grantee: IGrantable): Grant
```

###### `grantee`<sup>Required</sup> <a name="grantee" id="cdk-extensions.kinesis_firehose.IDeliveryStream.grantPutRecords.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metric` <a name="metric" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

###### `metricName`<sup>Required</sup> <a name="metricName" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3Bytes` <a name="metricBackupToS3Bytes" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Bytes"></a>

```typescript
public metricBackupToS3Bytes(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Bytes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3DataFreshness` <a name="metricBackupToS3DataFreshness" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3DataFreshness"></a>

```typescript
public metricBackupToS3DataFreshness(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3DataFreshness.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricBackupToS3Records` <a name="metricBackupToS3Records" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Records"></a>

```typescript
public metricBackupToS3Records(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricBackupToS3Records.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricIncomingBytes` <a name="metricIncomingBytes" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingBytes"></a>

```typescript
public metricIncomingBytes(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingBytes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricIncomingRecords` <a name="metricIncomingRecords" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingRecords"></a>

```typescript
public metricIncomingRecords(props?: MetricOptions): Metric
```

###### `props`<sup>Optional</sup> <a name="props" id="cdk-extensions.kinesis_firehose.IDeliveryStream.metricIncomingRecords.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal to grant permissions to. |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | The network connections associated with this resource. |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.deliveryStreamArn">deliveryStreamArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStream.property.deliveryStreamName">deliveryStreamName</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal to grant permissions to.

---

##### `connections`<sup>Required</sup> <a name="connections" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

The network connections associated with this resource.

---

##### `deliveryStreamArn`<sup>Required</sup> <a name="deliveryStreamArn" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.deliveryStreamArn"></a>

```typescript
public readonly deliveryStreamArn: string;
```

- *Type:* string

---

##### `deliveryStreamName`<sup>Required</sup> <a name="deliveryStreamName" id="cdk-extensions.kinesis_firehose.IDeliveryStream.property.deliveryStreamName"></a>

```typescript
public readonly deliveryStreamName: string;
```

- *Type:* string

---

### IDeliveryStreamBackupDestination <a name="IDeliveryStreamBackupDestination" id="cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination"></a>

- *Implemented By:* cdk-extensions.kinesis_firehose.ExtendedS3Destination, cdk-extensions.kinesis_firehose.S3Destination, cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination.renderBackupConfiguration">renderBackupConfiguration</a></code> | *No description.* |

---

##### `renderBackupConfiguration` <a name="renderBackupConfiguration" id="cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination.renderBackupConfiguration"></a>

```typescript
public renderBackupConfiguration(scope: IConstruct, enabled?: boolean): BackupConfigurationResult
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination.renderBackupConfiguration.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

###### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-extensions.kinesis_firehose.IDeliveryStreamBackupDestination.renderBackupConfiguration.parameter.enabled"></a>

- *Type:* boolean

---


### IGroup <a name="IGroup" id="cdk-extensions.sso.IGroup"></a>

- *Implemented By:* cdk-extensions.sso.GroupBase, cdk-extensions.sso.IGroup


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IGroup.property.groupId">groupId</a></code> | <code>string</code> | *No description.* |

---

##### `groupId`<sup>Required</sup> <a name="groupId" id="cdk-extensions.sso.IGroup.property.groupId"></a>

```typescript
public readonly groupId: string;
```

- *Type:* string

---

### IIdentityCenterPrincipal <a name="IIdentityCenterPrincipal" id="cdk-extensions.sso.IIdentityCenterPrincipal"></a>

- *Implemented By:* cdk-extensions.sso.GroupBase, cdk-extensions.sso.UserBase, cdk-extensions.sso.IIdentityCenterPrincipal

Represents an entity that can be granted permissions via IAM Identity Center.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IIdentityCenterPrincipal.property.principalId">principalId</a></code> | <code>string</code> | The unique ID that identifies the entity withing IAM Identity Center. |
| <code><a href="#cdk-extensions.sso.IIdentityCenterPrincipal.property.principalType">principalType</a></code> | <code>cdk-extensions.sso.IdentityCenterPrincipalType</code> | The type of entity being represented. |

---

##### `principalId`<sup>Required</sup> <a name="principalId" id="cdk-extensions.sso.IIdentityCenterPrincipal.property.principalId"></a>

```typescript
public readonly principalId: string;
```

- *Type:* string

The unique ID that identifies the entity withing IAM Identity Center.

---

##### `principalType`<sup>Required</sup> <a name="principalType" id="cdk-extensions.sso.IIdentityCenterPrincipal.property.principalType"></a>

```typescript
public readonly principalType: IdentityCenterPrincipalType;
```

- *Type:* cdk-extensions.sso.IdentityCenterPrincipalType

The type of entity being represented.

---

### IInstance <a name="IInstance" id="cdk-extensions.sso.IInstance"></a>

- *Implemented By:* cdk-extensions.sso.InstanceBase, cdk-extensions.sso.IInstance


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IInstance.property.instanceArn">instanceArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-extensions.sso.IInstance.property.instanceId">instanceId</a></code> | <code>string</code> | *No description.* |

---

##### `instanceArn`<sup>Required</sup> <a name="instanceArn" id="cdk-extensions.sso.IInstance.property.instanceArn"></a>

```typescript
public readonly instanceArn: string;
```

- *Type:* string

---

##### `instanceId`<sup>Required</sup> <a name="instanceId" id="cdk-extensions.sso.IInstance.property.instanceId"></a>

```typescript
public readonly instanceId: string;
```

- *Type:* string

---

### ILogDestination <a name="ILogDestination" id="cdk-extensions.ec2.ILogDestination"></a>

- *Implemented By:* cdk-extensions.ec2.FlowLogDestination, cdk-extensions.ec2.ILogDestination

Represents a resource that can act as a deliver endpoint for captured flow logs.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.ILogDestination.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.ec2.ILogDestination.bind"></a>

```typescript
public bind(scope: IConstruct): FlowLogDestinationConfig
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ec2.ILogDestination.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


### IPermissionSet <a name="IPermissionSet" id="cdk-extensions.sso.IPermissionSet"></a>

- *Implemented By:* cdk-extensions.sso.PermissionSet, cdk-extensions.sso.IPermissionSet

Represents an IAM Identity Center permission set resource.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IPermissionSet.property.permissionSetArn">permissionSetArn</a></code> | <code>string</code> | *No description.* |

---

##### `permissionSetArn`<sup>Required</sup> <a name="permissionSetArn" id="cdk-extensions.sso.IPermissionSet.property.permissionSetArn"></a>

```typescript
public readonly permissionSetArn: string;
```

- *Type:* string

---

### ISharedPrincipal <a name="ISharedPrincipal" id="cdk-extensions.ram.ISharedPrincipal"></a>

- *Implemented By:* cdk-extensions.ram.SharedPrincipal, cdk-extensions.ram.ISharedPrincipal

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.ISharedPrincipal.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.ram.ISharedPrincipal.bind"></a>

```typescript
public bind(scope: IConstruct): string
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ram.ISharedPrincipal.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


### ISharedResource <a name="ISharedResource" id="cdk-extensions.ram.ISharedResource"></a>

- *Implemented By:* cdk-extensions.ram.SharedResource, cdk-extensions.ram.ISharedResource

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ram.ISharedResource.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.ram.ISharedResource.bind"></a>

```typescript
public bind(scope: IConstruct): string
```

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-extensions.ram.ISharedResource.bind.parameter.scope"></a>

- *Type:* constructs.IConstruct

---


### ITriggerAction <a name="ITriggerAction" id="cdk-extensions.glue.ITriggerAction"></a>

- *Implemented By:* cdk-extensions.glue.ITriggerAction

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ITriggerAction.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.ITriggerAction.bind"></a>

```typescript
public bind(trigger: Trigger): ActionProperty
```

###### `trigger`<sup>Required</sup> <a name="trigger" id="cdk-extensions.glue.ITriggerAction.bind.parameter.trigger"></a>

- *Type:* cdk-extensions.glue.Trigger

---


### ITriggerPredicate <a name="ITriggerPredicate" id="cdk-extensions.glue.ITriggerPredicate"></a>

- *Implemented By:* cdk-extensions.glue.ITriggerPredicate

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ITriggerPredicate.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-extensions.glue.ITriggerPredicate.bind"></a>

```typescript
public bind(trigger: Trigger): ConditionProperty
```

###### `trigger`<sup>Required</sup> <a name="trigger" id="cdk-extensions.glue.ITriggerPredicate.bind.parameter.trigger"></a>

- *Type:* cdk-extensions.glue.Trigger

---


### IUser <a name="IUser" id="cdk-extensions.sso.IUser"></a>

- *Implemented By:* cdk-extensions.sso.UserBase, cdk-extensions.sso.IUser


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-extensions.sso.IUser.property.userId">userId</a></code> | <code>string</code> | *No description.* |

---

##### `userId`<sup>Required</sup> <a name="userId" id="cdk-extensions.sso.IUser.property.userId"></a>

```typescript
public readonly userId: string;
```

- *Type:* string

---

## Enums <a name="Enums" id="Enums"></a>

### CloudWatchEncryptionMode <a name="CloudWatchEncryptionMode" id="cdk-extensions.glue.CloudWatchEncryptionMode"></a>

Encryption mode for CloudWatch Logs.

> [https://docs.aws.amazon.com/glue/latest/webapi/API_CloudWatchEncryption.html#Glue-Type-CloudWatchEncryption-CloudWatchEncryptionMode](https://docs.aws.amazon.com/glue/latest/webapi/API_CloudWatchEncryption.html#Glue-Type-CloudWatchEncryption-CloudWatchEncryptionMode)

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.CloudWatchEncryptionMode.KMS">KMS</a></code> | Server-side encryption (SSE) with an AWS KMS key managed by the account owner. |

---

##### `KMS` <a name="KMS" id="cdk-extensions.glue.CloudWatchEncryptionMode.KMS"></a>

Server-side encryption (SSE) with an AWS KMS key managed by the account owner.

> [https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html)

---


### ConfigurationVersion <a name="ConfigurationVersion" id="cdk-extensions.glue.ConfigurationVersion"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ConfigurationVersion.V1_0">V1_0</a></code> | *No description.* |

---

##### `V1_0` <a name="V1_0" id="cdk-extensions.glue.ConfigurationVersion.V1_0"></a>

---


### ConnectionType <a name="ConnectionType" id="cdk-extensions.glue.ConnectionType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.ConnectionType.JDBC">JDBC</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionType.KAFKA">KAFKA</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionType.MONGODB">MONGODB</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.ConnectionType.NETWORK">NETWORK</a></code> | *No description.* |

---

##### `JDBC` <a name="JDBC" id="cdk-extensions.glue.ConnectionType.JDBC"></a>

---


##### `KAFKA` <a name="KAFKA" id="cdk-extensions.glue.ConnectionType.KAFKA"></a>

---


##### `MONGODB` <a name="MONGODB" id="cdk-extensions.glue.ConnectionType.MONGODB"></a>

---


##### `NETWORK` <a name="NETWORK" id="cdk-extensions.glue.ConnectionType.NETWORK"></a>

---


### ContentEncoding <a name="ContentEncoding" id="cdk-extensions.kinesis_firehose.ContentEncoding"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ContentEncoding.GZIP">GZIP</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ContentEncoding.NONE">NONE</a></code> | *No description.* |

---

##### `GZIP` <a name="GZIP" id="cdk-extensions.kinesis_firehose.ContentEncoding.GZIP"></a>

---


##### `NONE` <a name="NONE" id="cdk-extensions.kinesis_firehose.ContentEncoding.NONE"></a>

---


### DeleteBehavior <a name="DeleteBehavior" id="cdk-extensions.glue.DeleteBehavior"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.DeleteBehavior.DELETE_FROM_DATABASE">DELETE_FROM_DATABASE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.DeleteBehavior.DEPRECATE_IN_DATABASE">DEPRECATE_IN_DATABASE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.DeleteBehavior.LOG">LOG</a></code> | *No description.* |

---

##### `DELETE_FROM_DATABASE` <a name="DELETE_FROM_DATABASE" id="cdk-extensions.glue.DeleteBehavior.DELETE_FROM_DATABASE"></a>

---


##### `DEPRECATE_IN_DATABASE` <a name="DEPRECATE_IN_DATABASE" id="cdk-extensions.glue.DeleteBehavior.DEPRECATE_IN_DATABASE"></a>

---


##### `LOG` <a name="LOG" id="cdk-extensions.glue.DeleteBehavior.LOG"></a>

---


### DeliveryStreamType <a name="DeliveryStreamType" id="cdk-extensions.kinesis_firehose.DeliveryStreamType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamType.DIRECT_PUT">DIRECT_PUT</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.DeliveryStreamType.KINESIS_STREAM_AS_SOURCE">KINESIS_STREAM_AS_SOURCE</a></code> | *No description.* |

---

##### `DIRECT_PUT` <a name="DIRECT_PUT" id="cdk-extensions.kinesis_firehose.DeliveryStreamType.DIRECT_PUT"></a>

---


##### `KINESIS_STREAM_AS_SOURCE` <a name="KINESIS_STREAM_AS_SOURCE" id="cdk-extensions.kinesis_firehose.DeliveryStreamType.KINESIS_STREAM_AS_SOURCE"></a>

---


### FlowLogAggregationInterval <a name="FlowLogAggregationInterval" id="cdk-extensions.ec2.FlowLogAggregationInterval"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogAggregationInterval.ONE_MINUTE">ONE_MINUTE</a></code> | Flow logs will be written at least every 60 seconds. |
| <code><a href="#cdk-extensions.ec2.FlowLogAggregationInterval.TEN_MINUTES">TEN_MINUTES</a></code> | Flow logs will be written at least every ten minutes. |

---

##### `ONE_MINUTE` <a name="ONE_MINUTE" id="cdk-extensions.ec2.FlowLogAggregationInterval.ONE_MINUTE"></a>

Flow logs will be written at least every 60 seconds.

---


##### `TEN_MINUTES` <a name="TEN_MINUTES" id="cdk-extensions.ec2.FlowLogAggregationInterval.TEN_MINUTES"></a>

Flow logs will be written at least every ten minutes.

---


### FlowLogDataType <a name="FlowLogDataType" id="cdk-extensions.ec2.FlowLogDataType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogDataType.INT_32">INT_32</a></code> | 32 bit signed int. |
| <code><a href="#cdk-extensions.ec2.FlowLogDataType.INT_64">INT_64</a></code> | 64 bit signed int. |
| <code><a href="#cdk-extensions.ec2.FlowLogDataType.STRING">STRING</a></code> | UTF-8 encoded character string. |

---

##### `INT_32` <a name="INT_32" id="cdk-extensions.ec2.FlowLogDataType.INT_32"></a>

32 bit signed int.

---


##### `INT_64` <a name="INT_64" id="cdk-extensions.ec2.FlowLogDataType.INT_64"></a>

64 bit signed int.

---


##### `STRING` <a name="STRING" id="cdk-extensions.ec2.FlowLogDataType.STRING"></a>

UTF-8 encoded character string.

---


### FlowLogFileFormat <a name="FlowLogFileFormat" id="cdk-extensions.ec2.FlowLogFileFormat"></a>

The file format options for flow log files delivered to S3.

> [[Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path)]([Flow log files](https://docs.aws.amazon.com/vpc/latest/tgw/flow-logs-s3.html#flow-logs-s3-path))

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.ec2.FlowLogFileFormat.PARQUET">PARQUET</a></code> | Apache Parquet is a columnar data format. |
| <code><a href="#cdk-extensions.ec2.FlowLogFileFormat.PLAIN_TEXT">PLAIN_TEXT</a></code> | Plain text. |

---

##### `PARQUET` <a name="PARQUET" id="cdk-extensions.ec2.FlowLogFileFormat.PARQUET"></a>

Apache Parquet is a columnar data format.

Queries on data in Parquet
format are 10 to 100 times faster compared to queries on data in plain
text. Data in Parquet format with Gzip compression takes 20 percent less
storage space than plain text with Gzip compression.

---


##### `PLAIN_TEXT` <a name="PLAIN_TEXT" id="cdk-extensions.ec2.FlowLogFileFormat.PLAIN_TEXT"></a>

Plain text.

This is the default format.

---


### JobBookmarksEncryptionMode <a name="JobBookmarksEncryptionMode" id="cdk-extensions.glue.JobBookmarksEncryptionMode"></a>

Encryption mode for Job Bookmarks.

> [https://docs.aws.amazon.com/glue/latest/webapi/API_JobBookmarksEncryption.html#Glue-Type-JobBookmarksEncryption-JobBookmarksEncryptionMode](https://docs.aws.amazon.com/glue/latest/webapi/API_JobBookmarksEncryption.html#Glue-Type-JobBookmarksEncryption-JobBookmarksEncryptionMode)

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS">CLIENT_SIDE_KMS</a></code> | Client-side encryption (CSE) with an AWS KMS key managed by the account owner. |

---

##### `CLIENT_SIDE_KMS` <a name="CLIENT_SIDE_KMS" id="cdk-extensions.glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS"></a>

Client-side encryption (CSE) with an AWS KMS key managed by the account owner.

> [https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html)

---


### JobLanguage <a name="JobLanguage" id="cdk-extensions.glue.JobLanguage"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.JobLanguage.PYTHON">PYTHON</a></code> | Python. |
| <code><a href="#cdk-extensions.glue.JobLanguage.SCALA">SCALA</a></code> | Scala. |

---

##### `PYTHON` <a name="PYTHON" id="cdk-extensions.glue.JobLanguage.PYTHON"></a>

Python.

---


##### `SCALA` <a name="SCALA" id="cdk-extensions.glue.JobLanguage.SCALA"></a>

Scala.

---


### JsonParsingEngine <a name="JsonParsingEngine" id="cdk-extensions.kinesis_firehose.JsonParsingEngine"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.JsonParsingEngine.JQ_1_6">JQ_1_6</a></code> | *No description.* |

---

##### `JQ_1_6` <a name="JQ_1_6" id="cdk-extensions.kinesis_firehose.JsonParsingEngine.JQ_1_6"></a>

---


### OrcCompressionFormat <a name="OrcCompressionFormat" id="cdk-extensions.kinesis_firehose.OrcCompressionFormat"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcCompressionFormat.NONE">NONE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcCompressionFormat.SNAPPY">SNAPPY</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcCompressionFormat.ZLIB">ZLIB</a></code> | *No description.* |

---

##### `NONE` <a name="NONE" id="cdk-extensions.kinesis_firehose.OrcCompressionFormat.NONE"></a>

---


##### `SNAPPY` <a name="SNAPPY" id="cdk-extensions.kinesis_firehose.OrcCompressionFormat.SNAPPY"></a>

---


##### `ZLIB` <a name="ZLIB" id="cdk-extensions.kinesis_firehose.OrcCompressionFormat.ZLIB"></a>

---


### OrcFormatVersion <a name="OrcFormatVersion" id="cdk-extensions.kinesis_firehose.OrcFormatVersion"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcFormatVersion.V0_11">V0_11</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.OrcFormatVersion.V0_12">V0_12</a></code> | *No description.* |

---

##### `V0_11` <a name="V0_11" id="cdk-extensions.kinesis_firehose.OrcFormatVersion.V0_11"></a>

---


##### `V0_12` <a name="V0_12" id="cdk-extensions.kinesis_firehose.OrcFormatVersion.V0_12"></a>

---


### ParquetCompressionFormat <a name="ParquetCompressionFormat" id="cdk-extensions.kinesis_firehose.ParquetCompressionFormat"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetCompressionFormat.GZIP">GZIP</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetCompressionFormat.SNAPPY">SNAPPY</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetCompressionFormat.UNCOMPRESSED">UNCOMPRESSED</a></code> | *No description.* |

---

##### `GZIP` <a name="GZIP" id="cdk-extensions.kinesis_firehose.ParquetCompressionFormat.GZIP"></a>

---


##### `SNAPPY` <a name="SNAPPY" id="cdk-extensions.kinesis_firehose.ParquetCompressionFormat.SNAPPY"></a>

---


##### `UNCOMPRESSED` <a name="UNCOMPRESSED" id="cdk-extensions.kinesis_firehose.ParquetCompressionFormat.UNCOMPRESSED"></a>

---


### ParquetWriterVersion <a name="ParquetWriterVersion" id="cdk-extensions.kinesis_firehose.ParquetWriterVersion"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetWriterVersion.V1">V1</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.ParquetWriterVersion.V2">V2</a></code> | *No description.* |

---

##### `V1` <a name="V1" id="cdk-extensions.kinesis_firehose.ParquetWriterVersion.V1"></a>

---


##### `V2` <a name="V2" id="cdk-extensions.kinesis_firehose.ParquetWriterVersion.V2"></a>

---


### PartitionUpdateBehavior <a name="PartitionUpdateBehavior" id="cdk-extensions.glue.PartitionUpdateBehavior"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.PartitionUpdateBehavior.INHERIT_FROM_TABLE">INHERIT_FROM_TABLE</a></code> | *No description.* |

---

##### `INHERIT_FROM_TABLE` <a name="INHERIT_FROM_TABLE" id="cdk-extensions.glue.PartitionUpdateBehavior.INHERIT_FROM_TABLE"></a>

---


### PredicateOperator <a name="PredicateOperator" id="cdk-extensions.glue.PredicateOperator"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.PredicateOperator.AND">AND</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.PredicateOperator.OR">OR</a></code> | *No description.* |

---

##### `AND` <a name="AND" id="cdk-extensions.glue.PredicateOperator.AND"></a>

---


##### `OR` <a name="OR" id="cdk-extensions.glue.PredicateOperator.OR"></a>

---


### PythonVersion <a name="PythonVersion" id="cdk-extensions.glue.PythonVersion"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.PythonVersion.THREE">THREE</a></code> | Python 3 (the exact version depends on GlueVersion and JobCommand used). |
| <code><a href="#cdk-extensions.glue.PythonVersion.TWO">TWO</a></code> | Python 2 (the exact version depends on GlueVersion and JobCommand used). |

---

##### `THREE` <a name="THREE" id="cdk-extensions.glue.PythonVersion.THREE"></a>

Python 3 (the exact version depends on GlueVersion and JobCommand used).

---


##### `TWO` <a name="TWO" id="cdk-extensions.glue.PythonVersion.TWO"></a>

Python 2 (the exact version depends on GlueVersion and JobCommand used).

---


### RecrawlBehavior <a name="RecrawlBehavior" id="cdk-extensions.glue.RecrawlBehavior"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.RecrawlBehavior.EVENT_MODE">EVENT_MODE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.RecrawlBehavior.EVERYTHING">EVERYTHING</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.RecrawlBehavior.NEW_FOLDERS_ONLY">NEW_FOLDERS_ONLY</a></code> | *No description.* |

---

##### `EVENT_MODE` <a name="EVENT_MODE" id="cdk-extensions.glue.RecrawlBehavior.EVENT_MODE"></a>

---


##### `EVERYTHING` <a name="EVERYTHING" id="cdk-extensions.glue.RecrawlBehavior.EVERYTHING"></a>

---


##### `NEW_FOLDERS_ONLY` <a name="NEW_FOLDERS_ONLY" id="cdk-extensions.glue.RecrawlBehavior.NEW_FOLDERS_ONLY"></a>

---


### S3CompressionFormat <a name="S3CompressionFormat" id="cdk-extensions.kinesis_firehose.S3CompressionFormat"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.kinesis_firehose.S3CompressionFormat.GZIP">GZIP</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3CompressionFormat.HADOOP_SNAPPY">HADOOP_SNAPPY</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3CompressionFormat.SNAPPY">SNAPPY</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3CompressionFormat.UNCOMPRESSED">UNCOMPRESSED</a></code> | *No description.* |
| <code><a href="#cdk-extensions.kinesis_firehose.S3CompressionFormat.ZIP">ZIP</a></code> | *No description.* |

---

##### `GZIP` <a name="GZIP" id="cdk-extensions.kinesis_firehose.S3CompressionFormat.GZIP"></a>

---


##### `HADOOP_SNAPPY` <a name="HADOOP_SNAPPY" id="cdk-extensions.kinesis_firehose.S3CompressionFormat.HADOOP_SNAPPY"></a>

---


##### `SNAPPY` <a name="SNAPPY" id="cdk-extensions.kinesis_firehose.S3CompressionFormat.SNAPPY"></a>

---


##### `UNCOMPRESSED` <a name="UNCOMPRESSED" id="cdk-extensions.kinesis_firehose.S3CompressionFormat.UNCOMPRESSED"></a>

---


##### `ZIP` <a name="ZIP" id="cdk-extensions.kinesis_firehose.S3CompressionFormat.ZIP"></a>

---


### S3EncryptionMode <a name="S3EncryptionMode" id="cdk-extensions.glue.S3EncryptionMode"></a>

Encryption mode for S3.

> [https://docs.aws.amazon.com/glue/latest/webapi/API_S3Encryption.html#Glue-Type-S3Encryption-S3EncryptionMode](https://docs.aws.amazon.com/glue/latest/webapi/API_S3Encryption.html#Glue-Type-S3Encryption-S3EncryptionMode)

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.S3EncryptionMode.KMS">KMS</a></code> | Server-side encryption (SSE) with an AWS KMS key managed by the account owner. |
| <code><a href="#cdk-extensions.glue.S3EncryptionMode.S3_MANAGED">S3_MANAGED</a></code> | Server side encryption (SSE) with an Amazon S3-managed key. |

---

##### `KMS` <a name="KMS" id="cdk-extensions.glue.S3EncryptionMode.KMS"></a>

Server-side encryption (SSE) with an AWS KMS key managed by the account owner.

> [https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html)

---


##### `S3_MANAGED` <a name="S3_MANAGED" id="cdk-extensions.glue.S3EncryptionMode.S3_MANAGED"></a>

Server side encryption (SSE) with an Amazon S3-managed key.

> [https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html)

---


### TableGroupingPolicy <a name="TableGroupingPolicy" id="cdk-extensions.glue.TableGroupingPolicy"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.TableGroupingPolicy.COMBINE_COMPATIBLE_SCHEMAS">COMBINE_COMPATIBLE_SCHEMAS</a></code> | *No description.* |

---

##### `COMBINE_COMPATIBLE_SCHEMAS` <a name="COMBINE_COMPATIBLE_SCHEMAS" id="cdk-extensions.glue.TableGroupingPolicy.COMBINE_COMPATIBLE_SCHEMAS"></a>

---


### TableType <a name="TableType" id="cdk-extensions.glue.TableType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.TableType.EXTERNAL_TABLE">EXTERNAL_TABLE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TableType.VIRTUAL_VIEW">VIRTUAL_VIEW</a></code> | *No description.* |

---

##### `EXTERNAL_TABLE` <a name="EXTERNAL_TABLE" id="cdk-extensions.glue.TableType.EXTERNAL_TABLE"></a>

---


##### `VIRTUAL_VIEW` <a name="VIRTUAL_VIEW" id="cdk-extensions.glue.TableType.VIRTUAL_VIEW"></a>

---


### TableUpdateBehavior <a name="TableUpdateBehavior" id="cdk-extensions.glue.TableUpdateBehavior"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.TableUpdateBehavior.MERGE_NEW_COLUMNS">MERGE_NEW_COLUMNS</a></code> | *No description.* |

---

##### `MERGE_NEW_COLUMNS` <a name="MERGE_NEW_COLUMNS" id="cdk-extensions.glue.TableUpdateBehavior.MERGE_NEW_COLUMNS"></a>

---


### TriggerType <a name="TriggerType" id="cdk-extensions.glue.TriggerType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.TriggerType.CONDITIONAL">CONDITIONAL</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerType.EVENT">EVENT</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerType.ON_DEMAND">ON_DEMAND</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.TriggerType.SCHEDULED">SCHEDULED</a></code> | *No description.* |

---

##### `CONDITIONAL` <a name="CONDITIONAL" id="cdk-extensions.glue.TriggerType.CONDITIONAL"></a>

---


##### `EVENT` <a name="EVENT" id="cdk-extensions.glue.TriggerType.EVENT"></a>

---


##### `ON_DEMAND` <a name="ON_DEMAND" id="cdk-extensions.glue.TriggerType.ON_DEMAND"></a>

---


##### `SCHEDULED` <a name="SCHEDULED" id="cdk-extensions.glue.TriggerType.SCHEDULED"></a>

---


### UpdateBehavior <a name="UpdateBehavior" id="cdk-extensions.glue.UpdateBehavior"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-extensions.glue.UpdateBehavior.UPDATE_IN_DATABASE">UPDATE_IN_DATABASE</a></code> | *No description.* |
| <code><a href="#cdk-extensions.glue.UpdateBehavior.LOG">LOG</a></code> | *No description.* |

---

##### `UPDATE_IN_DATABASE` <a name="UPDATE_IN_DATABASE" id="cdk-extensions.glue.UpdateBehavior.UPDATE_IN_DATABASE"></a>

---


##### `LOG` <a name="LOG" id="cdk-extensions.glue.UpdateBehavior.LOG"></a>

---
