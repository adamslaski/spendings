import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DescriptionFilterComponent } from './transactions-filtering/description-filter.component';
import { TypeFilterComponent } from './transactions-filtering/type-filter.component';
import { AmountFilterComponent } from './transactions-filtering/amount-filter.component';
import { DateFilterComponent } from './transactions-filtering/date-filter.component';
import { Filter } from '../utils/filter';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store';
import { Rule, Predicate } from '../store/entities';
import { createRule, updateRule } from '../store/actions';

@Component({
  selector: 'app-rule-dialog',
  template: `<h1 mat-dialog-title>{{ rule.id ? 'Edycja reguły' : 'Tworzenie reguły' }}</h1>
    <div mat-dialog-content>
      <div class="grid-container">
        <div>
          <mat-form-field>
            <input matInput [(ngModel)]="rule.name" #name="ngModel" placeholder="nazwa" required />
          </mat-form-field>
          <div *ngIf="name.invalid && (name.dirty || name.touched)" class="validator-message">
            <div *ngIf="name.errors?.required">Reguła musi posiadać nazwę.</div>
          </div>
        </div>
        <app-select-category [(ngModel)]="rule.category" style="width: 100%"></app-select-category>
        <div class="filtering-element">
          <app-description-filter
            [descriptionQuery]="rule.predicate.description?.join(', ') || ''"
          ></app-description-filter>
        </div>
        <div class="filtering-element">
          <app-type-filter [typeQuery]="rule.predicate.type?.join(', ') || ''"></app-type-filter>
        </div>
        <div class="filtering-element">
          <app-amount-filter [amountRange]="rule.predicate.amountRange"></app-amount-filter>
        </div>
        <div class="filtering-element">
          <app-date-filter [dateFrom]="rule.predicate.dateFrom" [dateTo]="rule.predicate.dateTo"></app-date-filter>
        </div>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button (click)="save()" tabindex="1" color="primary">Ok</button>
      <button mat-raised-button (click)="cancel()" tabindex="2">Cancel</button>
    </div> `,
  styles: [
    `
      .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 2fr 2fr;
        gap: 10px 10px;
        grid-template-areas: repeat(3, '. .');
      }
    `,
    `
      .filtering-element {
        padding: 10px;
        background-color: var(--accent-lighter-color);
      }
      .mat-form-field {
        margin: 0;
      }
    `,
  ],
})
export class RuleDialogComponent implements AfterViewInit {
  @ViewChild(DescriptionFilterComponent)
  private descriptionQuery?: DescriptionFilterComponent;
  @ViewChild(TypeFilterComponent)
  private typeQuery?: TypeFilterComponent;
  @ViewChild(AmountFilterComponent)
  private amountQuery?: AmountFilterComponent;
  @ViewChild(DateFilterComponent)
  private dateQuery?: DateFilterComponent;
  children: (Filter | undefined)[] = [];
  rule: Rule;
  constructor(
    private dialogRef: MatDialogRef<RuleDialogComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) data: Rule,
  ) {
    this.rule = { ...data };
  }

  ngAfterViewInit(): void {
    this.children = [this.descriptionQuery, this.typeQuery, this.amountQuery, this.dateQuery];
  }

  save = () => {
    if (this.rule.name && this.children.every((child) => child?.isValid() || false)) {
      const predicate: Predicate = this.children.reduce((acc, v) => ({ ...acc, ...v?.makeQuery() }), {});
      console.log(this.rule);
      const rule: Rule = {
        ...this.rule,
        predicate,
      };
      if (!rule.id) {
        this.store.dispatch(createRule({ rule }));
      } else {
        this.store.dispatch(updateRule({ rule }));
      }
      this.dialogRef.close();
    }
  };

  cancel() {
    this.dialogRef.close();
  }
}
