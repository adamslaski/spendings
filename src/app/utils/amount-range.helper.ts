import { AmountRange } from '../store/entities';
export interface AmountRangeString {
  type: 'credit' | 'debit';
  min?: string;
  max?: string;
}

export const within = (n: number, amountRange?: AmountRange): boolean => {
  if (!amountRange) {
    return true;
  }
  if (amountRange.min !== undefined && amountRange.min > n) {
    return false;
  }
  if (amountRange.max !== undefined && amountRange.max < n) {
    return false;
  }
  return true;
};

const neg = (n?: number) => (n === undefined ? undefined : -n);

export const amountRangeToAmountRangeString = (ar: AmountRange = {}): AmountRangeString =>
  (ar.min && ar.min < 0) || (ar.max && ar.max < 0)
    ? {
        type: 'debit',
        min: neg(ar.max)?.toString(),
        max: neg(ar.min)?.toString(),
      }
    : {
        type: 'credit',
        min: ar.min?.toString(),
        max: ar.max?.toString(),
      };

const parse = (s?: string) => (s === undefined || s === '' || isNaN(Number(s)) ? undefined : Number(s));

export const amountRangeStringToAmountRange = (ars: AmountRangeString): AmountRange => {
  const maxAmount = parse(ars.max);
  const minAmount = parse(ars.min);
  if (ars.type === 'credit') {
    return { min: minAmount, max: maxAmount };
  } else {
    return { min: neg(maxAmount), max: neg(minAmount) };
  }
};
