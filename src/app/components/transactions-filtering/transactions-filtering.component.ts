import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'src/app/services/data-model.service';
import { PredicateService } from 'src/app/services/predicate.service';
import { passAllFilter } from '../transactions-table/transactions-table.component';

@Component({
  selector: 'app-transactions-filtering',
  templateUrl: './transactions-filtering.component.html',
  styleUrls: ['./transactions-filtering.component.css'],
})
export class TransactionsFilteringComponent implements OnInit {
  @Input()
  filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(passAllFilter);
  advancedQuery = '';
  descriptionQuery = '';
  typeQuery = '';
  categoryQuery = 0;
  amountQuery: AmountRange = { type: 'debit' };
  dateRangeQuery = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private router: Router, private predicateService: PredicateService) {}

  ngOnInit(): void {}

  makeDescriptionQuery(query: string) {
    const upperCaseQuery = query.toUpperCase();
    return `tr.description.toUpperCase().includes("${upperCaseQuery}")`;
  }

  makeTypeQuery(query: string) {
    const upperCaseQuery = query.toUpperCase();
    return `tr.type.toUpperCase().includes("${upperCaseQuery}")`;
  }

  makeCategoryQuery(category: number) {
    return `tr.category === ${category}`;
  }

  makeAmountQuery(amountRange: AmountRange, type: 'credit' | 'debit') {
    const max = amountRange.maxAmount === undefined ? Number.MAX_VALUE : amountRange.maxAmount;
    const min = amountRange.minAmount ? amountRange.minAmount : 0;
    if (type === 'credit') {
      return `tr.amount >= ${min} && tr.amount <= ${max}`;
    } else {
      return `tr.amount <= ${-min} && tr.amount >= ${-max}`;
    }
  }

  makeDateRangeQuery(range: { start: Date; end: Date }) {
    return `tr.date.getTime() >= ${range.start.getTime()} && tr.date.getTime() <= ${range.end.getTime()}`;
  }

  filter(query: string) {
    this.filterSubject.next(this.predicateService.compile(query));
  }

  addRule(query: string) {
    this.router.navigateByUrl('/rules-table/' + btoa(query));
  }

  clearFiltering() {
    this.filterSubject.next(passAllFilter);
    this.advancedQuery = '';
    this.descriptionQuery = '';
    this.typeQuery = '';
  }
}

interface AmountRange {
  type: 'credit' | 'debit';
  minAmount?: number;
  maxAmount?: number;
}
