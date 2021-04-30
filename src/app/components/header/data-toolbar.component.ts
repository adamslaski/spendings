import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { loadStateFromLocalStorage, resetState, saveStateToLocalStorage } from 'src/app/store/actions';
import { AppState } from 'src/app/store/store';
import { parseCitibankXML } from 'src/app/utils/citi-bank.helper';
import { environment } from 'src/environments/environment';
import { createCategory, createTransactions, createRule } from '../../store/actions';
import { selectCategories } from '../../store/selectors';
import { findCategoryByLabel } from '../../utils/categories.helper';
import { MESSAGE_SUBJECT } from '../../services/message.service';

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
    <button mat-button class="data-toolbar-button" (click)="loadData()">Wczytaj</button>
    <button mat-button class="data-toolbar-button" (click)="saveData()">Zapisz</button>
    <button mat-button class="data-toolbar-button" (click)="loadExampleData()" *ngIf="!isProduction">
      Dane testowe
    </button>`,
  styles: ['.data-toolbar-button { margin-left: 5px;}'],
})
export class DataToolbarComponent {
  isProduction = environment.production;

  constructor(private store: Store<AppState>) {}

  import(event: any) {
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      if (file) {
        try {
          file?.text().then((text) => {
            const transactions = parseCitibankXML(text);
            this.store.dispatch(createTransactions({ transactions }));
            MESSAGE_SUBJECT.next({ message: 'Ukończono importowanie wyciągu.', type: 'info' });
          });
        } catch (e) {
          MESSAGE_SUBJECT.next({ message: `Błąd w czasie imporowania: ${(e as Error)?.message}`, type: 'error' });
        }
      } else {
        MESSAGE_SUBJECT.next({ message: 'Plik nie istnieje', type: 'error' });
      }
    }
  }

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
      const transactions = parseCitibankXML(environment.exampleStatement);
      this.store.dispatch(createTransactions({ transactions }));
    }
    MESSAGE_SUBJECT.next({ message: 'Ukończono importowanie danych przykładowych.', type: 'info' });
  }
}
