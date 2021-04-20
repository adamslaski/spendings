import { createReducer, on } from '@ngrx/store';
import { Category, Rule, Transaction } from '../services/data-model.service';
import * as actions from './actions';

export interface SpendingsState {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
}

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
  })),
);
