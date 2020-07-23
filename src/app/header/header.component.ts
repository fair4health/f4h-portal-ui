import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  logout(): void {
    console.log('Clicked logout. TODO: ask for confirmation');
    this.openLogoutDialog();
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Logout dialog result: ${result}`);
      if (result) {
        console.log('Logout user and redirect then!');
      } else {
        console.log('Not logout!');
      }
    });
  }

}

