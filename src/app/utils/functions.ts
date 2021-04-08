export function compile<T>(exp: string): (a: T) => boolean {
  return function (a: T) {
    try {
      // eslint-disable-next-line no-eval
      const f = eval('(function(tr) { return ' + exp + ';})');
      return f(a);
    } catch (error) {
      console.log(`Error while processing ${a} with predicate ${exp}: `, error);
    }
  };
}
