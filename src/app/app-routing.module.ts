import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/views/page-not-found.component';
import { RulesTableComponent } from './components/views/rules-table/rules-table.component';
import { TransactionsTableComponent } from './components/views/transactions-table/transactions-table.component';
import { AccountsTableComponent } from './components/views/accounts-table.component';
import { CategoriesTableComponent } from './components/views/categories-table.component';
import { BalanceChartComponent } from './components/views/balance-chart/balance-chart.component';
import { SpendingsChartComponent } from './components/views/spendings-chart/spendings-chart.component';
import { SummaryChartComponent } from './components/views/summary-chart/summary-chart.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: TransactionsTableComponent },
  { path: 'categories-table', component: CategoriesTableComponent },
  { path: 'rules-table/:predicate', component: RulesTableComponent },
  { path: 'rules-table', component: RulesTableComponent },
  { path: 'balance-chart', component: BalanceChartComponent },
  { path: 'spendings-chart', component: SpendingsChartComponent },
  { path: 'summary-chart', component: SummaryChartComponent },
  { path: 'accounts', component: AccountsTableComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
