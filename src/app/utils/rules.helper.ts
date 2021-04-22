import { Transaction, Rule } from '../store/entities';

export const apply = (trs: Transaction[], ...rules: Rule[]): Transaction[] => {
  const compiledRules = rules.map((rule) => ({ rule, compiledPredicate: compile(rule.predicate) }));

  return trs.map((tr) => {
    const rule = compiledRules.find((r) => r.compiledPredicate(tr));
    return { ...tr, category: rule ? rule.rule.category : 0 };
  });
};

export function compile(exp: string): (a: Transaction) => boolean {
  return (a: Transaction) => {
    // eslint-disable-next-line no-eval
    const f = eval('(function(tr) { return ' + exp + ';})');
    return f(a);
  };
}
