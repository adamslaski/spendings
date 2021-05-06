import { DatePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/store/entities';
import * as Collections from 'typescript-collections';
import { selectAccounts, selectSortedTransactions } from 'src/app/store/selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store';
import { combineLatest } from 'rxjs';
import { Account } from '../../../store/entities';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
})
export class BalanceChartComponent implements OnDestroy {
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 40000,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: (val: string, index: number) =>
              index % 2 === 0 ? val.split('-').slice(1, 3).join('-') : undefined,
          },
        },
      ],
    },
    responsive: true,
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];

  private readonly subscription;

  constructor(private datePipe: DatePipe, store: Store<AppState>) {
    this.subscription = combineLatest([store.select(selectSortedTransactions), store.select(selectAccounts)]).subscribe(
      ([trs, accounts]) => {
        if (trs.length > 0 && accounts.length > 0) {
          const accountsWithTransactions = accounts.map((a) => ({
            ...a,
            transactions: trs.filter((tr) => tr.account === a.id),
          }));
          return this.plot(
            accountsWithTransactions.map((awt) => ({
              ...awt,
              balance: computeBalanceForEachDay(awt.transactions, trs[0].date, trs[trs.length - 1].date),
            })),
          );
        }
      },
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private plot(data: ExtendedAccount[]): void {
    this.lineChartData = data.map((ea) => ({ data: ea.balance.map((b) => b.balance), label: ea.name }));
    this.lineChartLabels = data[0].balance.map((balance) => this.datePipe.transform(balance.date, 'd-M-yy'));
  }
}

interface DayBalance {
  date: Date;
  balance: number | null;
}

interface ExtendedAccount extends Account {
  transactions: Transaction[];
  balance: DayBalance[];
}

function computeBalanceForEachDay(data: Transaction[], dateStart: Date, dateEnd: Date): DayBalance[] {
  const mm = new Collections.MultiDictionary<Date, number>(undefined, undefined, true);
  data.forEach((v) => mm.setValue(truncateDate(v.date), v.balanceAfter));
  const end = truncateDate(dateEnd);
  const result: DayBalance[] = [];
  if (data.length > 0) {
    let balance = null;
    for (const d = truncateDate(dateStart); d <= end; d.setDate(d.getDate() + 1)) {
      const list = mm.getValue(d);
      balance = list.length > 0 ? Math.round(list[list.length - 1]) : balance;
      result.push({ date: new Date(d), balance });
    }
  }
  return result;
}

function truncateDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
