/**
 * @license
 * Copyright (C) 2020  Atos Spain SA. All rights reserved.
 *
 * Use of this source code is governed by a license style Apache License, Version 2.0 that can be
 * found in the LICENSE file at https://github.com/fair4health/f4h-portal-ui/blob/master/LICENSE
 *
 * The software is provided "AS IS", without any warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose and noninfringement, in no event shall the authors or copyright holders be
 * liable for any claim, damages or other liability, whether in action of contract, tort or
 * otherwise, arising from, out of or in connection with the software or the use or other
 * dealings in the software.
 *
 * See README file for the full disclaimer information and LICENSE file for full license
 * information in the project root.
 */

import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserCommunicationService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

    // Message types
    readonly ERROR = 'ERROR';
    readonly INFO = 'INFO';
    readonly SUCCESS = 'SUCCESS';

    // The messges array accepts message: { text: any, type: string };
    createMessage(type: string, msg: any): void {
      console.log(type + ': ' + msg);

      let snackBarConfig: MatSnackBarConfig;
      if (type === this.ERROR) {
        snackBarConfig = {panelClass: ['snack-bar-error']};
      } else if (type === this.INFO) {
        snackBarConfig = {panelClass: ['snack-bar-info']};
      } else if (type === this.SUCCESS) {
        snackBarConfig = {panelClass: ['snack-bar-success']};
      } else {
        snackBarConfig = {panelClass: ['snack-bar-info']};
      }
       // The message lasts 12 seconds
      snackBarConfig.duration = 12000;
      msg = msg;
      this.snackBar.open(msg, 'close', snackBarConfig);
    }
}
