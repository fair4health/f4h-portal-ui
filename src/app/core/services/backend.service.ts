import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

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
    // Demo purposes
    if ('demo' === username && password === atob('ZGVtbzIwMjA=')) {
      return this.httpClient.get(environment.restApiUrl + 'login', options);
    } else {
      throw throwError('{"code": 401, "message": "Not authorized"}');
    }
  }

  public getUseCaseList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/project');
  }

  public getUseCase(id): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/project/' + id);
  }

  public getFeaturesetsList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/featureset');
  }

  public postFeatureset(featureSet): Observable<any> {
    return this.httpClient.post(environment.restApiUrl + 'manager/featureset', featureSet);
  }

  public getModelsList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/dm-model');
  }

  public getDataSetsList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/dataset');
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
