import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  username: string;
  token: string;

  constructor(
    private backendService: BackendService
  ) { }

  isLoggedIn(): boolean {
    if (this.username !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  login(user: string, token: string): void {
    this.username = user;
    this.token = token;
  }

  logout(): void {
    this.username = undefined;
    this.token = undefined;
  }

}
