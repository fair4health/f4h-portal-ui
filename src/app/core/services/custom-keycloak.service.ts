import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class CustomKeycloakService extends KeycloakService {

  async getToken(forceLogin = false): Promise<string> {
    try {
      await this.updateToken(10);
      return this.getKeycloakInstance().token;
    } catch (error) {
      if (forceLogin) {
        this.login();
      } else {
        throw error;
      }
    }
  }
}
