import { Aspects, CfnResource, IAspect, Stack, Stage, Token, Tokenization } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';


export class DynamicReferenceLock extends Construct implements IAspect {
  private static readonly DEFAULT_ID: string = 'dynamic-reference-lock';

  private static getLockForScope(scope: IConstruct): DynamicReferenceLock {
    const stage = Stage.of(scope);

    if (!stage) {
      throw Error([
        'Cannot register a dynamic reference lock for constructs that do not',
        'belong to a CDK stage construct.',
      ].join(' '));
    } else {
      const id = DynamicReferenceLock.DEFAULT_ID;
      return stage.node.tryFindChild(id) as DynamicReferenceLock ?? new DynamicReferenceLock(stage, id);
    }
  }

  public static registerAny(scope: IConstruct, token: any): void {
    const lock = DynamicReferenceLock.getLockForScope(scope);
    lock.registerStringToken(Token.asString(token));
  }

  public static registerNumber(scope: IConstruct, token: number): void {
    const lock = DynamicReferenceLock.getLockForScope(scope);
    lock.registerNumberToken(token);
    lock.registerStringToken(`${token}`);
  }

  public static registerString(scope: IConstruct, token: string): void {
    const lock = DynamicReferenceLock.getLockForScope(scope);
    lock.registerStringToken(token);
  }

  public static registerStringList(scope: IConstruct, token: string[]): void {
    const lock = DynamicReferenceLock.getLockForScope(scope);
    lock.registerStringToken(Token.asString(token));
  }

  private _locked: boolean;
  private readonly _scope: Stage;

  private readonly _numberTokens: number[];
  private readonly _stringTokens: string[];


  private constructor(scope: Stage, id: string) {
    super(scope, id);

    this._numberTokens = [];
    this._stringTokens = [];

    this._locked = false;
    this._scope = scope;

    Aspects.of(this).add(this);
  }

  private registerNumberToken(token: number): void {
    if (this._locked) {
      throw new Error([
        `Stage '${this._scope.node.path}' is locked and no new dynamic`,
        'references can be created.',
      ].join(' '));
    }

    if (!this._numberTokens.includes(token)) {
      this._numberTokens.push(token);
    }
  }

  private registerStringToken(token: string): void {
    if (this._locked) {
      throw new Error([
        `Stage '${this._scope.node.path}' is locked and no new dynamic`,
        'references can be created.',
      ].join(' '));
    }

    if (!this._stringTokens.includes(token)) {
      this._stringTokens.push(token);
    }
  }

  private walkProperties(resource: CfnResource, obj: object): void {
    for (const [_key, value] of Object.entries(obj)) {
      if (!Token.isUnresolved(value)) {
        continue;
      } else if (typeof(value) === 'string' && this._stringTokens.includes(value)) {
        Stack.of(resource).resolve(value);
      } else if (typeof(value) === 'number' && this._numberTokens.includes(value)) {
        Stack.of(resource).resolve(value);
      } else if (Array.isArray(value) && Token.isUnresolved(value) && this._stringTokens.includes(Token.asString(value))) {
        Stack.of(resource).resolve(value);
      } else if (Tokenization.isResolvable(value) && this._stringTokens.includes(Token.asString(value))) {
        Stack.of(resource).resolve(value);
      }
    }
  }

  private walkResource(resource: CfnResource): void {
    for (const [key, value] of Object.entries(resource)) {
      if (key === '_cfnProperties' && typeof(value) === 'object') {
        this.walkProperties(resource, value);
      }
    }
  }

  private walkStage(stage: Stage): void {
    // Find all CfnResources in the stage.
    const resources = stage.node.findAll().filter((x) => {
      return CfnResource.isCfnResource(x);
    }) as CfnResource[];

    // For each CfnResource walk its properties to find any instances of our
    // registered tokens.
    resources.forEach((x) => {
      this.walkResource(x);
    });
  }

  public visit(node: IConstruct): void {
    if (node === this) {
      // Get the top level construct for the tree.
      const root = this._scope.node.root;

      // Get all other stages in the construct tree that aren't the immediate
      // our scope.
      const relatives = root.node.findAll().filter((x) => {
        return Stage.isStage(x);
      }).filter((x) => {
        return x !== this._scope;
      }) as Stage[];

      // For every stage identified walk all resources to identify token usage.
      relatives.forEach((x) => {
        this.walkStage(x);
      });

      // Lock dynamic references from being added to the stage. Making it here
      // means the stage has been synthed so no changes that happen after this
      // point will be respected.
      this._locked = true;
    }
  }
}