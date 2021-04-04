import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsService } from 'src/app/services/transactions.service';
import {
  Transaction, DataModelService,
  ObservableDataSource, compileAndFilter
} from 'src/app/services/data-model.service';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog/transaction-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
})
export class TransactionsTableComponent implements OnInit {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'chips', 'comment'];
  dataSource = new ObservableDataSource(this.dmService.transactionsObservable);
  query: string = "";

  constructor(private trsService: TransactionsService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute, private dmService: DataModelService) {
    console.log('tr-table constructor');
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
    const trCopy = Object.assign({}, tr, { tags: tr.tags.slice() });
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '550px',
      data: trCopy
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        Object.assign(tr, result);
        tr.tags.slice(0, tr.tags.length);
        tr.tags.push(...result.tags);
      }
    });
  }

  filter(query: string) {
    this.dataSource = new ObservableDataSource(this.dmService.transactionsObservable.pipe(
      map(compileAndFilter<Transaction>(query))));
  }

  addRule(query: string) {
    this.router.navigateByUrl('/rules-table/' + encodeURIComponent(query));
  }

}
