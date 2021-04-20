import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Category } from 'src/app/services/data-model.service';
import { SpendingsState } from 'src/app/store/reducer';
import { createCategory, deleteCategory, updateCategory } from 'src/app/store/actions';

@Component({
  selector: 'app-categories-table',
  template: ` <mat-form-field>
      <input matInput type="text" name="newLabel" #newLabel placeholder="nazwa kategorii" />
    </mat-form-field>
    <button mat-flat-button (click)="create(newLabel.value); newLabel.value = ''" color="primary">dodaj</button>

    <table>
      <tr *ngFor="let cat of categories$ | async">
        <td>
          <mat-form-field>
            <input
              matInput
              name="label"
              type="text"
              [ngModel]="cat.label"
              (blur)="onChange($event, cat)"
              [readonly]="cat.notEditable"
            />
          </mat-form-field>
        </td>
        <td>
          <button *ngIf="!cat.notEditable" mat-flat-button (click)="delete(cat.id)" color="primary">
            <i class="material-icons" style="font-size: 18px">cancel</i>
          </button>
        </td>
      </tr>
    </table>`,
})
export class CategoriesTableComponent {
  readonly categories$ = this.store.select((state) => state?.spendings.categories);

  constructor(private store: Store<{ spendings: SpendingsState }>) {}

  public create(label: string) {
    this.store.dispatch(createCategory({ category: { id: 0, label } }));
  }

  public delete(id: number) {
    this.store.dispatch(deleteCategory({ id }));
  }

  public onChange($event: FocusEvent, cat: Category) {
    const newValue = ($event.target as HTMLInputElement).value;
    if (newValue !== cat.label) {
      this.store.dispatch(updateCategory({ category: { ...cat, label: newValue } }));
    }
  }
}
