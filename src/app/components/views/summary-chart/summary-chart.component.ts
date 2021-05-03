import { Component, OnDestroy } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Subscription, combineLatest } from 'rxjs';
import { selectCategories, selectTransactions } from 'src/app/store/selectors';
import { findCategoryByLabel } from 'src/app/utils/categories.helper';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store';

@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
})
export class SummaryChartComponent implements OnDestroy {
  public options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public labels: string[] = [];
  public data: number[] = [];
  public colors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  private readonly subscribtion: Subscription = combineLatest([
    this.store.select(selectCategories),
    this.store.select(selectTransactions),
  ]).subscribe(([cats, trs]) => {
    this.labels.splice(0, this.labels.length, ...cats.map((cat) => cat.label));
    const m = trs
      .filter((tr) => tr.amount < 0)
      .map((tr) => Object.assign({}, tr, { amount: -tr.amount }))
      .reduce((acc, tr) => {
        const old = acc.get(tr.category) || 0;
        const result = Math.round((old + tr.amount) * 100) / 100;
        acc.set(tr.category, result);
        return acc;
      }, new Map<number, number>());
    this.data.splice(0, this.data.length);
    this.labels.forEach((label) => {
      const catId = findCategoryByLabel(label, cats)?.id || 0;
      this.data.push(m.get(catId) || 0);
    });
  });

  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
