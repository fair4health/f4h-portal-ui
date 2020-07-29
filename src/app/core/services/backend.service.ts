import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public getMessage(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'sample');
  }

  public login(username: string, password: string): Observable<any> {
    const params = new HttpParams();
    params.set('username', username);
    params.set('password', password);

    const options = {
      params
    };
    return this.httpClient.get(environment.restApiUrl + 'login', options);
  }

  public getUseCaseList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/project');
  }

  public getFeaturesetsList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/featureset');
  }

  public getFeatureList(): Observable<any> {
    // TO DO Update this api method with a real one based on featureset
    return this.httpClient.get(environment.restApiUrl + 'features');
  }

  public handleError(where: string, error: HttpErrorResponse): void {
    let errorText = 'An error occurred in ' + where;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly
      errorText = errorText + ': ' + error.error.message;
    } else {
      // Unsuccessful response code, clues to what went wrong
      errorText = errorText + `: code ${error.status}, ${error.error}`;
      errorText = errorText.replace(', undefined', ', contact support');
    }
    console.error(errorText);
  }
}
