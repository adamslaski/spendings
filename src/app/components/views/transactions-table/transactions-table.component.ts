import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Transaction } from 'src/app/store/entities';
import { TransactionDialogComponent } from 'src/app/components/transaction-dialog.component';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppState } from 'src/app/store/store';
import { selectTransactions } from 'src/app/store/selectors';
import { updateTransaction } from 'src/app/store/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css'],
})
export class TransactionsTableComponent implements AfterViewInit, OnDestroy {
  readonly displayedColumns = ['date', 'type', 'amount', 'description', 'category', 'comment'];
  readonly filterSubject = new BehaviorSubject<(x: Transaction) => boolean>(passAllFilter);
  dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  private readonly subscription = new Subscription();

  constructor(private dialog: MatDialog, private store: Store<AppState>) {
    this.dataSource = new MatTableDataSource<Transaction>([]);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(tr: Transaction): void {
    const trCopy = Object.assign({}, tr);
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      height: '750px',
      width: '750px',
      data: trCopy,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && JSON.stringify(tr) !== JSON.stringify(result)) {
        this.store.dispatch(updateTransaction({ transaction: result }));
      }
    });
  }

  ngAfterViewInit() {
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
    this.subscription.add(
      combineLatest([this.store.select(selectTransactions), this.filterSubject])
        .pipe(map(([a, b]) => a.filter(b)))
        .subscribe((x) => {
          this.dataSource.data = x;
        }),
    );
  }
}

export const passAllFilter = (x: any) => true;
