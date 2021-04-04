import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction } from 'src/app/services/data-model.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import * as Collections from 'typescript-collections';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
})
export class BalanceChartComponent {

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 250
        }
      }]
    },
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
 
  constructor(private trsService: TransactionsService, private datePipe: DatePipe) {
    this.plot(computeBalanceForEachDay(this.trsService.transactions));
  }

  private plot(data: DayBalance[]): void {
    const len = data.length;
    const _lineChartData: Array<any> = new Array(1);
    const _lineChartLabels: Array<any> = new Array(len);

    _lineChartData[0] = { data: new Array(len), label: 'Foo' };
    for (let j = 0; j < len; j++) {
      _lineChartData[0].data[j] = data[j].balance;
      _lineChartLabels[j] = this.datePipe.transform(data[j].date, 'd-M-y');
    }
    this.lineChartData = _lineChartData;
    this.lineChartLabels.splice(0, this.lineChartLabels.length);
    this.lineChartLabels.push(..._lineChartLabels);
  }
}

interface DayBalance {
  date: Date,
  balance: number
}

function computeBalanceForEachDay(data: Transaction[]): DayBalance[] {
  const mm = new Collections.MultiDictionary<Date, number>(undefined, undefined, true);
  data.forEach(v => mm.setValue(truncateDate(v.date), v.amount));
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
