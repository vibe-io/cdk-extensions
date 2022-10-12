import { IResolveContext, Lazy, Stage } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export function contextAwareString(scope: IConstruct, token: string, defined: string): string {
  return Lazy.uncachedString({
    produce: (context: IResolveContext) => {
      const objectScope = Stage.of(scope);
      const contextScope = Stage.of(context.scope);
      return objectScope === contextScope ? token : defined;
    },
  });
}
