import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
import { loadStateFromLocalStorage, resetState, saveStateToLocalStorage } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducer';
import { parseCitibankXML } from 'src/app/utils/citi-bank.helper';
import { environment } from 'src/environments/environment';
import { createCategory, createRule, createTransactions, sendMessage } from '../../store/actions';
import { selectCategories } from '../../store/selectors';
import { findCategoryByLabel } from '../../utils/utils';

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

  constructor(private store: Store<AppState>, private messageService: MessageService) {}

  import(event: any) {
    this.store.dispatch(sendMessage({ message: { message: 'Info test', type: 'info' } }));
    this.store.dispatch(sendMessage({ message: { message: 'Warn test', type: 'warn' } }));
    this.store.dispatch(sendMessage({ message: { message: 'Error test', type: 'error' } }));
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      if (file) {
        //this.store.dispatch(importStatement({ file }));
      } else {
        this.store.dispatch(sendMessage({ message: { message: 'Plik nie istnieje', type: 'error' } }));
      }
      // file?.text().then((text) => {
      //   const transactions = this.transactionService.parseCitibankXML(text);
      //   this.transactionService.importTransactions(transactions);
      //   this.messageService.info('Ukończono importowanie wyciągu.');
      // });
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
              predicate: `tr.description.toUpperCase().includes('${rule.name.toUpperCase()}')`,
              category: findCategoryByLabel(rule.category, cats)?.id || 0,
            }))
            .forEach((rule) => this.store.dispatch(createRule({ rule })));
        });
    }
    if (environment.exampleStatement) {
      const transactions = parseCitibankXML(environment.exampleStatement);
      this.store.dispatch(createTransactions({ transactions }));
      this.store.dispatch(
        sendMessage({ message: { message: 'Ukończono importowanie danych przykładowych.', type: 'info' } }),
      );
    }
  }
}
