import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from 'src/app/store/reducer';
import { loadStateFromLocalStorage, saveStateToLocalStorage, resetState, sendMessage } from '../store/actions';
import { AppState } from '../store/store';
import { combineLatest } from 'rxjs';

@Injectable()
export class LocalStoraEffect {
  constructor(actions$: Actions, store: Store<AppState>) {
    const spendings = 'spendings';
    const parseDate: ((this: any, key: string, value: any) => any) | undefined = (key, value) =>
      key === 'date' && typeof value === 'string' ? new Date(value) : value;

    combineLatest([actions$, store]).subscribe(([action, appState]) => {
      if (action.type === saveStateToLocalStorage.type) {
        window.localStorage.setItem(spendings, JSON.stringify(appState.spendings));
      }
    });

    actions$.subscribe((action) => {
      if (action.type === loadStateFromLocalStorage.type) {
        const storedState = window.localStorage.getItem(spendings);
        if (storedState) {
          const state = JSON.parse(storedState || '', parseDate);
          store.dispatch(resetState({ state }));
          store.dispatch(sendMessage({ message: { message: `Wczytano stan z local storage.`, type: 'info' } }));
        } else {
          store.dispatch(
            sendMessage({ message: { message: `Local storage nie zawiera zapisanego stanu.`, type: 'error' } }),
          );
        }
      }
    });
  }
}
