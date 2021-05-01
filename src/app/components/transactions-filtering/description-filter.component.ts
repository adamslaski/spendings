import { Component, Input, OnInit } from '@angular/core';
import { Predicate } from '../../store/entities';
import { Filter } from '../../utils/filter';

@Component({
  selector: 'app-description-filter',
  template: `
    <div class="search-tab-description">Wpisz poszukiwane wyrażenie.<br />Na przykład: <code>ROSSMAN, LIDL</code></div>
    <mat-form-field class="filtering-form-field">
      <input matInput name="descriptionQuery" [(ngModel)]="descriptionQuery" placeholder="opis" />
    </mat-form-field>
  `,
  styles: [],
})
export class DescriptionFilterComponent implements Filter {
  @Input()
  descriptionQuery = '';

  ngOnInit(): void {}

  clear() {
    this.descriptionQuery = '';
  }

  makeQuery(): Predicate {
    return {
      description: this.descriptionQuery
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
