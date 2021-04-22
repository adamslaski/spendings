import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from 'src/app/store/reducer';
import { loadStateFromLocalStorage, saveStateToLocalStorage, resetState } from '../store/actions';
import { AppState } from '../store/store';
import { combineLatest } from 'rxjs';
import { MESSAGE_SUBJECT } from '../services/message.service';

@Injectable()
export class LocalStoraEffect {
  constructor(actions$: Actions, store: Store<AppState>) {
    const spendings = 'spendings';
    const parseDate: ((this: any, key: string, value: any) => any) | undefined = (key, value) =>
      key === 'date' && typeof value === 'string' ? new Date(value) : value;

    combineLatest([actions$, store]).subscribe(([action, appState]) => {
      if (action.type === saveStateToLocalStorage.type) {
        window.localStorage.setItem(spendings, JSON.stringify(appState.spendings));
        MESSAGE_SUBJECT.next({ message: `Zapisano stan do local storage.`, type: 'info' });
      }
    });

    actions$.subscribe((action) => {
      if (action.type === loadStateFromLocalStorage.type) {
        const storedState = window.localStorage.getItem(spendings);
        if (storedState) {
          const state = JSON.parse(storedState || '', parseDate);
          store.dispatch(resetState({ state }));
          MESSAGE_SUBJECT.next({ message: `Wczytano stan z local storage.`, type: 'info' });
        } else {
          MESSAGE_SUBJECT.next({ message: `Local storage nie zawiera zapisanego stanu.`, type: 'error' });
        }
      }
    });
  }
}
