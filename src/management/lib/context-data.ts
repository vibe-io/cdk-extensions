import { JsonPath } from "aws-cdk-lib/aws-stepfunctions";


export class ContextData {
  public static readonly account = JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.executionId, ':'), 4);
  public static readonly partition = JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.executionId, ':'), 1);
  public static readonly region = JsonPath.arrayGetItem(JsonPath.stringSplit(JsonPath.executionId, ':'), 3);
}