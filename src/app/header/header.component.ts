import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    public dialog: MatDialog
    ) { }

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
        // TO-DO logout
        this.router.navigate(['/']);
      } else {
        console.log('Not logout!');
      }
    });
  }

}

