import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCategories } from 'src/app/store/selectors';
import { findCategoryById } from 'src/app/utils/categories.helper';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/store';

@Component({
  selector: 'app-display-category',
  template: `{{ displayCategory$ | async }}`,
})
export class DisplayCategoryComponent {
  private categoryIdSubject$ = new BehaviorSubject<number>(0);
  displayCategory$ = combineLatest([this.categoryIdSubject$, this.store.select(selectCategories)]).pipe(
    map(([id, cats]) => findCategoryById(id, cats)?.label),
  );

  @Input()
  public set category(value: number) {
    this.categoryIdSubject$.next(value);
  }

  constructor(private store: Store<AppState>) {}
}
