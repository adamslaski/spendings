import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  ref?: MatSnackBarRef<TextOnlySnackBar>;
  callbacks: (() => MatSnackBarRef<TextOnlySnackBar>)[] = [];
  constructor(private snackBar: MatSnackBar) {}

  private open(message: string, type: 'info' | 'warn' | 'error') {
    const ref = this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`${type}-message`],
    });
    ref.afterDismissed().subscribe((x) => {
      if (this.callbacks.length > 0) {
        const next = this.callbacks[0];
        this.callbacks.splice(0, 1);
        this.ref = next();
      } else {
        this.ref = undefined;
      }
    });
    return ref;
  }

  private register(message: string, type: 'info' | 'warn' | 'error') {
    if (!this.ref) {
      this.ref = this.open(message, type);
    } else {
      this.callbacks.push(() => this.open(message, type));
    }
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
