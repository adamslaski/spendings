import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Message } from '../store/entities';

export const MESSAGE_SUBJECT = new Subject<Message>();

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  ref?: MatSnackBarRef<TextOnlySnackBar>;
  private readonly tokens$ = new BehaviorSubject(void 0);

  constructor(private snackBar: MatSnackBar) {
    zip(this.tokens$, MESSAGE_SUBJECT.pipe(tap(this.logMessage))).subscribe(([undef, msg]) => this.open(msg));
  }

  private readonly open = (msg: Message) => {
    const ref = this.snackBar.open(msg.message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`${msg.type}-message`],
    });
    ref.afterDismissed().subscribe((x) => {
      this.tokens$.next(void 0);
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
  };
}
