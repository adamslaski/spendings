import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'src/app/store/entities';
import { passAllFilter } from '../transactions-table/transactions-table.component';
import { compile } from 'src/app/utils/rules.helper';
import { DescriptionFilterComponent } from './description-filter.component';
import { TypeFilterComponent } from './type-filter.component';
import { AmountFilterComponent } from './amount-filter.component';
import { CategoryFilterComponent } from './category-filter.component';
import { DateFilterComponent } from './date-filter.component';
import { Filter } from '../../utils/filter';
import { RuleDialogComponent } from '../rule-dialog/rule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Rule } from '../../store/entities';

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
      <button mat-flat-button class="search-form-button" (click)="openAddRuleDialog()" color="accent">
        dodaj regułę
      </button>
      <button mat-icon-button (click)="clearFiltering()">
        <mat-icon color="primary-darker">cancel</mat-icon>
      </button>
    </div>`,
  styleUrls: ['./transactions-filtering.component.css'],
})
export class TransactionsFilteringComponent implements AfterViewInit {
  constructor(private dialog: MatDialog) {}

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

  private getQuery = () => this.children.reduce((acc, v) => ({ ...acc, ...v?.makeQuery() }), {});
  private childrenAreValid = () => this.children.every((child) => child?.isValid() || false);

  filter() {
    if (this.childrenAreValid()) {
      const query = this.getQuery();
      console.log('filter', query);
      this.filterSubject.next(compile(query));
    }
  }

  openAddRuleDialog(): void {
    if (this.childrenAreValid()) {
      const data: Rule = { id: 0, predicate: { ...this.getQuery() }, name: '', category: 0 };
      this.dialog.open(RuleDialogComponent, {
        width: '560px',
        height: '500px',
        data,
      });
    }
  }

  clearFiltering() {
    this.filterSubject.next(passAllFilter);
    this.children.forEach((c) => c?.clear());
  }
}
