import { Component, Input } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { selectAccounts } from '../store/selectors';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store';

@Component({
  selector: 'app-display-account',
  template: ` <div>{{ displayAccount$ | async }}</div>`,
})
export class DisplayAccountComponent {
  private accountIdSubject$ = new ReplaySubject<number>();
  displayAccount$ = combineLatest([this.accountIdSubject$, this.store.select(selectAccounts)]).pipe(
    map(([id, accounts]) => accounts.find((a) => a.id === id)),
    map((account) => `${account?.name} (${account?.bank})`),
  );

  @Input()
  public set account(value: number) {
    console.log('set account', value);
    this.accountIdSubject$.next(value);
  }

  constructor(private store: Store<AppState>) {}
}
