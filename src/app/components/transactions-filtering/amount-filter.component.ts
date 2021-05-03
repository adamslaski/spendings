import { Component, Input, OnInit } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from '../../utils/filter';
import {
  AmountRangeString,
  amountRangeStringToAmountRange,
  amountRangeToAmountRangeString,
} from '../../utils/amount-range.helper';
import { AmountRange } from 'src/app/store/entities';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-amount-filter',
  template: `
    <div class="search-tab-description">Wybierz zakres kwot.</div>
    <form [formGroup]="amountForm">
      <mat-button-toggle-group class="mat-form-field" formControlName="type">
        <mat-button-toggle value="credit"> uznania </mat-button-toggle>
        <mat-button-toggle value="debit"> obciążenia </mat-button-toggle>
      </mat-button-toggle-group>
      <br />
      <div style="display: inline-flex">
        <div>
          <mat-form-field class="amount--input">
            <input matInput maxlength="10" placeholder="od" pattern="[0-9]*" formControlName="min" />
          </mat-form-field>
          <div
            *ngIf="amountFormControl.min.invalid && (amountFormControl.min.dirty || amountFormControl.min.touched)"
            class="validator-message"
          >
            <div *ngIf="amountFormControl.min.errors?.pattern">Podaj liczbę.</div>
          </div>
        </div>
        <div>
          <mat-form-field class="amount--input" style="margin-right: 0">
            <input matInput maxlength="10" placeholder="do" pattern="[0-9]*" formControlName="max" />
          </mat-form-field>
          <div
            *ngIf="amountFormControl.max.invalid && (amountFormControl.max.dirty || amountFormControl.max.touched)"
            class="validator-message"
          >
            <div *ngIf="amountFormControl.max.errors?.pattern">Podaj liczbę.</div>
          </div>
        </div>
      </div>
    </form>
    <div *ngIf="amountForm.invalid && (amountForm.dirty || amountForm.touched)" class="validator-message">
      <div *ngIf="amountForm.errors?.minSmallerThanMax">Zakres nieprawidłowy.</div>
    </div>
  `,
  styles: ['.amount--input {width: 106px;}', 'mat-button-toggle {width: 110px;}'],
})
export class AmountFilterComponent implements Filter {
  amountForm = new FormGroup(
    {
      type: new FormControl('debit'),
      min: new FormControl('', Validators.pattern('[0-9]*')),
      max: new FormControl('', Validators.pattern('[0-9]*')),
    },
    { validators: minSmallerThanMax },
  );
  get amountFormControl() {
    return this.amountForm.controls;
  }
  @Input()
  public set amountRange(value: AmountRange | undefined) {
    this.amountForm.setValue(amountRangeToAmountRangeString(value));
  }

  clear(): void {
    this.amountForm.setValue({ type: 'debit' });
  }

  makeQuery(): Predicate {
    return { amountRange: amountRangeStringToAmountRange(this.amountForm.value) };
  }

  isValid(): boolean {
    console.log('is valid', this.amountForm.valid);
    return this.amountForm.valid;
  }
}

const minSmallerThanMax: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const range = amountRangeStringToAmountRange(control.value);
  return range.min && range.max && range.min > range.max ? { minSmallerThanMax: true } : null;
};
