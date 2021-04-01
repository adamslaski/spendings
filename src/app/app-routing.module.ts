import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RulesTableComponent } from './components/rules-table/rules-table.component';
import { TagsTableComponent } from './components/tags-table/tags-table.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list/:query', component: TransactionsTableComponent },
  { path: 'list', component: TransactionsTableComponent },  
  { path: 'tags-table', component: TagsTableComponent },
  { path: 'rules-table', component: RulesTableComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
