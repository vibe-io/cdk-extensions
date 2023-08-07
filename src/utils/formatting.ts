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

/**
 * Checks to see if a given object has any keys. If the object has keys then 
 * the input object is returned. If the input object is empty then `undefined` 
 * is returned instead.
 * 
 * @param obj The object to process.
 * @returns The input object or `undefined` if the input object is empty.
 */
export function undefinedIfNoKeys<A>(obj: A): A | undefined {
  const allUndefined = Object.values(obj as any).every(val => val === undefined);
  return allUndefined ? undefined : obj;
}

/**
 * Removed undefined elements from an array.
 * 
 * @param obj The array to process.
 * @returns A copy of the input array with any `undefined` elements removed.
 */
export function definedElements<A>(obj: (A | undefined)[]): A[] {
  return obj.filter((x) => {
    return x !== undefined;
  }) as A[];
}

/**
 * Removed undefined alements from an array. If all elements of the array are
 * `undefined` then the result of the entire operation is `undefined`.
 * 
 * @param obj The array to process.
 * @returns A copy of the input array with any `undefined` elements removed or
 * `undefined` if the array is empty after processing.
 */
export function definedElementsOrUndefined<A>(obj: (A | undefined)[]): A[] | undefined {
  const defined = definedElements(obj);
  return defined.length === 0 ? undefined : defined;
}

/**
 * Creates a copy of an object that has keys with an undefined value removed.
 * 
 * @param obj The object to process.
 * @returns A copy of the input object where keys with undefined values are
 * removed.
 */
export function definedFields<A>(obj: A): A {
  return Object.keys(obj as any).reduce((prev, cur) => {
    const key = cur as keyof A;
    if (obj[key] !== undefined) {
      prev[key] = obj[key];
    }
    return prev;
  }, {} as A);
}

/**
 * Creates a copy of the object that has keys with an undefined value removed. 
 * If the resulting objecty has no keys `undefined` is returned instead of an
 * empty object.
 * 
 * @param obj The object to process.
 * @returns A copy of the input object where keys with undefined values are
 * removed or `undefined` if the object has no remaining keys after processing.
 */
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
