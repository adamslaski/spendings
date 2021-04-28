import { Component, OnInit, ViewChild } from '@angular/core';
import { Predicate } from 'src/app/store/entities';
import { Filter } from '../../utils/filter';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-date-filter',
  template: `
    <div class="search-tab-description">Wybierz zakres dat.</div>
    <mat-form-field>
      <mat-date-range-input [formGroup]="dateRangeQuery" [rangePicker]="picker">
        <input #startDate matStartDate formControlName="start" placeholder="Start" />
        <input #endDate matEndDate formControlName="end" placeholder="Koniec" />
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
      <mat-error *ngIf="dateRangeQuery.controls.start.hasError('matStartDateInvalid')"
        >Nieprawidłowa data początkowa
      </mat-error>
      <mat-error *ngIf="dateRangeQuery.controls.end.hasError('matEndDateInvalid')"
        >Nieprawidłowa data końcowa
      </mat-error> </mat-form-field
    ><br />
  `,
  styles: [],
})
export class DateFilterComponent implements OnInit, Filter {
  dateRangeQuery = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  clear(): void {
    this.dateRangeQuery.reset();
  }

  makeQuery(): Predicate {
    return { dateFrom: this.dateRangeQuery.value.start, dateTo: this.dateRangeQuery.value.end };
  }

  ngOnInit(): void {}
}
