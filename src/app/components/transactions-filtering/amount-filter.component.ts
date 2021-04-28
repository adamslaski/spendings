import { Component, Input, OnInit } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from '../../utils/filter';

@Component({
  selector: 'app-amount-filter',
  template: `
    <div class="search-tab-description">Wybierz zakres kwot.</div>
    <mat-button-toggle-group [(ngModel)]="amountRange.type" class="mat-form-field">
      <mat-button-toggle value="credit"> uznania </mat-button-toggle>
      <mat-button-toggle value="debit"> obciążenia </mat-button-toggle>
    </mat-button-toggle-group>
    <br />
    <mat-form-field class="amount--input">
      <input matInput [(ngModel)]="amountRange.minAmount" placeholder="od" />
    </mat-form-field>
    <mat-form-field class="amount--input" style="margin-right: 0">
      <input matInput [(ngModel)]="amountRange.maxAmount" placeholder="do" />
    </mat-form-field>
  `,
  styles: ['.amount--input {width: 106px;}', 'mat-button-toggle {width: 110px;}'],
})
export class AmountFilterComponent implements OnInit, Filter {
  @Input()
  amountRange: AmountRange = { type: 'debit' };

  clear(): void {
    this.amountRange = { type: 'debit' };
  }

  makeQuery(): Predicate {
    console.log('amountRange.maxAmount', this.amountRange.maxAmount);
    console.log('amountRange.maxAmount type', typeof this.amountRange.maxAmount);
    const max = !this.amountRange.maxAmount ? Number.MAX_VALUE : Number(this.amountRange.maxAmount);
    const min = !this.amountRange.minAmount ? 0 : Number(this.amountRange.minAmount);
    if (this.amountRange.type === 'credit') {
      return { amountMin: min, amountMax: max };
    } else {
      return { amountMin: -max, amountMax: -min };
    }
  }

  ngOnInit(): void {}
}

interface AmountRange {
  type: 'credit' | 'debit';
  minAmount?: string;
  maxAmount?: string;
}
