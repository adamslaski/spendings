import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { loadStateFromLocalStorage, resetState, saveStateToLocalStorage } from 'src/app/store/actions';
import { AppState } from 'src/app/store/store';
import { parseCitibankXML } from 'src/app/utils/citi-bank.helper';
import { environment } from 'src/environments/environment';
import { createCategory, createTransactions, createRule, createAccount } from 'src/app/store/actions';
import { selectCategories } from 'src/app/store/selectors';
import { findCategoryByLabel } from '../../utils/categories.helper';
import { MESSAGE_SUBJECT } from '../../services/message.service';
import { selectAccounts } from '../../store/selectors';
import { Account } from '../../store/entities';
import { parseMBankCSV } from '../../utils/mbank.helper';

@Component({
  selector: 'app-data-toolbar',
  template: ` <button mat-button class="data-toolbar-button" [matMenuTriggerFor]="menu">Importuj wyciąg</button>
    <mat-menu #menu="matMenu">
      <div *ngIf="accounts$ | async as accounts">
        <div mat-menu-item *ngIf="accounts.length === 0">Najpierw musisz zdefiniować konto.</div>
        <span *ngFor="let account of accounts" mat-menu-item class="form-group">
          <label for="file-{{ account.id }}">
            <span mat-button>{{ account.name }} ({{ account.bank }})</span>
            <input id="file-{{ account.id }}" type="file" hidden (change)="import($event, account)" />
          </label>
        </span>
      </div>
    </mat-menu>
    <button mat-button class="data-toolbar-button" (click)="loadData()">Wczytaj</button>
    <button mat-button class="data-toolbar-button" (click)="saveData()">Zapisz</button>
    <button mat-button class="data-toolbar-button" (click)="loadExampleData()" *ngIf="!isProduction">
      Dane testowe
    </button>`,
  styles: ['.data-toolbar-button { margin-left: 5px;}'],
})
export class DataToolbarComponent {
  isProduction = environment.production;
  accounts$ = this.store.select(selectAccounts);

  constructor(private store: Store<AppState>) {}

  import(event: any, account: Account) {
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      if (file) {
        try {
          if (account.bank === 'Citi Handlowy') {
            this.importCiti(file, account.id);
            return;
          }
          if (account.bank === 'mBank') {
            this.importMBank(file, account.id);
            return;
          }
          MESSAGE_SUBJECT.next({
            message: `Importer dla wyciągu z ${account.bank} nie został zdefiniowany.`,
            type: 'warn',
          });
        } catch (e) {
          MESSAGE_SUBJECT.next({ message: `Błąd w czasie imporowania: ${(e as Error)?.message}`, type: 'error' });
        }
      } else {
        MESSAGE_SUBJECT.next({ message: 'Plik nie istnieje', type: 'error' });
      }
    }
  }

  private importMBank = async (file: File, accountId: number) => {
    const transactions = await parseMBankCSV(file, accountId);
    this.store.dispatch(createTransactions({ transactions }));
    MESSAGE_SUBJECT.next({ message: 'Ukończono importowanie wyciągu.', type: 'info' });
  };

  private importCiti = async (file: File, accountId: number) => {
    const text = await file?.text();
    const transactions = parseCitibankXML(text, accountId);
    this.store.dispatch(createTransactions({ transactions }));
    MESSAGE_SUBJECT.next({ message: 'Ukończono importowanie wyciągu.', type: 'info' });
  };

  loadData() {
    this.store.dispatch(loadStateFromLocalStorage());
  }

  saveData() {
    this.store.dispatch(saveStateToLocalStorage());
  }

  loadExampleData() {
    if (environment.exampleData) {
      this.store.dispatch(resetState({}));
      environment.exampleData.categories
        .map((cat) => ({ id: 0, label: cat }))
        .forEach((category) => this.store.dispatch(createCategory({ category })));
      environment.exampleData.accounts
        .map((account) => ({ id: 0, name: account.name, bank: account.bank }))
        .forEach((account) => this.store.dispatch(createAccount({ account })));

      this.store
        .select(selectCategories)
        .pipe(first())
        .forEach((cats) => {
          environment.exampleData.rules
            .map((rule) => ({
              id: 0,
              name: rule.name,
              predicate: { description: [rule.name.toUpperCase()] },
              category: findCategoryByLabel(rule.category, cats)?.id || 0,
            }))
            .forEach((rule) => this.store.dispatch(createRule({ rule })));
        });
    }
    if (environment.exampleStatement) {
      const transactions = parseCitibankXML(environment.exampleStatement, 0);
      this.store.dispatch(createTransactions({ transactions }));
    }
    MESSAGE_SUBJECT.next({ message: 'Ukończono importowanie danych przykładowych.', type: 'info' });
  }
}
