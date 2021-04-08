import { Injectable } from '@angular/core';
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
}

export interface DataModel {
  readonly transactions: Transaction[];
  transactionSequence: number;
  readonly rules: Rule[];
  ruleSequence: number;
  readonly categories: Category[];
  categorySequence: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataModelService {
  private readonly dataModel: DataModel = {
    transactions: [],
    transactionSequence: 1,
    rules: [],
    ruleSequence: 1,
    categories: [{ id: 0, label: 'inne' }],
    categorySequence: 1
  };

  readonly transactionsView =
    new EntityViewWithTransactionsSupport<Transaction>(this.dataModel.transactions, this.dataModel.transactionSequence);
  readonly rulesView = new EntityViewWithTransactionsSupport<Rule>(this.dataModel.rules, this.dataModel.ruleSequence);
  readonly categoriesView =
    new EntityViewWithTransactionsSupport<Category>(this.dataModel.categories, this.dataModel.categorySequence);

}
