import { CfnParameter, IResolvable, IResolveContext, Lazy, Stack } from 'aws-cdk-lib';
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

class ParameterReference {
  private readonly _producer: IConstruct;
  private readonly _type: ParameterReferenceType;
  private readonly _value: any;


  public constructor(scope: IConstruct, value: any, parameterType: ParameterReferenceType) {
    this._producer = scope;
    this._type = parameterType;
    this._value = value;
  }

  public valueForScope(scope: IConstruct): any {
    const relation = getRelation(scope, this._producer);

    if (relation === ConstructRelation.LOCAL) {
      return this._value;
    } else {
      const consumerStack = Stack.of(scope);
      const producerStack = Stack.of(this._producer);
      const unresolvedImport = producerStack.exportValue(this._value);
      const resolvedImport = producerStack.resolve(unresolvedImport);
      const exportId = resolvedImport['Fn::ImportValue'];

      const parameter = consumerStack.node.tryFindChild(exportId) as CfnParameter ?? new CfnParameter(consumerStack, exportId, {
        type: this._type,
      });

      if (this._type === ParameterReferenceType.STRING) {
        return parameter.valueAsString;
      } else if (this._type === ParameterReferenceType.STRING_LIST) {
        return parameter.valueAsList;
      } else if (this._type === ParameterReferenceType.NUMBER) {
        return parameter.valueAsNumber;
      } else {
        return parameter.value;
      }
    }
  }
}

class ParameterReferenceProvider implements IDynamicReferenceProvider {
  public forAny(scope: IConstruct, value: IResolvable): IResolvable {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.BOOLEAN);

    return Lazy.uncachedAny({
      produce: (context: IResolveContext) => {
        return ref.valueForScope(context.scope);
      },
    });
  }

  public forNumber(scope: IConstruct, value: number): number {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.NUMBER);

    return Lazy.uncachedNumber({
      produce: (context: IResolveContext) => {
        return ref.valueForScope(context.scope);
      },
    });
  }

  public forString(scope: IConstruct, value: string): string {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.STRING);

    return Lazy.uncachedString({
      produce: (context: IResolveContext) => {
        return ref.valueForScope(context.scope);
      },
    });
  }

  public forStringList(scope: IConstruct, value: string[]): string[] {
    const ref = new ParameterReference(scope, value, ParameterReferenceType.STRING_LIST);

    return Lazy.uncachedList({
      produce: (context: IResolveContext) => {
        return ref.valueForScope(context.scope);
      },
    });
  }
}

export const PROVIDER_KEY = 'dynamic-reference::export-parameter';
export const PROVIDER = new ParameterReferenceProvider();
