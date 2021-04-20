import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SpendingsState } from './reducer';

@Injectable()
export class LoggingEffect {
  constructor(private actions$: Actions, private store: Store<SpendingsState>) {
    this.actions$.subscribe((a) => console.log('ACTION', a));
    this.store.subscribe((s) => console.log('STORE', s));
  }
}
