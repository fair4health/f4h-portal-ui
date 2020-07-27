import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { AuthService } from '../core/services/auth.service';

import { MatDialog } from '@angular/material/dialog';

import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';


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
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
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

