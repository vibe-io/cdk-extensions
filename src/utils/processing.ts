export function filterSort<A>(obj: A[], f: (o: A) => boolean): {matched: A[]; unmatched: A[]} {
  const matched: A[] = [];
  const unmatched: A[] = [];

  obj.forEach((x) => {
    const result = f(x);

    if (result) {
      matched.push(x);
    } else {
      unmatched.push(x);
    }
  });

  return {
    matched,
    unmatched,
  };
}

export function onlySome<A>(obj: A[], f: (o: A) => boolean): boolean {
  const sorted = filterSort(obj, f);
  return (!!sorted.matched.length && !!sorted.unmatched.length);
}