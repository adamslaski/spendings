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
  readonly category: number;
  categoryOverride?: number;
  readonly account: number;
}

export type AmountRange = {
  min?: number;
  max?: number;
};

export type Predicate = {
  description?: string[];
  type?: string[];
  category?: number;
  amountRange?: AmountRange;
  dateFrom?: Date;
  dateTo?: Date;
};

export interface Rule extends EntityWithId {
  name: string;
  predicate: Predicate;
  category: number;
}

export interface Category extends EntityWithId {
  label: string;
  notEditable?: `don't edit or delete this item`;
}

export type MessageType = 'info' | 'warn' | 'error';
export type Message = { message: string; type: MessageType };

export type Bank = 'Citi Handlowy';

export interface Account extends EntityWithId {
  name: string;
  readonly bank: Bank;
}
