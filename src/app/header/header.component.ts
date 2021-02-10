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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { AuthService } from '../core/services/auth.service';

import { MatDialog } from '@angular/material/dialog';

import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { LocalStorageService } from '../core/services/local-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private userCommunication: UserCommunicationService,
    private router: Router,
    public dialog: MatDialog,
    protected keycloakAngular: KeycloakService,
    private localStorage: LocalStorageService
    ) { }

  ngOnInit(): void {
    try {
      console.log('update logged user details');
      this.localStorage.setUserId(this.keycloakAngular.getKeycloakInstance().tokenParsed['preferred_username']);
      this.auth.login(this.keycloakAngular.getKeycloakInstance().tokenParsed['name'],
      this.keycloakAngular.getKeycloakInstance().token,
      this.keycloakAngular.getKeycloakInstance().realmAccess.roles[0]);
    } catch (e){
      console.log('Failed to load user details', e);
    }
  }

  onLogin(): void {
    console.log('Login clicked');
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    console.log('Logout clicked');
    this.openLogoutDialog();
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Logout dialog result: ${result}`);
      if (result) {
        console.log('Logout user and redirect then!');
        this.auth.logout();
        this.userCommunication.createMessage(this.userCommunication.INFO, 'User has been logged out');
        this.router.navigate(['/']);
      } else {
        console.log('Not logout!');
      }
    });
  }

}

