import { DatePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/store/entities';
import { AppState, Store } from 'src/app/store/reducer';
import * as Collections from 'typescript-collections';
import { selectTransactions } from '../../store/selectors';

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
            suggestedMin: 0,
            suggestedMax: 250,
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
    this.subscription = store
      .select(selectTransactions)
      .subscribe((transactions) => this.plot(computeBalanceForEachDay(transactions)));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private plot(data: DayBalance[]): void {
    const len = data.length;
    const lineChartData: Array<any> = new Array(1);
    const lineChartLabels: Array<any> = new Array(len);

    lineChartData[0] = { data: new Array(len), label: 'Stan konta' };
    for (let j = 0; j < len; j++) {
      lineChartData[0].data[j] = data[j].balance;
      lineChartLabels[j] = this.datePipe.transform(data[j].date, 'd-M-y');
    }
    this.lineChartData = lineChartData;
    this.lineChartLabels.splice(0, this.lineChartLabels.length, ...lineChartLabels);
  }
}

interface DayBalance {
  date: Date;
  balance: number;
}

function computeBalanceForEachDay(data: Transaction[]): DayBalance[] {
  const mm = new Collections.MultiDictionary<Date, number>(undefined, undefined, true);
  data.forEach((v) => mm.setValue(truncateDate(v.date), v.amount));
  const now = new Date();
  const result: DayBalance[] = [];
  if (data.length > 0) {
    let balance = data[0].balanceAfter - data[0].amount;
    for (const d = truncateDate(data[0].date); d <= now; d.setDate(d.getDate() + 1)) {
      balance = mm.getValue(d).reduce((p, c) => p + c, balance);
      result.push({ date: new Date(d), balance: Math.round(balance) });
    }
  }
  return result;
}

function truncateDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
