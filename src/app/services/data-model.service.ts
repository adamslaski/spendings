import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EntityView } from '../utils/entity-view';
import { EntityViewWithTransactionsSupport } from '../utils/entity-view-with-transacations-support';
import { EntityWithId } from '../utils/entity-with-id';

export interface Transaction extends EntityWithId {
  readonly date: Date;
  readonly type: string;
  readonly amount: number;
  readonly balanceAfter: number;
  readonly description: string;
  comment: string;
  category: number;
}

export interface Rule extends EntityWithId {
  name: string;
  readonly predicate: string;
  readonly category: number;
}

export interface Category extends EntityWithId {
  label: string;
  notEditable?: `don't edit or delete this item`;
}

export interface Sequence {
  n: number;
}

export interface DataModel {
  readonly transactions: Transaction[];
  transactionSequence: Sequence;
  readonly rules: Rule[];
  ruleSequence: Sequence;
  readonly categories: Category[];
  categorySequence: Sequence;
}

@Injectable({
  providedIn: 'root',
})
export class DataModelService {
  private readonly dataModel: DataModel = {
    transactions: [],
    transactionSequence: { n: 1 },
    rules: [],
    ruleSequence: { n: 1 },
    categories: [{ id: 0, label: 'inne', notEditable: `don't edit or delete this item` }],
    categorySequence: { n: 1 },
  };

  readonly transactionsView = new EntityViewWithTransactionsSupport<Transaction>(
    this.dataModel.transactions,
    this.dataModel.transactionSequence,
    'transactions',
  );
  readonly rulesView = new EntityViewWithTransactionsSupport<Rule>(
    this.dataModel.rules,
    this.dataModel.ruleSequence,
    'rules',
  );
  readonly categoriesView = new EntityView<Category>(
    this.dataModel.categories,
    this.dataModel.categorySequence,
    'categories',
  );

  saveToLocalStorage() {
    window.localStorage.setItem('categories', JSON.stringify(this.dataModel.categories));
    window.localStorage.setItem('categorySequence', JSON.stringify(this.dataModel.categorySequence));
    window.localStorage.setItem('rules', JSON.stringify(this.dataModel.rules));
    window.localStorage.setItem('ruleSequence', JSON.stringify(this.dataModel.ruleSequence));
    window.localStorage.setItem('transactions', JSON.stringify(this.dataModel.transactions));
    window.localStorage.setItem('transactionSequence', JSON.stringify(this.dataModel.transactionSequence));
  }

  loadFromLocalStorage() {
    const categories = JSON.parse(window.localStorage.getItem('categories') || '');
    const categorySequence = JSON.parse(window.localStorage.getItem('categorySequence') || '');
    const rules = JSON.parse(window.localStorage.getItem('rules') || '');
    const ruleSequence = JSON.parse(window.localStorage.getItem('ruleSequence') || '');
    const transactions = JSON.parse(window.localStorage.getItem('transactions') || '', (key, value) =>
      key === 'date' && typeof value === 'string' ? new Date(value) : value,
    );
    const transactionSequence = JSON.parse(window.localStorage.getItem('transactionSequence') || '');

    this.dataModel.categories.splice(0, this.dataModel.categories.length, ...categories);
    this.dataModel.categorySequence = categorySequence;
    this.dataModel.rules.splice(0, this.dataModel.rules.length, ...rules);
    this.dataModel.ruleSequence = ruleSequence;
    this.dataModel.transactions.splice(0, this.dataModel.transactions.length, ...transactions);
    this.dataModel.transactionSequence = transactionSequence;

    this.categoriesView.emitNext();
    this.rulesView.emitNext();
    this.transactionsView.emitNext();
  }
}
