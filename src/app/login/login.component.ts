import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor() { }

  ngOnInit(): void {
  }

  rememberPassword(): void {
    console.log('Clicked rememberPassword. TODO: remember password');
  }

  askAccess(): void {
    console.log('Clicked askAccess. TODO: user creation');
  }

}
