import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

type MessageType = 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  ref?: MatSnackBarRef<TextOnlySnackBar>;
  private readonly messages: { message: string; type: MessageType }[] = [];
  private readonly notification$: Subject<[]> = new Subject();
  private token = true;
  constructor(private snackBar: MatSnackBar) {
    this.notification$.subscribe((x) => {
      if (this.token && this.messages.length > 0) {
        const msg = this.messages.shift();
        if (msg) {
          this.open(msg?.message, msg?.type);
        }
      }
    });
  }

  private open(message: string, type: 'info' | 'warn' | 'error') {
    this.token = false;
    const ref = this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`${type}-message`],
    });
    ref.afterDismissed().subscribe((x) => {
      this.token = true;
      this.notification$.next([]);
    });
    return ref;
  }

  private register(message1: string, type1: MessageType) {
    this.messages.push({ message: message1, type: type1 });
    this.notification$.next([]);
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
