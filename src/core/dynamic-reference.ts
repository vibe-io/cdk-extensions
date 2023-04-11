import { IResolvable } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { DynamicReferenceProvider } from './dynamic-reference-provider';


export class DynamicReference {
  public static any(scope: IConstruct, value: IResolvable): IResolvable {
    return DynamicReferenceProvider.of(scope).forAny(scope, value);
  }

  public static number(scope: IConstruct, value: number): number {
    return DynamicReferenceProvider.of(scope).forNumber(scope, value);
  }

  public static string(scope: IConstruct, value: string): string {
    return DynamicReferenceProvider.of(scope).forString(scope, value);
  }

  public static stringList(scope: IConstruct, value: string[]): string[] {
    return DynamicReferenceProvider.of(scope).forStringList(scope, value);
  }
}
