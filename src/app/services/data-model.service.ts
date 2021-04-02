import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';


export interface Transaction {
  readonly id: number;
  readonly date: Date;
  readonly type: string;
  readonly amount: number;
  readonly balanceAfter: number;
  readonly currency: string;
  readonly accountNumber: string;
  readonly name: string;
  readonly description: string[];
  comment: string;
  readonly tags: number[]
}

export interface Rule {
  readonly name: string,
  readonly predicate: string,
  readonly tags: number[]
}

export interface Tag {
  readonly id: number,
  label: string,
  color: string
}

export interface DataModel {
  readonly transactions: Transaction[],
  readonly rules: Rule[],
  readonly tags: Tag[]
}

const dataFile = '/home/adam/.amperomierz/data.json';


@Injectable({
  providedIn: 'root'
})
export class DataModelService {
  readonly observableTransactionsArray: ObservableArray<Transaction> = new ObservableArray();
  public readonly dataModel: DataModel = { transactions: this.observableTransactionsArray.table, rules: [], tags: [] };
  get transactionsObservable(): Observable<Transaction[]> {
    return this.observableTransactionsArray.subject;
  }

  constructor() {
    // this.transactionsObservable.forEach(tr => console.log('tr listner:', tr));
  }

  save(): void {
//    fs.writeFileSync(dataFile, JSON.stringify(this.dataModel));
  }

  load(): void {
    const rawData = ''; // fs.readFileSync(dataFile);
    const dataModel: DataModel = 
      {transactions: [ 
        {
        accountNumber: "1",
        amount: 2,
        id: 3,
        balanceAfter: 17,
        comment: "nic  takiego",
        currency: "PLN",
        date: new Date(),
        description: ["opis"],
        name: "nazwa",
        type: "ww",
        tags: []},
        {
          accountNumber: "1",
          amount: 2,
          id: 4,
          balanceAfter: 517,
          comment: "nic  takiego",
          currency: "PLN",
          date: new Date(),
          description: ["opis"],
          name: "nazwa",
          type: "ww",
          tags: [1,2]
        }],
       rules: [],
       tags: [ {id: 1, color: 'blue', label: 'blah'}, {id: 2, color: 'red', label: 'foo'} ]}
    // JSON.parse(rawData.toString(), (key, value) =>
    //   key === 'date'
    //     ? new Date(value)
    //     : value);
    const dm = this.dataModel;
    dm.transactions.splice(0, dm.transactions.length, ...dataModel.transactions);
    dm.rules.splice(0, dm.rules.length, ...dataModel.rules);
    dm.tags.splice(0, dm.tags.length, ...dataModel.tags);
  }

  clear(): void {
    this.dataModel.rules.splice(0, this.dataModel.rules.length);
    this.dataModel.tags.splice(0, this.dataModel.tags.length);
    this.dataModel.transactions.splice(0, this.dataModel.transactions.length);
  }

}

class ObservableArray<T> {
  private readonly modifyingMethods = 'pop push shift unshift splice reverse sort'.split(' ');
  private readonly handler: ProxyHandler<Array<T>> = {
    get: (target, prop, receiver) => {
      const tmp =  Reflect.get(target, prop, receiver);
      // tslint:disable-next-line:triple-equals
      if (this.modifyingMethods.find(it => it == prop )) {
        console.log('get', target, prop, receiver);
        const subject = this.subject;
        const table = this.table;
        return (function() { tmp.apply(target, arguments); subject.next(table); });
      }
      return tmp;
    },
  };
  readonly table = new Proxy(new Array<T>(), this.handler);
  readonly subject: BehaviorSubject<T[]> = new BehaviorSubject(this.table);
}

export class ObservableDataSource<T> extends DataSource<T> {
  constructor(private obs: Observable<T[]>) { super(); }
  connect(): Observable<T[]> {
    return this.obs;
  }
  disconnect() { }
}

export class SimpleDataSource<T> extends ObservableDataSource<T> {
  constructor(private arr: T[]) { super(new BehaviorSubject(arr)); }
}

export function compileAndFilter<T>(exp: string): (arr: T[]) => T[] {
  return function (arr: T[]) {
    try {
      // tslint:disable-next-line:no-eval
      const f = eval('(function(tr) { return ' + exp + ';})');

      return arr.filter(tr => {
        try {
          return f(tr);
        } catch (error) {
          console.log('Error while processing ${tr} with predicate ${exp}: ', error);
        }
      });
    } catch (error) {
      console.log('Error while compiling predicate:', error);
    }
    return arr;
  }
}
