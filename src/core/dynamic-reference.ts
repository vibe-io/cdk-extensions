import { IResolvable } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { DynamicReferenceLock } from './dynamic-reference-lock';
import { DynamicReferenceProvider } from './dynamic-reference-provider';


export class DynamicReference {
  public static any(scope: IConstruct, value: IResolvable): IResolvable {
    const token = DynamicReferenceProvider.of(scope).forAny(scope, value);
    DynamicReferenceLock.registerAny(scope, token);
    return token;
  }

  public static number(scope: IConstruct, value: number): number {
    const token = DynamicReferenceProvider.of(scope).forNumber(scope, value);
    DynamicReferenceLock.registerNumber(scope, token);
    return token;
  }

  public static string(scope: IConstruct, value: string): string {
    const token = DynamicReferenceProvider.of(scope).forString(scope, value);
    DynamicReferenceLock.registerString(scope, token);
    return token;
  }

  public static stringList(scope: IConstruct, value: string[]): string[] {
    const token = DynamicReferenceProvider.of(scope).forStringList(scope, value);
    DynamicReferenceLock.registerStringList(scope, token);
    return token;
  }
}
