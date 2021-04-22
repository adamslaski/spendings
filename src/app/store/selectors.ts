import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, SpendingsState } from './store';

const selectSpendings = createFeatureSelector<AppState, SpendingsState>('spendings');

export const selectCategories = createSelector(selectSpendings, (state: SpendingsState) => state.categories);
export const selectRules = createSelector(selectSpendings, (state: SpendingsState) => state.rules);
export const selectTransactions = createSelector(selectSpendings, (state: SpendingsState) => state.transactions);
