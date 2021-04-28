import { Predicate } from '../store/entities';
export const flatten = (preds: Predicate[]): Predicate => preds.reduce((acc, v) => ({ ...acc, ...v }), {});
