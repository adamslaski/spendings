import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Rule } from 'src/app/services/data-model.service';
import { RulesService } from 'src/app/services/rules.service';

@Component({
  selector: 'app-rules-table',
  template: `
    <mat-form-field>
      <input matInput #newName placeholder="nazwa">
    </mat-form-field>
    <mat-form-field class="longField">
      <input matInput #newPredicate placeholder="predykat" [(ngModel)]="predicate">
    </mat-form-field>
    <div style="width: 1000px">
      <app-chips [tags]="tags" [editMode]="true"></app-chips>
    </div>
    <button mat-raised-button (click)="create(newName.value, newPredicate.value, tags)">dodaj</button>

    <table>
      <tr *ngFor="let rule of rules">
        <td>{{ rule.name }}</td>
        <td>{{ rule.predicate }}</td>
        <td>
          <app-chips [tags]="rule.tags"></app-chips>
        </td>
        <td>
          <button mat-button (click)="delete(rule.name)">
            <i class="material-icons" style="font-size: 18px">cancel</i>
          </button>
        </td>
      </tr>
    </table>`,
  styles: ['.mat-form-field.longField{ width: 1000px }']
})
export class RulesTableComponent {
  readonly rules: Rule[];
  tags: number[] = [];
  predicate: string = '';

constructor(private rulesService: RulesService, private route: ActivatedRoute) {
  this.rules = rulesService.rules;
  this.route.paramMap.forEach((params: ParamMap) => {
    if (params.has('predicate')) {
      this.predicate = params.get('predicate') || '';
    }
  });
}

public create(name: string, predicate: string, tags: number[]) {
  this.rulesService.create(name, predicate, tags);
}

public delete(name: string) {
  this.rulesService.delete(name);
}

}
