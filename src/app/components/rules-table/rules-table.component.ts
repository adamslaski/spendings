import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { selectRules } from 'src/app/store/selectors';
import { deleteRule, moveRule } from 'src/app/store/actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/store';
import { Rule } from '../../store/entities';
import { RuleDialogComponent } from '../rule-dialog/rule-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rules-table',
  template: `<div style="display: inline-flex">
    <div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
      <div class="example-box" *ngFor="let rule of rules$ | async" cdkDrag>
        <span class="material-icons" style="margin-right: 10px"> drag_indicator </span>
        <div style="width: 10em;">{{ rule.name }}</div>
        <app-display-category [category]="rule.category" style="width: 30em;"></app-display-category>
        <span class="fill-remaining-space"></span>
        <button mat-icon-button (click)="openDialog(rule)" color="primary" class="box-button">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button (click)="delete(rule.id)" color="primary" class="box-button">
          <mat-icon>cancel</mat-icon>
        </button>
      </div>
    </div>
    <div style="margin-top: 20px; margin-left: 20px">
      <button mat-flat-button (click)="openDialog()" color="primary">Stwórz nową regułę</button>
    </div>
  </div>`,
  styleUrls: ['./rules-table.component.css'],
})
export class RulesTableComponent {
  readonly rules$ = this.store.select(selectRules);

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  openDialog(rule?: Rule): void {
    this.dialog.open(RuleDialogComponent, {
      width: '560px',
      height: '500px',
      data: rule || { id: 0, predicate: {}, name: '', category: 0 },
    });
  }

  public delete(id: number) {
    this.store.dispatch(deleteRule({ id }));
  }

  drop(event: CdkDragDrop<string[]>) {
    this.store.dispatch(moveRule({ prevIndex: event.previousIndex, newIndex: event.currentIndex }));
  }
}
