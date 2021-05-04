import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { PageNotFoundComponent } from './components/views/page-not-found.component';
import { RulesTableComponent } from './components/views/rules-table/rules-table.component';
import { CategoriesTableComponent } from './components/views/categories-table.component';
import { TransactionsTableComponent } from './components/views/transactions-table/transactions-table.component';
import { SelectCategoryComponent } from './components/select-category.component';
import { TransactionDialogComponent } from './components/transaction-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BalanceChartComponent } from './components/views/balance-chart/balance-chart.component';
import { SpendingsChartComponent } from './components/views/spendings-chart/spendings-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { DisplayCategoryComponent } from './components/display-category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TransactionsFilteringComponent } from './components/views/transactions-table/transactions-filtering.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SummaryChartComponent } from './components/views/summary-chart/summary-chart.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { spendingsReducer } from './store/reducer';
import { LoggingEffect } from './effects/logging-effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { LocalStoraEffect } from './effects/local-storage-effect';
import { MessageService } from './services/message.service';
import { DescriptionFilterComponent } from './components/transactions-filtering/description-filter.component';
import { TypeFilterComponent } from './components/transactions-filtering/type-filter.component';
import { AmountFilterComponent } from './components/transactions-filtering/amount-filter.component';
import { DateFilterComponent } from './components/transactions-filtering/date-filter.component';
import { CategoryFilterComponent } from './components/transactions-filtering/category-filter.component';
import { RuleDialogComponent } from './components/rule-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { DisplayAccountComponent } from './components/display-account.component';
import { AccountsTableComponent } from './components/views/accounts-table.component';
import { MatMenuModule } from '@angular/material/menu';

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
    DescriptionFilterComponent,
    TypeFilterComponent,
    AmountFilterComponent,
    DateFilterComponent,
    CategoryFilterComponent,
    RuleDialogComponent,
    DisplayAccountComponent,
    AccountsTableComponent,
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
    MatIconModule,
    MatMenuModule,
    StoreModule.forRoot({ spendings: spendingsReducer }),
    EffectsModule.forRoot([LoggingEffect, LocalStoraEffect]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    DatePipe,
    { provide: APP_INITIALIZER, multi: true, deps: [MessageService], useFactory: (x: MessageService) => () => null },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
