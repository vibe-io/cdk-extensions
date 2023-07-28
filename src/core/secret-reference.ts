import { IResolveContext, Lazy, Resource, SecretValue, Stack } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { IConstruct } from 'constructs';
import { ConstructRelation, getRelation } from './relations';


class SecretReferenceSecret extends Resource {
  public static of(scope: IConstruct): SecretReferenceSecret {
    const stack = Stack.of(scope);
    const id = 'cross-stage-reference-secret';
    return stack.node.tryFindChild(id) as SecretReferenceSecret ?? new SecretReferenceSecret(stack);
  }

  private readonly _consumedKeys: Set<string>;
  private readonly _consumerAccounts: string[];
  private _secret?: Secret;
  private readonly _values: {[key: string]: string};


  private constructor(scope: Stack) {
    super(scope, 'cross-stage-reference-secret');

    this._consumedKeys = new Set<string>();
    this._consumerAccounts = [];
    this._values = {};
  }

  private buildKey(producer: IConstruct, key: string): string {
    return `${producer.node.addr}_${key}`;
  }

  private _enableSecret(): Secret {
    if (!this._secret) {
      this._secret = new Secret(this, 'inner-secret', {
        description: `Secret used for sharing values from ${this.stack.stackName} to other accounts and regions.`,
        secretName: `cfn-outputs-${this.stack.node.addr}`,
        secretStringValue: new SecretValue(Lazy.string({
          produce: () => {
            return this._renderSecret();
          },
        })),
      });

      return this._secret;
    } else {
      return this._secret;
    }
  }

  private _registerConsumer(consumer: IConstruct): void {
    const account = Stack.of(consumer).account;

    if (account != this.stack.account && !this._consumerAccounts.includes(account)) {
      this._consumerAccounts.push(account);
    }
  }

  private _renderSecret(): string {
    const consumed = Array.from(this._consumedKeys).sort();

    return this.stack.toJsonString(consumed.reduce((prev, cur) => {
      prev[cur] = this._values[cur];
      return prev;
    }, {} as { [key: string]: any }));
  }

  public addField(producer: IConstruct, key: string, value: string): void {
    const fullKey = this.buildKey(producer, key);

    if (fullKey in this._values) {
      throw new Error([
        `Attempted to register duplicate reference '${key}' from resource`,
        `'${producer.node.path}' to be shared cross account/region.`,
      ].join(' '));
    }

    this._values[fullKey] = value;
  }

  public getField(producer: IConstruct, consumer: IConstruct, key: string): string {
    this._registerConsumer(consumer);

    const secret = this._enableSecret();
    const fullKey = `${producer.node.addr}_${key}`;

    this._consumedKeys.add(fullKey);
    return secret.secretValueFromJson(fullKey).toString();
  }
}

export class SecretReference {
  public static string(scope: IConstruct, key: string, value: string): string {
    const ref = new SecretReference(scope, key, value);

    return Lazy.uncachedString({
      produce: (context: IResolveContext) => {
        return ref.valueForScope(context.scope);
      },
    });
  }

  private readonly _key: string;
  private readonly _producer: IConstruct;
  private readonly _secret: SecretReferenceSecret;
  private readonly _value: string;


  private constructor(scope: IConstruct, key: string, value: string) {
    this._producer = scope;
    this._key = key;
    this._value = value;

    this._secret = SecretReferenceSecret.of(scope);
    this._secret.addField(scope, key, value);
  }

  public valueForScope(scope: IConstruct) {
    const relation = getRelation(scope, this._producer);

    if (relation === ConstructRelation.LOCAL) {
      return this._value;
    } else {
      return this._secret.getField(this._producer, scope, this._key);
    }
  }
}