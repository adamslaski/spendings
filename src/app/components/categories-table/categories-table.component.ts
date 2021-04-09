import { Component } from '@angular/core';
import { Category, DataModelService } from 'src/app/services/data-model.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories-table',
  template: ` <mat-form-field>
      <input matInput type="text" name="newLabel" #newLabel placeholder="nazwa kategorii" />
    </mat-form-field>
    <button mat-flat-button (click)="create(newLabel.value); newLabel.value = ''" color="primary">dodaj</button>

    <table>
      <tr *ngFor="let cat of categories | async">
        <td>
          <mat-form-field>
            <input matInput name="label" type="text" [(ngModel)]="cat.label" (blur)="onChange(cat)" />
          </mat-form-field>
        </td>
        <td>
          <button *ngIf="cat.id > 0" mat-flat-button (click)="delete(cat.id)" color="primary">
            <i class="material-icons" style="font-size: 18px">cancel</i>
          </button>
        </td>
      </tr>
    </table>`,
})
export class CategoriesTableComponent {
  readonly categories;

  constructor(private categoriesService: CategoriesService, private dmService: DataModelService) {
    this.categories = dmService.categoriesView.observableValues();
  }

  public create(label: string) {
    this.categoriesService.create(label);
  }

  public delete(id: number) {
    this.categoriesService.delete(id);
  }

  public onChange(cat: Category) {
    this.dmService.categoriesView.modify(cat);
  }
}
