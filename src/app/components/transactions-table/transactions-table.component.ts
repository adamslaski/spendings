import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Transaction, DataModelService } from 'src/app/services/data-model.service';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog/transaction-dialog.component';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ObservableDataSource } from 'src/app/utils/observable-data-source';
import { compile } from 'src/app/utils/functions';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styles: ['div.search-tab-description {margin: 10px 0px 10px 0px}',
    '.search-form-tabs { max-width: 1020px; margin-bottom: 20px }',
    '.search-form-button { margin-right: 5px;}',
    '.tab-body { margin-left: 10px; margin-bottom: 10px }']
})
export class TransactionsTableComponent implements OnInit {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'chips', 'comment'];
  readonly passAllFilter = (x: Transaction) => true;
  readonly filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(this.passAllFilter);
  readonly dataSource: ObservableDataSource<Transaction>;
  query: string = "";
  simpleQuery: string = "";

  constructor(private trsService: TransactionsService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute, private dmService: DataModelService) {
    console.log('tr-table constructor');

    let combined = combineLatest([this.dmService.transactionsView.observableValues(), this.filterSubject])
      .pipe(map(([a, b]) => a.filter(b)));
    this.dataSource = new ObservableDataSource(combined);
  }

  ngOnInit(): void {
    this.route.paramMap.forEach((params: ParamMap) => {
      if (params.has('query')) {
        this.query = 'tr.name === \'' + params.get('query') + '\'';
        this.filter(this.query);
      }
    });
  }

  openDialog(tr: Transaction): void {
    const trCopy = Object.assign({}, tr);
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '550px',
      data: trCopy
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && JSON.stringify(tr) != JSON.stringify(result)) {
        this.dmService.transactionsView.modify(result);
      }
    });
  }

  makeQuery(simpleQuery: string) {
    const upperCaseQuery = simpleQuery.toUpperCase();
    return `tr.description.toUpperCase().includes("${upperCaseQuery}")`
      + ` || tr.type.toUpperCase().includes("${upperCaseQuery}")`;
  }

  filter(query: string) {
    this.filterSubject.next(compile<Transaction>(query));
  }

  addRule(query: string) {
    this.router.navigateByUrl('/rules-table/' + btoa(query));
  }

  clearFiltering() {
    this.filterSubject.next(this.passAllFilter);
    this.query = "";
    this.simpleQuery = "";
  }

}
