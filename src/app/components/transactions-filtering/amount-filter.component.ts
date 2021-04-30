import { Component, Input, OnInit } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from '../../utils/filter';
import {
  AmountRangeString,
  amountRangeStringToAmountRange,
  amountRangeToAmountRangeString,
} from '../../utils/amount-range.helper';
import { AmountRange } from '../../store/entities';

@Component({
  selector: 'app-amount-filter',
  template: `
    <div class="search-tab-description">Wybierz zakres kwot.</div>
    <mat-button-toggle-group [(ngModel)]="amountRangeString.type" class="mat-form-field">
      <mat-button-toggle value="credit"> uznania </mat-button-toggle>
      <mat-button-toggle value="debit"> obciążenia </mat-button-toggle>
    </mat-button-toggle-group>
    <br />
    <mat-form-field class="amount--input">
      <input matInput [(ngModel)]="amountRangeString.min" placeholder="od" />
    </mat-form-field>
    <mat-form-field class="amount--input" style="margin-right: 0">
      <input matInput [(ngModel)]="amountRangeString.max" placeholder="do" />
    </mat-form-field>
  `,
  styles: ['.amount--input {width: 106px;}', 'mat-button-toggle {width: 110px;}'],
})
export class AmountFilterComponent implements Filter {
  public amountRangeString: AmountRangeString = { type: 'debit' };
  @Input()
  public set amountRange(value: AmountRange | undefined) {
    this.amountRangeString = amountRangeToAmountRangeString(value);
  }

  clear(): void {
    this.amountRangeString = { type: 'debit' };
  }

  makeQuery(): Predicate {
    return { amountRange: amountRangeStringToAmountRange(this.amountRangeString) };
  }
}
