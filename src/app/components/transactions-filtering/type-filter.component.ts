import { Component, Input } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from '../../utils/filter';

@Component({
  selector: 'app-type-filter',
  template: `
    <div class="search-tab-description">Wpisz poszukiwane wyrażenie.<br />Na przykład: <code>ZAKUP, PRZELEW</code></div>
    <mat-form-field class="filtering-form-field">
      <input matInput name="typeQuery" [(ngModel)]="typeQuery" placeholder="typ" />
    </mat-form-field>
  `,
  styles: [],
})
export class TypeFilterComponent implements Filter {
  @Input()
  typeQuery = '';

  clear(): void {
    this.typeQuery = '';
  }

  makeQuery(): Predicate {
    return {
      type: this.typeQuery
        .toUpperCase()
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== ''),
    };
  }

  isValid(): boolean {
    return true;
  }
}
