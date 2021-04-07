import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent, DataToolbarComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RulesTableComponent } from './components/rules-table/rules-table.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { SelectCategoryComponent } from './components/category/select-category.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BalanceChartComponent } from './components/balance-chart/balance-chart.component';
import { SpendingsChartComponent } from './components/spendings-chart/spendings-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { DisplayCategoryComponent } from './components/category/display-category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    RulesTableComponent,
    CategoriesTableComponent,
    TransactionsTableComponent,
    DataToolbarComponent,
    SelectCategoryComponent,
    TransactionDialogComponent,
    BalanceChartComponent,
    SpendingsChartComponent,
    DisplayCategoryComponent,
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
    ChartsModule,
    MatTabsModule,
    DragDropModule,
    OverlayModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
