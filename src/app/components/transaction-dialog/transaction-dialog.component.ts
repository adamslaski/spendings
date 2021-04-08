import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styles: [
    '.full-width { width: 100%; }',
    `
      #transaction-dialog-table > tr > td {
        height: 50px;
      }
    `,
  ],
})
export class TransactionDialogComponent {
  constructor(public dialogRef: MatDialogRef<TransactionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  cancel() {
    this.dialogRef.close();
  }
}
