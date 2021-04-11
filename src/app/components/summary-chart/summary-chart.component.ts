import { Component, OnDestroy } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { DataModelService } from 'src/app/services/data-model.service';

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
  private readonly subscribtions: Subscription[];

  constructor(dmService: DataModelService, catsService: CategoriesService) {
    const catSubscribtion = dmService.categoriesView.observableValues().subscribe((cats) => {
      this.labels.splice(0, this.labels.length);
      cats.map((cat) => cat.label).forEach((cat) => this.labels.push(cat));
    });
    const trSubscribtion = dmService.transactionsView.observableValues().subscribe((trs) => {
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
        const catId = catsService.findCategoryByLabel(label)?.id || 0;
        this.data.push(m.get(catId) || 0);
      });
    });
    this.subscribtions = [trSubscribtion, catSubscribtion];
  }

  ngOnDestroy(): void {
    this.subscribtions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
