import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction } from 'src/app/services/data-model.service';
import { TagsService } from 'src/app/services/tags.service';
import { TransactionsService } from 'src/app/services/transactions.service';
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
    responsive: true
  };

  constructor(trsService: TransactionsService, private datePipe: DatePipe, tagService: TagsService) {
    const transactions = trsService.transactions
      .filter(tr => tr.amount < 0)
      .map(tr => Object.assign({}, tr, { amount: -tr.amount }));
    if (transactions.length > 0) {
      const begin = new Date(transactions[0].date);
      const end = new Date();
      const data = tagService.tags.map(t => {
        return {
          label: t.label,
          data: computeBalanceForEachDay(begin, end, transactions.filter(tr => tr.tags.includes(t.id)))
        };
      });
      data.push({
        label: 'inne',
        data: computeBalanceForEachDay(begin, end, transactions.filter(tr => tr.tags.length === 0))
      });
      this.plot(computeRangeLabels(begin, end), data);
    }
  }

  private plot(rangeLabels: Date[], x: { label: string, data: number[] }[]): void {
    this.chartLabels = rangeLabels.map(d => this.datePipe.transform(d, 'M-y'));
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
  data.forEach(v => mm.setValue(truncateDate(v.date), v.amount));
  const now = new Date();
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
