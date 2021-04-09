import { transition } from '@angular/animations';
import { Component } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category, DataModelService } from 'src/app/services/data-model.service';
import { MessageService } from 'src/app/services/message.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  template: ` <mat-toolbar color="primary">
    <button mat-button routerLink="/list" routerLinkActive="active">Lista transakcji</button>
    <button mat-button routerLink="/balance-chart" routerLinkActive="active">Wykres stanu konta</button>
    <button mat-button routerLink="/spendings-chart" routerLinkActive="active">Wykres wydatków</button>
    <button mat-button routerLink="/rules-table" routerLinkActive="active">Reguły</button>
    <button mat-button routerLink="/categories-table" routerLinkActive="active">Kategorie</button>
    <span class="fill-remaining-space"></span>
    <app-data-toolbar></app-data-toolbar>
  </mat-toolbar>`,
  styles: [
    'mat-toolbar { padding: 5px}',
    'app-data-toolbar { margin-right: 10px; }',
    '.active { background-color: var(--primary-darker-color); }',
  ],
})
export class HeaderComponent {}

@Component({
  selector: 'app-data-toolbar',
  template: ` <span class="form-group">
      <label for="file">
        <span
          class="mat-focus-indicator data-toolbar-button mat-button mat-button-base
          _mat-animation-noopable"
          color="accent"
          >Importuj wyciąg</span
        >
        <input type="file" id="file" hidden (change)="import($event)" />
      </label>
    </span>
    <button mat-button class="data-toolbar-button" (click)="loadExampleData()" [hidden]="isProduction">
      Wczytaj dane testowe
    </button>`,
  styles: ['.data-toolbar-button { margin-left: 5px;}'],
})
export class DataToolbarComponent {
  public isProduction = environment.production;

  constructor(
    private dataModelService: DataModelService,
    private transactionService: TransactionsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
  ) {}

  import(event: any) {
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      file?.text().then((text) => {
        const transactions = this.transactionService.parseCitibankXML(text);
        this.transactionService.importTransactions(transactions);
        this.messageService.info('Ukończono importowanie wyciągu.');
      });
    }
  }

  loadExampleData() {
    if (environment.exampleData) {
      const exampleCategories: Category[] = environment.exampleData.categories.map((cat) => ({ id: 0, label: cat }));
      this.dataModelService.categoriesView.push(...exampleCategories);
      const exampleRules = environment.exampleData.rules.map((rule) => ({
        id: 0,
        name: rule.name,
        predicate: `tr.description.toUpperCase().includes('${rule.name.toUpperCase()}')`,
        category: this.categoriesService.findCategoryByLabel(rule.category)?.id || 0,
      }));
      this.dataModelService.rulesView.push(...exampleRules);
    }
    if (environment.exampleStatement) {
      const transactions = this.transactionService.parseCitibankXML(environment.exampleStatement);
      this.transactionService.importTransactions(transactions);
      this.messageService.info('Ukończono importowanie danych przykładowych.');
    }
  }
}
