import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DataModelService, Transaction } from 'src/app/services/data-model.service';
import * as Collections from 'typescript-collections';

@Component({
  selector: 'app-spendings-chart',
  templateUrl: './spendings-chart.component.html',
})
export class SpendingsChartComponent {
  public chartData: Array<any> = [];
  public chartLabels: Array<any> = [];
  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  constructor(dmService: DataModelService, private datePipe: DatePipe) {
    dmService.transactionsView.observableValues().subscribe((_transactions) => {
      const transactions = _transactions
        .filter((tr) => tr.amount < 0)
        .map((tr) => Object.assign({}, tr, { amount: -tr.amount }));
      if (transactions.length > 0) {
        const begin = new Date(transactions[0].date);
        const end = new Date();
        const data = dmService.categoriesView.values().map((t) => ({
          label: t.label,
          data: computeBalanceForEachDay(
            begin,
            end,
            transactions.filter((tr) => tr.category === t.id),
          ),
        }));
        this.plot(computeRangeLabels(begin, end), data);
      }
    });
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
