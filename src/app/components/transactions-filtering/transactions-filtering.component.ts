import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'src/app/store/entities';
import { passAllFilter } from '../transactions-table/transactions-table.component';
import { compile } from 'src/app/utils/rules.helper';
import { Predicate } from '../../store/entities';
import { DescriptionFilterComponent } from './description-filter.component';
import { TypeFilterComponent } from './type-filter.component';
import { AmountFilterComponent } from './amount-filter.component';
import { CategoryFilterComponent } from './category-filter.component';
import { DateFilterComponent } from './date-filter.component';
import { Filter } from '../../utils/filter';

@Component({
  selector: 'app-transactions-filtering',
  template: `<div class="filtering-element">
      <app-description-filter></app-description-filter>
    </div>
    <div class="filtering-element">
      <app-type-filter></app-type-filter>
    </div>
    <div class="filtering-element">
      <app-category-filter></app-category-filter>
    </div>
    <div class="filtering-element">
      <app-amount-filter></app-amount-filter>
    </div>
    <div class="filtering-element">
      <app-date-filter></app-date-filter>
    </div>

    <div class="filtering-element">
      <button mat-flat-button class="search-form-button" (click)="filter()" color="primary">filtruj</button>
      <button mat-flat-button class="search-form-button" (click)="clearFiltering()">
        <i class="material-icons" style="font-size: 18px">cancel</i>
      </button>
      <button mat-flat-button class="search-form-button" (click)="addRule()" color="accent">dodaj regułę</button>
    </div>`,
  styleUrls: ['./transactions-filtering.component.css'],
})
export class TransactionsFilteringComponent implements OnInit, AfterViewInit {
  @Input()
  filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(passAllFilter);
  @ViewChild(DescriptionFilterComponent)
  private descriptionQuery?: DescriptionFilterComponent;
  @ViewChild(TypeFilterComponent)
  private typeQuery?: TypeFilterComponent;
  @ViewChild(AmountFilterComponent)
  private amountQuery?: AmountFilterComponent;
  @ViewChild(CategoryFilterComponent)
  private categoryQuery?: CategoryFilterComponent;
  @ViewChild(DateFilterComponent)
  private dateQuery?: DateFilterComponent;
  children: (Filter | undefined)[] = [];

  ngAfterViewInit(): void {
    this.children = [this.descriptionQuery, this.typeQuery, this.amountQuery, this.categoryQuery, this.dateQuery];
  }

  ngOnInit(): void {}

  filter() {
    const query = this.children.reduce((acc, v) => ({ ...acc, ...v?.makeQuery() }), {});
    console.log('filter', query);
    this.filterSubject.next(compile(query));
  }

  addRule() {
    //this.router.navigateByUrl('/rules-table/' + btoa(query));
  }

  clearFiltering() {
    this.filterSubject.next(passAllFilter);
    this.children.forEach((c) => c?.clear());
  }
}
