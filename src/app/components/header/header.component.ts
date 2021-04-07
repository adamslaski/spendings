import { Component } from '@angular/core';
import { DataModelService } from 'src/app/services/data-model.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color="primary">
    <button mat-button routerLink="/list"  routerLinkActive="active">Lista transakcji</button>
    <button mat-button routerLink="/balance-chart"  routerLinkActive="active">Wykres stanu konta</button>
    <button mat-button routerLink="/spendings-chart"  routerLinkActive="active">Wykres wydatków</button>
    <button mat-button routerLink="/rules-table"  routerLinkActive="active">Reguły</button>
    <button mat-button routerLink="/categories-table"  routerLinkActive="active">Kategorie</button>
    <span class="fill-remaining-space"></span>
    <app-data-toolbar></app-data-toolbar>
  </mat-toolbar>`,
  styles: ['.fill-remaining-space { flex: 1 1 auto;}', 'mat-toolbar { padding: 5px}',
    'app-data-toolbar { margin-right: 10px; }']
})
export class HeaderComponent { }

@Component({
  selector: 'app-data-toolbar',
  template: `
    <span class="form-group">
      <label for="file">
        <span class="mat-focus-indicator data-toolbar-button mat-button mat-button-base _mat-animation-noopable" color="accent">Importuj wyciąg</span>
        <input type="file" id="file" hidden (change)="import($event)">
      </label>
    </span>
    <button mat-button class="data-toolbar-button" (click)="loadExampleData()" [hidden]="isProduction">Wczytaj dane testowe</button>`,
  styles: ['.data-toolbar-button { margin-left: 5px;}']
})
export class DataToolbarComponent {
  public isProduction = environment.production;

  constructor(private dataModelService: DataModelService, private transactionService: TransactionsService) { }

  import(event: any) {
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      file?.text().then(text => this.transactionService.readXML(text));
    }
  }

  loadExampleData() {
    if (environment['exampleData']) {
      this.dataModelService.categoriesView.push(...environment['exampleData'].categories);
      this.dataModelService.rulesView.push(...environment['exampleData'].rules);
    }
    if (environment['exampleStatement']) {
      this.transactionService.readXML(environment['exampleStatement']);
    }
  }

}
