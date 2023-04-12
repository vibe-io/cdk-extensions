import { CfnParameter, IResolvable, IResolveContext, Lazy, Stack, Token } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { IDynamicReferenceProvider } from './dynamic-reference-provider-ref';
import { ConstructRelation, getRelation } from './relations';


export enum ParameterReferenceType {
  BOOLEAN = 'String',
  NUMBER = 'Number',
  NUMBER_LIST = 'List<Number>',
  STRING = 'String',
  STRING_LIST = 'CommaDelimitedList',
}

interface ExportInfo {
  readonly importReference: IResolvable;
  readonly exportName: string;
}

class ParameterReference {
  private readonly _producer: IConstruct;
  private readonly _type: ParameterReferenceType;
  private readonly _value: any;


  public constructor(scope: IConstruct, value: any, parameterType: ParameterReferenceType) {
    this._producer = scope;
    this._type = parameterType;
    this._value = value;
  }

  private makeListExport(producer: Stack): ExportInfo {
    const ref = Token.asAny(producer.exportStringListValue(this._value));
    const resolvedImport = producer.resolve(ref);

    return {
      exportName: resolvedImport['Fn::Split'][1]['Fn::ImportValue'],
      importReference: ref,
    };
  }

  private makeScalarExport(producer: Stack): ExportInfo {
    const ref = Token.asAny(producer.exportValue(this._value));
    const resolvedImport = producer.resolve(ref);

    return {
      exportName: resolvedImport['Fn::ImportValue'],
      importReference: ref,
    };
  }

  private makeExport(producer: Stack): ExportInfo {
    return this._type === ParameterReferenceType.STRING_LIST ?
      this.makeListExport(producer) :
      this.makeScalarExport(producer);
  }

  public valueForScope(scope: IConstruct): any {
    const relation = getRelation(scope, this._producer);

    if (relation === ConstructRelation.LOCAL) {
      return this._value;
    } else if (relation === ConstructRelation.CROSS_STAGE) {
      const producerStack = Stack.of(this._producer);
      return this.makeExport(producerStack).importReference;
    } else {
      const consumerStack = Stack.of(scope);
      const producerStack = Stack.of(this._producer);
      const { exportName } = this.makeExport(producerStack);

      const parameter = consumerStack.node.tryFindChild(exportName) as CfnParameter ?? new CfnParameter(consumerStack, exportName, {
        type: this._type,
      });
      return parameter.value;
    }
  }
}

class ParameterReferenceProvider implements IDynamicReferenceProvider {
  public forAny(scope: IConstruct, value: IResolvable): IResolvable {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.STRING);

    return Lazy.uncachedAny({
      produce: (context: IResolveContext) => {
        return Token.asAny(ref.valueForScope(context.scope));
      },
    });
  }

  public forNumber(scope: IConstruct, value: number): number {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.NUMBER);

    return Lazy.uncachedNumber({
      produce: (context: IResolveContext) => {
        return Token.asNumber(ref.valueForScope(context.scope));
      },
    });
  }

  public forString(scope: IConstruct, value: string): string {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.STRING);

    return Lazy.uncachedString({
      produce: (context: IResolveContext) => {
        return Token.asString(ref.valueForScope(context.scope));
      },
    });
  }

  public forStringList(scope: IConstruct, value: string[]): string[] {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.STRING_LIST);

    return Lazy.uncachedList({
      produce: (context: IResolveContext) => {
        return Token.asList(ref.valueForScope(context.scope));
      },
    });
  }
}

export const PROVIDER_KEY = 'dynamic-reference::export-parameter';
export const PROVIDER = new ParameterReferenceProvider();
