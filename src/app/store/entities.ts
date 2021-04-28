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

export type Predicate = {
  description?: string[];
  type?: string[];
  category?: number;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
};

export interface Rule extends EntityWithId {
  name: string;
  readonly predicate: Predicate;
  readonly category: number;
}

export interface Category extends EntityWithId {
  label: string;
  notEditable?: `don't edit or delete this item`;
}

export type MessageType = 'info' | 'warn' | 'error';
export type Message = { message: string; type: MessageType };
