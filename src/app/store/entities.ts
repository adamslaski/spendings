export interface EntityWithId {
  readonly id: number;
}

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
