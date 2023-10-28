import { ArnFormat, IResolveContext, Lazy, Stack } from "aws-cdk-lib";
import { IStateMachine, JsonPath, StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { IConstruct } from "constructs";
import { ContextData } from "./context-data";


/**
 * Provides functionality allowing handler state machines to be referenced
 * while inferring information from the context of the currently executing
 * state machine.
 */
export class HandlerReference {
  /**
   * Creates a new reference to a handler state machine.
   * 
   * When properties of the handler are referenced from within another state
   * machine, that state machine's context is used to infer things like the
   * currently executing partition, account, and region.
   * 
   * When properties of the handler are referenced in any other context then
   * those details are exposed via the CloudFormation context it is being 
   * deployed under.
   * 
   * This allows the resulting state machine to be more portable.
   * 
   * @param scope A CDK Construct that will serve as the reference parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param handlerName The name of the handler state machine to be invoked as
   * a child execution.
   * @returns A context aware state machine object.
   */
  public static create(scope: IConstruct, id: string, handlerName: string): IStateMachine {
    


    const token = Lazy.uncachedString({
      produce: (context: IResolveContext) => {
        if (context.documentPath.includes('definitionString')) {
          return JsonPath.format('arn:{}:states:{}:{}:stateMachine:{}', ...[
            ContextData.partition,
            ContextData.region,
            ContextData.account,
            handlerName,
          ]);
        } else {
          return Stack.of(scope).formatArn({
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resource: 'stateMachine',
            resourceName: handlerName,
            service: 'states',
          });
        }
      },
    });

    const symbol = Symbol.for('@aws-cdk/aws-stepfunctions.JsonPathToken');
    Object.defineProperty(token, symbol, {
      value: true
    });

    return StateMachine.fromStateMachineArn(scope, id, token);
  }
}