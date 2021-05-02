import { Account, Category, Rule, Transaction } from './entities';

export interface SpendingsState {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
  readonly accounts: Account[];
  accountSequence: number;
}

export interface AppState {
  spendings: SpendingsState;
}
