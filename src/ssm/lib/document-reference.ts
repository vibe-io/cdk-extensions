import { IResolvable, IResolveContext, Lazy, Token } from "aws-cdk-lib";
import { Construct, IConstruct } from "constructs";


const REFERENCE_SYMBOL = Symbol.for('cdk-extensions/ssm.DocumentReference');

export class DocumentReferenceType {
  public static readonly BOOLEAN: DocumentReferenceType = DocumentReferenceType.of('Boolean');
  public static readonly INTEGER: DocumentReferenceType = DocumentReferenceType.of('Integer');
  public static readonly MAP_LIST: DocumentReferenceType = DocumentReferenceType.of('MapList');
  public static readonly STRING: DocumentReferenceType = DocumentReferenceType.of('String');
  public static readonly STRING_LIST: DocumentReferenceType = DocumentReferenceType.of('StringList');
  public static readonly STRING_MAP: DocumentReferenceType = DocumentReferenceType.of('StringMap');

  public static of(name: string): DocumentReferenceType {
    return new DocumentReferenceType(name);
  }


  private constructor(public readonly name: string) {}
}

export interface DocumentReferenceProps {
  readonly reference: string;
  readonly type: DocumentReferenceType;
}

export class DocumentReference extends Construct {
  public static isReference(x: any): x is DocumentReference {
    return typeof x === 'object' && x !== null && REFERENCE_SYMBOL in x;
  }

  public static resolveUnion<T>(obj: T | DocumentReference, f: {(x: T): any}): any {
    return DocumentReference.isReference(obj) ? obj.value : f(obj);
  }

  private readonly _referenceContent: string;

  public readonly type: DocumentReferenceType;

  public get value(): IResolvable {
    return Lazy.uncachedAny({
      produce: (context: IResolveContext) => {
        if (context.scope === undefined || context.scope !== this.node.scope) {
          throw new Error([
            'Resolving the value of an SSM document reference is only',
            'supported within the same scope (document) as the reference.',
            `itself. Tried to resolve reference '${this.node.addr}' outside`,
            `its containing scope at '${context.scope.node.addr}'.`
          ].join(' '));
        }

        return `{{${this._referenceContent}}}`;
      }
    });
  }

  public get valueAsList(): string[] {
    if (this.type !== DocumentReferenceType.STRING_LIST) {
      throw new Error([
        `Cannot convert document parameter type '${this.type}' to a string`,
        'array.',
      ].join(' '));
    }

    return Token.asList(this.value);
  }

  public get valueAsString(): string {
    return Token.asString(this.value);
  }


  public constructor(scope: IConstruct, id: string, props: DocumentReferenceProps) {
    super(scope, id);

    this._referenceContent = props.reference;
    this.type = props.type;

    Object.defineProperty(this, REFERENCE_SYMBOL, {
      value: true,
    });
  }
}