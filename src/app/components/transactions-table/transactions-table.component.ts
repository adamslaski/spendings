import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Transaction, DataModelService } from 'src/app/services/data-model.service';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog/transaction-dialog.component';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ObservableDataSource } from 'src/app/utils/observable-data-source';
import { compile } from 'src/app/utils/functions';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css'],
})
export class TransactionsTableComponent {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'chips', 'comment'];
  readonly passAllFilter = (x: Transaction) => true;
  readonly filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(this.passAllFilter);
  readonly dataSource: ObservableDataSource<Transaction>;
  advancedQuery = '';
  descriptionQuery = '';
  typeQuery = '';
  categoryQuery = 0;
  amountQuery: AmountRange = { type: 'debit', minAmount: 0 };
  dateRangeQuery = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private router: Router, public dialog: MatDialog, private dmService: DataModelService) {
    console.log('tr-table constructor');

    const combined = combineLatest([this.dmService.transactionsView.observableValues(), this.filterSubject]).pipe(
      map(([a, b]) => a.filter(b)),
    );
    this.dataSource = new ObservableDataSource(combined);
  }

  openDialog(tr: Transaction): void {
    const trCopy = Object.assign({}, tr);
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '550px',
      height: '550px',
      data: trCopy,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result && JSON.stringify(tr) !== JSON.stringify(result)) {
        this.dmService.transactionsView.modify(result);
      }
    });
  }

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

  makeAmountQuery(amountRange: AmountRange) {
    const max = amountRange.maxAmount === undefined ? Number.MAX_VALUE : amountRange.maxAmount;
    const min = amountRange.minAmount;
    if (amountRange.type === 'credit') {
      return `tr.amount >= ${min} && tr.amount <= ${max}`;
    } else {
      return `tr.amount <= ${-min} && tr.amount >= ${-max}`;
    }
  }

  makeDateRangeQuery(range: { start: Date; end: Date }) {
    return `tr.date.getTime() >= ${range.start.getTime()} && tr.date.getTime() <= ${range.end.getTime()}`;
  }

  filter(query: string) {
    this.filterSubject.next(compile<Transaction>(query));
  }

  addRule(query: string) {
    this.router.navigateByUrl('/rules-table/' + btoa(query));
  }

  clearFiltering() {
    this.filterSubject.next(this.passAllFilter);
    this.advancedQuery = '';
    this.descriptionQuery = '';
    this.typeQuery = '';
  }
}

interface AmountRange {
  type: 'credit' | 'debit';
  minAmount: number;
  maxAmount?: number;
}
