import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DataToolbarComponent } from './components/header/data-toolbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RulesTableComponent } from './components/rules-table/rules-table.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { SelectCategoryComponent } from './components/category/select-category.component';
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
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TransactionsFilteringComponent } from './components/transactions-filtering/transactions-filtering.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SummaryChartComponent } from './components/summary-chart/summary-chart.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { spendingsReducer } from './store/reducer';
import { LoggingEffect } from './store/logging-effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

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
    TransactionsFilteringComponent,
    SummaryChartComponent,
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
    MatDialogModule,
    MatTableModule,
    ChartsModule,
    MatTabsModule,
    DragDropModule,
    OverlayModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    StoreModule.forRoot({ spendings: spendingsReducer }),
    EffectsModule.forRoot([LoggingEffect]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
