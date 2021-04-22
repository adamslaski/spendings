import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { removeDuplicates } from '../utils/transactions.helper';
import { SpendingsState } from './store';
export { Store } from '@ngrx/store';

const initialState: SpendingsState = {
  transactions: [],
  transactionSequence: 0,
  rules: [],
  ruleSequence: 0,
  categories: [{ id: 0, label: 'inne', notEditable: `don't edit or delete this item` }],
  categorySequence: 1,
};

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
    const withoutDuplicates = removeDuplicates(transactions, state.transactions);
    const trs = [...state.transactions];
    let seq = state.transactionSequence;
    withoutDuplicates.forEach((tr) => trs.push({ ...tr, id: seq++ }));
    return {
      ...state,
      transactions: trs, //todo recount transactions
      transactionSequence: seq,
    };
  }),
  on(actions.updateTransaction, (state, { transaction }) => ({
    ...state,
    transactions: state.transactions.map((t) => (t.id === transaction.id ? transaction : t)),
  })),

  on(actions.resetState, (state, { state: newState }) => (newState ? newState : initialState)),
);
