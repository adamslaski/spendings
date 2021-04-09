import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Transaction, DataModelService } from 'src/app/services/data-model.service';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog/transaction-dialog.component';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css'],
})
export class TransactionsTableComponent implements AfterViewInit {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'category', 'comment'];
  readonly filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(passAllFilter);
  dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(public dialog: MatDialog, private dmService: DataModelService) {
    console.log('tr-table constructor');

    this.dataSource = new MatTableDataSource<Transaction>([]);
    combineLatest([this.dmService.transactionsView.observableValues(), this.filterSubject])
      .pipe(map(([a, b]) => a.filter(b)))
      .subscribe((x) => {
        this.dataSource = new MatTableDataSource<Transaction>(x);
        this.dataSource.sort = this.sort ? this.sort : null;
        this.dataSource.paginator = this.paginator ? this.paginator : null;
        const sortData = this.dataSource.sortData;
        this.dataSource.sortData = (data, sort) => {
          const active = sort.active;
          const direction = sort.direction;
          if (active === 'category' && direction) {
            return data.sort((a, b) => (a.category - b.category) * (direction === 'asc' ? 1 : -1));
          } else {
            return sortData(data, sort);
          }
        };
      });
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort ? this.sort : null;
    this.dataSource.paginator = this.paginator ? this.paginator : null;
  }
}

export const passAllFilter = (x: any) => true;
