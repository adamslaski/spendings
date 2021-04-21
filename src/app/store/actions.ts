import { createAction, props } from '@ngrx/store';
import { Category, Rule, Transaction } from '../services/data-model.service';
import { Message } from '../services/message.service';
import { SpendingsState } from './reducer';

export const createCategory = createAction('[CATEGORY] create', props<{ category: Category }>());
export const updateCategory = createAction('[CATEGORY] update', props<{ category: Category }>());
export const deleteCategory = createAction('[CATEGORY] delete', props<{ id: number }>());

export const createRule = createAction('[RULE] create', props<{ rule: Rule }>());
export const deleteRule = createAction('[RULE] delete', props<{ id: number }>());
export const moveRule = createAction('[RULE] move', props<{ prevIndex: number; newIndex: number }>());

export const createTransactions = createAction('[TRANSACTION] create', props<{ transactions: Transaction[] }>());
export const updateTransaction = createAction('[TRANSACTION] update', props<{ transaction: Transaction }>());

export const saveStateToLocalStorage = createAction('[STATE] save to local storage');
export const loadStateFromLocalStorage = createAction('[STATE] load from local storage');
export const resetState = createAction('[STATE] reset', props<{ state?: SpendingsState }>());

export const sendMessage = createAction('[MESSAGE] send', props<{ message: Message }>());
