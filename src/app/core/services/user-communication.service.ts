import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserCommunicationService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

    // Message types
    readonly ERROR = 'error';
    readonly INFO = 'info';
    readonly SUCCESS = 'success';

    // The messges array accepts message: { text: any, type: string };
    createMessage(type: string, msg: any): void {
      console.log(type + ': ' + msg);
      // The message lasts 2 seconds
      msg = msg;
      this.snackBar.open(msg, type, {
        duration: 2000,
      });
    }
}
