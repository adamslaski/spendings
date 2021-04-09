import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Transaction, DataModelService } from 'src/app/services/data-model.service';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog/transaction-dialog.component';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ObservableDataSource } from 'src/app/utils/observable-data-source';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css'],
})
export class TransactionsTableComponent {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'chips', 'comment'];
  readonly filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(passAllFilter);
  readonly dataSource: ObservableDataSource<Transaction>;

  constructor(public dialog: MatDialog, private dmService: DataModelService) {
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
}

export const passAllFilter = (x: any) => true;
