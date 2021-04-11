import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanceChartComponent } from './components/balance-chart/balance-chart.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RulesTableComponent } from './components/rules-table/rules-table.component';
import { SpendingsChartComponent } from './components/spendings-chart/spendings-chart.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { SummaryChartComponent } from './components/summary-chart/summary-chart.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: TransactionsTableComponent },
  { path: 'categories-table', component: CategoriesTableComponent },
  { path: 'rules-table/:predicate', component: RulesTableComponent },
  { path: 'rules-table', component: RulesTableComponent },
  { path: 'balance-chart', component: BalanceChartComponent },
  { path: 'spendings-chart', component: SpendingsChartComponent },
  { path: 'summary-chart', component: SummaryChartComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
