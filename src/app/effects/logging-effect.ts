import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store';

@Injectable()
export class LoggingEffect {
  constructor(private actions$: Actions, private store: Store<AppState>) {
    this.actions$.subscribe((a) => console.log('ACTION', a));
    this.store.subscribe((s) => console.log('STORE', s));
  }
}
