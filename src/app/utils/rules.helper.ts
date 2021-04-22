import { Transaction, Rule } from '../store/entities';
const apply = (trs: Transaction[], ...rules: Rule[]) => {
  applyWithFunction(
    (tr, rule) => {
      tr.category = rule.category;
    },
    trs,
    ...rules,
  );
};

const applyWithFunction = (fn: (tr: Transaction, rule: Rule) => void, trs: Transaction[], ...rules: Rule[]) => {
  const compiledRules = rules.map((rule) => Object.assign(rule, { compiledPredicate: compile(rule.predicate) }));

  trs.forEach((tr) => {
    const rule = compiledRules.find((r) => r.compiledPredicate(tr));
    if (rule) {
      tr.category = rule.category;
    }
  });
};

export function compile(exp: string): (a: Transaction) => boolean {
  return (a: Transaction) => {
    // eslint-disable-next-line no-eval
    const f = eval('(function(tr) { return ' + exp + ';})');
    return f(a);
  };
}
