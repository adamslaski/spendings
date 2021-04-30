import { Component, Input, OnInit } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from 'src/app/utils/filter';

@Component({
  selector: 'app-category-filter',
  template: `
    <div class="search-tab-description">Wybierz kategorię.</div>
    <app-select-category [(ngModel)]="categoryQuery" [showBlank]="true"></app-select-category>
  `,
  styles: [],
})
export class CategoryFilterComponent implements OnInit, Filter {
  @Input()
  categoryQuery?: number = undefined;
  clear(): void {
    this.categoryQuery = undefined;
  }
  makeQuery(): Predicate {
    return { category: this.categoryQuery };
  }

  ngOnInit(): void {}
}
