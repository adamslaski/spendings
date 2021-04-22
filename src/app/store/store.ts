import { Category, Rule, Transaction } from './entities';

export interface SpendingsState {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
}

export interface AppState {
  spendings: SpendingsState;
}
