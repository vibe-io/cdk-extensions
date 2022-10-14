export function trimString(input: string, length: number): string {
  if (input.length <= length) {
    return input;
  } else {
    const prefixLength = Math.floor(length / 2);
    const suffixLength = Math.floor(length / 2);
    const prefix = input.substring(0, prefixLength);
    const suffix = input.substring(input.length - suffixLength);

    return `${prefix}${suffix}`;
  }
}

export function undefinedIfNoKeys<A>(obj: A): A | undefined {
  const allUndefined = Object.values(obj as any).every(val => val === undefined);
  return allUndefined ? undefined : obj;
}

export function definedElements<A>(obj: (A | undefined)[]): A[] {
  return obj.filter((x) => {
    return x !== undefined;
  }) as A[];
}

export function definedElementsOrUndefined<A>(obj: (A | undefined)[]): A[] | undefined {
  const defined = definedElements(obj);
  return defined.length === 0 ? undefined : defined;
}

export function definedFields<A>(obj: A): A {
  return Object.keys(obj as any).reduce((prev, cur) => {
    const key = cur as keyof A;
    if (obj[key] !== undefined) {
      prev[key] = obj[key];
    }
    return prev;
  }, {} as A);
}

export function definedFieldsOrUndefined<A>(obj: A): A | undefined {
  return undefinedIfNoKeys(definedFields(obj));
}

export function flatten<A>(obj: A[][]): A[] {
  return obj.reduce((prev, cur) => {
    return prev.concat(cur);
  }, []);
}

export function flattenedOrUndefined<A>(obj: A[][]): A[] | undefined {
  return definedElementsOrUndefined(flatten(obj));
}

export function includesAll<A>(obj: A[], values: A[]): boolean {
  for (let x of values) {
    if (!obj.includes(x)) {
      return false;
    }
  }

  return true;
}
