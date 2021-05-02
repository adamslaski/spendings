import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: ` <mat-toolbar color="primary">
    <button mat-button routerLink="/list" routerLinkActive="active">Lista transakcji</button>
    <button mat-button routerLink="/balance-chart" routerLinkActive="active">Wykres stanu konta</button>
    <button mat-button routerLink="/spendings-chart" routerLinkActive="active">Wykres wydatków</button>
    <button mat-button routerLink="/summary-chart" routerLinkActive="active">Podsumowanie wydatków</button>
    <button mat-button routerLink="/rules-table" routerLinkActive="active">Reguły</button>
    <button mat-button routerLink="/categories-table" routerLinkActive="active">Kategorie</button>
    <button mat-button routerLink="/accounts" routerLinkActive="active">Konta</button>
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
