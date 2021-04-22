import { Category, Message, Rule, Transaction } from './entities';

export interface SpendingsState {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
  message?: Message;
}

export interface AppState {
  spendings: SpendingsState;
}
