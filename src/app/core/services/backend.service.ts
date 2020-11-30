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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { environment } from './../../../environments/environment';
import { UseCase } from 'src/app/shared/use-case';

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
      return throwError('{"code": 401, "message": "Not authorized"}');
    }
  }

  public getUseCaseList(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };

    return this.httpClient.get(environment.restApiPPDDM + 'manager/project', httpOptions);
    // return this.httpClient.get(environment.restApiUrl + 'manager/project');
  }

  public getUseCase(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    return this.httpClient.get(environment.restApiPPDDM + 'manager/project/' + id, httpOptions);
  }

  saveUseCase(useCase): Observable<any> {
    console.log(useCase);

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    return this.httpClient.post(environment.restApiPPDDM + 'manager/project', useCase, httpOptions);
  }

  public getFeaturesetsList(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    console.log('getFeaturesetsList   - manager/featureset?project_id=' + id);
    return this.httpClient.get(environment.restApiPPDDM + 'manager/featureset?project_id=' + id, httpOptions);
    // return this.httpClient.get(environment.restApiUrl + 'manager/featureset');
  }

  public postFeatureset(featureSet): Observable<any> {
    return this.httpClient.post(environment.restApiUrl + 'manager/featureset', featureSet);
  }

  // get model list from the mockup api
  public getModelsList(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };

    console.log('getModelsList   - manager/dm-model');
    // return this.httpClient.get(environment.restApiPPDDM + 'manager/dm-model', httpOptions);
    return this.httpClient.get(environment.restApiUrl + 'manager/dm-model/');
  }

  // get model list from SRDC api

  public getModels(projectId: string): any {

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };

    console.log('getModelsList   - manager/dm-model');
    // return this.httpClient.get(environment.restApiPPDDM + 'manager/dm-model', httpOptions);
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dm-model?project_id=' + projectId, httpOptions);

  }

  public saveModel(model): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };

    return this.httpClient.post(environment.restApiPPDDM + 'manager/dm-model', model, httpOptions);
  }

  public getDataSetsList(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    console.log('getDataSetsList - manager/dataset?project_id=' + id);
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dataset?project_id=' + id , httpOptions);
    // return this.httpClient.get(environment.restApiUrl + 'manager/dataset');
  }

  public getFeatureList(): Observable<any> {
    // TO DO Update this api method with a real one based on featureset
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    console.log('getFeatureList   - features');
    // return this.httpClient.get(environment.restApiPPDDM + 'manager/featureset', httpOptions);
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


/**
 * This method saves Data Set, refers to 3.4 - Update Data Set: Updates the data set resource
 * in Platform Repository by changing its execution state to "final"
 */
  updateDataSet(id, dataSet): any {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    // console.log('getDataSetsList - manager/dataset/' + id);
    console.log('URL base: ', environment.restApiPPDDM + 'manager/dataset/' + id);
    console.log('data set: ', dataSet);
    return this.httpClient.put(environment.restApiPPDDM + 'manager/dataset/' + id, dataSet, httpOptions);
  }

  saveDataSet(id, dataSet): any {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    return this.httpClient.post(environment.restApiPPDDM + 'manager/dataset', dataSet, httpOptions);
  }

  saveFeatureSet(featureSet): any {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    console.log('featureset: ', featureSet)
    return this.httpClient.post(environment.restApiPPDDM + 'manager/featureset', featureSet, httpOptions);
  }

  // prospective study service methods

  predict(prediction): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };

    console.log('prediction service: ', prediction)
    return this.httpClient.post(environment.restApiPPDDM + 'manager/predict', prediction, httpOptions);
  }

  getProspectiveStudies(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    return this.httpClient.get(environment.restApiPPDDM + 'manager/prospective', httpOptions);
  }

  onSaveprospectiveStudy(pospectiveStudy): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anytokenfordemopurpose'
      })
    };
    return this.httpClient.post(environment.restApiPPDDM + 'manager/prospective', pospectiveStudy, httpOptions);
  }
}
