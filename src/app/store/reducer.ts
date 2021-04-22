import { createReducer, on } from '@ngrx/store';
import { Category, Rule, Transaction } from './entities';
import * as actions from './actions';
import { Message } from '../services/message.service';
import { removeDuplicates } from '../utils/transactions.helper';
export { Store } from '@ngrx/store';

export interface SpendingsState {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
  message?: Message;
}

const initialState: SpendingsState = {
  transactions: [],
  transactionSequence: 0,
  rules: [],
  ruleSequence: 0,
  categories: [{ id: 0, label: 'inne', notEditable: `don't edit or delete this item` }],
  categorySequence: 1,
  message: undefined,
};

export interface AppState {
  spendings: SpendingsState;
}

export const spendingsReducer = createReducer(
  initialState,
  on(actions.createCategory, (state, { category }) => ({
    ...state,
    categories: [...state.categories, { ...category, id: state.categorySequence }],
    categorySequence: state.categorySequence + 1,
  })),
  on(actions.updateCategory, (state, { category }) => ({
    ...state,
    categories: state.categories.map((c) => (c.id === category.id && !c.notEditable ? category : c)),
  })),
  on(actions.deleteCategory, (state, { id }) => ({
    ...state,
    categories: state.categories.filter((c) => c.id !== id || c.notEditable),
    rules: state.rules.map((r) => (r.category === id ? { ...r, category: 0 } : r)),
    //todo recount transactions
  })),

  on(actions.createRule, (state, { rule }) => ({
    ...state,
    rules: [...state.rules, { ...rule, id: state.ruleSequence }],
    ruleSequence: state.ruleSequence + 1,
  })), //todo recount transactions
  on(actions.deleteRule, (state, { id }) => ({
    ...state,
    rules: state.rules.filter((r) => r.id !== id),
  })), //todo recount transactions
  on(actions.moveRule, (state, { prevIndex, newIndex }) => {
    const rules = [...state.rules];
    const tmp = rules.splice(prevIndex, 1);
    rules.splice(newIndex, 0, ...tmp);
    return { ...state, rules };
  }), //todo recount transactions

  on(actions.createTransactions, (state, { transactions }) => {
    const withoutDuplicatesResult = removeDuplicates(transactions, state.transactions);
    const trs = [...state.transactions];
    let seq = state.transactionSequence;
    withoutDuplicatesResult.withoutDuplicates.forEach((tr) => trs.push({ ...tr, id: seq++ }));
    return {
      ...state,
      transactions: trs, //todo recount transactions
      transactionSequence: seq,
      message: withoutDuplicatesResult.message,
    };
  }),
  on(actions.updateTransaction, (state, { transaction }) => ({
    ...state,
    transactions: state.transactions.map((t) => (t.id === transaction.id ? transaction : t)),
  })),

  on(actions.resetState, (state, { state: newState }) => (newState ? newState : initialState)),

  on(actions.sendMessage, (state, { message }) => ({ ...state, message })),
);
