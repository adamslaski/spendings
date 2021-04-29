import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-dialog',
  template: `<h1 mat-dialog-title>Transaction details</h1>
    <div mat-dialog-content class="grid-container">
      <div>Data</div>
      <div>{{ data.date | date: 'd-M-y' }}</div>
      <div>Typ</div>
      <div>{{ data.type }}</div>
      <div>Kwota</div>
      <div>{{ data.amount }}</div>
      <div>Stan rachunku po operacji</div>
      <div>{{ data.balanceAfter }}</div>
      <div>Opis</div>
      <div>{{ data.description }}</div>
      <div>Komentarz</div>
      <div>
        <mat-form-field style="width: 100%;">
          <input matInput name="comment" [(ngModel)]="data.comment" />
        </mat-form-field>
      </div>
      <div>Kategoria</div>
      <div>
        <app-select-category [(ngModel)]="data.category"></app-select-category>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button [mat-dialog-close]="data" tabindex="1" color="primary">Ok</button>
      <button mat-raised-button (click)="cancel()" tabindex="2">Cancel</button>
    </div>`,
  styles: [
    `
      .grid-container {
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: repeat(7, 1fr);
        gap: 10px 10px;
        grid-template-areas: repeat(7, '. .');
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
