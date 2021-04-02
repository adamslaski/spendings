import { Component, OnInit } from '@angular/core';
import { DataModelService } from 'src/app/services/data-model.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color="primary">
    <button mat-button routerLink="/list"  routerLinkActive="active">Lista transakcji</button>
    <button mat-button routerLink="/balance-chart"  routerLinkActive="active">Wykres stanu konta</button>
    <button mat-button routerLink="/spendings-chart"  routerLinkActive="active">Wykres wydatków</button>
    <button mat-button routerLink="/receivers"  routerLinkActive="active">Odbiorcy</button>
    <button mat-button routerLink="/rules-table"  routerLinkActive="active">Reguły</button>
    <button mat-button routerLink="/tags-table"  routerLinkActive="active">Tagi</button>
    <span class="fill-remaining-space"></span>
    <app-data-toolbar></app-data-toolbar>
  </mat-toolbar>`,
  styles: ['.fill-remaining-space { flex: 1 1 auto;}', 'mat-toolbar { padding: 5px}', 
  'app-data-toolbar { margin-right: 10px; }']
})
export class HeaderComponent  { }

@Component({
  selector: 'app-data-toolbar',
  template: `
    <span class="form-group">
      <label for="file">
        <span class="mat-focus-indicator data-toolbar-button mat-raised-button mat-button-base mat-accent _mat-animation-noopable" color="accent">Importuj wyciąg</span>
        <input type="file" id="file" hidden (change)="import($event)">
      </label>
    </span>
    <button mat-raised-button class="data-toolbar-button" (click)="load()"  color="accent">Wczytaj</button>
    <button mat-raised-button class="data-toolbar-button" (click)="save()"  color="accent">Zapisz</button>
    <button mat-raised-button class="data-toolbar-button" (click)="clear()" color="accent">Wyczyść</button>`,
    styles: ['.data-toolbar-button { margin-left: 5px;}']
})
export class DataToolbarComponent {
  constructor(private dataModelService: DataModelService, private transactionService: TransactionsService) { }

  import(event:any) {
    const list = event.target.files as FileList;
    if (list.length>0) {
      const file = list.item(0);
      file?.text().then(text => this.transactionService.readXML(text));
    }
  }

  load() {
    this.dataModelService.load();
  }

  save() {
  }

  clear() {
    this.dataModelService.clear();
  }

}
