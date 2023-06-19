
const INTRINSIC_REGEX = /^States\.[A-Za-z]+\(.*\)$/s;
const JSON_PATH_REGEX = /^\${1,2}((\[([0-9]|\?.+?)\])?(\.[A-Za-z0-9]+|$))*$/;


export class StepFunctionValidation {
  public static isIntrinsic(value: string): boolean {
    return INTRINSIC_REGEX.test(value);
  }

  public static isJsonPath(value: string): boolean {
    return JSON_PATH_REGEX.test(value);
  }

  public static isStatesExpression(value: string): boolean {
    return StepFunctionValidation.isIntrinsic(value) || StepFunctionValidation.isJsonPath(value);
  }
}
