import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category } from 'src/app/services/data-model.service';
import { MessageService } from 'src/app/services/message.service';
import { importStatement, loadStateFromLocalStorage, resetState, saveStateToLocalStorage } from 'src/app/store/actions';
import { environment } from 'src/environments/environment';

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

  constructor(private store: Store, private messageService: MessageService) {}

  import(event: any) {
    const list = event.target.files as FileList;
    if (list.length > 0) {
      const file = list.item(0);
      if (file) {
        this.store.dispatch(importStatement({ file }));
      } else {
        this.messageService.error('Plik nie istnieje');
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
      const exampleCategories: Category[] = environment.exampleData.categories.map((cat) => ({ id: 0, label: cat }));
      //    this.dataModelService.categoriesView.push(...exampleCategories);
      const exampleRules = environment.exampleData.rules.map((rule) => ({
        id: 0,
        name: rule.name,
        predicate: `tr.description.toUpperCase().includes('${rule.name.toUpperCase()}')`,
        //    category: this.categoriesService.findCategoryByLabel(rule.category)?.id || 0,
      }));
      //      this.dataModelService.rulesView.push(...exampleRules);
      this.store.dispatch(resetState({ state: 'TODO' }));
    }
    if (environment.exampleStatement) {
      //      const transactions = this.transactionService.parseCitibankXML(environment.exampleStatement);
      //    this.transactionService.importTransactions(transactions);
      //  this.messageService.info('Ukończono importowanie danych przykładowych.');
    }
  }
}
