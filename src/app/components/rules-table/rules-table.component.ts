import { Component, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppState, Store } from 'src/app/store/reducer';
import { selectRules } from 'src/app/store/selectors';
import { createRule, deleteRule, moveRule } from 'src/app/store/actions';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.css'],
})
export class RulesTableComponent implements OnDestroy {
  readonly rules$ = this.store.select(selectRules);
  readonly isOverlayOpen: boolean[] = [];
  category = 0;
  predicate = '';
  name = '';
  selected = 0;
  // private readonly subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    // this.subscription = this.dmService.rulesView
    //   .observableValues()
    //   .subscribe((rules) => rules.forEach((rule) => (this.isOverlayOpen[rule.id] = false)));
    this.route.paramMap.forEach((params: ParamMap) => {
      if (params.has('predicate')) {
        this.predicate = atob(params.get('predicate') || '');
      }
    });
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  public create() {
    if (this.name !== '' && this.predicate !== '') {
      this.store.dispatch(
        createRule({ rule: { id: 0, name: this.name, predicate: this.predicate, category: this.category } }),
      );
      this.category = 0;
      this.predicate = '';
      this.name = '';
    }
  }

  public delete(id: number) {
    this.store.dispatch(deleteRule({ id }));
  }

  drop(event: CdkDragDrop<string[]>) {
    this.store.dispatch(moveRule({ prevIndex: event.previousIndex, newIndex: event.currentIndex }));
  }
}
