import { DatePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/store/entities';
import * as Collections from 'typescript-collections';
import { AppState, Store } from 'src/app/store/reducer';
import { combineLatest } from 'rxjs';
import { selectTransactions, selectCategories } from '../../store/selectors';

@Component({
  selector: 'app-spendings-chart',
  templateUrl: './spendings-chart.component.html',
})
export class SpendingsChartComponent implements OnDestroy {
  public chartData: Array<any> = [];
  public chartLabels: Array<any> = [];
  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  private readonly subscription;

  constructor(store: Store<AppState>, private datePipe: DatePipe) {
    this.subscription = combineLatest([store.select(selectTransactions), store.select(selectCategories)]).subscribe(
      ([_transactions, categories]) => {
        const transactions = _transactions.filter((tr) => tr.amount < 0).map((tr) => ({ ...tr, amount: -tr.amount }));
        if (transactions.length > 0) {
          const begin = new Date(transactions[0].date);
          const end = new Date();
          const data = categories.map((t) => ({
            label: t.label,
            data: computeBalanceForEachDay(
              begin,
              end,
              transactions.filter((tr) => tr.category === t.id),
            ),
          }));
          this.plot(computeRangeLabels(begin, end), data);
        }
      },
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private plot(rangeLabels: Date[], x: { label: string; data: number[] }[]): void {
    this.chartLabels = rangeLabels.map((d) => this.datePipe.transform(d, 'M-y'));
    this.chartData = x;
  }
}

function computeRangeLabels(begin: Date, end: Date): Date[] {
  const result: Date[] = [];
  for (const d = truncateDate(begin); d <= end; d.setMonth(d.getMonth() + 1)) {
    const month = truncateDate(d);
    result.push(month);
  }
  return result;
}

function computeBalanceForEachDay(begin: Date, end: Date, data: Transaction[]): number[] {
  const mm = new Collections.MultiDictionary<Date, number>(undefined, undefined, true);
  data.forEach((v) => mm.setValue(truncateDate(v.date), v.amount));
  const result: number[] = [];
  for (const d = truncateDate(begin); d <= end; d.setMonth(d.getMonth() + 1)) {
    const month = truncateDate(d);
    const balance = mm.getValue(month).reduce((p, c) => p + c, 0);
    result.push(Math.round(balance));
  }
  return result;
}

function truncateDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth());
}
