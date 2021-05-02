import { Component } from '@angular/core';
import { selectAccounts } from '../../store/selectors';
import { AppState } from '../../store/store';
import { Store } from '@ngrx/store';
import { createAccount } from '../../store/actions';
import { Bank } from 'src/app/store/entities';

@Component({
  selector: 'app-accounts-table',
  template: `<mat-form-field>
      <input matInput type="text" #newName placeholder="nazwa Konta" />
    </mat-form-field>
    <mat-form-field>
      <mat-select #newBank>
        <mat-option [value]="'Citi Handlowy'">Citi Handlowy</mat-option>
      </mat-select>
    </mat-form-field>
    <button
      mat-flat-button
      (click)="create(newName.value, newBank.value); newName.value = ''; newBank.value = undefined"
      color="primary"
    >
      dodaj
    </button>

    <ul>
      <li *ngFor="let account of accounts$ | async">{{ account.name }} ({{ account.bank }})</li>
    </ul>`,
  styles: ['ul { list-style-type: none; }'],
})
export class AccountsTableComponent {
  bank: Bank = 'Citi Handlowy';
  readonly accounts$ = this.store.select(selectAccounts);

  constructor(private store: Store<AppState>) {}

  public create(name: string, bank: Bank) {
    this.store.dispatch(createAccount({ account: { id: 0, name, bank } }));
  }
}
