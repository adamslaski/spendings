import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent, DataToolbarComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RulesTableComponent } from './components/rules-table/rules-table.component';
import { TagsTableComponent } from './components/tags-table/tags-table.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { ChipsComponent } from './components/chips/chips.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { BalanceChartComponent } from './components/balance-chart/balance-chart.component';
import { SpendingsChartComponent } from './components/spendings-chart/spendings-chart.component'; 
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    RulesTableComponent,
    TagsTableComponent,
    TransactionsTableComponent,
    DataToolbarComponent,
    ChipsComponent,
    TransactionDialogComponent,
    BalanceChartComponent,
    SpendingsChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    ChartsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
