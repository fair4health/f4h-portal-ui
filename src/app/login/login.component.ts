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

import { AuthService } from '../core/services/auth.service';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor(
    private router: Router,
    public auth: AuthService,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
  }

  onRememberPassword(): void {
    console.log('Clicked remember password. TODO: remember password');
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Access limited');
  }

  onAskAccess(): void {
    console.log('Clicked ask access. TODO: user creation');
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Access limited');
  }

  onLogin(user: string, pass: string): void {
    console.log('Clicked login submit');
    this.backendService.login(user, pass).subscribe(
      (data) => {
        console.log('Login answer received!', data);
        this.auth.login(user, data.access_token, data.role);
        this.router.navigate(['/uclist']);
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Login failed!');
      });
  }

}
