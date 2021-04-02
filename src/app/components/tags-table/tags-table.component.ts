import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/services/data-model.service';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-tags-table',
  template: `
    <mat-form-field>
      <input matInput type="text" name="newLabel" #newLabel>
    </mat-form-field>
    <button mat-raised-button (click)="create(newLabel.value)">dodaj</button>

    <table>
      <tr *ngFor="let tag of tags">
        <td>
          <mat-form-field>
            <input matInput name="label" type="text" [(ngModel)]="tag.label">
          </mat-form-field>
        </td>
        <td><button mat-button (click)="delete(tag.id)">
          <i class="material-icons" style="font-size: 18px">cancel</i>
        </button></td>
      </tr>
    </table>`,
})
export class TagsTableComponent{
  readonly tags: Tag[];

  constructor(private tagService: TagsService) {
    this.tags = tagService.tags;
  }

  public create(label: string) {
    this.tagService.create(label);
  }

  public delete(id: number) {
    this.tagService.delete(id);
  }

}
