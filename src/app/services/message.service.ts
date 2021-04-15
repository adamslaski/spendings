import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, zip } from 'rxjs';

type MessageType = 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  ref?: MatSnackBarRef<TextOnlySnackBar>;
  private readonly tokens$: Subject<[]> = new BehaviorSubject([]);
  private readonly messages$: Subject<{ message: string; type: MessageType }> = new Subject();
  constructor(private snackBar: MatSnackBar) {
    zip(this.tokens$, this.messages$).subscribe(([[], msg]) => {
      this.open(msg.message, msg.type);
    });
  }

  private open(message: string, type: 'info' | 'warn' | 'error') {
    const ref = this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`${type}-message`],
    });
    ref.afterDismissed().subscribe((x) => {
      this.tokens$.next([]);
    });
  }

  private register(message1: string, type1: MessageType) {
    this.messages$.next({ message: message1, type: type1 });
  }

  info(message: string) {
    console.log(message);
    this.register(message, 'info');
  }

  warn(message: string) {
    console.warn(message);
    this.register(message, 'warn');
  }

  error(message: string) {
    console.error(message);
    this.register(message, 'error');
  }
}
