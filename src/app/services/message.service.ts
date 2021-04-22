import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, OperatorFunction, Subject, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store';
import { selectMessage } from '../store/selectors';
import { filter, map } from 'rxjs/operators';
import { Message } from '../store/entities';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  ref?: MatSnackBarRef<TextOnlySnackBar>;
  private readonly tokens$: Subject<[]> = new BehaviorSubject([]);

  constructor(store: Store<AppState>, private snackBar: MatSnackBar) {
    zip(
      this.tokens$,
      store
        .select(selectMessage)
        .pipe(
          filter((msg) => msg !== undefined) as OperatorFunction<Message | undefined, Message>,
          map(this.logMessage),
        ),
    ).subscribe(([[], msg]) => this.open(msg));
  }

  private readonly open = (msg: Message) => {
    const ref = this.snackBar.open(msg.message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`${msg.type}-message`],
    });
    ref.afterDismissed().subscribe((x) => {
      this.tokens$.next([]);
    });
  };

  private readonly logMessage = (msg: Message) => {
    switch (msg.type) {
      case 'info': {
        console.log(msg.message);
        break;
      }
      case 'error': {
        console.error(msg.message);
        break;
      }
      case 'warn': {
        console.warn(msg.message);
        break;
      }
    }
    return msg;
  };
}
