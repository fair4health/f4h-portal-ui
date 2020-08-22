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
        console.log('Login answer received!');
        this.auth.login(user, data.access_token);
        this.router.navigate(['/uclist']);
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Login failed!');
      });
  }

}
