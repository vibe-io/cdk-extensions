import { Token } from 'aws-cdk-lib';
import { StepFunctionValidation } from './validation';


function assertExpression(value: string, arg: string, intrinsic: string): void {
  if (Token.isUnresolved(value)) {
    return;
  }

  if (!StepFunctionValidation.isStatesExpression(value)) {
    throw new Error([
      'Expected a valid AWS States expression (JsonPath or intrinsic',
      `function) for '${arg}' argument of '${intrinsic}' got '${value}'`,
      'instead.',
    ].join(' '));
  }
}

function assertExpressionOrInt(value: string, arg: string, intrinsic: string): void {
  if (Token.isUnresolved(value) || /^[0-9]+$/.test(value)) {
    return;
  }

  if (!StepFunctionValidation.isStatesExpression(value)) {
    throw new Error([
      'Expected an interger or a valid AWS States expression (JsonPath or',
      `intrinsic function) for '${arg}' argument of '${intrinsic}' got`,
      `'${value}' instead.`,
    ].join(' '));
  }
}

function escape(value: string): string {
  return value.replace('\\', '\\\\').replace("'", "\\'");
}

function toInline(value: any): string {
  if (typeof value === 'string' && !StepFunctionValidation.isStatesExpression(value)) {
    return `'${escape(value)}'`;
  } else if (value === undefined) {
    return 'null';
  } else {
    return value.toString();
  }
}

export class SfnFn {
  public static array(...values: any[]): string {
    const joinedValues = values.map((x) => {
      return toInline(x);
    }).join(', ');

    return `States.Array(${joinedValues})`;
  }

  public static arrayContains(array: string, lookingFor: any): string {
    assertExpression(array, 'array', 'ArrayContains');

    return `States.ArrayContains(${array}, ${toInline(lookingFor)})`;
  }

  public static arrayGetItem(array: string, index: any): string {
    const resolvedIndex = index.toString();

    assertExpression(array, 'array', 'ArrayGetItem');
    assertExpressionOrInt(resolvedIndex, 'index', 'ArrayGetItem');

    return `States.ArrayGetItem(${array}, ${resolvedIndex})`;
  }

  public static arrayLength(array: string): string {
    assertExpression(array, 'array', 'ArrayLength');

    return `States.ArrayLength(${array})`;
  }

  public static arrayPartition(array: string, size: any): string {
    const resolvedSize = size.toString();

    assertExpression(array, 'array', 'ArrayPartition');
    assertExpressionOrInt(resolvedSize, 'index', 'ArrayPartition');

    return `States.ArrayPartition(${array}, ${resolvedSize})`;
  }

  public static arrayRange(start: any, stop: any, step: any): string {
    assertExpressionOrInt(start, 'start', 'ArrayPartition');
    assertExpressionOrInt(stop, 'stop', 'ArrayPartition');
    assertExpressionOrInt(step, 'step', 'ArrayPartition');

    return `States.ArrayRange(${start}, ${stop}, ${step})`;
  }

  public static arrayUnique(array: string): string {
    assertExpression(array, 'array', 'ArrayUnique');

    return `States.ArrayUnique(${array})`;
  }

  public static base64Decode(value: string): string {
    return `States.Base64Decode(${toInline(value)})`;
  }

  public static base64Encode(value: string): string {
    return `States.Base64Encode(${toInline(value)})`;
  }

  public static format(template: string, values: string[]): string {
    const args = [
      toInline(template),
      ...values.map((x) => {
        return toInline(x);
      }),
    ].join(', ');

    return `States.Format(${args})`;
  }

  public static hash(data: string, algorithm: string): string {
    const valid = [
      'MD5',
      'SHA-1',
      'SHA-256',
      'SHA-384',
      'SHA-512',
    ];

    if (!StepFunctionValidation.isStatesExpression(algorithm) && !valid.includes(algorithm)) {
      throw new Error([
        `Got unrecognized hashing alogrithm '${algorithm}'. Expected:`,
        valid.join(', '),
      ].join(' '));
    }

    return `States.Hash(${toInline(data)}, ${toInline(algorithm)})`;
  }

  public static jsonMerge(json1: string, json2: string): string {
    assertExpression(json1, 'json1', 'JsonMerge');
    assertExpression(json2, 'json2', 'JsonMerge');

    return `States.JsonMerge(${json1}, ${json2}, false)`;
  }

  public static jsonToString(data: string): string {
    assertExpression(data, 'data', 'JsonToString');

    return `States.JsonToString(${data})`;
  }

  public static mathAdd(value: string, step: any): string {
    assertExpressionOrInt(step, 'step', 'MathAdd');

    return `States.MathAdd(${value}, ${step})`;
  }

  public static mathRandom(start: any, end: any): string {
    assertExpressionOrInt(start, 'start', 'MathRandom');
    assertExpressionOrInt(end, 'end', 'MathRandom');

    return `States.MathRandom(${toInline(start)}, ${toInline(end)})`;
  }

  public static stringSplit(data: string, splitter: string): string {
    return `States.StringSplit(${toInline(data)}, ${toInline(splitter)})`;
  }

  public static stringToJson(data: string): string {
    return `States.StringToJson(${toInline(data)})`;
  }

  public static uuid(): string {
    return `States.UUID()`;
  }
}