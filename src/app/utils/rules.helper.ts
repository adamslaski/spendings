import { Transaction, Rule, Predicate } from '../store/entities';
import { within } from './amount-range.helper';

export const apply = (trs: Transaction[], ...rules: Rule[]): Transaction[] => {
  const compiledRules = rules.map((rule) => ({ rule, compiledPredicate: compile(rule.predicate) }));

  return trs.map((tr) => {
    const rule = compiledRules.find((r) => r.compiledPredicate(tr));
    return { ...tr, category: rule ? rule.rule.category : 0 };
  });
};

export function compile(pred: Predicate): (a: Transaction) => boolean {
  return (a: Transaction) => {
    const trDesc = a.description.toUpperCase();
    const trType = a.type.toUpperCase();
    if (pred.description && pred.description.length > 0 && !pred.description.some((d) => trDesc.includes(d))) {
      return false;
    }
    if (pred.type && pred.type.length > 0 && !pred.type.some((t) => trType.includes(t))) {
      return false;
    }
    if (
      pred.category !== undefined &&
      pred.category !== (a.categoryOverride === undefined ? a.category : a.categoryOverride)
    ) {
      return false;
    }
    if (!within(a.amount, pred.amountRange)) {
      return false;
    }
    if (pred.dateFrom !== undefined && pred.dateFrom !== null && pred.dateFrom.getTime() > a.date.getTime()) {
      return false;
    }
    if (pred.dateTo !== undefined && pred.dateFrom !== null && pred.dateTo.getTime() < a.date.getTime()) {
      return false;
    }

    return true;
  };
}
