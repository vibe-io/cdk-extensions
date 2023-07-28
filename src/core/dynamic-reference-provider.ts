import { IConstruct } from 'constructs';
import { IDynamicReferenceProvider } from './dynamic-reference-provider-ref';
import * as ParameterReference from './export-parameter-provider';


export class DynamicReferenceProvider {
  public static readonly DEFAULT_PROVIDER: string = ParameterReference.PROVIDER_KEY;
  public static readonly DYNAMIC_PROVIDER_CONTEXT: string = '@cdk-extensions/core:dynamicReferenceProvider';


  public static of(scope: IConstruct): IDynamicReferenceProvider {
    const contextKey = DynamicReferenceProvider.DYNAMIC_PROVIDER_CONTEXT;
    const defaultProvider = DynamicReferenceProvider.DEFAULT_PROVIDER;

    const key = scope.node.tryGetContext(contextKey) as string ?? defaultProvider;
    return DynamicReferenceProvider._providers[key];
  }

  public static register(key: string, provider: IDynamicReferenceProvider): void {
    DynamicReferenceProvider._providers[key] = provider;
  }

  private static _providers: {[key: string]: IDynamicReferenceProvider} = {};
}


DynamicReferenceProvider.register(ParameterReference.PROVIDER_KEY, ParameterReference.PROVIDER);
